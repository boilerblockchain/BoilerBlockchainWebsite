package main

import (
	"strconv"
	"testing"
	"time"
)

func TestBracketFlow(t *testing.T) {
	s := newState()
	now := time.Now()
	tokens := map[int]string{}
	for index := range 5 {
		result, err := s.playerAction("register", Request{Name: "P" + strconv.Itoa(index), Partner: "Q"}, now)
		if err != nil {
			t.Fatal(err)
		}
		token := result.(map[string]string)["token"]
		tokens[s.playerByToken(token).TeamID] = token
	}
	if _, err := s.playerAction("register", Request{Name: "Solo"}, now); err == nil {
		t.Fatal("registration without a partner must fail")
	}
	for range 2 {
		s.adminAction(Request{Op: "court_add"}, now)
	}
	if err := s.adminAction(Request{Op: "bracket_build"}, now); err != nil {
		t.Fatal(err)
	}
	if len(s.Matches) != 7 {
		t.Fatalf("5 teams -> 8-slot bracket, 7 matches; got %d", len(s.Matches))
	}
	if _, err := s.playerAction("register", Request{Name: "Late", Partner: "X"}, now); err == nil {
		t.Fatal("registration closes once the bracket is built")
	}
	byes := 0
	for _, match := range s.Matches {
		if match.Round == 1 && match.Status == "done" {
			byes++
			if match.TeamB != 0 || s.nextMatch(match).TeamA+s.nextMatch(match).TeamB == 0 {
				t.Fatal("bye winners advance into round 2")
			}
		}
	}
	if byes != 3 {
		t.Fatalf("want 3 byes, got %d", byes)
	}

	s.tick(now)
	if len(s.upNext()) == 0 || s.liveMatchCount() != 0 {
		t.Fatal("nothing is called while paused")
	}
	s.adminAction(Request{Op: "pause", On: false}, now)
	s.tick(now)
	if s.liveMatchCount() != 2 {
		t.Fatalf("both courts should be filled, got %d", s.liveMatchCount())
	}
	var first *Match
	for _, match := range s.Matches {
		if match.Status == "playing" && match.Round == 1 {
			first = match
		}
	}
	if first == nil {
		t.Fatal("the round 1 match must be called before later rounds")
	}

	// Players report and confirm; the winner advances, the loser is out.
	report := func(teamID, winner int, at time.Time) {
		t.Helper()
		if _, err := s.playerAction("report", Request{Token: tokens[teamID], Winner: winner}, at); err != nil {
			t.Fatal(err)
		}
		s.tick(at)
	}
	report(first.TeamA, first.TeamA, now)
	report(first.TeamB, first.TeamA, now)
	next := s.nextMatch(first)
	if first.Status != "done" || s.Teams[first.TeamB].Status != "out" || (next.TeamA != first.TeamA && next.TeamB != first.TeamA) {
		t.Fatal("confirmed winner advances and loser is out")
	}

	// Reopen undoes the advance while the next match hasn't started.
	if next.Status == "pending" {
		if err := s.adminAction(Request{Op: "match_reopen", ID: first.ID}, now); err != nil {
			t.Fatal(err)
		}
		if first.Status != "pending" || next.TeamA == first.TeamA || next.TeamB == first.TeamA {
			t.Fatal("reopen clears the advanced team")
		}
		s.adminAction(Request{Op: "match_result", ID: first.ID, Winner: first.TeamB}, now)
	}

	// Disputes free the court until an admin settles them.
	s.tick(now)
	var live *Match
	for _, match := range s.Matches {
		if match.Status == "playing" {
			live = match
			break
		}
	}
	report(live.TeamA, live.TeamA, now)
	report(live.TeamB, live.TeamB, now)
	if live.Status != "disputed" || s.courtMatch(live.CourtID) == live {
		t.Fatal("conflicting reports dispute the match")
	}
	s.adminAction(Request{Op: "match_result", ID: live.ID, Winner: live.TeamB}, now)

	// Forfeit everything that's left, then check a single champion remains.
	for range 10 {
		s.tick(now)
		for _, match := range s.Matches {
			if match.Status == "playing" {
				if err := s.adminAction(Request{Op: "no_show", ID: match.ID, Team: match.TeamB}, now); err != nil {
					t.Fatal(err)
				}
			}
		}
	}
	champions := 0
	for _, team := range s.Teams {
		if team.Status == "champion" {
			champions++
		} else if team.Status != "out" {
			t.Fatalf("team %d left as %q", team.ID, team.Status)
		}
	}
	if champions != 1 {
		t.Fatalf("want one champion, got %d", champions)
	}

	// Auto-confirm still works on a fresh bracket.
	s.adminAction(Request{Op: "bracket_reset"}, now)
	s.adminAction(Request{Op: "bracket_build"}, now)
	s.adminAction(Request{Op: "pause", On: false}, now)
	s.tick(now)
	for _, match := range s.Matches {
		if match.Status == "playing" {
			report(match.TeamA, match.TeamA, now)
			s.tick(now.Add(autoConfirmAfter + time.Second))
			if match.Status != "done" || match.Winner != match.TeamA {
				t.Fatal("unanswered claim should auto-confirm")
			}
			break
		}
	}
}

func TestBracketSizes(t *testing.T) {
	for teams := 2; teams <= 33; teams++ {
		s := newState()
		for index := range teams {
			s.playerAction("register", Request{Name: "P" + strconv.Itoa(index), Partner: "Q"}, time.Now())
		}
		if err := s.buildBracket(time.Now()); err != nil {
			t.Fatal(err)
		}
		for _, match := range s.Matches {
			if match.Round == 1 && match.TeamA == 0 {
				t.Fatalf("%d teams: bye vs bye", teams)
			}
		}
	}
}

func (s *State) liveMatchCount() int {
	count := 0
	for _, match := range s.Matches {
		if match.Status == "playing" {
			count++
		}
	}
	return count
}
