import { useEffect, useState } from 'react';
import {
  call, usePoll, LiveView, EventInfo, teamLabel,
  Page, Title, Muted, Box, Big, Row, Btn, Input, Error,
} from './shared';

const TOKEN_KEY = 'bb_pickleball_token';
const JOIN_KEY = 'bb_pickleball_join';

function readToken() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('t')) localStorage.setItem(TOKEN_KEY, params.get('t'));
  if (params.get('join')) localStorage.setItem(JOIN_KEY, params.get('join'));
  if (params.has('t') || params.has('join') || params.has('live')) window.history.replaceState(null, '', window.location.pathname);
  return localStorage.getItem(TOKEN_KEY) || '';
}

export default function Pickleball() {
  const [token, setToken] = useState(readToken);
  const [tab, setTab] = useState(() => (window.location.search.includes('live') ? 'live' : 'play'));
  const [state, pollError, refresh] = usePoll('/api/state?token=' + encodeURIComponent(token));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const act = async (path, body = {}) => {
    setBusy(true);
    setError('');
    try {
      const result = await call('/api/' + path, { token, ...body });
      refresh();
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  // Token from another device that the server no longer knows.
  useEffect(() => {
    if (state && token && !state.me) { localStorage.removeItem(TOKEN_KEY); setToken(''); }
  }, [state, token]);

  // Auto-join from an invite link once registered.
  const me = state?.me;
  useEffect(() => {
    const code = localStorage.getItem(JOIN_KEY);
    if (me && code) {
      localStorage.removeItem(JOIN_KEY);
      if (!me.team) act('team/join', { code });
    }
  }, [me]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Page>
      <Title>UBC Pickleball <span>Cup</span></Title>
      <Muted>Boiler Blockchain × Meteora · win a match, earn a point for your org. Top two orgs play the final.</Muted>
      <Row>
        <Btn className={tab === 'play' ? '' : 'ghost'} onClick={() => setTab('play')}>Play</Btn>
        <Btn className={tab === 'live' ? '' : 'ghost'} onClick={() => setTab('live')}>Live leaderboard</Btn>
      </Row>
      <EventInfo state={state} />
      {pollError && <Error>Connection issue: {pollError}. Retrying…</Error>}
      {error && <Error>{error}</Error>}
      {tab === 'live' ? <LiveView state={state} /> : !state ? <Muted>Loading…</Muted> : !me ? (
        <Register state={state} busy={busy} onDone={(newToken) => { localStorage.setItem(TOKEN_KEY, newToken); setToken(newToken); }} setError={setError} />
      ) : (
        <Play state={state} me={me} act={act} busy={busy} />
      )}
    </Page>
  );
}

function OrgInput({ state, value, onChange }) {
  return (
    <>
      <Input list="pb-orgs" placeholder="Org / school / company" value={value} onChange={(event) => onChange(event.target.value)} maxLength={60} required />
      <datalist id="pb-orgs">{state.orgs.map((org) => <option key={org.id} value={org.name} />)}</datalist>
    </>
  );
}

function Register({ state, busy, onDone, setError }) {
  const [name, setName] = useState('');
  const [org, setOrg] = useState('');
  const submit = async (event) => {
    event.preventDefault();
    try {
      const { token } = await call('/api/register', { name, org });
      onDone(token);
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <Box as="form" onSubmit={submit}>
      <h2>Register</h2>
      <Muted>Pick an existing org from the list if yours is there, so your points stack together.</Muted>
      <Row><Input placeholder="Your name" value={name} onChange={(event) => setName(event.target.value)} maxLength={40} required /></Row>
      <Row><OrgInput state={state} value={org} onChange={setOrg} /></Row>
      <Row><Btn className="huge" disabled={busy}>Join the cup</Btn></Row>
    </Box>
  );
}

function Play({ state, me, act, busy }) {
  const team = me.team;
  const myOrg = state.orgs.find((org) => org.id === me.orgId)?.name;
  return (
    <>
      <Box>
        <h2>You</h2>
        <Big>{me.name}</Big>
        <Muted>{myOrg} · Bookmark this page. Your spot is saved on this device.</Muted>
      </Box>
      {state.paused && <Box className="hot"><h2>Heads up</h2>Matchmaking hasn't started or is paused. Get your team ready and you'll be called to a court.</Box>}
      {!team ? <NoTeam state={state} me={me} act={act} busy={busy} /> : <TeamPanel state={state} team={team} me={me} act={act} busy={busy} />}
    </>
  );
}

function NoTeam({ state, me, act, busy }) {
  const [code, setCode] = useState('');
  return (
    <>
      <Box>
        <h2>Got a partner?</h2>
        <Btn className="huge" disabled={busy} onClick={() => act('team/create')}>Create a team & invite them</Btn>
        <Row>
          <Input placeholder="Invite code" value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} maxLength={4} />
          <Btn className="ghost" disabled={busy || code.length < 4} onClick={() => act('team/join', { code })}>Join</Btn>
        </Row>
      </Box>
      <Box className={me.looking ? 'hot' : ''}>
        <h2>Need a partner?</h2>
        {me.looking ? (
          <>
            <Big>Finding you a partner…</Big>
            <Muted>You'll be paired with the next solo player, from your org if possible.</Muted>
            <Row><Btn className="ghost" disabled={busy} onClick={() => act('looking', { on: false })}>Stop looking</Btn></Row>
          </>
        ) : (
          <>
            <Muted>{state.looking} player{state.looking === 1 ? '' : 's'} looking right now.</Muted>
            <Row><Btn className="huge" disabled={busy} onClick={() => act('looking', { on: true })}>Find me a partner</Btn></Row>
          </>
        )}
      </Box>
    </>
  );
}

function TeamPanel({ state, team, me, act, busy }) {
  const [editing, setEditing] = useState(false);
  const full = team.view.players.length === 2;
  const match = me.match;
  const inviteLink = `${window.location.origin}/pickleball?join=${team.code}`;
  const share = () =>
    navigator.share
      ? navigator.share({ title: 'Join my pickleball team', url: inviteLink }).catch(() => {})
      : navigator.clipboard.writeText(inviteLink);

  return (
    <>
      {match && <MatchPanel match={match} teamId={team.view.id} act={act} busy={busy} />}
      {!match && me.last && <LastResult match={me.last} teamId={team.view.id} />}
      <Box className={team.status === 'ready' ? 'hot' : ''}>
        <h2>Your team</h2>
        <Big>{team.view.name || 'Your team'}</Big>
        <Muted>Playing for <b>{team.view.org}</b></Muted>
        {!full && (
          <>
            <Muted>Send this to your teammate. Invite code: <b>{team.code}</b></Muted>
            <Row><Btn className="huge" onClick={share}>Share invite link</Btn></Row>
          </>
        )}
        {full && !match && (team.status === 'ready' ? (
          <>
            <Big>In queue · #{team.position}</Big>
            <Muted>Stay close. Your court shows up here when it's your turn.</Muted>
            <Row><Btn className="ghost" disabled={busy} onClick={() => act('ready', { on: false })}>Leave queue</Btn></Row>
          </>
        ) : (
          <Row><Btn className="huge" disabled={busy} onClick={() => act('ready', { on: true })}>Ready to play</Btn></Row>
        ))}
        {!match && (
          <Row>
            <Btn className="ghost small" onClick={() => setEditing(!editing)}>Edit team</Btn>
            <Btn className="danger small" disabled={busy} onClick={() => act('team/leave')}>Leave team</Btn>
          </Row>
        )}
        {editing && <EditTeam state={state} team={team} act={act} busy={busy} done={() => setEditing(false)} />}
      </Box>
    </>
  );
}

function EditTeam({ state, team, act, busy, done }) {
  const [name, setName] = useState(team.name);
  const [org, setOrg] = useState(team.view.org);
  return (
    <>
      <Row><Input placeholder="Team name (optional)" value={name} onChange={(event) => setName(event.target.value)} maxLength={40} /></Row>
      <Row><OrgInput state={state} value={org} onChange={setOrg} /></Row>
      <Row><Btn disabled={busy} onClick={async () => { await act('team/update', { name, org }); done(); }}>Save</Btn></Row>
    </>
  );
}

function MatchPanel({ match, teamId, act, busy }) {
  const [us, them] = match.a.id === teamId ? [match.a, match.b] : [match.b, match.a];
  const report = (winner) => act('report', { winner });
  return (
    <Box className="hot">
      <h2>You're up{match.final ? ' · FINAL' : ''}</h2>
      <Big>{match.court}</Big>
      <Muted>vs {teamLabel(them)}</Muted>
      {match.claimBy === 0 && (
        <Row>
          <Btn disabled={busy} onClick={() => report(us.id)}>We won</Btn>
          <Btn className="ghost" disabled={busy} onClick={() => report(them.id)}>We lost</Btn>
        </Row>
      )}
      {match.claimBy === us.id && (
        <>
          <Muted>You reported {match.claimWinner === us.id ? 'a win' : 'a loss'}. Waiting for {them.name} to confirm (auto-confirms in 2 min).</Muted>
          <Row><Btn className="ghost small" disabled={busy} onClick={() => report(match.claimWinner === us.id ? them.id : us.id)}>Oops, flip it</Btn></Row>
        </>
      )}
      {match.claimBy === them.id && (
        <>
          <Big>{them.name} says {match.claimWinner === us.id ? 'you' : 'they'} won.</Big>
          <Row>
            <Btn disabled={busy} onClick={() => report(match.claimWinner)}>Confirm</Btn>
            <Btn className="danger" disabled={busy} onClick={() => report(match.claimWinner === us.id ? them.id : us.id)}>That's wrong</Btn>
          </Row>
        </>
      )}
    </Box>
  );
}

function LastResult({ match, teamId }) {
  const won = match.winner === teamId;
  const them = match.a.id === teamId ? match.b : match.a;
  if (match.status === 'disputed') return <Box><h2>Last match</h2>Result vs {them.name} is disputed. Find an organizer.</Box>;
  if (match.status !== 'done') return null;
  return <Box><h2>Last match</h2>{won ? `🏆 You beat ${them.name}. +1 for your org!` : `Lost to ${them.name}. Queue up again!`}</Box>;
}
