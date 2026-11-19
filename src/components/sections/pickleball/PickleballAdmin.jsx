import { useState } from 'react';
import styled from 'styled-components';
import {
  call, usePoll, LiveView, teamLabel,
  Page, Title, Muted, Box, Row, Btn, Input, Select, Error,
} from './shared';

const KEY = 'bb_pickleball_admin';

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
  const [state, pollError, refresh] = usePoll(token ? '/admin/state' : null, token);
  const [error, setError] = useState('');

  const op = async (name, body = {}) => {
    setError('');
    try {
      await call('/admin', { op: name, ...body }, token);
      refresh();
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
  const attention = state.matches.filter((match) => match.status === 'disputed' || (match.status === 'playing' && match.claimBy));

  return (
    <Page className="wide">
      <Title>Cup <span>admin</span></Title>
      <Muted>{state.players} players · {state.teams} teams · {state.queue.length} in queue · {state.looking} looking for partner</Muted>
      {error && <Error>{error}</Error>}
      {pollError && <Error>{pollError}</Error>}
      <Row>
        <Btn className={state.paused ? '' : 'danger'} onClick={() => op('pause', { on: !state.paused })}>
          {state.paused ? '▶ Start matchmaking' : '⏸ Pause matchmaking'}
        </Btn>
        <Btn className="ghost" onClick={() => { localStorage.removeItem(KEY); setToken(''); }}>Sign out</Btn>
      </Row>

      <Grid>
        <div>
          {attention.length > 0 && (
            <Box className="hot">
              <h2>Needs attention</h2>
              <MatchTable matches={attention} op={op} teamName={teamName} />
            </Box>
          )}
          <InfoEditor info={state.info} op={op} />
          <Courts state={state} op={op} />
          <ManualMatch state={state} op={op} />
          <Box>
            <h2>All matches</h2>
            <MatchTable matches={state.matches} op={op} teamName={teamName} />
          </Box>
          <Teams state={state} op={op} />
          <Players state={state} op={op} />
          <Orgs state={state} op={op} />
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

function ManualMatch({ state, op }) {
  const [form, setForm] = useState({ court: 0, a: 0, b: 0, final: false });
  const set = (key) => (event) => setForm({ ...form, [key]: key === 'final' ? event.target.checked : Number(event.target.value) });
  const free = state.courts.filter((court) => !court.match);
  const available = state.allTeams.filter((team) => team.status !== 'playing' && team.size === 2);
  const top = state.leaderboard.slice(0, 2).map((org) => org.name).join(' vs ');
  return (
    <Box>
      <h2>Manual match / final</h2>
      {top && <Muted>Current top two: <b>{top}</b>. For the final, pick one team from each and tick Final.</Muted>}
      <Row>
        <Select value={form.court} onChange={set('court')}>
          <option value={0}>Court…</option>
          {free.map((court) => <option key={court.id} value={court.id}>{court.label}</option>)}
        </Select>
        {['a', 'b'].map((side) => (
          <Select key={side} value={form[side]} onChange={set(side)}>
            <option value={0}>Team {side.toUpperCase()}…</option>
            {available.map((team) => <option key={team.view.id} value={team.view.id}>{teamLabel(team.view)}</option>)}
          </Select>
        ))}
        <label><input type="checkbox" checked={form.final} onChange={set('final')} /> Final</label>
        <Btn onClick={() => op('match_create', form)}>Start</Btn>
      </Row>
    </Box>
  );
}

function MatchTable({ matches, op, teamName }) {
  return (
    <Table>
      <thead><tr><th>#</th><th>Court</th><th>Teams</th><th>Status</th><th>Set winner</th></tr></thead>
      <tbody>
        {matches.map((match) => (
          <tr key={match.id}>
            <td>{match.id}{match.final ? ' 🏆' : ''}</td>
            <td>{match.court}</td>
            <td>{teamLabel(match.a)}<br />{teamLabel(match.b)}</td>
            <td>
              {match.status}
              {match.status === 'done' && <><br />won: {teamName(match.winner)}</>}
              {match.status === 'playing' && match.claimBy > 0 && <><br />claim: {teamName(match.claimWinner)} won</>}
            </td>
            <td>
              <Btn className="ghost small" onClick={() => op('match_result', { id: match.id, winner: match.a.id })}>{match.a.name}</Btn>{' '}
              <Btn className="ghost small" onClick={() => op('match_result', { id: match.id, winner: match.b.id })}>{match.b.name}</Btn>{' '}
              {match.status !== 'void' && <Btn className="danger small" onClick={() => op('match_void', { id: match.id })}>Void</Btn>}
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
        <thead><tr><th>Team</th><th>Code</th><th>Status</th><th /></tr></thead>
        <tbody>
          {[...state.allTeams].sort((x, y) => x.view.name.localeCompare(y.view.name)).map((team) => (
            <tr key={team.view.id}>
              <td>{teamLabel(team.view)}<br /><Muted as="span">{team.view.players?.join(', ')}</Muted></td>
              <td>{team.code}</td>
              <td>{team.status}{team.size < 2 ? ' (needs partner)' : ''}</td>
              <td>
                {team.status !== 'playing' && team.size === 2 && (
                  <Btn className="ghost small" onClick={() => op('team_status', { id: team.view.id, status: team.status === 'ready' ? 'idle' : 'ready' })}>
                    {team.status === 'ready' ? 'Dequeue' : 'Queue'}
                  </Btn>
                )}{' '}
                {team.status !== 'playing' && <Btn className="danger small" onClick={() => op('team_remove', { id: team.view.id })}>Disband</Btn>}
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
    .filter((player) => (player.name + player.org).toLowerCase().includes(filter.toLowerCase()))
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
              <td>{player.org}</td>
              <td>{player.teamId ? 'on team' : player.looking ? 'looking' : 'solo'}</td>
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

function Orgs({ state, op }) {
  const [merge, setMerge] = useState({ id: 0, to: 0 });
  const [name, setName] = useState('');
  return (
    <Box>
      <h2>Orgs</h2>
      <Muted>Merge duplicates (e.g. "UT" into "UT Austin"): players, teams and points all move.</Muted>
      <Row>
        <Select value={merge.id} onChange={(event) => setMerge({ ...merge, id: Number(event.target.value) })}>
          <option value={0}>Merge…</option>
          {state.orgs.map((org) => <option key={org.id} value={org.id}>{org.name}</option>)}
        </Select>
        <Select value={merge.to} onChange={(event) => setMerge({ ...merge, to: Number(event.target.value) })}>
          <option value={0}>…into</option>
          {state.orgs.map((org) => <option key={org.id} value={org.id}>{org.name}</option>)}
        </Select>
        <Btn onClick={() => op('org_merge', merge)}>Merge</Btn>
      </Row>
      <Row as="form" onSubmit={(event) => { event.preventDefault(); op('org_add', { name }); setName(''); }}>
        <Input placeholder="Pre-add an org (shows in signup list)" value={name} onChange={(event) => setName(event.target.value)} />
        <Btn>Add</Btn>
      </Row>
      <Table>
        <tbody>{state.orgs.map((org) => <OrgRow key={org.id} org={org} op={op} />)}</tbody>
      </Table>
    </Box>
  );
}

function OrgRow({ org, op }) {
  const [name, setName] = useState(org.name);
  return (
    <tr><td><Input value={name} onChange={(event) => setName(event.target.value)} onBlur={() => name !== org.name && op('org_rename', { id: org.id, name })} /></td></tr>
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
      <Muted>Cup start (your local time) drives the countdown. Matchmaking still starts when you hit Start.</Muted>
      <Row>
        <Input type="datetime-local" value={draft.cupStart} onChange={set('cupStart')} />
        <Btn onClick={save}>Save info</Btn>
      </Row>
    </Box>
  );
}
