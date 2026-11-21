import { useEffect, useState } from 'react';
import {
  call, usePoll, LiveView, Bracket, EventInfo, teamLabel, roundName, useNow, clock, SHOW_UP_SECONDS,
  Page, Title, Muted, Box, Big, Row, Btn, Input, ErrorText,
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
      <Muted>Boiler Blockchain × Meteora · single-elimination doubles bracket. Lose once and you're out.</Muted>
      <Row>
        <Btn className={tab === 'play' ? '' : 'ghost'} onClick={() => setTab('play')}>{me?.team ? 'My team' : 'Register'}</Btn>
        <Btn className={tab === 'live' ? '' : 'ghost'} onClick={() => setTab('live')}>Courts & bracket</Btn>
      </Row>
      <EventInfo state={state} />
      {pollError && <ErrorText>Connection issue: {pollError}. Retrying…</ErrorText>}
      {error && <ErrorText>{error}</ErrorText>}
      {tab === 'live' ? <LiveView state={state} teamId={me?.team?.view.id} /> : !state ? <Muted>Loading…</Muted> : !me?.team ? (
        <Register busy={busy} setBusy={setBusy} setError={setError}
          onDone={(newToken) => { localStorage.setItem(TOKEN_KEY, newToken); setToken(newToken); }} />
      ) : (
        <TeamPanel state={state} me={me} act={act} busy={busy} forget={forget} />
      )}
      {tab === 'play' && state && <Box><h2>Bracket · live</h2><Bracket state={state} teamId={me?.team?.view.id} /></Box>}
    </Page>
  );
}

function Register({ busy, setBusy, setError, onDone }) {
  const [form, setForm] = useState({ name: '', partner: '', teamName: '' });
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
      <Muted>One of you registers for both. Registration closes when the bracket is drawn.</Muted>
      <Row><Input placeholder="Your name" value={form.name} onChange={set('name')} maxLength={40} required /></Row>
      <Row><Input placeholder="Partner's name" value={form.partner} onChange={set('partner')} maxLength={40} required /></Row>
      <Row><Input placeholder="Team name (optional)" value={form.teamName} onChange={set('teamName')} maxLength={40} /></Row>
      <Row><Btn className="huge" disabled={busy}>Register</Btn></Row>
    </Box>
  );
}

function TeamPanel({ state, me, act, busy, forget }) {
  const [editing, setEditing] = useState(false);
  const team = me.team;
  const loginLink = `${window.location.origin}/pickleball?t=${localStorage.getItem('bb_pickleball_token')}`;
  const share = () =>
    navigator.share
      ? navigator.share({ title: 'Our pickleball team', url: loginLink }).catch(() => {})
      : navigator.clipboard.writeText(loginLink);

  return (
    <>
      <Status state={state} me={me} />
      <Box>
        <h2>Your team</h2>
        <Big>{team.view.name}</Big>
        <Muted>{team.view.players?.join(' & ')}</Muted>
        <Row>
          <Btn className="ghost small" onClick={share}>Send this page to your partner</Btn>
          <Btn className="ghost small" onClick={() => setEditing(!editing)}>Edit team</Btn>
        </Row>
        {editing && <EditTeam team={team} act={act} busy={busy} done={() => setEditing(false)} />}
        <Muted>Wrong team on this phone? <a href="#" onClick={(event) => { event.preventDefault(); forget(); }} style={{ color: 'inherit' }}>Log out</a></Muted>
      </Box>
    </>
  );
}

function EditTeam({ team, act, busy, done }) {
  const [name, setName] = useState(team.name);
  return (
    <>
      <Row><Input placeholder="Team name (optional)" value={name} onChange={(event) => setName(event.target.value)} maxLength={40} /></Row>
      <Row><Btn disabled={busy} onClick={async () => { await act('team/update', { name }); done(); }}>Save</Btn></Row>
    </>
  );
}

function Status({ state, me }) {
  const team = me.team;
  const match = me.match;
  const rounds = state.bracket?.length || 0;
  if (team.status === 'champion') return <Box className="hot"><h2>Champions</h2><Big>🏆 You won the cup!</Big></Box>;
  if (team.status === 'out') return <LastResult match={me.last} teamId={team.view.id} />;
  if (!rounds) return <Box><h2>Registered</h2><Big>You're in.</Big><Muted>The bracket is drawn when registration closes. This page tells you when and where you play.</Muted></Box>;
  if (match?.status === 'playing') return <MatchPanel match={match} teamId={team.view.id} />;
  const round = match ? roundName(match.round, rounds) : '';
  const opponent = match && [match.a, match.b].find((side) => side.id && side.id !== team.view.id);
  const feeder = me.waitingOn;
  return (
    <>
      {me.last && <LastResult match={me.last} teamId={team.view.id} />}
      <Box className="hot">
        <h2>Up next · {round}</h2>
        {opponent ? (
          <>
            <Big>vs {opponent.name}</Big>
            <Muted>{state.paused ? 'Matches start soon. Stay close.' : `Waiting for a free court (#${me.position} in line). Stay close, this page shows your court the moment it opens.`}</Muted>
          </>
        ) : feeder ? (
          <>
            <Big>vs winner of {feeder.a.name} / {feeder.b.name}</Big>
            <Muted>
              {feeder.status === 'playing' ? `They're playing on ${feeder.court} right now. Wait for them to finish.`
                : feeder.a.id && feeder.b.id ? "Their match hasn't started yet. Hang tight."
                : 'Their earlier matches are still being played. Hang tight.'}
            </Muted>
          </>
        ) : <Big>Waiting for your opponent</Big>}
      </Box>
    </>
  );
}

function MatchPanel({ match, teamId }) {
  const them = match.a.id === teamId ? match.b : match.a;
  const now = useNow();
  const left = SHOW_UP_SECONDS - (now - new Date(match.created)) / 1000;
  return (
    <Box className="hot">
      <h2>You're up{match.final ? ' · FINAL' : ''}</h2>
      <Big>Go to {match.court}</Big>
      <Muted>vs {teamLabel(them)} · 1 game to 11, win by 2</Muted>
      {left > 0 && <Muted><b>Be on the court within {clock(left)}</b> or you can be forfeited.</Muted>}
      <Muted>When the game ends, both teams come tell an organizer who won.</Muted>
    </Box>
  );
}

function LastResult({ match, teamId }) {
  if (!match) return null;
  const them = match.a.id === teamId ? match.b : match.a;
  if (match.noShow === teamId) return <Box><h2>Forfeited</h2>You weren't on court in time vs {them.name}. Thanks for playing!</Box>;
  if (match.winner === teamId) return <Box><h2>Last match</h2>🏆 You beat {them.name}. On to the next round!</Box>;
  return <Box><h2>Eliminated</h2>Lost to {them.name}. Thanks for playing! Stick around and watch the bracket.</Box>;
}
