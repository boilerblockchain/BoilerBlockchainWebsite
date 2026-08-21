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
  Card,
} from '../ui/primitives';

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

const Head = styled.div`
  margin-bottom: ${({ theme }) => theme.space[12]};
`;

/* The reveal sits on a wrapper so framer's inline transform never fights a
   card's own hover translate. */
const Reveal = styled(motion.div)`
  display: flex;
  min-width: 0;
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${({ theme }) => theme.space[6]};
  margin-top: ${({ theme }) => theme.space[12]};

  ${({ theme }) => theme.media.sm} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const StatCard = styled(Card)`
  flex: 1;
  min-width: 0;
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

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: ${({ theme }) => theme.space[6]};
`;

const ItemCard = styled(Card)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
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
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

const OperationsLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
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
      <Section $divided={false}>
        <GridBackdrop />
        <Container>
          <Eyebrow>Operations</Eyebrow>
          <SectionTitle as="h1">Operations Team</SectionTitle>
          <Lead style={{ marginTop: '1rem' }}>
            Ensuring smooth operations and organizational excellence to support our mission and community
          </Lead>

          <StatsRow>
            {stats.map((stat, index) => (
              <Reveal
                key={stat.label}
                {...reveal}
                transition={{ duration: 0.4, delay: index * 0.06 }}
              >
                <StatCard>
                  <StatNumber><CountUp end={stat.end} suffix={stat.suffix} /></StatNumber>
                  <StatLabel>{stat.label}</StatLabel>
                </StatCard>
              </Reveal>
            ))}
          </StatsRow>
        </Container>
      </Section>

      <Section>
        <GridBackdrop />
        <Container>
          <Head>
            <Eyebrow>What we run</Eyebrow>
            <SectionTitle>Operations Areas</SectionTitle>
          </Head>

          <CardGrid>
            {operationsAreas.map((area, index) => (
              <Reveal
                key={area.title}
                {...reveal}
                transition={{ duration: 0.4, delay: index * 0.06 }}
              >
                <ItemCard>
                  <CardTitle>{area.title}</CardTitle>
                  <CardText>{area.description}</CardText>
                  <OperationsLink href={area.link}>
                    <ExternalLink size={16} /> Learn More
                  </OperationsLink>
                </ItemCard>
              </Reveal>
            ))}
          </CardGrid>
        </Container>
      </Section>
    </>
  );
};

export default OperationsTeam;
