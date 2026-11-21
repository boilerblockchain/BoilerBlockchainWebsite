import { useState } from 'react';
import styled from 'styled-components';
import {
  call, usePoll, LiveView, Bracket, teamLabel, useNow, clock, SHOW_UP_SECONDS,
  Page, Title, Muted, Box, Row, Btn, Input, Error,
} from './shared';

const KEY = 'bb_pickleball_admin';

const Notice = styled.p`
  position: sticky;
  top: ${({ theme }) => theme.layout.navHeight};
  z-index: 5;
  padding: ${({ theme }) => theme.space[3]};
  background: #12351f;
  border: 1px solid #2fbf71;
  color: #b9f5d0;
  font-weight: 600;
`;

const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
  ${({ theme }) => theme.media.lg} { grid-template-columns: 2fr 1fr; align-items: start; }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.fontSize.small};
  td, th { padding: 0.4rem; border-bottom: 1px solid ${({ theme }) => theme.color.border}; text-align: left; vertical-align: middle; }
  th { color: ${({ theme }) => theme.color.textFaint}; font-weight: 500; }
`;

export default function PickleballAdmin() {
  const [token, setToken] = useState(() => localStorage.getItem(KEY) || '');
  const [draft, setDraft] = useState('');
  const [state, pollError, , setState] = usePoll(token ? '/admin/state' : null, token, 1500);
  const [error, setError] = useState('');

  const [notice, setNotice] = useState('');
  const op = async (name, body = {}, done = '') => {
    setError('');
    setNotice('');
    try {
      // The server answers with the updated board, so no refetch round trip.
      setState(await call('/admin', { op: name, ...body }, token));
      if (done) { setNotice(done); setTimeout(() => setNotice(''), 6000); }
    } catch (err) {
      setError(err.message);
    }
  };

  if (!token || pollError === 'bad admin token') {
    return (
      <Page>
        <Title>Cup <span>admin</span></Title>
        {pollError && <Error>Wrong token.</Error>}
        <Row as="form" onSubmit={(event) => { event.preventDefault(); localStorage.setItem(KEY, draft); setToken(draft); }}>
          <Input type="password" placeholder="Admin token" value={draft} onChange={(event) => setDraft(event.target.value)} />
          <Btn>Sign in</Btn>
        </Row>
      </Page>
    );
  }
  if (!state) return <Page><Muted>Loading… {pollError}</Muted></Page>;

  const teamName = (id) => state.allTeams.find((team) => team.view.id === id)?.view.name || '?';

  return (
    <Page className="wide">
      <Title>Cup <span>admin</span></Title>
      <Muted>{state.players} players · {state.teams} teams · {state.bracket.length ? `bracket: ${state.upNext.length} matches waiting for a court` : 'no bracket yet'}</Muted>
      {error && <Error>{error}</Error>}
      {notice && <Notice>✓ {notice}</Notice>}
      {pollError && <Error>{pollError}</Error>}
      <Row>
        <Btn className={state.paused ? '' : 'danger'} onClick={() => op('pause', { on: !state.paused })}>
          {state.paused ? '▶ Start calling matches' : '⏸ Pause calling matches'}
        </Btn>
        {state.bracket.length === 0
          ? <Btn onClick={() => window.confirm(`Draw the bracket with ${state.allTeams.filter((team) => team.size === 2).length} teams? Registration closes.`) && op('bracket_build', {}, 'Bracket drawn. Hit Start to call matches to courts.')}>🎲 Build bracket</Btn>
          : <Btn className="danger" onClick={() => window.confirm('Delete the whole bracket and every result? Teams stay registered.') && op('bracket_reset', {}, 'Bracket deleted. Registration is open again.')}>Reset bracket</Btn>}
        <Btn className="ghost" onClick={() => { localStorage.removeItem(KEY); setToken(''); }}>Sign out</Btn>
      </Row>

      <Box className="hot">
        <h2>Bracket · tap the team that won</h2>
        <Bracket state={state} onPick={(match, team) => match.winner !== team.id && window.confirm(`${team.name} beat ${match.a.id === team.id ? match.b.name : match.a.name}?`) && op('match_result', { id: match.id, winner: team.id }, `${team.name} won and advances.`)} />
      </Box>
      <Grid>
        <div>
          <CourtBoard state={state} op={op} />
          <InfoEditor info={state.info} op={op} />
          <Courts state={state} op={op} />
          <Box>
            <h2>All matches</h2>
            <MatchTable matches={state.bracket.flat().filter((match) => match.a.id && match.b.id)} op={op} teamName={teamName} />
          </Box>
          <Teams state={state} op={op} />
          <Players state={state} op={op} />
        </div>
        <div><LiveView state={state} /></div>
      </Grid>
    </Page>
  );
}

function Courts({ state, op }) {
  const [label, setLabel] = useState('');
  return (
    <Box>
      <h2>Courts</h2>
      <Table>
        <tbody>
          {state.courts.map((court) => <CourtRow key={court.id} court={court} op={op} />)}
        </tbody>
      </Table>
      <Row as="form" onSubmit={(event) => { event.preventDefault(); op('court_add', { label }); setLabel(''); }}>
        <Input placeholder={`Court ${state.courts.length + 1}`} value={label} onChange={(event) => setLabel(event.target.value)} />
        <Btn>Add court</Btn>
        {state.courts.length === 0 && <Btn type="button" className="ghost" onClick={async () => { for (let i = 1; i <= 8; i += 1) await op('court_add', { label: `Court ${i}` }); }}>Create 8 courts</Btn>}
      </Row>
    </Box>
  );
}

function CourtRow({ court, op }) {
  const [label, setLabel] = useState(court.label);
  return (
    <tr>
      <td><Input value={label} onChange={(event) => setLabel(event.target.value)} onBlur={() => label !== court.label && op('court_update', { id: court.id, label, on: court.active })} /></td>
      <td>{court.match ? `${court.match.a.name} vs ${court.match.b.name}` : court.active ? 'open' : 'closed'}</td>
      <td>
        <Btn className="ghost small" onClick={() => op('court_update', { id: court.id, label, on: !court.active })}>{court.active ? 'Close' : 'Open'}</Btn>{' '}
        <Btn className="danger small" onClick={() => op('court_remove', { id: court.id })}>✕</Btn>
      </td>
    </tr>
  );
}

function MatchTable({ matches, op, teamName }) {
  const win = (match, team) => op('match_result', { id: match.id, winner: team.id }, `${team.name} won and advances.`);
  return (
    <Table>
      <thead><tr><th>Round</th><th>Court</th><th>Teams</th><th>Status</th><th>Set winner</th></tr></thead>
      <tbody>
        {matches.map((match) => (
          <tr key={match.id}>
            <td>{match.round}{match.final ? ' 🏆' : ''}</td>
            <td>{match.court}</td>
            <td>{teamLabel(match.a)}<br />{teamLabel(match.b)}</td>
            <td>
              {match.status}{match.noShow ? ' (forfeit)' : ''}
              {match.status === 'done' && <><br />won: {teamName(match.winner)}</>}
            </td>
            <td>
              <Btn className="ghost small" onClick={() => win(match, match.a)}>{match.a.name}</Btn>{' '}
              <Btn className="ghost small" onClick={() => win(match, match.b)}>{match.b.name}</Btn>{' '}
              {match.status !== 'pending' && <Btn className="danger small" onClick={() => window.confirm('Reopen this match? Its result is cleared and it gets called to a court again.') && op('match_reopen', { id: match.id }, 'Match reopened.')}>Reopen</Btn>}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function Teams({ state, op }) {
  return (
    <Box>
      <h2>Teams ({state.allTeams.length})</h2>
      <Table>
        <thead><tr><th>Team</th><th>Status</th><th /></tr></thead>
        <tbody>
          {[...state.allTeams].sort((x, y) => x.view.name.localeCompare(y.view.name)).map((team) => (
            <tr key={team.view.id}>
              <td>{teamLabel(team.view)}<br /><Muted as="span">{team.view.players?.join(', ')}</Muted></td>
              <td>{team.size < 2 ? 'missing a player' : team.status === 'ready' ? (state.bracket.length ? 'alive' : 'registered') : team.status}</td>
              <td>
                {team.status !== 'playing' && <Btn className="danger small" onClick={() => window.confirm(`Remove ${team.view.name}?`) && op('team_remove', { id: team.view.id })}>Remove</Btn>}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Box>
  );
}

function Players({ state, op }) {
  const [filter, setFilter] = useState('');
  const shown = state.allPlayers
    .filter((player) => player.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((x, y) => x.name.localeCompare(y.name));
  return (
    <Box>
      <h2>Players ({state.allPlayers.length})</h2>
      <Muted>"Link" copies a player's personal login link, for when they switch phones.</Muted>
      <Row><Input placeholder="Search" value={filter} onChange={(event) => setFilter(event.target.value)} /></Row>
      <Table>
        <tbody>
          {shown.map((player) => (
            <tr key={player.id}>
              <td>{player.name}</td>
              <td>{player.teamId ? 'on team' : 'no team'}</td>
              <td>
                <Btn className="ghost small" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/pickleball?t=${player.token}`)}>Link</Btn>{' '}
                <Btn className="danger small" onClick={() => op('player_remove', { id: player.id })}>✕</Btn>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Box>
  );
}

const toLocalInput = (iso) => {
  const date = new Date(iso);
  return new Date(date - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

function InfoEditor({ info, op }) {
  const [draft, setDraft] = useState({ ...info, cupStart: toLocalInput(info.cupStart) });
  const set = (key) => (event) => setDraft({ ...draft, [key]: event.target.value });
  const save = () => op('info', { info: { ...draft, cupStart: new Date(draft.cupStart).toISOString() } });
  return (
    <Box>
      <h2>Event info (shows on every phone)</h2>
      <Muted>Announcement banner (leave empty to hide)</Muted>
      <Row><Input as="textarea" rows={2} value={draft.announcement} onChange={set('announcement')} maxLength={500} /></Row>
      <Muted>Schedule / details, one per line</Muted>
      <Row><Input as="textarea" rows={4} value={draft.schedule} onChange={set('schedule')} maxLength={2000} /></Row>
      <Muted>About & rules (players see this under the schedule)</Muted>
      <Row><Input as="textarea" rows={12} value={draft.rules} onChange={set('rules')} maxLength={5000} /></Row>
      <Muted>Cup start (your local time) drives the countdown. Matches are only called after you hit Start.</Muted>
      <Row>
        <Input type="datetime-local" value={draft.cupStart} onChange={set('cupStart')} />
        <Btn onClick={save}>Save info</Btn>
      </Row>
    </Box>
  );
}

const Cards = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  ${({ theme }) => theme.media.sm} { grid-template-columns: 1fr 1fr; }
`;

const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.color.border};
  padding: ${({ theme }) => theme.space[3]};
  &.late { border-color: #ff7a7a; }
  header { display: flex; justify-content: space-between; font-weight: 700; margin-bottom: ${({ theme }) => theme.space[2]}; }
  .vs { font-size: ${({ theme }) => theme.fontSize.small}; line-height: 1.5; }
`;

/** One card per court with one-tap result / no-show buttons. */
function CourtBoard({ state, op }) {
  const now = useNow();
  const noShow = (match, team) =>
    window.confirm(`Forfeit ${team.name}? They're out and ${match.a.id === team.id ? match.b.name : match.a.name} advances.`) &&
    op('no_show', { id: match.id, team: team.id }, `${team.name} forfeited. ${match.a.id === team.id ? match.b.name : match.a.name} advances.`);
  return (
    <Box>
      <h2>Courts · tap the winner when a game ends</h2>
      {state.courts.length === 0 && <Muted>No courts yet. Add them below.</Muted>}
      <Cards>
        {state.courts.map((court) => {
          const match = court.match;
          if (!match) return <Card key={court.id}><header><span>{court.label}</span><Muted as="span">{court.active ? (state.paused ? 'paused' : 'waiting for a match') : 'closed'}</Muted></header></Card>;
          const elapsed = (now - new Date(match.created)) / 1000;
          const late = elapsed > SHOW_UP_SECONDS;
          return (
            <Card key={court.id} className={late ? 'late' : ''}>
              <header><span>{court.label} · {match.final ? 'FINAL' : `R${match.round}`}</span><span>{clock(elapsed)}</span></header>
              <div className="vs">
                <b>A</b> {teamLabel(match.a)}<br /><Muted as="span">{match.a.players?.join(' & ')}</Muted><br />
                <b>B</b> {teamLabel(match.b)}<br /><Muted as="span">{match.b.players?.join(' & ')}</Muted>
              </div>
              {late && <Muted style={{ color: '#ff7a7a' }}>Over 3 min since called. Forfeit whoever isn't here.</Muted>}
              <Row>
                <Btn className="small" onClick={() => op('match_result', { id: match.id, winner: match.a.id }, `${match.a.name} won and advances.`)}>A won</Btn>
                <Btn className="small" onClick={() => op('match_result', { id: match.id, winner: match.b.id }, `${match.b.name} won and advances.`)}>B won</Btn>
              </Row>
              <Row>
                <Btn className="ghost small" onClick={() => noShow(match, match.a)}>Forfeit A</Btn>
                <Btn className="ghost small" onClick={() => noShow(match, match.b)}>Forfeit B</Btn>
              </Row>
            </Card>
          );
        })}
      </Cards>
    </Box>
  );
}
