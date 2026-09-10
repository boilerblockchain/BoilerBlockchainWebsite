import { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink } from '../ui/Arrow';
import {
  Section,
  Container,
  GridBackdrop,
  Eyebrow,
  Lead,
  Tag,
  Button,
} from '../ui/primitives';

/**
 * Base URL of the Cloudflare Worker that stores submissions in D1.
 * Set VITE_CHALLENGES_API at build time (see worker/README.md). Falls back to
 * the deployed worker route so a plain build still points somewhere real.
 */
const API_BASE =
  import.meta.env.VITE_CHALLENGES_API ||
  'https://bb-challenges.jkokinda9.workers.dev';

const Head = styled.div`
  margin-bottom: ${({ theme }) => theme.space[12]};
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  margin-bottom: ${({ theme }) => theme.space[6]};
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textFaint};
  text-decoration: none;
  transition: color ${({ theme }) => theme.motion.base};

  &::before {
    content: '←';
  }

  &:hover {
    color: ${({ theme }) => theme.color.accent};
  }
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

const LevelLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  margin-bottom: ${({ theme }) => theme.space[6]};
  padding-bottom: ${({ theme }) => theme.space[3]};
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`;

const LevelNumber = styled.span`
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.accent};
`;

const LevelHeading = styled.h2`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.h3};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.color.text};
`;

const Body = styled.p`
  font-family: ${({ theme }) => theme.fontFamily.body};
  font-size: ${({ theme }) => theme.fontSize.body};
  line-height: 1.65;
  color: ${({ theme }) => theme.color.textMuted};
  max-width: ${({ theme }) => theme.layout.maxWidthText};
  margin-bottom: ${({ theme }) => theme.space[5]};

  a {
    color: ${({ theme }) => theme.color.accent};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Steps = styled.ol`
  margin: 0 0 ${({ theme }) => theme.space[6]};
  padding-left: 1.2rem;
  max-width: ${({ theme }) => theme.layout.maxWidthText};

  li {
    font-family: ${({ theme }) => theme.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSize.body};
    line-height: 1.6;
    color: ${({ theme }) => theme.color.textMuted};
    padding: ${({ theme }) => theme.space[2]} 0;

    strong {
      color: ${({ theme }) => theme.color.text};
      font-weight: ${({ theme }) => theme.fontWeight.semibold};
    }

    code {
      font-family: ${({ theme }) => theme.fontFamily.mono};
      font-size: 0.9em;
      color: ${({ theme }) => theme.color.accentBright};
    }
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[4]};
  margin-top: ${({ theme }) => theme.space[6]};
`;

const ChallengeGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${({ theme }) => theme.space[5]};
  margin-top: ${({ theme }) => theme.space[8]};

  ${({ theme }) => theme.media.sm} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const ChallengeCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.color.surfaceRaised};
  border: 1px solid ${({ theme }) => theme.color.border};
  padding: ${({ theme }) => theme.space[6]};
  transition: border-color ${({ theme }) => theme.motion.base},
    transform ${({ theme }) => theme.motion.base};

  &:hover {
    border-color: ${({ theme }) => theme.color.accentBorderStrong};
    transform: translateY(-3px);
  }
`;

const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[3]};
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const CardName = styled.h3`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.h4};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.color.accent};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const CardDesc = styled.p`
  font-family: ${({ theme }) => theme.fontFamily.body};
  font-size: ${({ theme }) => theme.fontSize.small};
  line-height: 1.55;
  color: ${({ theme }) => theme.color.textMuted};
  margin-bottom: ${({ theme }) => theme.space[5]};
  flex: 1;
`;

const DownloadLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  margin-top: auto;
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textMuted};
  text-decoration: none;
  border: 1px solid ${({ theme }) => theme.color.border};
  padding: 0.5rem 0.8rem;
  align-self: flex-start;
  transition: color ${({ theme }) => theme.motion.base},
    border-color ${({ theme }) => theme.motion.base};

  &:hover {
    color: ${({ theme }) => theme.color.accent};
    border-color: ${({ theme }) => theme.color.accent};
  }
`;

const Note = styled.p`
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  line-height: 1.6;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.color.textFaint};
  max-width: ${({ theme }) => theme.layout.maxWidthText};
  margin-top: ${({ theme }) => theme.space[8]};
  padding-top: ${({ theme }) => theme.space[5]};
  border-top: 1px solid ${({ theme }) => theme.color.border};
`;

/* ---- submission form ---- */

const Form = styled.form`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${({ theme }) => theme.space[4]};
  max-width: 640px;
  margin-top: ${({ theme }) => theme.space[6]};

  ${({ theme }) => theme.media.sm} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textMuted};

  ${({ $full }) =>
    $full &&
    `
    grid-column: 1 / -1;
  `}
`;

const inputStyles = `
  width: 100%;
  padding: 0.7rem 0.8rem;
  background: #0E0E12;
  border: 1px solid rgba(255,255,255,0.10);
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  letter-spacing: normal;
  text-transform: none;
  border-radius: 0;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #A855F7;
  }
  &::placeholder { color: rgba(255,255,255,0.35); }
`;

const Input = styled.input`
  ${inputStyles}
`;

const Select = styled.select`
  ${inputStyles}
`;

const Textarea = styled.textarea`
  ${inputStyles}
  min-height: 120px;
  resize: vertical;
`;

const SubmitRow = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};
  flex-wrap: wrap;
`;

const SubmitButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  padding: 0.9rem 1.75rem;
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.small};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: ${({ theme }) => theme.color.accentDeep};
  border: 1px solid ${({ theme }) => theme.color.accentDeep};
  color: #fff;
  cursor: pointer;
  transition: background ${({ theme }) => theme.motion.base};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.color.accent};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StatusMsg = styled.span`
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.small};
  color: ${({ $error, theme }) =>
    $error ? '#ff6b6b' : theme.color.accentBright};
`;

const challengeOptions = [
  'Level 1 — TipJar',
  'Multisig Mayhem',
  'Flash Crash',
  'Double Down Drain',
  'Trusted Transit',
];

const level2 = [
  {
    name: 'Multisig Mayhem',
    difficulty: 'Warm-up',
    desc: 'A "three-owner" multisig vault that trusts ecrecover without checking whether the recovered address is actually an owner. Forge the signatures, drain the vault.',
    file: '/challenges/cex-security-multisig_mayhem.tar.gz',
  },
  {
    name: 'Flash Crash',
    difficulty: 'Medium',
    desc: 'A flash-credit vault whose session flag lives in EIP-1153 transient storage. Transient storage clears at the end of the transaction, not between calls — open the session and drain in a single tx.',
    file: '/challenges/blockchain-flash_crash.tar.gz',
  },
  {
    name: 'Double Down Drain',
    difficulty: 'Hard',
    desc: 'A vault that merges a delegatecall flash loan with an owner-only skim(). Neither trick drains it alone. Chain both in one transaction.',
    file: '/challenges/blockchain-double_down_drain.tar.gz',
  },
  {
    name: 'Trusted Transit',
    difficulty: 'Bonus · Move / Sui',
    desc: 'A cross-chain bridge with a flawed attestation check, written in Move for Sui. Different toolchain, different mindset — the advanced bonus round.',
    file: '/challenges/blockchain-trusted_transit.tar.gz',
  },
];

function SubmissionForm() {
  const [status, setStatus] = useState({ state: 'idle', msg: '' });

  async function onSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus({ state: 'sending', msg: 'Submitting…' });
    try {
      const res = await fetch(`${API_BASE}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus({ state: 'ok', msg: 'Received. Good luck.' });
      form.reset();
    } catch (err) {
      setStatus({
        state: 'error',
        msg: `Could not submit (${err.message}). Try again shortly.`,
      });
    }
  }

  return (
    <Form onSubmit={onSubmit}>
      <Field>
        Name
        <Input name="name" required placeholder="Your name" autoComplete="name" />
      </Field>
      <Field>
        Email
        <Input
          name="email"
          type="email"
          required
          placeholder="you@purdue.edu"
          autoComplete="email"
        />
      </Field>
      <Field>
        Challenge
        <Select name="challenge" required defaultValue="">
          <option value="" disabled>
            Select…
          </option>
          {challengeOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </Field>
      <Field>
        Contract address / tx (if any)
        <Input name="onchain" placeholder="0x… address, or winning tx hash" />
      </Field>
      <Field $full>
        Links (repo, Etherscan, gist)
        <Input
          name="links"
          placeholder="https://github.com/…  https://sepolia.etherscan.io/…"
        />
      </Field>
      <Field $full>
        Writeup / notes
        <Textarea
          name="writeup"
          placeholder="How you approached it, how you tested, the vuln + fix for Level 2."
        />
      </Field>
      <SubmitRow>
        <SubmitButton type="submit" disabled={status.state === 'sending'}>
          Submit
        </SubmitButton>
        {status.msg && (
          <StatusMsg $error={status.state === 'error'}>{status.msg}</StatusMsg>
        )}
      </SubmitRow>
    </Form>
  );
}

export default function Challenges() {
  return (
    <Section $divided={false}>
      <GridBackdrop />
      <Container $wide>
        <Head>
          <BackButton to="/">Back</BackButton>
          <Eyebrow>Prove it on-chain</Eyebrow>
          <Title>
            Boiler Blockchain <span>Challenges</span>
          </Title>
          <Lead>
            Two levels. Level 1 is required: build and ship a contract to a live
            testnet. Level 2 is an optional set of vulnerable-contract puzzles
            that get harder as you go. Submit everything at the bottom of this
            page.
          </Lead>
        </Head>

        {/* LEVEL 1 */}
        <LevelLabel>
          <LevelNumber>Level 1</LevelNumber>
          <Tag>Required</Tag>
        </LevelLabel>
        <LevelHeading>Ship a TipJar</LevelHeading>
        <Body style={{ marginTop: '1rem' }}>
          Write a <code>TipJar</code> contract, deploy it to the{' '}
          <strong>Sepolia</strong> testnet, verify it on Etherscan, and send a
          few real transactions through it.
        </Body>
        <Steps>
          <li>
            Build a <code>TipJar</code>: anyone deposits ETH, totals tracked{' '}
            <strong>per address</strong>, only the owner withdraws. Use{' '}
            <strong>OpenZeppelin v5</strong> for <code>Ownable</code>.
          </li>
          <li>
            Deploy to <strong>Sepolia</strong> and verify the source on
            Etherscan.
          </li>
          <li>
            Send at least two deposits from one address and one withdrawal.
          </li>
          <li>
            Submit the contract address, Etherscan link, deploy tx, repo, and a
            short note (form below).
          </li>
        </Steps>
        <Actions>
          <Button
            href="/challenges/level-1-tipjar.md"
            target="_blank"
            rel="noopener noreferrer"
            $variant="outline"
          >
            Read the full brief <ExternalLink size={15} />
          </Button>
        </Actions>

        {/* LEVEL 2 */}
        <div style={{ marginTop: '5rem' }}>
          <LevelLabel>
            <LevelNumber>Level 2</LevelNumber>
            <Tag>Optional</Tag>
          </LevelLabel>
          <LevelHeading>Break a vault</LevelHeading>
          <Body style={{ marginTop: '1rem' }}>
            Each challenge is a custom vulnerable contract with a Docker handout
            you run locally (<code>docker compose up</code>) to develop your
            exploit against the real bytecode. Find the bug, write an exploit
            that actually drains the vault, then submit your solve script, the
            winning transaction, and a short explanation of the vulnerability and
            how you would fix it.
          </Body>

          <ChallengeGrid>
            {level2.map((c, i) => (
              <ChallengeCard
                key={c.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{
                  duration: 0.4,
                  delay: Math.min(i, 4) * 0.05,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <CardTop>
                  <Tag>{c.difficulty}</Tag>
                </CardTop>
                <CardName>{c.name}</CardName>
                <CardDesc>{c.desc}</CardDesc>
                <DownloadLink href={c.file} download>
                  Download handout ↓
                </DownloadLink>
              </ChallengeCard>
            ))}
          </ChallengeGrid>

          <Note>
            Each handout runs a local chain that returns a placeholder{' '}
            <code>fake&#123;flag&#125;</code>. Submit a working exploit plus a
            short walkthrough. Requires Docker and Foundry (Trusted Transit needs
            the Sui / Move toolchain).
          </Note>
        </div>

        {/* SUBMIT */}
        <div style={{ marginTop: '5rem' }}>
          <LevelLabel>
            <LevelNumber>Submit</LevelNumber>
          </LevelLabel>
          <LevelHeading>Send your work</LevelHeading>
          <Body style={{ marginTop: '1rem' }}>
            One form for every challenge. Pick which one, drop your links, and
            add a short writeup.
          </Body>
          <SubmissionForm />
        </div>
      </Container>
    </Section>
  );
}
