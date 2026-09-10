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

// The instancer: each student launches their own isolated challenge instance.
const LAUNCH_URL = 'https://ctf.pyras.org';

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

const SectionBlock = styled.div`
  margin-top: ${({ theme }) => theme.space[16]};
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
    grid-template-columns: repeat(3, minmax(0, 1fr));
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

  code {
    color: ${({ theme }) => theme.color.accentBright};
  }
`;

const Help = styled.p`
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.small};
  line-height: 1.6;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.color.textMuted};
  max-width: ${({ theme }) => theme.layout.maxWidthText};
  margin-top: ${({ theme }) => theme.space[6]};

  strong {
    color: ${({ theme }) => theme.color.accent};
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
  }
`;

const AiNote = styled.p`
  font-family: ${({ theme }) => theme.fontFamily.body};
  font-size: ${({ theme }) => theme.fontSize.body};
  line-height: 1.6;
  color: ${({ theme }) => theme.color.text};
  max-width: ${({ theme }) => theme.layout.maxWidthText};
  margin-top: ${({ theme }) => theme.space[5]};
  padding-left: ${({ theme }) => theme.space[4]};
  border-left: 2px solid ${({ theme }) => theme.color.accent};

  strong {
    color: ${({ theme }) => theme.color.accentBright};
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
  }
`;

/* ---- submission forms ---- */

const Form = styled.form`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${({ theme }) => theme.space[4]};
  max-width: 680px;
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

const vaultChallenges = [
  {
    name: 'Multisig Mayhem',
    difficulty: 'Warm-up',
    desc: 'A jackpot vault guarded by a three-owner multisig. It checks the signatures on a withdrawal — but how carefully?',
    file: '/challenges/cex-security-multisig_mayhem.tar.gz',
  },
  {
    name: 'Flash Crash',
    difficulty: 'Medium',
    desc: 'A neon flash-credit desk that opens a session for the length of your transaction, then trusts that session a little too much.',
    file: '/challenges/blockchain-flash_crash.tar.gz',
  },
  {
    name: 'Double Down Drain',
    difficulty: 'Hard',
    desc: 'A high-roller vault that runs your module and pays its owner. Neither lever is enough on its own.',
    file: '/challenges/blockchain-double_down_drain.tar.gz',
  },
];

const vaultOptions = vaultChallenges.map((c) => c.name);

/** POSTs the form to the Worker; `track` distinguishes level on the dashboard. */
async function postSubmission(form, setStatus) {
  const data = Object.fromEntries(new FormData(form).entries());
  setStatus({ state: 'sending', msg: 'Submitting…' });
  try {
    const res = await fetch(`${API_BASE}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json().catch(() => ({}));
    if (body.flag_correct === true) {
      setStatus({ state: 'ok', msg: '✓ Correct flag — nice. Submission recorded.' });
    } else if (body.flag_correct === false) {
      setStatus({ state: 'error', msg: 'Recorded, but that flag is not correct.' });
    } else {
      setStatus({ state: 'ok', msg: 'Received. Good luck.' });
    }
    form.reset();
  } catch (err) {
    setStatus({
      state: 'error',
      msg: `Could not submit (${err.message}). Try again shortly.`,
    });
  }
}

function TipJarForm() {
  const [status, setStatus] = useState({ state: 'idle', msg: '' });
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        postSubmission(e.currentTarget, setStatus);
      }}
    >
      <input type="hidden" name="challenge" value="Level 1 — TipJar" />
      <Field>
        Name
        <Input name="name" required placeholder="Your name" autoComplete="name" />
      </Field>
      <Field>
        Email
        <Input name="email" type="email" required placeholder="you@purdue.edu" autoComplete="email" />
      </Field>
      <Field $full>
        Contract address (Sepolia)
        <Input name="onchain" required placeholder="0x…" />
      </Field>
      <Field $full>
        Etherscan link, deploy tx, and repo
        <Input
          name="links"
          required
          placeholder="https://sepolia.etherscan.io/address/…#code   +   deploy tx   +   https://github.com/…"
        />
      </Field>
      <Field $full>
        How you tested it / decisions you made
        <Textarea name="writeup" placeholder="Keep it simple and in your own words — don't paste AI slop." />
      </Field>
      <SubmitRow>
        <SubmitButton type="submit" disabled={status.state === 'sending'}>
          Submit TipJar
        </SubmitButton>
        {status.msg && <StatusMsg $error={status.state === 'error'}>{status.msg}</StatusMsg>}
      </SubmitRow>
    </Form>
  );
}

function VaultForm() {
  const [status, setStatus] = useState({ state: 'idle', msg: '' });
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        postSubmission(e.currentTarget, setStatus);
      }}
    >
      <Field>
        Name
        <Input name="name" required placeholder="Your name" autoComplete="name" />
      </Field>
      <Field>
        Email
        <Input name="email" type="email" required placeholder="you@purdue.edu" autoComplete="email" />
      </Field>
      <Field>
        Challenge
        <Select name="challenge" required defaultValue="">
          <option value="" disabled>
            Select…
          </option>
          {vaultOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </Field>
      <Field $full>
        What is the flag?
        <Input name="flag" required placeholder="boiler{…}  — from /claim after you drain the vault" />
      </Field>
      <Field $full>
        Paste your exploit (forge test / solve script)
        <Textarea name="exploit" placeholder="Paste the exploit you used to drain the vault." style={{ minHeight: '200px', fontFamily: 'ui-monospace, monospace' }} />
      </Field>
      <Field $full>
        The vulnerability + how you'd fix it
        <Textarea name="writeup" required placeholder="In your own words, keep it simple — don't paste AI slop. The bug, how your exploit drains it, and the fix." />
      </Field>
      <SubmitRow>
        <SubmitButton type="submit" disabled={status.state === 'sending'}>
          Submit flag
        </SubmitButton>
        {status.msg && <StatusMsg $error={status.state === 'error'}>{status.msg}</StatusMsg>}
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
          <Eyebrow>Prove it on-chain</Eyebrow>
          <Title>
            Boiler Blockchain <span>Challenges</span>
          </Title>
          <AiNote>
            <strong>AI use is encouraged</strong> — but you must understand what
            is going on and what you are doing. Be able to explain every line,
            every decision, and how you verified it works.
          </AiNote>
          <Help>
            Stuck or have a question? Message <strong>!spek (@sp3ked)</strong> on
            Discord.
          </Help>
        </Head>

        {/* LEVEL 1 */}
        <SectionBlock>
          <LevelLabel>
            <LevelNumber>Level 1</LevelNumber>
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

          <div style={{ marginTop: '2.5rem' }}>
            <LevelLabel>
              <LevelNumber>Submit · Level 1</LevelNumber>
            </LevelLabel>
            <TipJarForm />
          </div>
        </SectionBlock>

        {/* LEVEL 2 */}
        <SectionBlock>
          <LevelLabel>
            <LevelNumber>Level 2</LevelNumber>
          </LevelLabel>
          <LevelHeading>Break a vault</LevelHeading>
          <Body style={{ marginTop: '1rem' }}>
            Each challenge is a <strong>custom vulnerable contract</strong> with a
            hidden flaw. Launch your own live instance and exploit it.
          </Body>
          <Actions>
            <Button
              href={LAUNCH_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Launch your instance <ExternalLink size={15} />
            </Button>
          </Actions>

          <ChallengeGrid>
            {vaultChallenges.map((c, i) => (
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
                  Source (dev locally) ↓
                </DownloadLink>
              </ChallengeCard>
            ))}
          </ChallengeGrid>

          <Body style={{ marginTop: '2.5rem' }}>
            <strong>The goal:</strong> every challenge is a vault holding 10 ETH
            with a hidden flaw. Break it, drain the vault to zero, and capture the
            flag.
          </Body>
          <Steps>
            <li>
              <strong>Launch your instance</strong> — you get a private RPC URL, a
              funded player key, and the contract addresses.
            </li>
            <li>
              <strong>Point Foundry at that RPC</strong> and exploit the bug to{' '}
              <strong>drain the vault</strong> (balance → 0).
            </li>
            <li>
              <strong>
                <code>POST</code> to your instance's <code>/claim</code>
              </strong>{' '}
              → it hands you the flag.
            </li>
            <li>
              <strong>Paste the flag</strong> into the form below.
            </li>
          </Steps>

          <Note>
            Your instance expires after 30 minutes of inactivity. The source
            download is optional — for reading the code or testing your exploit
            locally first. Needs Foundry.
          </Note>

          <div style={{ marginTop: '2.5rem' }}>
            <LevelLabel>
              <LevelNumber>Submit · Level 2</LevelNumber>
            </LevelLabel>
            <VaultForm />
            <Help>
              Problems submitting or a question about a challenge? Message{' '}
              <strong>!spek (@sp3ked)</strong> on Discord.
            </Help>
          </div>
        </SectionBlock>
      </Container>
    </Section>
  );
}
