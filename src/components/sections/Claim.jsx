import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  Section,
  Container,
  GridBackdrop,
  Eyebrow,
  Tag,
} from '../ui/primitives';

/**
 * Base URL of the prize-wheel backend. It signs and sends the payout, so it
 * cannot live in this static bundle. Set VITE_WHEEL_API at build time; the
 * service is the `solanawheel` deployment, not the challenges worker.
 */
const API_BASE = import.meta.env.VITE_WHEEL_API || '';

/**
 * Fixed layout of the wheel face. Decoration only: it has no relationship to
 * the sealed prize deck on chain. Every prize tier appears here so whatever the
 * server returns always has a segment to land on.
 */
const SEGMENTS = [1, 4, 2, 10, 1, 6, 2, 15, 1, 4, 2, 20, 1, 6, 2, 10, 1, 4, 2, 15];
const SEGMENT_ANGLE = 360 / SEGMENTS.length;

/**
 * One accent hue at varying depth, per the site's flat-color rule. The bigger
 * the prize the brighter the wedge, so the wheel reads without labels.
 */
const TIER_FILL = {
  20: '#C77DFF',
  15: '#A855F7',
  10: '#8B3FD9',
  6: '#7120B0',
  4: '#551A85',
  2: '#3A125C',
  1: '#241038',
};

const polar = (radius, angleDegrees) => {
  const radians = ((angleDegrees - 90) * Math.PI) / 180;
  return {
    x: 200 + radius * Math.cos(radians),
    y: 200 + radius * Math.sin(radians),
  };
};

const wedgePath = (index) => {
  const start = index * SEGMENT_ANGLE;
  const a = polar(190, start);
  const b = polar(190, start + SEGMENT_ANGLE);
  return `M 200 200 L ${a.x} ${a.y} A 190 190 0 0 1 ${b.x} ${b.y} Z`;
};

/** Current rotation in degrees, read out of the element's transform matrix. */
const currentRotation = (element) => {
  const { transform } = getComputedStyle(element);
  if (!transform || transform === 'none') return 0;
  const [a, b] = transform.replace(/matrix\(|\)/g, '').split(',').map(Number);
  return (Math.atan2(b, a) * 180) / Math.PI;
};

export default function Claim() {
  const [address, setAddress] = useState('');
  const [phase, setPhase] = useState('idle');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [campaign, setCampaign] = useState(null);

  const wheelRef = useRef(null);
  const settledFor = useRef(null);

  const spinning = phase === 'spinning' || phase === 'landing';

  const loadCampaign = useCallback(async () => {
    if (!API_BASE) return;
    try {
      const res = await fetch(`${API_BASE}/api/campaign`, { cache: 'no-store' });
      if (res.ok) setCampaign(await res.json());
    } catch {
      // The wheel still works without the panel; leave it empty.
    }
  }, []);

  useEffect(() => {
    loadCampaign();
  }, [loadCampaign]);

  // Free spin while the payout transaction is in flight.
  useEffect(() => {
    const wheel = wheelRef.current;
    if (!wheel || phase !== 'spinning') return;
    settledFor.current = null;
    wheel.style.transition = 'none';
    wheel.style.animation = 'bb-wheel-freespin 0.9s linear infinite';
  }, [phase]);

  // Decelerate onto the prize that was actually paid.
  useEffect(() => {
    const wheel = wheelRef.current;
    if (!wheel || phase !== 'landing' || !result) return;
    if (settledFor.current === result.signature) return;
    settledFor.current = result.signature;

    const candidates = SEGMENTS.reduce(
      (acc, value, index) => (value === result.usdValue ? [...acc, index] : acc),
      [],
    );
    const target = candidates[Math.floor(Math.random() * candidates.length)] ?? 0;

    // Pick up where the free spin left off so dropping the keyframe animation
    // does not snap the wheel to a new angle.
    const from = currentRotation(wheel);
    wheel.style.animation = 'none';
    wheel.style.transition = 'none';
    wheel.style.transform = `rotate(${from}deg)`;
    void wheel.offsetHeight;

    let destination = -(target * SEGMENT_ANGLE + SEGMENT_ANGLE / 2);
    while (destination < from + 1440) destination += 360;

    wheel.style.transition = 'transform 5s cubic-bezier(0.16, 0.84, 0.24, 1)';
    wheel.style.transform = `rotate(${destination}deg)`;

    const handle = setTimeout(() => {
      setPhase('done');
      loadCampaign();
    }, 5100);
    return () => clearTimeout(handle);
  }, [phase, result, loadCampaign]);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (spinning || !address.trim()) return;

    if (!API_BASE) {
      setError('The wheel backend is not configured for this build.');
      return;
    }

    setError(null);
    setResult(null);
    setPhase('spinning');

    try {
      const res = await fetch(`${API_BASE}/api/spin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: address.trim() }),
      });
      const payload = await res.json();

      if (!res.ok) {
        setError(payload.error || 'Something went wrong.');
        setPhase('idle');
        return;
      }

      // The payout has already confirmed on chain by now. The spin is
      // presentation, so it always lands on what was actually sent.
      setResult(payload);
      setPhase('landing');
    } catch {
      setError('Could not reach the server. Check your connection and retry.');
      setPhase('idle');
    }
  };

  return (
    <Section>
      <GridBackdrop />
      <Container>
        <Head>
          <Eyebrow>Boiler Blockchain</Eyebrow>
          <Title>
            Spin the <span>Wheel</span>
          </Title>
          <Lede>
            Enter your Solana address for one spin. Prizes pay out instantly, on
            chain, straight to your wallet.
          </Lede>
          {campaign && (
            <Tag>
              {campaign.remainingSlots} of {campaign.totalSlots} spins left
              {campaign.paused ? ' · paused' : ''}
            </Tag>
          )}
        </Head>

        <Stage>
          <Pointer aria-hidden="true" />
          <Rotor ref={wheelRef}>
            <svg viewBox="0 0 400 400" role="img" aria-label="Prize wheel">
              {SEGMENTS.map((value, index) => (
                <path
                  key={index}
                  d={wedgePath(index)}
                  fill={TIER_FILL[value]}
                  stroke="#000000"
                  strokeWidth={1.5}
                />
              ))}
              {SEGMENTS.map((value, index) => {
                const angle = index * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
                const at = polar(140, angle);
                return (
                  <WheelLabel
                    key={`label-${index}`}
                    x={at.x}
                    y={at.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={`rotate(${angle} ${at.x} ${at.y})`}
                  >
                    ${value}
                  </WheelLabel>
                );
              })}
              <Hub cx="200" cy="200" r="38" />
            </svg>
          </Rotor>
        </Stage>

        <Panel>
          <Form onSubmit={onSubmit}>
            <Input
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Your Solana wallet address"
              spellCheck={false}
              autoComplete="off"
              disabled={spinning}
              aria-label="Solana wallet address"
            />
            <Spin type="submit" disabled={spinning || !address.trim()}>
              {phase === 'spinning'
                ? 'Spinning'
                : phase === 'landing'
                  ? 'Landing'
                  : 'Spin'}
            </Spin>
          </Form>
          <Hint>
            Double check the address. Payouts are on chain and final, and each
            address can only spin once.
          </Hint>

          {error && <Alert role="alert">{error}</Alert>}

          {phase === 'done' && result && (
            <Won>
              <WonAmount>You won ${result.usdValue}</WonAmount>
              <WonSol>{result.amountSol.toFixed(6)} SOL sent</WonSol>
              <WonLinks>
                <a href={result.solscan} target="_blank" rel="noreferrer">
                  View on Solscan
                </a>
                <a href={result.explorer} target="_blank" rel="noreferrer">
                  View on Solana Explorer
                </a>
              </WonLinks>
            </Won>
          )}
        </Panel>

        {campaign && (
          <Panel>
            <PanelTitle>The contract</PanelTitle>
            <Hint>
              Every prize and its position was committed on chain before the
              first spin. Nobody, including us, can reorder it now.
            </Hint>

            <Vault href={campaign.solscan.vault} target="_blank" rel="noreferrer">
              <VaultLabel>Live in the prize vault</VaultLabel>
              <VaultAmount>
                {(Number(campaign.vaultLamports) / 1e9).toFixed(4)} SOL
              </VaultAmount>
              <VaultAddress>{campaign.vault}</VaultAddress>
              <VaultCta>Verify the balance on Solscan</VaultCta>
            </Vault>

            <Facts>
              <dt>Network</dt>
              <dd>{campaign.cluster}</dd>

              <dt>Program</dt>
              <dd>
                <Mono>{campaign.programId}</Mono>
                <Explorers>
                  <a href={campaign.solscan.program} target="_blank" rel="noreferrer">
                    Solscan
                  </a>
                  <a href={campaign.links.program} target="_blank" rel="noreferrer">
                    Explorer
                  </a>
                </Explorers>
              </dd>

              <dt>Prize vault</dt>
              <dd>
                <Mono>{campaign.vault}</Mono>
                <Explorers>
                  <a href={campaign.solscan.vault} target="_blank" rel="noreferrer">
                    Solscan
                  </a>
                  <a href={campaign.links.vault} target="_blank" rel="noreferrer">
                    Explorer
                  </a>
                </Explorers>
              </dd>

              <dt>Prize deck root</dt>
              <dd>
                <Mono>{campaign.deckRoot}</Mono>
              </dd>

              <dt>Claimed</dt>
              <dd>
                {campaign.claimedSlots} / {campaign.totalSlots}
              </dd>
            </Facts>
          </Panel>
        )}
      </Container>
    </Section>
  );
}

/* Styles ------------------------------------------------------------------ */

const Head = styled.div`
  margin-bottom: ${({ theme }) => theme.space[12]};
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.h1};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.color.text};
  margin-bottom: ${({ theme }) => theme.space[4]};

  span {
    color: ${({ theme }) => theme.color.accent};
  }
`;

const Lede = styled.p`
  font-size: ${({ theme }) => theme.fontSize.bodyLarge};
  color: ${({ theme }) => theme.color.textMuted};
  max-width: ${({ theme }) => theme.layout.maxWidthText};
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const Stage = styled.div`
  position: relative;
  width: min(400px, 82vw);
  aspect-ratio: 1;
  margin: 0 auto ${({ theme }) => theme.space[12]};

  @keyframes bb-wheel-freespin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const Rotor = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  will-change: transform;

  svg {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

const Pointer = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 30px solid ${({ theme }) => theme.color.accent};
  z-index: 2;
`;

const WheelLabel = styled.text`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: 22px;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  fill: ${({ theme }) => theme.color.text};
`;

const Hub = styled.circle`
  fill: ${({ theme }) => theme.color.surface};
  stroke: ${({ theme }) => theme.color.borderStrong};
  stroke-width: 3;
`;

const Panel = styled.div`
  border: 1px solid ${({ theme }) => theme.color.border};
  background: ${({ theme }) => theme.color.surfaceRaised};
  padding: ${({ theme }) => theme.space[6]};
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

const PanelTitle = styled.h2`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.h4};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.color.text};
  margin: 0 0 ${({ theme }) => theme.space[2]};
`;

const Form = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.space[3]};
  flex-wrap: wrap;
`;

const Input = styled.input`
  flex: 1 1 320px;
  min-width: 0;
  padding: ${({ theme }) => `${theme.space[4]} ${theme.space[4]}`};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.color.surface};
  color: ${({ theme }) => theme.color.text};
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.small};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.color.accentBorderStrong};
  }
`;

const Spin = styled.button`
  padding: ${({ theme }) => `${theme.space[4]} ${theme.space[8]}`};
  border: 1px solid ${({ theme }) => theme.color.accent};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.color.accent};
  color: ${({ theme }) => theme.color.text};
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.body};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  cursor: pointer;
  transition: background ${({ theme }) => theme.motion.fast};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.color.accentDeep};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const Hint = styled.p`
  margin: ${({ theme }) => theme.space[3]} 0 0;
  font-size: ${({ theme }) => theme.fontSize.small};
  color: ${({ theme }) => theme.color.textFaint};
`;

const Alert = styled.p`
  margin: ${({ theme }) => theme.space[4]} 0 0;
  padding: ${({ theme }) => theme.space[3]};
  border: 1px solid ${({ theme }) => theme.color.borderStrong};
  color: ${({ theme }) => theme.color.text};
  font-size: ${({ theme }) => theme.fontSize.small};
`;

const Won = styled.div`
  margin-top: ${({ theme }) => theme.space[5]};
  padding: ${({ theme }) => theme.space[6]};
  border: 1px solid ${({ theme }) => theme.color.accentBorderStrong};
  background: ${({ theme }) => theme.color.accentWash};
  text-align: center;
`;

const WonAmount = styled.p`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.stat};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.color.text};
  margin: 0;
`;

const WonSol = styled.p`
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.small};
  color: ${({ theme }) => theme.color.textMuted};
  margin: ${({ theme }) => theme.space[1]} 0 ${({ theme }) => theme.space[4]};
`;

const WonLinks = styled.p`
  display: flex;
  gap: ${({ theme }) => theme.space[5]};
  justify-content: center;
  flex-wrap: wrap;
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.small};

  a {
    color: ${({ theme }) => theme.color.accent};
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
  }
`;

const Vault = styled.a`
  display: block;
  margin: ${({ theme }) => theme.space[5]} 0;
  padding: ${({ theme }) => theme.space[5]};
  border: 1px solid ${({ theme }) => theme.color.accentBorder};
  background: ${({ theme }) => theme.color.accentWash};
  text-decoration: none;
  transition: border-color ${({ theme }) => theme.motion.fast};

  &:hover {
    border-color: ${({ theme }) => theme.color.accentBorderStrong};
  }
`;

const VaultLabel = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.fontSize.micro};
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textFaint};
`;

const VaultAmount = styled.span`
  display: block;
  margin-top: ${({ theme }) => theme.space[1]};
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.h3};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.color.accent};
`;

const VaultAddress = styled.span`
  display: block;
  margin-top: ${({ theme }) => theme.space[2]};
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  color: ${({ theme }) => theme.color.textFaint};
  overflow-wrap: anywhere;
`;

const VaultCta = styled.span`
  display: block;
  margin-top: ${({ theme }) => theme.space[3]};
  font-size: ${({ theme }) => theme.fontSize.small};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.color.accent};
`;

const Facts = styled.dl`
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: ${({ theme }) => `${theme.space[3]} ${theme.space[5]}`};
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.small};

  dt {
    color: ${({ theme }) => theme.color.textFaint};
  }

  dd {
    margin: 0;
    color: ${({ theme }) => theme.color.textMuted};
    overflow-wrap: anywhere;
  }

  ${({ theme }) => theme.mediaDown.sm} {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.space[1]} 0;

    dt {
      margin-top: ${({ theme }) => theme.space[3]};
    }
  }
`;

const Mono = styled.span`
  display: block;
  font-family: ${({ theme }) => theme.fontFamily.mono};
`;

const Explorers = styled.span`
  display: inline-flex;
  gap: ${({ theme }) => theme.space[4]};
  margin-top: ${({ theme }) => theme.space[1]};
  font-size: ${({ theme }) => theme.fontSize.micro};

  a {
    color: ${({ theme }) => theme.color.accent};
  }
`;
