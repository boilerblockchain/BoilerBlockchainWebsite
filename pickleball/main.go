// Pickleball Cup API: pair registration, then a single-elimination bracket
// whose matches are called to the next free court. All state lives in memory
// behind one mutex and is snapshotted to a JSON file after every change.
package main

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"log"
	mrand "math/rand/v2"
	"net/http"
	"os"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"
)

// ponytail: one global lock + full JSON rewrite per mutation; fine for a few hundred players.

// Org is legacy: kept so old snapshots load untouched; the bracket ignores it.
type Org struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type Player struct {
	ID      int       `json:"id"`
	Token   string    `json:"token"`
	Name    string    `json:"name"`
	OrgID   int       `json:"orgId"`
	TeamID  int       `json:"teamId"`
	Created time.Time `json:"created"`
}

type Team struct {
	ID     int    `json:"id"`
	Name   string `json:"name"`
	OrgID  int    `json:"orgId"`
	Status string `json:"status"` // ready | playing | out | champion
}

type Court struct {
	ID     int    `json:"id"`
	Label  string `json:"label"`
	Active bool   `json:"active"`
}

// Match is one bracket slot. Round 1 is the first round; the winner of
// (round, slot) moves to (round+1, slot/2), side A if slot is even. TeamA or
// TeamB of 0 means TBD, or a bye in round 1.
type Match struct {
	ID       int       `json:"id"`
	Round    int       `json:"round"`
	Slot     int       `json:"slot"`
	CourtID  int       `json:"courtId"`
	TeamA    int       `json:"teamA"`
	TeamB    int       `json:"teamB"`
	Status   string    `json:"status"` // pending | playing | done
	Winner   int       `json:"winner"`
	Final    bool      `json:"final"`
	NoShow   int       `json:"noShow"`  // team that forfeited
	Created  time.Time `json:"created"` // when it was called to a court
	Finished time.Time `json:"finished"`
}

type State struct {
	NextID  int             `json:"nextId"`
	Paused  bool            `json:"paused"`
	Orgs    map[int]*Org    `json:"orgs"`
	Players map[int]*Player `json:"players"`
	Teams   map[int]*Team   `json:"teams"`
	Courts  map[int]*Court  `json:"courts"`
	Matches map[int]*Match  `json:"matches"`
	Info    Info            `json:"info"`
}

// Info is the admin-editable event copy shown at the top of every page.
type Info struct {
	Announcement string    `json:"announcement"`
	Schedule     string    `json:"schedule"`
	Rules        string    `json:"rules"`
	CupStart     time.Time `json:"cupStart"`
}

const defaultRules = `Boiler Blockchain and Meteora are taking over 8 courts for a single-elimination doubles bracket. Who has the best pickleball team at UBC?

• Register your pair once on this page before the bracket is drawn. Late pairs can't be added once it's set.
• The bracket is drawn at random. Lose once and you're out; win and you move on.
• When your match is up, this page tells you which court to go to. Be there within 3 minutes or an organizer can forfeit you.
• Every game is 1 game to 11, win by 2.
• When your game ends, both teams come tell an organizer who won. The bracket updates live on this page.
• Prizes: 🥇 the champions get a pickleball set, 🥈 the runners-up get a poker set.
• All skill levels and spectators welcome. Paddles, snacks and refreshments provided.`

var defaultInfo = Info{
	Schedule: "6:00 PM CST · Open play\n7:00 PM CST · Cup begins\nWhitaker Courts, 4901 Guadalupe St\nPaddles, snacks and drinks provided",
	Rules:    defaultRules,
	CupStart: time.Date(2026, 11, 21, 1, 0, 0, 0, time.UTC),
}

var (
	mu        sync.Mutex
	st        = newState()
	dataPath  = envOr("DATA", "pickleball.json")
	adminKey  = os.Getenv("ADMIN_TOKEN")
	errClient = errors.New("")
)

func newState() *State {
	return &State{NextID: 1, Paused: true, Orgs: map[int]*Org{}, Players: map[int]*Player{},
		Teams: map[int]*Team{}, Courts: map[int]*Court{}, Matches: map[int]*Match{}, Info: defaultInfo}
}

func envOr(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func fail(message string) error { return errors.Join(errClient, errors.New(message)) }

func (s *State) id() int { s.NextID++; return s.NextID - 1 }

func randomHex(bytes int) string {
	buffer := make([]byte, bytes)
	rand.Read(buffer)
	return hex.EncodeToString(buffer)
}

func (s *State) playerByToken(token string) *Player {
	if token == "" {
		return nil
	}
	for _, player := range s.Players {
		if player.Token == token {
			return player
		}
	}
	return nil
}

func (s *State) members(teamID int) []*Player {
	var list []*Player
	for _, player := range s.Players {
		if player.TeamID == teamID && teamID != 0 {
			list = append(list, player)
		}
	}
	sort.Slice(list, func(i, j int) bool { return list[i].ID < list[j].ID })
	return list
}

func (s *State) liveMatch(teamID int) *Match {
	for _, match := range s.Matches {
		if match.Status == "playing" && (match.TeamA == teamID || match.TeamB == teamID) {
			return match
		}
	}
	return nil
}

// openMatch is the team's unfinished bracket match, if any.
func (s *State) openMatch(teamID int) *Match {
	for _, match := range s.Matches {
		if match.Status != "done" && (match.TeamA == teamID || match.TeamB == teamID) {
			return match
		}
	}
	return nil
}

func (s *State) setTeams(match *Match, status string) {
	for _, teamID := range []int{match.TeamA, match.TeamB} {
		if team, ok := s.Teams[teamID]; ok {
			team.Status = status
		}
	}
}

func (s *State) nextMatch(match *Match) *Match {
	for _, next := range s.Matches {
		if next.Round == match.Round+1 && next.Slot == match.Slot/2 {
			return next
		}
	}
	return nil
}

// placeWinner writes teamID into the side of the next match this match feeds.
func (s *State) placeWinner(match *Match, teamID int) {
	if next := s.nextMatch(match); next != nil {
		if match.Slot%2 == 0 {
			next.TeamA = teamID
		} else {
			next.TeamB = teamID
		}
	}
}

func (s *State) finish(match *Match, winner int, now time.Time) {
	loser := match.TeamA + match.TeamB - winner
	match.Status, match.Winner, match.Finished = "done", winner, now
	if team, ok := s.Teams[loser]; ok {
		team.Status = "out"
	}
	if team, ok := s.Teams[winner]; ok {
		team.Status = "ready"
		if match.Final {
			team.Status = "champion"
		}
	}
	s.placeWinner(match, winner)
}

// buildBracket seeds every complete pair at random into a power-of-two
// bracket. Byes go to the top seeds (standard seed order), so two byes never
// meet, and they resolve immediately.
func (s *State) buildBracket(now time.Time) error {
	if len(s.Matches) > 0 {
		return fail("bracket already built; reset it first")
	}
	var teams []int
	for _, team := range s.Teams {
		if len(s.members(team.ID)) == 2 {
			teams = append(teams, team.ID)
		}
	}
	if len(teams) < 2 {
		return fail("need at least 2 teams")
	}
	mrand.Shuffle(len(teams), func(i, j int) { teams[i], teams[j] = teams[j], teams[i] })
	order := []int{1}
	for len(order) < len(teams) {
		size := len(order) * 2
		var next []int
		for _, seed := range order {
			next = append(next, seed, size+1-seed)
		}
		order = next
	}
	seedTeam := func(seed int) int {
		if seed > len(teams) {
			return 0
		}
		return teams[seed-1]
	}
	rounds := 0
	for size := len(order); size > 1; size /= 2 {
		rounds++
	}
	var byes []*Match
	for round := 1; round <= rounds; round++ {
		for slot := 0; slot < len(order)>>round; slot++ {
			match := &Match{ID: s.id(), Round: round, Slot: slot, Status: "pending", Final: round == rounds}
			if round == 1 {
				match.TeamA, match.TeamB = seedTeam(order[2*slot]), seedTeam(order[2*slot+1])
				if match.TeamB == 0 {
					byes = append(byes, match)
				}
			}
			s.Matches[match.ID] = match
		}
	}
	for _, teamID := range teams {
		s.Teams[teamID].Status = "ready"
	}
	for _, match := range byes {
		s.finish(match, match.TeamA, now)
	}
	return nil
}

// tick calls the earliest ready bracket matches to free courts.
func (s *State) tick(now time.Time) {
	if s.Paused {
		return
	}
	busy := map[int]bool{}
	for _, match := range s.Matches {
		if match.Status == "playing" {
			busy[match.CourtID] = true
		}
	}
	waiting := s.upNext()
	for _, court := range sortedCourts(s) {
		if len(waiting) == 0 {
			return
		}
		if !court.Active || busy[court.ID] {
			continue
		}
		match := waiting[0]
		waiting = waiting[1:]
		match.CourtID, match.Status, match.Created = court.ID, "playing", now
		s.setTeams(match, "playing")
	}
}

// upNext lists pending matches with both teams known, earliest round first.
func (s *State) upNext() []*Match {
	var list []*Match
	for _, match := range s.Matches {
		if match.Status == "pending" && match.TeamA != 0 && match.TeamB != 0 {
			list = append(list, match)
		}
	}
	sortBracket(list)
	return list
}

func sortBracket(list []*Match) {
	sort.Slice(list, func(i, j int) bool {
		if list[i].Round != list[j].Round {
			return list[i].Round < list[j].Round
		}
		return list[i].Slot < list[j].Slot
	})
}

func sortedCourts(s *State) []*Court {
	var list []*Court
	for _, court := range s.Courts {
		list = append(list, court)
	}
	sort.Slice(list, func(i, j int) bool { return list[i].ID < list[j].ID })
	return list
}

// ---------- views ----------

type TeamView struct {
	ID      int      `json:"id"`
	Name    string   `json:"name"`
	Players []string `json:"players"`
}

type MatchView struct {
	ID       int       `json:"id"`
	Round    int       `json:"round"`
	Slot     int       `json:"slot"`
	Court    string    `json:"court"`
	A        TeamView  `json:"a"`
	B        TeamView  `json:"b"`
	Status   string    `json:"status"`
	Winner   int       `json:"winner"`
	Final    bool      `json:"final"`
	NoShow   int       `json:"noShow"`
	Created  time.Time `json:"created"`
	Finished time.Time `json:"finished"`
}

func (s *State) teamView(teamID int) TeamView {
	team, ok := s.Teams[teamID]
	if !ok {
		return TeamView{ID: teamID, Name: "(removed team)"}
	}
	view := TeamView{ID: team.ID, Name: team.Name}
	for _, player := range s.members(team.ID) {
		view.Players = append(view.Players, player.Name)
	}
	if view.Name == "" {
		view.Name = strings.Join(view.Players, " & ")
	}
	return view
}

func (s *State) matchView(match *Match) MatchView {
	view := MatchView{ID: match.ID, Round: match.Round, Slot: match.Slot, A: s.teamView(match.TeamA), B: s.teamView(match.TeamB),
		Status: match.Status, Winner: match.Winner, Final: match.Final, NoShow: match.NoShow, Created: match.Created, Finished: match.Finished}
	for _, side := range []*TeamView{&view.A, &view.B} {
		if side.ID == 0 {
			side.Name = "TBD"
			if match.Round == 1 {
				side.Name = "BYE"
			}
		}
	}
	if court, ok := s.Courts[match.CourtID]; ok {
		view.Court = court.Label
	}
	return view
}

func (s *State) publicView(token string) map[string]any {
	courts := []map[string]any{}
	for _, court := range sortedCourts(s) {
		entry := map[string]any{"id": court.ID, "label": court.Label, "active": court.Active}
		if match := s.courtMatch(court.ID); match != nil {
			entry["match"] = s.matchView(match)
		}
		courts = append(courts, entry)
	}
	var all []*Match
	for _, match := range s.Matches {
		all = append(all, match)
	}
	sortBracket(all)
	bracket := [][]MatchView{}
	for _, match := range all {
		if match.Round > len(bracket) {
			bracket = append(bracket, []MatchView{})
		}
		bracket[match.Round-1] = append(bracket[match.Round-1], s.matchView(match))
	}
	upNext := []MatchView{}
	for _, match := range s.upNext() {
		upNext = append(upNext, s.matchView(match))
	}
	view := map[string]any{"paused": s.Paused, "courts": courts, "bracket": bracket, "upNext": upNext,
		"players": len(s.Players), "teams": len(s.Teams), "info": s.Info}
	if player := s.playerByToken(token); player != nil {
		me := map[string]any{"id": player.ID, "name": player.Name}
		if team, ok := s.Teams[player.TeamID]; ok {
			me["team"] = map[string]any{"view": s.teamView(team.ID), "status": team.Status, "name": team.Name}
			if match := s.openMatch(team.ID); match != nil {
				me["match"] = s.matchView(match)
				if feeder := s.feeder(match); feeder != nil {
					me["waitingOn"] = s.matchView(feeder)
				}
				for index, waiting := range s.upNext() {
					if waiting.ID == match.ID {
						me["position"] = index + 1
					}
				}
			}
			var last *Match
			for _, match := range all {
				if match.Status == "done" && match.TeamA != 0 && match.TeamB != 0 && (match.TeamA == team.ID || match.TeamB == team.ID) {
					last = match
				}
			}
			if last != nil {
				me["last"] = s.matchView(last)
			}
		}
		view["me"] = me
	} else if token != "" {
		view["unknownToken"] = token
	}
	return view
}

// feeder is the earlier match that will decide this match's missing team.
func (s *State) feeder(match *Match) *Match {
	if match.Status != "pending" || match.Round == 1 || (match.TeamA != 0 && match.TeamB != 0) {
		return nil
	}
	slot := match.Slot * 2
	if match.TeamA != 0 {
		slot++
	}
	for _, candidate := range s.Matches {
		if candidate.Round == match.Round-1 && candidate.Slot == slot {
			return candidate
		}
	}
	return nil
}

func (s *State) courtMatch(courtID int) *Match {
	for _, match := range s.Matches {
		if match.CourtID == courtID && match.Status == "playing" {
			return match
		}
	}
	return nil
}

// ---------- player actions ----------

type Request struct {
	Token    string `json:"token"`
	Op       string `json:"op"`
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Label    string `json:"label"`
	Partner  string `json:"partner"`
	TeamName string `json:"teamName"`
	On       bool   `json:"on"`
	Winner   int    `json:"winner"`
	Info     *Info  `json:"info"`
	Team     int    `json:"team"`
}

func cleanName(name string) (string, error) {
	name = strings.Join(strings.Fields(name), " ")
	if name == "" || len(name) > 40 {
		return "", fail("name must be 1-40 characters")
	}
	return name, nil
}

// register creates both players of a pair. The partner gets no separate
// login: the captain shares their link.
func (s *State) register(req Request, now time.Time) (any, error) {
	if len(s.Matches) > 0 {
		return nil, fail("the bracket is set, registration is closed. Find an organizer")
	}
	name, err := cleanName(req.Name)
	if err != nil {
		return nil, err
	}
	partner, err := cleanName(req.Partner)
	if err != nil {
		return nil, fail("partner " + strings.TrimSpace(err.Error()))
	}
	teamName := strings.Join(strings.Fields(req.TeamName), " ")
	if len(teamName) > 40 {
		return nil, fail("team name max 40 characters")
	}
	team := &Team{ID: s.id(), Name: teamName, Status: "ready"}
	s.Teams[team.ID] = team
	captain := &Player{ID: s.id(), Token: randomHex(16), Name: name, TeamID: team.ID, Created: now}
	second := &Player{ID: s.id(), Token: randomHex(16), Name: partner, TeamID: team.ID, Created: now}
	s.Players[captain.ID], s.Players[second.ID] = captain, second
	return map[string]string{"token": captain.Token}, nil
}

func (s *State) playerAction(path string, req Request, now time.Time) (any, error) {
	if path == "register" {
		return s.register(req, now)
	}
	player := s.playerByToken(req.Token)
	if player == nil {
		return nil, fail("not registered")
	}
	team := s.Teams[player.TeamID]
	if team == nil {
		return nil, fail("you're not on a team")
	}
	switch path {
	case "team/update":
		name := strings.Join(strings.Fields(req.Name), " ")
		if len(name) > 40 {
			return nil, fail("team name max 40 characters")
		}
		team.Name = name
	default:
		return nil, fail("unknown action")
	}
	return map[string]bool{"ok": true}, nil
}

// ---------- admin actions ----------

func (s *State) adminAction(req Request, now time.Time) error {
	switch req.Op {
	case "pause":
		s.Paused = req.On
	case "info":
		if req.Info == nil || len(req.Info.Announcement) > 500 || len(req.Info.Schedule) > 2000 || len(req.Info.Rules) > 5000 {
			return fail("info too long")
		}
		s.Info = *req.Info
	case "court_add":
		label := strings.TrimSpace(req.Label)
		if label == "" {
			label = "Court " + strconv.Itoa(len(s.Courts)+1)
		}
		court := &Court{ID: s.id(), Label: label, Active: true}
		s.Courts[court.ID] = court
	case "court_update":
		court, ok := s.Courts[req.ID]
		if !ok {
			return fail("no such court")
		}
		if label := strings.TrimSpace(req.Label); label != "" {
			court.Label = label
		}
		court.Active = req.On
	case "court_remove":
		if s.courtMatch(req.ID) != nil {
			return fail("court has a live match")
		}
		delete(s.Courts, req.ID)
	case "bracket_build":
		return s.buildBracket(now)
	case "bracket_reset":
		s.Matches = map[int]*Match{}
		for _, team := range s.Teams {
			team.Status = "ready"
		}
		s.Paused = true
	case "match_result":
		match, ok := s.Matches[req.ID]
		if !ok || match.TeamA == 0 || match.TeamB == 0 || (req.Winner != match.TeamA && req.Winner != match.TeamB) {
			return fail("bad match or winner")
		}
		if next := s.nextMatch(match); match.Status == "done" && match.Winner != req.Winner && next != nil && next.Status != "pending" {
			return fail("the next round already started; reopen that match first")
		}
		s.finish(match, req.Winner, now)
	case "no_show":
		// Forfeit: the team that didn't show is out, the other advances.
		match, ok := s.Matches[req.ID]
		if !ok || match.Status == "done" || match.TeamA == 0 || match.TeamB == 0 || (req.Team != match.TeamA && req.Team != match.TeamB) {
			return fail("pick an open match and the team that didn't show")
		}
		match.NoShow = req.Team
		s.finish(match, match.TeamA+match.TeamB-req.Team, now)
	case "match_reopen":
		// Back to pending so it gets called again (replay or undo a result).
		match, ok := s.Matches[req.ID]
		if !ok || match.TeamA == 0 || match.TeamB == 0 {
			return fail("can't reopen that match")
		}
		if next := s.nextMatch(match); match.Status == "done" && next != nil {
			if next.Status != "pending" {
				return fail("the next round already started; reopen that match first")
			}
			s.placeWinner(match, 0)
		}
		*match = Match{ID: match.ID, Round: match.Round, Slot: match.Slot, TeamA: match.TeamA, TeamB: match.TeamB,
			Final: match.Final, Status: "pending"}
		s.setTeams(match, "ready")
	case "team_remove":
		team, ok := s.Teams[req.ID]
		if !ok || s.openMatch(team.ID) != nil {
			return fail("team is still in the bracket; forfeit their match first")
		}
		for _, player := range s.members(team.ID) {
			delete(s.Players, player.ID)
		}
		delete(s.Teams, team.ID)
	case "player_remove":
		player, ok := s.Players[req.ID]
		if !ok {
			return fail("no such player")
		}
		if team, ok := s.Teams[player.TeamID]; ok {
			if s.openMatch(team.ID) != nil {
				return fail("player's team is still in the bracket")
			}
			player.TeamID = 0
			if len(s.members(team.ID)) == 0 {
				delete(s.Teams, team.ID)
			}
		}
		delete(s.Players, player.ID)
	default:
		return fail("unknown op")
	}
	return nil
}

func (s *State) adminView() map[string]any {
	view := s.publicView("")
	teams := []map[string]any{}
	for _, team := range s.Teams {
		teams = append(teams, map[string]any{"view": s.teamView(team.ID), "status": team.Status,
			"size": len(s.members(team.ID))})
	}
	players := []map[string]any{}
	for _, player := range s.Players {
		players = append(players, map[string]any{"id": player.ID, "name": player.Name,
			"teamId": player.TeamID, "token": player.Token})
	}
	view["allTeams"], view["allPlayers"] = teams, players
	return view
}

// ---------- http ----------

func save() {
	encoded, err := json.Marshal(st)
	if err != nil {
		log.Print(err)
		return
	}
	if err := os.WriteFile(dataPath+".tmp", encoded, 0o600); err != nil {
		log.Print(err)
		return
	}
	if err := os.Rename(dataPath+".tmp", dataPath); err != nil {
		log.Print(err)
	}
}

func reply(writer http.ResponseWriter, status int, body any) {
	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(status)
	json.NewEncoder(writer).Encode(body)
}

// mutate runs action under the lock, refills courts and saves. If view is set,
// the response is view() taken after that, so the client skips a refetch.
func mutate(writer http.ResponseWriter, action func(now time.Time) (any, error), view func() any) {
	mu.Lock()
	defer mu.Unlock()
	now := time.Now()
	result, err := action(now)
	if err != nil {
		if errors.Is(err, errClient) {
			reply(writer, http.StatusBadRequest, map[string]string{"error": strings.TrimSpace(err.Error())})
		} else {
			reply(writer, http.StatusInternalServerError, map[string]string{"error": "server error"})
		}
		return
	}
	st.tick(now)
	save()
	if view != nil {
		result = view()
	}
	reply(writer, http.StatusOK, result)
}

func decode(request *http.Request) (Request, error) {
	var req Request
	err := json.NewDecoder(http.MaxBytesReader(nil, request.Body, 16384)).Decode(&req)
	if err != nil {
		return req, fail("bad request body")
	}
	return req, nil
}

func isAdmin(request *http.Request) bool {
	token := strings.TrimPrefix(request.Header.Get("Authorization"), "Bearer ")
	return adminKey != "" && len(token) == len(adminKey) && token == adminKey
}

func handler() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/state", func(writer http.ResponseWriter, request *http.Request) {
		mu.Lock()
		view := st.publicView(request.URL.Query().Get("token"))
		mu.Unlock()
		reply(writer, http.StatusOK, view)
	})
	mux.HandleFunc("POST /api/{action...}", func(writer http.ResponseWriter, request *http.Request) {
		mutate(writer, func(now time.Time) (any, error) {
			req, err := decode(request)
			if err != nil {
				return nil, err
			}
			return st.playerAction(request.PathValue("action"), req, now)
		}, nil)
	})
	mux.HandleFunc("GET /admin/state", func(writer http.ResponseWriter, request *http.Request) {
		if !isAdmin(request) {
			reply(writer, http.StatusUnauthorized, map[string]string{"error": "bad admin token"})
			return
		}
		mu.Lock()
		view := st.adminView()
		mu.Unlock()
		reply(writer, http.StatusOK, view)
	})
	mux.HandleFunc("POST /admin", func(writer http.ResponseWriter, request *http.Request) {
		if !isAdmin(request) {
			reply(writer, http.StatusUnauthorized, map[string]string{"error": "bad admin token"})
			return
		}
		mutate(writer, func(now time.Time) (any, error) {
			req, err := decode(request)
			if err != nil {
				return nil, err
			}
			return nil, st.adminAction(req, now)
		}, func() any { return st.adminView() })
	})
	return http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		writer.Header().Set("Access-Control-Allow-Origin", "*")
		writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		writer.Header().Set("Cache-Control", "no-store")
		if request.Method == http.MethodOptions {
			writer.WriteHeader(http.StatusNoContent)
			return
		}
		mux.ServeHTTP(writer, request)
	})
}

func main() {
	if adminKey == "" {
		log.Fatal("ADMIN_TOKEN is required")
	}
	if raw, err := os.ReadFile(dataPath); err == nil {
		if err := json.Unmarshal(raw, st); err != nil {
			log.Fatalf("corrupt %s: %v", dataPath, err)
		}
	}
	if st.Info == (Info{}) {
		st.Info = defaultInfo
	}
	// Swap the old queue-era default rules for the bracket ones; custom rules stay.
	if st.Info.Rules == "" || strings.Contains(st.Info.Rules, "Meteora leaderboard") {
		st.Info.Rules = defaultRules
	}
	go func() {
		for range time.Tick(10 * time.Second) {
			mu.Lock()
			st.tick(time.Now())
			save()
			mu.Unlock()
		}
	}()
	address := envOr("ADDR", "127.0.0.1:8620")
	log.Printf("pickleball listening on %s", address)
	log.Fatal(http.ListenAndServe(address, handler()))
}
