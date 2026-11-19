package main

import (
	"testing"
	"time"
)

func TestCupFlow(t *testing.T) {
	s := newState()
	now := time.Now()
	register := func(name, partner, org string) string {
		t.Helper()
		result, err := s.playerAction("register", Request{Name: name, Partner: partner, Org: org}, now)
		if err != nil {
			t.Fatal(err)
		}
		return result.(map[string]string)["token"]
	}
	act := func(token, path string, req Request) {
		t.Helper()
		req.Token = token
		if _, err := s.playerAction(path, req, now); err != nil {
			t.Fatal(err)
		}
		s.tick(now)
	}
	team := func(token string) *Team { return s.Teams[s.playerByToken(token).TeamID] }

	if _, err := s.playerAction("register", Request{Name: "Solo", Org: "X"}, now); err == nil {
		t.Fatal("registration without a partner must fail")
	}
	joey, ana, cal := register("Joey", "Sam", "Purdue"), register("Ana", "Ben", "UT"), register("Cal", "Dee", "purdue ")
	if len(s.Orgs) != 2 || len(s.members(team(joey).ID)) != 2 {
		t.Fatal("pairs register together and org names match case-insensitively")
	}

	s.adminAction(Request{Op: "court_add"}, now)
	s.tick(now)
	if s.liveMatch(team(joey).ID) != nil {
		t.Fatal("nothing starts while paused")
	}
	s.adminAction(Request{Op: "pause", On: false}, now)
	s.tick(now)
	match := s.liveMatch(team(joey).ID)
	if match == nil || s.liveMatch(team(ana).ID) != match {
		t.Fatal("first two registered teams should be called first")
	}
	if team(cal).Status != "ready" {
		t.Fatal("third team waits in the queue")
	}

	purdue, ut := team(joey).ID, team(ana).ID
	later := now.Add(time.Second)
	act(joey, "report", Request{Winner: purdue})
	if _, err := s.playerAction("report", Request{Token: ana, Winner: purdue}, later); err != nil {
		t.Fatal(err)
	}
	s.tick(later)
	if match.Status != "done" || s.leaderboard()[0].Name != "Purdue" || s.leaderboard()[0].Points != 1 {
		t.Fatalf("confirmed win should score for Purdue: %+v", s.leaderboard())
	}
	next := s.liveMatch(team(cal).ID)
	if next == nil || team(joey).Status != "ready" && team(ana).Status != "ready" {
		t.Fatal("waiting team plays next and finished teams rejoin the back of the queue")
	}

	act(cal, "report", Request{Winner: team(cal).ID})
	opponent := next.TeamA + next.TeamB - team(cal).ID
	otherToken := joey
	if opponent == ut {
		otherToken = ana
	}
	act(otherToken, "report", Request{Winner: opponent})
	if next.Status != "disputed" || team(cal).Status != "idle" {
		t.Fatal("conflicting reports should dispute and take both teams out of the queue")
	}

	if err := s.adminAction(Request{Op: "match_result", ID: next.ID, Winner: opponent}, now); err != nil {
		t.Fatal(err)
	}
	s.tick(now)
	if next.Status != "done" || s.liveMatch(team(cal).ID) == nil {
		t.Fatal("admin settling a dispute scores it and puts both teams back in line")
	}
	points := func(org string) int {
		for _, score := range s.leaderboard() {
			if score.Name == org {
				return score.Points
			}
		}
		return -1
	}
	before := points("Purdue")
	if err := s.adminAction(Request{Op: "match_result", ID: match.ID, Winner: ut}, now); err != nil {
		t.Fatal(err)
	}
	if points("Purdue") != before-1 || points("UT") < 1 {
		t.Fatal("admin flipping a finished result moves the point")
	}
	s.adminAction(Request{Op: "match_void", ID: match.ID}, now)
	if points("UT") != 0 && opponent != ut {
		t.Fatal("voiding a match removes its point")
	}
	s.adminAction(Request{Op: "match_void", ID: s.liveMatch(team(cal).ID).ID}, now)
	act(cal, "ready", Request{On: true})
	s.tick(now)
	stale := s.liveMatch(team(cal).ID)
	register("Eve", "Fay", "MIT") // someone else waiting, so a rematch is avoidable
	present, absent := stale.TeamA, stale.TeamB
	if err := s.adminAction(Request{Op: "no_show", ID: stale.ID, Team: absent}, now); err != nil {
		t.Fatal(err)
	}
	s.tick(now)
	if stale.Status != "void" || stale.NoShow != absent || s.liveMatch(present) == nil {
		t.Fatal("no-show voids the match and the team that showed up gets the court right back")
	}
	if rematch := s.liveMatch(present); rematch.TeamA == absent || rematch.TeamB == absent {
		t.Fatal("the no-show team must not be paired straight back in")
	}
	for _, other := range s.queue() {
		if other.ID != absent && other.ReadyAt.After(s.Teams[absent].ReadyAt) {
			t.Fatal("the no-show team goes to the back of the line")
		}
	}
	if s.liveMatch(team(cal).ID) == nil {
		s.adminAction(Request{Op: "court_add"}, now)
		s.tick(now)
	}
	stale = s.liveMatch(team(cal).ID)
	act(cal, "report", Request{Winner: team(cal).ID})
	s.tick(now.Add(autoConfirmAfter + 2*time.Second))
	if stale.Status != "done" || stale.Winner != team(cal).ID {
		t.Fatal("unanswered claim should auto-confirm")
	}
}
