import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

export const API =
  import.meta.env.VITE_PICKLEBALL_API || 'https://pickleball.boilerblockchain.org';

export async function call(path, body, adminToken) {
  const response = await fetch(API + path, {
    method: body ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(adminToken ? { Authorization: 'Bearer ' + adminToken } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'request failed');
  return data;
}

/** Polls `path` every `every` ms while the tab is visible. Returns [data, error, refresh, setData]. */
export function usePoll(path, adminToken, every = 3000) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const latest = useRef(0);
  const refresh = useCallback(() => {
    if (!path) return;
    // Only the newest request may update state, so a slow response from
    // before login (or a token change) can never overwrite a fresher one.
    const request = ++latest.current;
    call(path, null, adminToken)
      .then((next) => { if (request === latest.current) { setData(next); setError(''); } })
      .catch((err) => { if (request === latest.current) setError(err.message); });
  }, [path, adminToken]);
  useEffect(() => {
    refresh();
    const timer = setInterval(() => { if (!document.hidden) refresh(); }, every);
    document.addEventListener('visibilitychange', refresh);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', refresh); };
  }, [refresh, every]);
  // setData also bumps the sequence so an older in-flight poll can't overwrite it.
  const set = useCallback((next) => { latest.current += 1; setData(next); }, []);
  return [data, error, refresh, set];
}

export const Page = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space[6]} ${({ theme }) => theme.sectionPadding.inline} ${({ theme }) => theme.space[16]};
  color: ${({ theme }) => theme.color.text};
  font-family: ${({ theme }) => theme.fontFamily.body};
  &.wide { max-width: 1200px; }
`;

export const Title = styled.h1`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.h2};
  line-height: 1.05;
  margin: 0 0 ${({ theme }) => theme.space[2]};
  span { color: ${({ theme }) => theme.color.accent}; }
`;

export const Muted = styled.p`
  color: ${({ theme }) => theme.color.textMuted};
  font-size: ${({ theme }) => theme.fontSize.small};
  margin: ${({ theme }) => theme.space[1]} 0;
`;

export const Box = styled.section`
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  padding: ${({ theme }) => theme.space[5]};
  margin-top: ${({ theme }) => theme.space[4]};
  &.hot { border-color: ${({ theme }) => theme.color.accentBorderStrong}; background: ${({ theme }) => theme.color.accentWash}; }
  h2 {
    font-family: ${({ theme }) => theme.fontFamily.mono};
    font-size: ${({ theme }) => theme.fontSize.micro};
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.color.textFaint};
    margin: 0 0 ${({ theme }) => theme.space[3]};
  }
`;

export const Big = styled.div`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.h3};
  font-weight: 700;
  margin: ${({ theme }) => theme.space[1]} 0;
`;

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[2]};
  align-items: center;
  margin-top: ${({ theme }) => theme.space[3]};
  & > input, & > select, & > textarea { flex: 1; min-width: 8rem; }
`;

export const Btn = styled.button`
  font: inherit;
  font-weight: 600;
  padding: 0.7rem 1.1rem;
  border: 1px solid ${({ theme }) => theme.color.accent};
  background: ${({ theme }) => theme.color.accent};
  color: #fff;
  cursor: pointer;
  &.ghost { background: transparent; color: ${({ theme }) => theme.color.text}; border-color: ${({ theme }) => theme.color.borderStrong}; }
  &.danger { background: transparent; color: #ff7a7a; border-color: rgba(255, 122, 122, 0.4); }
  &.huge { width: 100%; padding: 1.1rem; font-size: ${({ theme }) => theme.fontSize.h4}; }
  &.small { padding: 0.35rem 0.6rem; font-size: ${({ theme }) => theme.fontSize.small}; }
  &:disabled { opacity: 0.5; cursor: default; }
`;

export const Input = styled.input`
  font: inherit;
  font-size: 16px; /* below 16px iOS Safari zooms the page on focus */
  padding: 0.7rem 0.8rem;
  background: ${({ theme }) => theme.color.black};
  color: ${({ theme }) => theme.color.text};
  border: 1px solid ${({ theme }) => theme.color.borderStrong};
  &:focus { outline: none; border-color: ${({ theme }) => theme.color.accent}; }
`;

export const Select = styled(Input).attrs({ as: 'select' })``;

export const Error = styled.p`
  color: #ff7a7a;
  font-size: ${({ theme }) => theme.fontSize.small};
`;

export const List = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  li {
    display: flex;
    justify-content: space-between;
    gap: ${({ theme }) => theme.space[3]};
    padding: ${({ theme }) => theme.space[2]} 0;
    border-bottom: 1px solid ${({ theme }) => theme.color.border};
  }
  li:last-child { border-bottom: 0; }
  li > span:first-child { white-space: nowrap; }
  b { font-family: ${({ theme }) => theme.fontFamily.mono}; color: ${({ theme }) => theme.color.accentBright}; }
`;

export const teamLabel = (team) => team?.name || '';

const Rules = styled.details`
  margin-top: ${({ theme }) => theme.space[3]};
  summary { cursor: pointer; font-weight: 600; color: ${({ theme }) => theme.color.accentBright}; }
  div { white-space: pre-line; margin-top: ${({ theme }) => theme.space[2]}; color: ${({ theme }) => theme.color.textMuted}; font-size: ${({ theme }) => theme.fontSize.small}; line-height: 1.6; }
`;

/** Re-renders every second; for countdowns. */
export function useNow() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, []);
  return now;
}

export const SHOW_UP_SECONDS = 180;

export function clock(seconds) {
  const whole = Math.max(0, Math.floor(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}

function countdown(cupStart) {
  const ms = new Date(cupStart) - Date.now();
  if (!cupStart || ms <= 0) return null;
  const minutes = Math.ceil(ms / 60000);
  return minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`;
}

/** Admin-editable announcement, schedule and cup countdown. */
export function EventInfo({ state }) {
  const info = state?.info;
  if (!info) return null;
  const until = countdown(info.cupStart);
  return (
    <>
      {info.announcement && <Box className="hot"><h2>📣 Announcement</h2><div style={{ whiteSpace: 'pre-line' }}>{info.announcement}</div></Box>}
      <Box>
        <h2>{!state.paused ? '🏓 Cup is live' : until ? `Cup starts in ${until}` : 'Schedule'}</h2>
        <Muted style={{ whiteSpace: 'pre-line' }}>{info.schedule}</Muted>
        {info.rules && (
          <Rules>
            <summary>About the cup & rules</summary>
            <div>{info.rules}</div>
          </Rules>
        )}
      </Box>
    </>
  );
}

export function roundName(round, rounds) {
  const fromEnd = rounds - round;
  return ['Final', 'Semifinals', 'Quarterfinals'][fromEnd] || `Round ${round}`;
}

const BracketGrid = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(170px, 1fr);
  gap: ${({ theme }) => theme.space[3]};
  overflow-x: auto;
  padding-bottom: ${({ theme }) => theme.space[2]};
  & > div { display: flex; flex-direction: column; justify-content: space-around; gap: ${({ theme }) => theme.space[2]}; }
  h3 { font-size: ${({ theme }) => theme.fontSize.micro}; text-transform: uppercase; letter-spacing: 0.1em; color: ${({ theme }) => theme.color.textFaint}; margin: 0; }
`;

const Slot = styled.div`
  border: 1px solid ${({ theme }) => theme.color.border};
  font-size: ${({ theme }) => theme.fontSize.small};
  &.playing { border-color: ${({ theme }) => theme.color.accent}; }
  &.mine { background: ${({ theme }) => theme.color.accentWash}; }
  div { padding: 0.45rem 0.5rem; display: flex; justify-content: space-between; gap: 0.5rem; }
  div + div { border-top: 1px solid ${({ theme }) => theme.color.border}; }
  .won { font-weight: 700; color: ${({ theme }) => theme.color.accentBright}; }
  .lost, .tbd { color: ${({ theme }) => theme.color.textFaint}; }
  .lost { text-decoration: line-through; }
  small { color: ${({ theme }) => theme.color.textMuted}; padding: 0.15rem 0.5rem; display: block; }
`;

function BracketMatch({ match, mine, onPick }) {
  const pickable = onPick && match.a.id && match.b.id;
  const side = (team) => {
    const className = match.status === 'done' && team.id ? (match.winner === team.id ? 'won' : 'lost') : team.id ? '' : 'tbd';
    return (
      <div className={className} onClick={pickable ? () => onPick(match, team) : undefined} style={pickable ? { cursor: 'pointer' } : undefined}>
        <span>{team.name}</span>{match.noShow === team.id && <span>FF</span>}
      </div>
    );
  };
  const note = match.status === 'playing' ? `🏓 ${match.court}` : '';
  return (
    <Slot className={`${match.status} ${mine ? 'mine' : ''}`}>
      {side(match.a)}{side(match.b)}
      {note && <small>{note}</small>}
    </Slot>
  );
}

export function Bracket({ state, teamId, onPick }) {
  const rounds = state.bracket || [];
  if (rounds.length === 0) return <Muted>The bracket is drawn when registration closes. {state.teams} teams registered so far.</Muted>;
  return (
    <BracketGrid>
      {rounds.map((matches, index) => (
        <div key={index}>
          <h3>{roundName(index + 1, rounds.length)}</h3>
          {matches.map((match) => <BracketMatch key={match.id} match={match} mine={teamId && (match.a.id === teamId || match.b.id === teamId)} onPick={onPick} />)}
        </div>
      ))}
    </BracketGrid>
  );
}

/** Champion, courts, up next, bracket. Used by players, spectators and admins. */
export function LiveView({ state, teamId }) {
  if (!state) return <Muted>Loading…</Muted>;
  const rounds = state.bracket || [];
  const final = rounds.length ? rounds[rounds.length - 1][0] : null;
  const champion = final?.status === 'done' && [final.a, final.b].find((team) => team.id === final.winner);
  return (
    <>
      {champion && <Box className="hot"><h2>Champion</h2><Big>🏆 {champion.name}</Big><Muted>{champion.players?.join(' & ')}</Muted></Box>}
      <Box>
        <h2>Courts</h2>
        {state.paused && rounds.length > 0 && <Muted>Matches are paused.</Muted>}
        <List>
          {state.courts.filter((court) => court.active).map((court) => (
            <li key={court.id}>
              <span>{court.label}</span>
              <span>{court.match ? `${court.match.a.name} vs ${court.match.b.name}` : <Muted as="span">open</Muted>}</span>
            </li>
          ))}
        </List>
      </Box>
      {state.upNext?.length > 0 && (
        <Box>
          <h2>Up next</h2>
          <List>
            {state.upNext.map((match, index) => (
              <li key={match.id}><span>{index + 1}. {match.a.name} vs {match.b.name}</span><Muted as="span">{roundName(match.round, rounds.length)}</Muted></li>
            ))}
          </List>
        </Box>
      )}
      <Box>
        <h2>Bracket</h2>
        <Bracket state={state} teamId={teamId} />
      </Box>
    </>
  );
}
