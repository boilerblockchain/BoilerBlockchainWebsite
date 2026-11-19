package main

import (
	"testing"
	"time"
)

func TestCupFlow(t *testing.T) {
	s := newState()
	now := time.Now()
	must := func(result any, err error) any {
		t.Helper()
		if err != nil {
			t.Fatal(err)
		}
		return result
	}
	register := func(name, org string) string {
		return must(s.playerAction("register", Request{Name: name, Org: org}, now)).(map[string]string)["token"]
	}
	act := func(token, path string, req Request) error {
		req.Token = token
		_, err := s.playerAction(path, req, now)
		s.tick(now)
		return err
	}
	team := func(token string) *Team { return s.Teams[s.playerByToken(token).TeamID] }

	joey, sam := register("Joey", "Purdue"), register("Sam", "purdue ")
	if len(s.Orgs) != 1 {
		t.Fatal("org names should match case-insensitively")
	}
	must(nil, act(joey, "team/create", Request{}))
	must(nil, act(sam, "team/join", Request{Code: team(joey).Code}))
	if act(register("Extra", "Purdue"), "team/join", Request{Code: team(joey).Code}) == nil {
		t.Fatal("third member must be rejected")
	}

	ana, ben := register("Ana", "UT"), register("Ben", "UT")
	must(nil, act(ana, "looking", Request{On: true}))
	must(nil, act(ben, "looking", Request{On: true}))
	if team(ana) == nil || team(ana) != team(ben) {
		t.Fatal("random partner should pair the two solo players")
	}

	s.adminAction(Request{Op: "court_add"}, now)
	s.adminAction(Request{Op: "pause", On: false}, now)
	must(nil, act(joey, "ready", Request{On: true}))
	must(nil, act(ana, "ready", Request{On: true}))
	match := s.liveMatch(team(joey).ID)
	if match == nil {
		t.Fatal("two ready teams + free court should start a match")
	}

	purdue, ut := team(joey).ID, team(ana).ID
	must(nil, act(joey, "report", Request{Winner: purdue}))
	must(nil, act(ben, "report", Request{Winner: purdue}))
	if match.Status != "done" || s.leaderboard()[0].Name != "Purdue" || s.leaderboard()[0].Points != 1 {
		t.Fatalf("confirmed win should score for Purdue: %+v", s.leaderboard())
	}

	must(nil, act(joey, "ready", Request{On: true}))
	must(nil, act(ana, "ready", Request{On: true}))
	rematch := s.liveMatch(purdue)
	must(nil, act(joey, "report", Request{Winner: purdue}))
	must(nil, act(ana, "report", Request{Winner: ut}))
	if rematch.Status != "disputed" || team(joey).Status != "idle" {
		t.Fatal("conflicting reports should dispute and free the teams")
	}

	must(nil, act(joey, "ready", Request{On: true}))
	must(nil, act(ana, "ready", Request{On: true}))
	stale := s.liveMatch(purdue)
	must(nil, act(ana, "report", Request{Winner: ut}))
	s.tick(now.Add(autoConfirmAfter + time.Second))
	if stale.Status != "done" || stale.Winner != ut {
		t.Fatal("unanswered claim should auto-confirm")
	}
}
