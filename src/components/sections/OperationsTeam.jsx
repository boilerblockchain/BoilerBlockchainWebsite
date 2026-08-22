import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import { ExternalLink } from '../ui/Arrow';
import {
  Section,
  Container,
  GridBackdrop,
  Eyebrow,
  SectionTitle,
  Lead,
} from '../ui/primitives';

/**
 * Operations team page.
 *
 * The sparsest of the three team pages: a heading, three numbers and four
 * cards. Density pass, following the choose-a-team page — the stats become a
 * hairline strip instead of three boxes, the top of the page carries a photo,
 * and the four areas sit beside a photo column so the section fills its row
 * rather than leaving a phantom track of black.
 */

const CountUp = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!hasAnimated) {
      setHasAnimated(true);
      let startTime;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);

        setCount(Math.floor(progress * end));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [end, duration, hasAnimated]);

  return <span>{count}{suffix}</span>;
};

/* ---------------------------------------------------------------- hero band */

const HeroSection = styled(Section)`
  padding-block: clamp(3rem, 2rem + 4.5vw, 5.5rem);
`;

const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${({ theme }) => theme.space[10]};
  align-items: center;

  ${({ theme }) => theme.media.lg} {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    gap: ${({ theme }) => theme.space[12]};
  }
`;

/* Leading accent rule, so the top of the page carries some structure. */
const HeroCopy = styled.div`
  min-width: 0;
  border-left: 2px solid ${({ theme }) => theme.color.accent};
  padding-left: ${({ theme }) => theme.space[5]};

  ${({ theme }) => theme.media.md} {
    padding-left: ${({ theme }) => theme.space[6]};
  }
`;

const PageTitle = styled(SectionTitle)`
  font-size: ${({ theme }) => theme.fontSize.h1};
  line-height: 0.98;
  letter-spacing: -0.03em;
`;

const Frame = styled.div`
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.color.border};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    /* Greyscale at rest so unrelated snapshots read as one set. */
    filter: grayscale(1) brightness(0.62);
    transition: transform ${({ theme }) => theme.motion.slow},
                filter ${({ theme }) => theme.motion.slow};
  }

  &:hover img {
    filter: grayscale(0) brightness(0.88);
    transform: scale(1.03);
  }
`;

const ShortFrame = styled(Frame)`
  aspect-ratio: 16 / 9;

  ${({ theme }) => theme.media.lg} {
    aspect-ratio: auto;
    flex: 1;
    min-height: 160px;
  }
`;

/* ---------------------------------------------------------------- stat strip */

/* Hairline-divided inline row spanning the container, like home/Stats. */
const StatStrip = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  margin-top: ${({ theme }) => theme.space[10]};
  border-top: 1px solid ${({ theme }) => theme.color.border};

  ${({ theme }) => theme.media.sm} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const StatCell = styled(motion.div)`
  min-width: 0;
  padding-block: ${({ theme }) => theme.space[6]};
  border-bottom: 1px solid ${({ theme }) => theme.color.border};

  ${({ theme }) => theme.media.sm} {
    border-bottom: 0;
    border-left: 1px solid ${({ theme }) => theme.color.border};
    padding-inline: ${({ theme }) => theme.space[6]};

    &:first-child {
      border-left: 0;
      padding-left: 0;
    }
  }
`;

const StatNumber = styled.div`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.stat};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  line-height: 1;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.color.accent};
  font-variant-numeric: tabular-nums;
  margin-bottom: ${({ theme }) => theme.space[3]};
`;

const StatLabel = styled.div`
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textFaint};
`;

/* ------------------------------------------------------------- areas layout */

/* Heading and photography hold the left column so the four cards do not sit
   alone in a half-empty row. */
const Split = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${({ theme }) => theme.space[10]};

  ${({ theme }) => theme.media.lg} {
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
    gap: ${({ theme }) => theme.space[12]};
    /* stretch, not start: with start each column sized to its own content, so
       the images ended at a different baseline from the card grid. */
    align-items: stretch;
  }
`;

const Aside = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[6]};
`;

const Head = styled.div`
  padding-bottom: ${({ theme }) => theme.space[5]};
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`;

const Count = styled.span`
  display: block;
  margin-top: ${({ theme }) => theme.space[4]};
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textFaint};
`;

/* The reveal sits on a wrapper so framer's inline transform never fights a
   card's own hover translate. */
const Reveal = styled(motion.div)`
  display: flex;
  min-width: 0;
`;

/* Four areas is a known set: explicit columns, so the row fills. */
const AreaGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${({ theme }) => theme.space[5]};

  ${({ theme }) => theme.media.sm} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const Panel = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  padding: ${({ theme }) => theme.space[6]};
  background: ${({ theme }) => theme.color.surfaceRaised};
  border: 1px solid ${({ theme }) => theme.color.border};
  transition: border-color ${({ theme }) => theme.motion.base},
              transform ${({ theme }) => theme.motion.base};

  &:hover {
    border-color: ${({ theme }) => theme.color.accentBorderStrong};
    transform: translateY(-3px);
  }
`;

/* Numbered index plate: the one piece of contrast on an otherwise flat card. */
const Index = styled.span`
  align-self: flex-start;
  margin-bottom: ${({ theme }) => theme.space[5]};
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  letter-spacing: 0.2em;
  color: ${({ theme }) => theme.color.text};
  background: ${({ theme }) => theme.color.black};
  border: 1px solid ${({ theme }) => theme.color.border};
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[2]};
`;

const CardTitle = styled.h3`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.h4};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  line-height: 1.2;
  color: ${({ theme }) => theme.color.text};
  margin-bottom: ${({ theme }) => theme.space[3]};
`;

const CardText = styled.p`
  font-family: ${({ theme }) => theme.fontFamily.body};
  font-size: ${({ theme }) => theme.fontSize.body};
  line-height: 1.6;
  color: ${({ theme }) => theme.color.textMuted};
  margin-bottom: ${({ theme }) => theme.space[5]};
`;

const OperationsLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  /* 44px tap target without a visible box. */
  min-height: 44px;
  margin-top: auto;
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.small};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.accent};
  text-decoration: none;
  transition: color ${({ theme }) => theme.motion.base};

  &:hover {
    color: ${({ theme }) => theme.color.accentBright};
  }
`;

const operationsAreas = [
  {
    title: 'Event Management',
    description: 'Organizing hackathons, workshops, and community events to foster blockchain innovation and engagement.',
    link: '#'
  },
  {
    title: 'Finance & Budgeting',
    description: 'Managing organizational finances, budgets, and resource allocation to support our mission.',
    link: '#'
  },
  {
    title: 'Community Operations',
    description: 'Building and maintaining our community presence across platforms and managing member engagement.',
    link: '#'
  },
  {
    title: 'Infrastructure & Systems',
    description: 'Maintaining organizational infrastructure, tools, and systems to ensure smooth operations.',
    link: '#'
  },
];

const pad = (index) => String(index + 1).padStart(2, '0');

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
};

const stats = [
  { end: 20, suffix: '+', label: 'Team Members' },
  { end: 4, suffix: '', label: 'Operations Areas' },
  { end: 50, suffix: '+', label: 'Events Organized' },
];

const OperationsTeam = () => {
  return (
    <>
      <HeroSection $divided={false}>
        <GridBackdrop />
        <Container>
          <HeroGrid>
            <HeroCopy>
              <Eyebrow>Operations</Eyebrow>
              <PageTitle as="h1">Operations Team</PageTitle>
              <Lead style={{ marginTop: '1rem' }}>
                Ensuring smooth operations and organizational excellence to support our mission and community
              </Lead>
            </HeroCopy>

            <Frame>
              <img
                src="/images/operations/op1.webp"
                alt=""
                loading="lazy"
                width="1600"
                height="1200"
              />
            </Frame>
          </HeroGrid>

          <StatStrip>
            {stats.map((stat, index) => (
              <StatCell
                key={stat.label}
                {...reveal}
                transition={{ duration: 0.4, delay: index * 0.06 }}
              >
                <StatNumber><CountUp end={stat.end} suffix={stat.suffix} /></StatNumber>
                <StatLabel>{stat.label}</StatLabel>
              </StatCell>
            ))}
          </StatStrip>
        </Container>
      </HeroSection>

      <Section>
        <GridBackdrop />
        <Container>
          <Split>
            <Aside>
              <Head>
                <Eyebrow>What we run</Eyebrow>
                <SectionTitle>Operations Areas</SectionTitle>
                <Count>{String(operationsAreas.length).padStart(2, '0')} Areas</Count>
              </Head>

              <ShortFrame>
                <img
                  src="/images/operations/op2.webp"
                  alt=""
                  loading="lazy"
                  width="1600"
                  height="1200"
                />
              </ShortFrame>

              <ShortFrame>
                <img
                  src="/images/operations/op3.webp"
                  alt=""
                  loading="lazy"
                  width="1600"
                  height="1200"
                />
              </ShortFrame>
            </Aside>

            <AreaGrid>
              {operationsAreas.map((area, index) => (
                <Reveal
                  key={area.title}
                  {...reveal}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                >
                  <Panel>
                    <Index>{pad(index)}</Index>
                    <CardTitle>{area.title}</CardTitle>
                    <CardText>{area.description}</CardText>
                    <OperationsLink href={area.link}>
                      <ExternalLink size={16} /> Learn More
                    </OperationsLink>
                  </Panel>
                </Reveal>
              ))}
            </AreaGrid>
          </Split>
        </Container>
      </Section>
    </>
  );
};

export default OperationsTeam;
