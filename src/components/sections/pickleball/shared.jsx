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

/** Polls `path` every 3s while the tab is visible. Returns [data, error, refresh]. */
export function usePoll(path, adminToken) {
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
    const timer = setInterval(() => { if (!document.hidden) refresh(); }, 3000);
    document.addEventListener('visibilitychange', refresh);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', refresh); };
  }, [refresh]);
  return [data, error, refresh];
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
  & > input, & > select { flex: 1; min-width: 8rem; }
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

export const teamLabel = (team) =>
  team ? `${team.name}${team.org ? ` · ${team.org}` : ''}` : '';

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
        <h2>{until ? `Cup starts in ${until}` : state.paused ? 'Schedule' : 'Cup is live'}</h2>
        <Muted style={{ whiteSpace: 'pre-line' }}>{info.schedule}</Muted>
      </Box>
    </>
  );
}

/** Leaderboard, final, courts, queue, results. Used by players, spectators and admins. */
export function LiveView({ state }) {
  if (!state) return <Muted>Loading…</Muted>;
  const final = state.final;
  return (
    <>
      {final && (
        <Box className="hot">
          <h2>{final.status === 'done' ? 'Champion' : 'Final'}</h2>
          {final.status === 'done' ? (
            <Big>🏆 {[final.a, final.b].find((team) => team.id === final.winner)?.org}</Big>
          ) : (
            <Big>{teamLabel(final.a)} vs {teamLabel(final.b)}</Big>
          )}
          <Muted>{final.court}</Muted>
        </Box>
      )}
      <Box>
        <h2>Org leaderboard</h2>
        {state.leaderboard.length === 0 && <Muted>No teams yet.</Muted>}
        <List>
          {state.leaderboard.map((org, index) => (
            <li key={org.id}>
              <span>{index + 1}. {org.name} <Muted as="span">({org.teams} teams)</Muted></span>
              <b>{org.points} pt{org.points === 1 ? '' : 's'}</b>
            </li>
          ))}
        </List>
      </Box>
      <Box>
        <h2>Courts</h2>
        {state.paused && <Muted>Matchmaking is paused.</Muted>}
        <List>
          {state.courts.filter((court) => court.active).map((court) => (
            <li key={court.id}>
              <span>{court.label}</span>
              <span>{court.match ? `${teamLabel(court.match.a)} vs ${teamLabel(court.match.b)}` : <Muted as="span">open</Muted>}</span>
            </li>
          ))}
        </List>
      </Box>
      <Box>
        <h2>Up next ({state.queue.length} in queue)</h2>
        <List>
          {state.queue.map((team, index) => (
            <li key={team.id}><span>{index + 1}. {teamLabel(team)}</span></li>
          ))}
        </List>
      </Box>
      <Box>
        <h2>Recent results</h2>
        <List>
          {state.recent.map((match) => {
            const [winner, loser] = match.winner === match.a.id ? [match.a, match.b] : [match.b, match.a];
            return (
              <li key={match.id}>
                <span><b>{winner.name}</b> beat {loser.name}</span>
                <Muted as="span">+1 {winner.org}</Muted>
              </li>
            );
          })}
        </List>
      </Box>
    </>
  );
}
