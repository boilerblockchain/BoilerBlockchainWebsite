import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { Arrow } from '../ui/Arrow';
import {
  Section,
  Container,
  GridBackdrop,
  Eyebrow,
  SectionTitle,
  Lead,
} from '../ui/primitives';

/**
 * Choose-a-team page.
 *
 * Previously three narrow cards in an auto-fill grid, which left roughly 40%
 * of the row empty and the rest of the viewport black. Three teams is a known,
 * fixed set, so the columns are explicit and the cards carry photography.
 */
const Head = styled.div`
  margin-bottom: ${({ theme }) => theme.space[10]};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${({ theme }) => theme.space[5]};

  ${({ theme }) => theme.media.md} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const Reveal = styled(motion.div)`
  display: flex;
  min-width: 0;
`;

/* The whole card is the link, so the hit area is the card, not just a button. */
const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  background: ${({ theme }) => theme.color.surfaceRaised};
  border: 1px solid ${({ theme }) => theme.color.border};
  transition: border-color ${({ theme }) => theme.motion.base},
              transform ${({ theme }) => theme.motion.base};

  &:hover {
    border-color: ${({ theme }) => theme.color.accentBorderStrong};
    transform: translateY(-4px);
  }

  &:hover img {
    transform: scale(1.04);
  }

  &:hover [data-go] {
    color: ${({ theme }) => theme.color.accent};
  }

  &:hover [data-go] svg {
    transform: translateX(4px);
  }
`;

const Frame = styled.div`
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-bottom: 1px solid ${({ theme }) => theme.color.border};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    /* Desaturated at rest so the three photos read as one set rather than
       three unrelated snapshots; colour returns on hover. */
    filter: grayscale(1) brightness(0.62);
    transition: transform ${({ theme }) => theme.motion.slow},
                filter ${({ theme }) => theme.motion.slow};
  }

  ${Card}:hover & img {
    filter: grayscale(0) brightness(0.85);
  }
`;

const Index = styled.span`
  position: absolute;
  left: 0;
  bottom: 0;
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  letter-spacing: 0.2em;
  color: ${({ theme }) => theme.color.text};
  background: ${({ theme }) => theme.color.black};
  border-top: 1px solid ${({ theme }) => theme.color.border};
  border-right: 1px solid ${({ theme }) => theme.color.border};
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: ${({ theme }) => theme.space[6]};
`;

const Name = styled.h2`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.h3};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  line-height: 1.1;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.color.text};
  margin-bottom: ${({ theme }) => theme.space[3]};
`;

const Copy = styled.p`
  font-family: ${({ theme }) => theme.fontFamily.body};
  font-size: ${({ theme }) => theme.fontSize.body};
  line-height: 1.6;
  color: ${({ theme }) => theme.color.textMuted};
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

const Focus = styled.ul`
  list-style: none;
  margin-bottom: ${({ theme }) => theme.space[6]};
  border-top: 1px solid ${({ theme }) => theme.color.border};

  li {
    display: flex;
    justify-content: space-between;
    gap: ${({ theme }) => theme.space[3]};
    padding-block: ${({ theme }) => theme.space[2]};
    border-bottom: 1px solid ${({ theme }) => theme.color.border};
    font-family: ${({ theme }) => theme.fontFamily.mono};
    font-size: ${({ theme }) => theme.fontSize.micro};
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.color.textFaint};
  }

  li span:last-child {
    color: ${({ theme }) => theme.color.accent};
  }
`;

const Go = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  margin-top: auto;
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.small};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.text};
  transition: color ${({ theme }) => theme.motion.base};

  svg {
    transition: transform ${({ theme }) => theme.motion.base};
  }
`;

const teams = [
  {
    id: 'developer',
    index: '01',
    name: 'Developer Team',
    description:
      'Building the future of blockchain technology through innovative smart contracts, DApps, and Web3 infrastructure.',
    image: '/images/development/dev1.webp',
    focus: [
      ['Ships', 'Products'],
      ['Cadence', 'Weekly sprints'],
      ['Output', 'Hackathons'],
    ],
    path: '/teams/developer',
  },
  {
    id: 'research',
    index: '02',
    name: 'Research Team',
    description:
      'Exploring cutting-edge blockchain research, consensus mechanisms, and emerging technologies in the decentralized space.',
    image: '/images/research/res1.webp',
    focus: [
      ['Ships', 'Theses'],
      ['Cadence', 'Per cycle'],
      ['Output', 'Due diligence'],
    ],
    path: '/teams/research',
  },
  {
    id: 'operations',
    index: '03',
    name: 'Operations Team',
    description:
      'The engine behind everything: partnerships, events, logistics, and systems that let builders focus and scale impact.',
    image: '/images/operations/op1.webp',
    focus: [
      ['Ships', 'Events'],
      ['Cadence', 'Continuous'],
      ['Output', 'Partnerships'],
    ],
    path: '/teams/operations',
  },
];

export default function TeamsLanding() {
  return (
    <Section $divided={false}>
      <GridBackdrop />
      <Container>
        <Head>
          <Eyebrow>Structure</Eyebrow>
          <SectionTitle as="h1">Choose a team</SectionTitle>
          <Lead style={{ marginTop: '1rem' }}>
            Three specialized teams. One mission: cultivating elite Web3 talent
            at Purdue through development, research, and operations.
          </Lead>
        </Head>

        <Grid>
          {teams.map((team, index) => (
            <Reveal
              key={team.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.4,
                delay: index * 0.06,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <Card to={team.path}>
                <Frame>
                  <img
                    src={team.image}
                    alt=""
                    loading="lazy"
                    width="1600"
                    height="1200"
                  />
                  <Index>{team.index}</Index>
                </Frame>
                <Body>
                  <Name>{team.name}</Name>
                  <Copy>{team.description}</Copy>
                  <Focus>
                    {team.focus.map(([label, value]) => (
                      <li key={label}>
                        <span>{label}</span>
                        <span>{value}</span>
                      </li>
                    ))}
                  </Focus>
                  <Go data-go>
                    View Team
                    <Arrow size={16} />
                  </Go>
                </Body>
              </Card>
            </Reveal>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
