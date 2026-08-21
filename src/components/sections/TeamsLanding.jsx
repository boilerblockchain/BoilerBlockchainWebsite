import styled from 'styled-components';
import { motion } from 'framer-motion';

import { Arrow } from '../ui/Arrow';
import {
  Section,
  Container,
  GridBackdrop,
  Eyebrow,
  SectionTitle,
  Lead,
  Card,
  ButtonLink,
} from '../ui/primitives';

const Head = styled.div`
  margin-bottom: ${({ theme }) => theme.space[12]};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: ${({ theme }) => theme.space[6]};
`;

/* The reveal lives on a wrapper so framer's inline transform never fights the
   card's own hover translate. */
const Reveal = styled(motion.div)`
  display: flex;
  min-width: 0;
`;

const TeamCard = styled(Card)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
`;

const TeamName = styled.h3`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.h3};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  line-height: 1.1;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.color.text};
  margin-bottom: ${({ theme }) => theme.space[3]};
`;

const TeamDescription = styled.p`
  font-family: ${({ theme }) => theme.fontFamily.body};
  font-size: ${({ theme }) => theme.fontSize.body};
  line-height: 1.6;
  color: ${({ theme }) => theme.color.textMuted};
  margin-bottom: ${({ theme }) => theme.space[8]};
`;

const teams = [
  {
    id: 'developer',
    name: 'Developer Team',
    description: 'Building the future of blockchain technology through innovative smart contracts, DApps, and Web3 infrastructure.',
    path: '/teams/developer'
  },
  {
    id: 'research',
    name: 'Research Team',
    description: 'Exploring cutting-edge blockchain research, consensus mechanisms, and emerging technologies in the decentralized space.',
    path: '/teams/research'
  },
  {
    id: 'operations',
    name: 'Operations Team',
    description: 'The engine behind everything: partnerships, events, logistics, and systems that let builders focus and scale impact.',
    path: '/teams/operations'
  }
];

const TeamsLanding = () => {
  return (
    <Section $divided={false}>
      <GridBackdrop />
      <Container>
        <Head>
          <Eyebrow>Structure</Eyebrow>
          <SectionTitle as="h1">Our Teams</SectionTitle>
          <Lead style={{ marginTop: '1rem' }}>
            Three specialized teams. One mission: cultivating elite Web3 talent at Purdue through development, research, and operations.
          </Lead>
        </Head>

        <Grid>
          {teams.map((team, index) => (
            <Reveal
              key={team.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: index * 0.06, ease: [0.4, 0, 0.2, 1] }}
            >
              <TeamCard>
                <TeamName>{team.name}</TeamName>

                <TeamDescription>{team.description}</TeamDescription>

                <ButtonLink to={team.path} $variant="outline" style={{ marginTop: 'auto' }}>
                  View Team <Arrow size={16} />
                </ButtonLink>
              </TeamCard>
            </Reveal>
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

export default TeamsLanding;
