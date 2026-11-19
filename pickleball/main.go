// Pickleball Cup API: registration, teams, auto court queue, org leaderboard.
// All state lives in memory behind one mutex and is snapshotted to a JSON file
// after every change.
package main

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"
)

// ponytail: one global lock + full JSON rewrite per mutation; fine for a few hundred players.

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
	Looking bool      `json:"looking"`
	Created time.Time `json:"created"`
}

type Team struct {
	ID      int       `json:"id"`
	Name    string    `json:"name"`
	OrgID   int       `json:"orgId"`
	Code    string    `json:"code"`
	Status  string    `json:"status"` // idle | ready | playing
	ReadyAt time.Time `json:"readyAt"`
}

type Court struct {
	ID     int    `json:"id"`
	Label  string `json:"label"`
	Active bool   `json:"active"`
}

type Match struct {
	ID          int       `json:"id"`
	CourtID     int       `json:"courtId"`
	TeamA       int       `json:"teamA"`
	TeamB       int       `json:"teamB"`
	Status      string    `json:"status"` // playing | done | disputed | void
	Winner      int       `json:"winner"`
	WinnerOrg   int       `json:"winnerOrg"`
	ClaimBy     int       `json:"claimBy"`
	ClaimWinner int       `json:"claimWinner"`
	ClaimAt     time.Time `json:"claimAt"`
	Final       bool      `json:"final"`
	Created     time.Time `json:"created"`
	Finished    time.Time `json:"finished"`
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
	CupStart     time.Time `json:"cupStart"`
}

var defaultInfo = Info{
	Schedule: "6:00 PM CST · Open play\n7:00 PM CST · Cup begins\nWhitaker Courts, 4901 Guadalupe St\nPaddles, snacks and drinks provided",
	CupStart: time.Date(2026, 11, 21, 1, 0, 0, 0, time.UTC),
}

const autoConfirmAfter = 2 * time.Minute

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

func (s *State) inviteCode() string {
	const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"
	for {
		buffer := make([]byte, 4)
		rand.Read(buffer)
		for index := range buffer {
			buffer[index] = alphabet[int(buffer[index])%len(alphabet)]
		}
		code := string(buffer)
		if s.teamByCode(code) == nil {
			return code
		}
	}
}

func (s *State) teamByCode(code string) *Team {
	for _, team := range s.Teams {
		if team.Code == strings.ToUpper(strings.TrimSpace(code)) {
			return team
		}
	}
	return nil
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

func (s *State) orgByName(name string) *Org {
	for _, org := range s.Orgs {
		if strings.EqualFold(org.Name, name) {
			return org
		}
	}
	return nil
}

// resolveOrg takes an org id or a name; unknown names create the org.
func (s *State) resolveOrg(orgID int, name string) (int, error) {
	if org, ok := s.Orgs[orgID]; ok {
		return org.ID, nil
	}
	name = strings.TrimSpace(name)
	if name == "" || len(name) > 60 {
		return 0, fail("pick an org (1-60 characters)")
	}
	if org := s.orgByName(name); org != nil {
		return org.ID, nil
	}
	org := &Org{ID: s.id(), Name: name}
	s.Orgs[org.ID] = org
	return org.ID, nil
}

func (s *State) liveMatch(teamID int) *Match {
	for _, match := range s.Matches {
		if match.Status == "playing" && (match.TeamA == teamID || match.TeamB == teamID) {
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

func (s *State) finish(match *Match, winner int, now time.Time) {
	if match.Status == "playing" {
		s.setTeams(match, "idle")
	}
	match.Status, match.Winner, match.Finished = "done", winner, now
	if team, ok := s.Teams[winner]; ok {
		match.WinnerOrg = team.OrgID
	}
}

func (s *State) timesPlayed(a, b int) int {
	count := 0
	for _, match := range s.Matches {
		if match.Status != "void" && ((match.TeamA == a && match.TeamB == b) || (match.TeamA == b && match.TeamB == a)) {
			count++
		}
	}
	return count
}

// tick auto-confirms stale claims, then fills free courts from the ready queue.
func (s *State) tick(now time.Time) {
	for _, match := range s.Matches {
		if match.Status == "playing" && match.ClaimBy != 0 && now.Sub(match.ClaimAt) > autoConfirmAfter {
			s.finish(match, match.ClaimWinner, now)
		}
	}
	if s.Paused {
		return
	}
	busy := map[int]bool{}
	for _, match := range s.Matches {
		if match.Status == "playing" {
			busy[match.CourtID] = true
		}
	}
	for _, court := range sortedCourts(s) {
		if !court.Active || busy[court.ID] {
			continue
		}
		queue := s.queue()
		if len(queue) < 2 {
			return
		}
		first, rest := queue[0], queue[1:]
		sort.SliceStable(rest, func(i, j int) bool {
			playedI, playedJ := s.timesPlayed(first.ID, rest[i].ID), s.timesPlayed(first.ID, rest[j].ID)
			if playedI != playedJ {
				return playedI < playedJ
			}
			return rest[i].OrgID != first.OrgID && rest[j].OrgID == first.OrgID
		})
		s.startMatch(court.ID, first.ID, rest[0].ID, false, now)
	}
}

func (s *State) startMatch(courtID, a, b int, final bool, now time.Time) *Match {
	match := &Match{ID: s.id(), CourtID: courtID, TeamA: a, TeamB: b, Status: "playing", Final: final, Created: now}
	s.Matches[match.ID] = match
	s.setTeams(match, "playing")
	return match
}

func (s *State) queue() []*Team {
	var list []*Team
	for _, team := range s.Teams {
		if team.Status == "ready" {
			list = append(list, team)
		}
	}
	sort.Slice(list, func(i, j int) bool { return list[i].ReadyAt.Before(list[j].ReadyAt) })
	return list
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
	Org     string   `json:"org"`
	Players []string `json:"players"`
}

type MatchView struct {
	ID          int       `json:"id"`
	Court       string    `json:"court"`
	A           TeamView  `json:"a"`
	B           TeamView  `json:"b"`
	Status      string    `json:"status"`
	Winner      int       `json:"winner"`
	ClaimBy     int       `json:"claimBy"`
	ClaimWinner int       `json:"claimWinner"`
	Final       bool      `json:"final"`
	Created     time.Time `json:"created"`
	Finished    time.Time `json:"finished"`
}

func (s *State) teamView(teamID int) TeamView {
	team, ok := s.Teams[teamID]
	if !ok {
		return TeamView{ID: teamID, Name: "(removed team)"}
	}
	view := TeamView{ID: team.ID, Name: team.Name}
	if org, ok := s.Orgs[team.OrgID]; ok {
		view.Org = org.Name
	}
	for _, player := range s.members(team.ID) {
		view.Players = append(view.Players, player.Name)
	}
	if view.Name == "" {
		view.Name = strings.Join(view.Players, " & ")
	}
	return view
}

func (s *State) matchView(match *Match) MatchView {
	view := MatchView{ID: match.ID, A: s.teamView(match.TeamA), B: s.teamView(match.TeamB), Status: match.Status,
		Winner: match.Winner, ClaimBy: match.ClaimBy, ClaimWinner: match.ClaimWinner, Final: match.Final,
		Created: match.Created, Finished: match.Finished}
	if court, ok := s.Courts[match.CourtID]; ok {
		view.Court = court.Label
	}
	return view
}

type OrgScore struct {
	ID     int    `json:"id"`
	Name   string `json:"name"`
	Points int    `json:"points"`
	Played int    `json:"played"`
	Teams  int    `json:"teams"`
}

func (s *State) leaderboard() []OrgScore {
	scores := map[int]*OrgScore{}
	for _, org := range s.Orgs {
		scores[org.ID] = &OrgScore{ID: org.ID, Name: org.Name}
	}
	for _, team := range s.Teams {
		if score, ok := scores[team.OrgID]; ok {
			score.Teams++
		}
	}
	for _, match := range s.Matches {
		if match.Status != "done" || match.Final {
			continue
		}
		if score, ok := scores[match.WinnerOrg]; ok {
			score.Points++
		}
		for _, teamID := range []int{match.TeamA, match.TeamB} {
			if team, ok := s.Teams[teamID]; ok {
				if score, ok := scores[team.OrgID]; ok {
					score.Played++
				}
			}
		}
	}
	list := []OrgScore{}
	for _, score := range scores {
		if score.Teams > 0 || score.Points > 0 {
			list = append(list, *score)
		}
	}
	sort.Slice(list, func(i, j int) bool {
		if list[i].Points != list[j].Points {
			return list[i].Points > list[j].Points
		}
		return list[i].Name < list[j].Name
	})
	return list
}

func (s *State) matchesSorted(filter func(*Match) bool) []*Match {
	var list []*Match
	for _, match := range s.Matches {
		if filter(match) {
			list = append(list, match)
		}
	}
	sort.Slice(list, func(i, j int) bool { return list[i].ID > list[j].ID })
	return list
}

func (s *State) publicView(token string) map[string]any {
	courts := []map[string]any{}
	for _, court := range sortedCourts(s) {
		entry := map[string]any{"id": court.ID, "label": court.Label, "active": court.Active}
		for _, match := range s.Matches {
			if match.CourtID == court.ID && match.Status == "playing" {
				entry["match"] = s.matchView(match)
			}
		}
		courts = append(courts, entry)
	}
	queue := []TeamView{}
	for _, team := range s.queue() {
		queue = append(queue, s.teamView(team.ID))
	}
	recent := []MatchView{}
	for _, match := range s.matchesSorted(func(m *Match) bool { return m.Status == "done" && !m.Final }) {
		if len(recent) == 12 {
			break
		}
		recent = append(recent, s.matchView(match))
	}
	var final any
	if finals := s.matchesSorted(func(m *Match) bool { return m.Final && m.Status != "void" }); len(finals) > 0 {
		final = s.matchView(finals[0])
	}
	orgs := []Org{}
	for _, org := range s.Orgs {
		orgs = append(orgs, *org)
	}
	sort.Slice(orgs, func(i, j int) bool { return strings.ToLower(orgs[i].Name) < strings.ToLower(orgs[j].Name) })
	looking := 0
	for _, player := range s.Players {
		if player.Looking && player.TeamID == 0 {
			looking++
		}
	}
	view := map[string]any{"paused": s.Paused, "courts": courts, "queue": queue, "recent": recent,
		"final": final, "leaderboard": s.leaderboard(), "orgs": orgs, "looking": looking,
		"players": len(s.Players), "teams": len(s.Teams), "info": s.Info}
	if player := s.playerByToken(token); player != nil {
		me := map[string]any{"id": player.ID, "name": player.Name, "orgId": player.OrgID, "looking": player.Looking}
		if team, ok := s.Teams[player.TeamID]; ok {
			me["team"] = map[string]any{"view": s.teamView(team.ID), "code": team.Code, "status": team.Status,
				"orgId": team.OrgID, "name": team.Name, "position": s.queuePosition(team.ID)}
			if match := s.liveMatch(team.ID); match != nil {
				me["match"] = s.matchView(match)
			}
			for _, match := range s.matchesSorted(func(m *Match) bool {
				return (m.TeamA == team.ID || m.TeamB == team.ID) && m.Status != "playing"
			}) {
				me["last"] = s.matchView(match)
				break
			}
		}
		view["me"] = me
	}
	return view
}

func (s *State) queuePosition(teamID int) int {
	for index, team := range s.queue() {
		if team.ID == teamID {
			return index + 1
		}
	}
	return 0
}

// ---------- player actions ----------

type Request struct {
	Token  string `json:"token"`
	Op     string `json:"op"`
	ID     int    `json:"id"`
	To     int    `json:"to"`
	Name   string `json:"name"`
	Label  string `json:"label"`
	Org    string `json:"org"`
	OrgID  int    `json:"orgId"`
	Code   string `json:"code"`
	On     bool   `json:"on"`
	Winner int    `json:"winner"`
	Court  int    `json:"court"`
	A      int    `json:"a"`
	B      int    `json:"b"`
	Final  bool   `json:"final"`
	Status string `json:"status"`
	Info   *Info  `json:"info"`
}

func cleanName(name string) (string, error) {
	name = strings.Join(strings.Fields(name), " ")
	if name == "" || len(name) > 40 {
		return "", fail("name must be 1-40 characters")
	}
	return name, nil
}

func (s *State) newTeam(orgID int, members ...*Player) *Team {
	team := &Team{ID: s.id(), OrgID: orgID, Code: s.inviteCode(), Status: "idle"}
	s.Teams[team.ID] = team
	for _, player := range members {
		player.TeamID, player.Looking = team.ID, false
	}
	return team
}

func (s *State) playerAction(path string, req Request, now time.Time) (any, error) {
	if path == "register" {
		name, err := cleanName(req.Name)
		if err != nil {
			return nil, err
		}
		orgID, err := s.resolveOrg(req.OrgID, req.Org)
		if err != nil {
			return nil, err
		}
		player := &Player{ID: s.id(), Token: randomHex(16), Name: name, OrgID: orgID, Created: now}
		s.Players[player.ID] = player
		return map[string]string{"token": player.Token}, nil
	}
	player := s.playerByToken(req.Token)
	if player == nil {
		return nil, fail("not registered")
	}
	team := s.Teams[player.TeamID]
	switch path {
	case "profile":
		name, err := cleanName(req.Name)
		if err != nil {
			return nil, err
		}
		orgID, err := s.resolveOrg(req.OrgID, req.Org)
		if err != nil {
			return nil, err
		}
		player.Name, player.OrgID = name, orgID
	case "team/create":
		if team != nil {
			return nil, fail("you're already on a team")
		}
		s.newTeam(player.OrgID, player)
	case "team/join":
		if team != nil {
			return nil, fail("leave your current team first")
		}
		target := s.teamByCode(req.Code)
		if target == nil {
			return nil, fail("no team with that code")
		}
		if len(s.members(target.ID)) >= 2 {
			return nil, fail("that team is full")
		}
		player.TeamID, player.Looking = target.ID, false
	case "team/leave":
		if team == nil {
			return nil, fail("you're not on a team")
		}
		if team.Status == "playing" {
			return nil, fail("finish your match first")
		}
		player.TeamID = 0
		team.Status = "idle"
		if len(s.members(team.ID)) == 0 {
			delete(s.Teams, team.ID)
		}
	case "team/update":
		if team == nil {
			return nil, fail("you're not on a team")
		}
		name := strings.Join(strings.Fields(req.Name), " ")
		if len(name) > 40 {
			return nil, fail("team name max 40 characters")
		}
		orgID, err := s.resolveOrg(req.OrgID, req.Org)
		if err != nil {
			return nil, err
		}
		team.Name, team.OrgID = name, orgID
	case "looking":
		if team != nil {
			return nil, fail("you already have a team")
		}
		player.Looking = req.On
		if !req.On {
			break
		}
		// Pair with the longest-waiting solo player, same org first.
		var partner *Player
		better := func(other *Player) bool {
			sameOther, samePartner := other.OrgID == player.OrgID, partner.OrgID == player.OrgID
			if sameOther != samePartner {
				return sameOther
			}
			return other.Created.Before(partner.Created)
		}
		for _, other := range s.Players {
			if other.ID != player.ID && other.Looking && other.TeamID == 0 && (partner == nil || better(other)) {
				partner = other
			}
		}
		if partner != nil {
			s.newTeam(partner.OrgID, partner, player)
		}
	case "ready":
		if team == nil {
			return nil, fail("you need a team")
		}
		if team.Status == "playing" {
			return nil, fail("you're already playing")
		}
		if req.On && len(s.members(team.ID)) < 2 {
			return nil, fail("you need a teammate first")
		}
		if req.On && team.Status != "ready" {
			team.Status, team.ReadyAt = "ready", now
		} else if !req.On {
			team.Status = "idle"
		}
	case "report":
		if team == nil {
			return nil, fail("you're not on a team")
		}
		match := s.liveMatch(team.ID)
		if match == nil {
			return nil, fail("no match in progress")
		}
		if req.Winner != match.TeamA && req.Winner != match.TeamB {
			return nil, fail("bad winner")
		}
		switch {
		case match.ClaimBy == 0 || match.ClaimBy == team.ID:
			match.ClaimBy, match.ClaimWinner, match.ClaimAt = team.ID, req.Winner, now
		case match.ClaimWinner == req.Winner:
			s.finish(match, req.Winner, now)
		default:
			match.Status = "disputed"
			s.setTeams(match, "idle")
		}
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
		if req.Info == nil || len(req.Info.Announcement) > 500 || len(req.Info.Schedule) > 2000 {
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
		for _, match := range s.Matches {
			if match.CourtID == req.ID && match.Status == "playing" {
				return fail("court has a live match")
			}
		}
		delete(s.Courts, req.ID)
	case "match_create":
		if _, ok := s.Courts[req.Court]; !ok {
			return fail("pick a court")
		}
		if req.A == req.B || s.Teams[req.A] == nil || s.Teams[req.B] == nil {
			return fail("pick two different teams")
		}
		for _, match := range s.Matches {
			if match.Status == "playing" && match.CourtID == req.Court {
				return fail("that court is busy")
			}
		}
		if s.liveMatch(req.A) != nil || s.liveMatch(req.B) != nil {
			return fail("a team is already playing")
		}
		s.startMatch(req.Court, req.A, req.B, req.Final, now)
	case "match_result":
		match, ok := s.Matches[req.ID]
		if !ok || (req.Winner != match.TeamA && req.Winner != match.TeamB) {
			return fail("bad match or winner")
		}
		s.finish(match, req.Winner, now)
	case "match_void":
		match, ok := s.Matches[req.ID]
		if !ok {
			return fail("no such match")
		}
		if match.Status == "playing" {
			s.setTeams(match, "idle")
		}
		match.Status = "void"
	case "team_status":
		team, ok := s.Teams[req.ID]
		if !ok || team.Status == "playing" || (req.Status != "idle" && req.Status != "ready") {
			return fail("can't change that team")
		}
		team.Status, team.ReadyAt = req.Status, now
	case "team_remove":
		team, ok := s.Teams[req.ID]
		if !ok || team.Status == "playing" {
			return fail("can't remove a team mid-match")
		}
		for _, player := range s.members(team.ID) {
			player.TeamID = 0
		}
		delete(s.Teams, team.ID)
	case "player_remove":
		player, ok := s.Players[req.ID]
		if !ok {
			return fail("no such player")
		}
		if team, ok := s.Teams[player.TeamID]; ok {
			if team.Status == "playing" {
				return fail("player is mid-match")
			}
			team.Status = "idle"
			player.TeamID = 0
			if len(s.members(team.ID)) == 0 {
				delete(s.Teams, team.ID)
			}
		}
		delete(s.Players, player.ID)
	case "org_rename":
		org, ok := s.Orgs[req.ID]
		name := strings.TrimSpace(req.Name)
		if !ok || name == "" {
			return fail("bad org or name")
		}
		org.Name = name
	case "org_add":
		_, err := s.resolveOrg(0, req.Name)
		return err
	case "org_merge":
		if s.Orgs[req.ID] == nil || s.Orgs[req.To] == nil || req.ID == req.To {
			return fail("pick two different orgs")
		}
		for _, player := range s.Players {
			if player.OrgID == req.ID {
				player.OrgID = req.To
			}
		}
		for _, team := range s.Teams {
			if team.OrgID == req.ID {
				team.OrgID = req.To
			}
		}
		for _, match := range s.Matches {
			if match.WinnerOrg == req.ID {
				match.WinnerOrg = req.To
			}
		}
		delete(s.Orgs, req.ID)
	default:
		return fail("unknown op")
	}
	return nil
}

func (s *State) adminView() map[string]any {
	view := s.publicView("")
	teams := []map[string]any{}
	for _, team := range s.Teams {
		teams = append(teams, map[string]any{"view": s.teamView(team.ID), "status": team.Status, "code": team.Code,
			"orgId": team.OrgID, "size": len(s.members(team.ID)), "readyAt": team.ReadyAt})
	}
	matches := []MatchView{}
	for _, match := range s.matchesSorted(func(*Match) bool { return true }) {
		matches = append(matches, s.matchView(match))
	}
	players := []map[string]any{}
	for _, player := range s.Players {
		org := ""
		if found, ok := s.Orgs[player.OrgID]; ok {
			org = found.Name
		}
		players = append(players, map[string]any{"id": player.ID, "name": player.Name, "org": org,
			"teamId": player.TeamID, "looking": player.Looking, "token": player.Token})
	}
	view["allTeams"], view["matches"], view["allPlayers"] = teams, matches, players
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

func mutate(writer http.ResponseWriter, action func(now time.Time) (any, error)) {
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
	reply(writer, http.StatusOK, result)
}

func decode(request *http.Request) (Request, error) {
	var req Request
	err := json.NewDecoder(http.MaxBytesReader(nil, request.Body, 8192)).Decode(&req)
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
		})
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
			return map[string]bool{"ok": true}, st.adminAction(req, now)
		})
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
