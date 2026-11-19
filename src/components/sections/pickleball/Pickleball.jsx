import { useEffect, useState } from 'react';
import {
  call, usePoll, LiveView, EventInfo, teamLabel, useNow, clock, SHOW_UP_SECONDS,
  Page, Title, Muted, Box, Big, Row, Btn, Input, Error,
} from './shared';

const TOKEN_KEY = 'bb_pickleball_token';

function readToken() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('t')) localStorage.setItem(TOKEN_KEY, params.get('t'));
  if (params.has('t') || params.has('live')) window.history.replaceState(null, '', window.location.pathname);
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
      await call('/api/' + path, { token, ...body });
      refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const forget = () => { localStorage.removeItem(TOKEN_KEY); setToken(''); };

  // Forget a saved login only when the server says that exact token is unknown
  // (e.g. the event data was reset), never just because `me` is missing.
  useEffect(() => {
    if (state?.unknownToken === token && token) forget();
  }, [state, token]);

  const me = state?.me;
  return (
    <Page>
      <Title>UBC Pickleball <span>Cup</span></Title>
      <Muted>Boiler Blockchain × Meteora · doubles, win a match to earn a point for your org. Top two orgs play the final.</Muted>
      <Row>
        <Btn className={tab === 'play' ? '' : 'ghost'} onClick={() => setTab('play')}>{me?.team ? 'My team' : 'Register'}</Btn>
        <Btn className={tab === 'live' ? '' : 'ghost'} onClick={() => setTab('live')}>Courts & leaderboard</Btn>
      </Row>
      <EventInfo state={state} />
      {pollError && <Error>Connection issue: {pollError}. Retrying…</Error>}
      {error && <Error>{error}</Error>}
      {tab === 'live' ? <LiveView state={state} /> : !state ? <Muted>Loading…</Muted> : !me?.team ? (
        <Register state={state} busy={busy} setBusy={setBusy} setError={setError}
          onDone={(newToken) => { localStorage.setItem(TOKEN_KEY, newToken); setToken(newToken); }} />
      ) : (
        <TeamPanel state={state} me={me} act={act} busy={busy} forget={forget} />
      )}
    </Page>
  );
}

function OrgInput({ state, value, onChange }) {
  return (
    <>
      <Input list="pb-orgs" placeholder="Org you're playing for (school / company)" value={value} onChange={(event) => onChange(event.target.value)} maxLength={60} required />
      <datalist id="pb-orgs">{state.orgs.map((org) => <option key={org.id} value={org.name} />)}</datalist>
    </>
  );
}

function Register({ state, busy, setBusy, setError, onDone }) {
  const [form, setForm] = useState({ name: '', partner: '', org: '', teamName: '' });
  const set = (key) => (event) => setForm({ ...form, [key]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { token } = await call('/api/register', form);
      onDone(token);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Box as="form" onSubmit={submit}>
      <h2>Register your pair</h2>
      <Muted>One of you registers for both. You'll go straight into the court queue.</Muted>
      <Row><Input placeholder="Your name" value={form.name} onChange={set('name')} maxLength={40} required /></Row>
      <Row><Input placeholder="Partner's name" value={form.partner} onChange={set('partner')} maxLength={40} required /></Row>
      <Row><OrgInput state={state} value={form.org} onChange={(org) => setForm({ ...form, org })} /></Row>
      <Muted>Pick your org from the list if it's there, so your points stack with everyone else's.</Muted>
      <Row><Input placeholder="Team name (optional)" value={form.teamName} onChange={set('teamName')} maxLength={40} /></Row>
      <Row><Btn className="huge" disabled={busy}>Register & join queue</Btn></Row>
    </Box>
  );
}

function TeamPanel({ state, me, act, busy, forget }) {
  const [editing, setEditing] = useState(false);
  const team = me.team;
  const match = me.match;
  const loginLink = `${window.location.origin}/pickleball?t=${localStorage.getItem('bb_pickleball_token')}`;
  const share = () =>
    navigator.share
      ? navigator.share({ title: 'Our pickleball team', url: loginLink }).catch(() => {})
      : navigator.clipboard.writeText(loginLink);

  return (
    <>
      {match && <MatchPanel match={match} teamId={team.view.id} act={act} busy={busy} />}
      {!match && me.last && <LastResult match={me.last} teamId={team.view.id} />}
      {!match && (
        <Box className={team.status === 'ready' ? 'hot' : ''}>
          <h2>Queue</h2>
          {team.status === 'ready' ? (
            <>
              <Big>{state.paused ? `#${team.position} in line` : `#${team.position} in line · stay close`}</Big>
              <Muted>{state.paused ? 'Courts open when the cup starts. You keep your spot.' : "Your court shows up here when it's your turn."}</Muted>
              <Row><Btn className="ghost small" disabled={busy} onClick={() => act('ready', { on: false })}>Take a break</Btn></Row>
            </>
          ) : (
            <>
              <Big>On a break</Big>
              <Row><Btn className="huge" disabled={busy} onClick={() => act('ready', { on: true })}>Rejoin queue</Btn></Row>
            </>
          )}
        </Box>
      )}
      <Box>
        <h2>Your team</h2>
        <Big>{team.view.name}</Big>
        <Muted>{team.view.players?.join(' & ')} · playing for <b>{team.view.org}</b></Muted>
        <Row>
          <Btn className="ghost small" onClick={share}>Send this page to your partner</Btn>
          {!match && <Btn className="ghost small" onClick={() => setEditing(!editing)}>Edit team</Btn>}
        </Row>
        {editing && <EditTeam state={state} team={team} act={act} busy={busy} done={() => setEditing(false)} />}
        <Muted>Wrong team on this phone? <a href="#" onClick={(event) => { event.preventDefault(); forget(); }} style={{ color: 'inherit' }}>Log out</a></Muted>
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
  const now = useNow();
  const left = SHOW_UP_SECONDS - (now - new Date(match.created)) / 1000;
  return (
    <Box className="hot">
      <h2>You're up{match.final ? ' · FINAL' : ''}</h2>
      <Big>Go to {match.court}</Big>
      <Muted>vs {teamLabel(them)} · 1 game to 11, win by 2</Muted>
      {match.claimBy === 0 && left > 0 && <Muted><b>Be on the court within {clock(left)}</b> or you go to the back of the queue.</Muted>}
      {match.claimBy === 0 && (
        <>
          <Muted>When you're done, one of you report the result:</Muted>
          <Row>
            <Btn disabled={busy} onClick={() => report(us.id)}>We won</Btn>
            <Btn className="ghost" disabled={busy} onClick={() => report(them.id)}>We lost</Btn>
          </Row>
        </>
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
  if (match.noShow === teamId) return <Box><h2>Missed your court</h2>You weren't on court within 3 minutes, so you're at the back of the queue. Stay close for the next call!</Box>;
  if (match.status === 'disputed') return <Box><h2>Last match</h2>Result vs {them.name} is disputed. Find an organizer, then rejoin the queue.</Box>;
  if (match.status !== 'done') return null;
  return <Box><h2>Last match</h2>{won ? `🏆 You beat ${them.name}. +1 for your org!` : `Lost to ${them.name}.`} You're back in line.</Box>;
}
