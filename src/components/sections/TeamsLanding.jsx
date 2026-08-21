import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Arrow } from '../ui/Arrow';

const PageSection = styled.section`
  width: 100%;
  background-color: ${({ theme }) => theme.color.black};
  position: relative;
  padding: ${({ theme }) => theme.sectionPadding.block} 0;
  font-family: 'Tomorrow', sans-serif;
  display: flex;
  flex-direction: column;
  
  * {
    font-family: 'Tomorrow', sans-serif;
  }
`;



const Container = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 0 auto 4rem;
  padding: 120px 2rem 0;
  position: relative;
  z-index: 2;
  flex: 1;
  
  @media (max-width: 1024px) {
    padding: 110px 1.75rem 0;
  }

  @media (max-width: 768px) {
    width: 95%;
    padding: 100px 1.5rem 0;
    margin: 0 auto 3rem;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 80px 1rem 0;
    margin: 0 auto 2rem;
  }

  @media (max-width: 360px) {
    padding: 70px 0.75rem 0;
  }
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem; 
  color: #ffffff;
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;

  span {
    color: #7120b0;
  }

  @media (max-width: 40em) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: ${props => props.theme.fontSize.bodyLarge};
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  max-width: 700px;
  margin: 0 auto 3rem;
  line-height: 1.5;
`;

const TeamsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin: 3rem 0;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin: 2rem 0;
  }

  @media (max-width: 480px) {
    gap: 1.25rem;
  }
`;

const TeamCard = styled(motion.div)`
  background: ${({ theme }) => theme.color.surfaceRaised};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.space[8]};
  box-shadow: ${({ theme }) => theme.elevation[1]};
  transition: transform ${({ theme }) => theme.motion.base},
              border-color ${({ theme }) => theme.motion.base},
              box-shadow ${({ theme }) => theme.motion.base};
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  &:hover {
    transform: translateY(-4px);
    border-color: ${({ theme }) => theme.color.accentBorderStrong};
    box-shadow: ${({ theme }) => theme.elevation[2]};
  }
`;

const TeamName = styled.h3`
  font-size: 1.4rem;
  color: #ffffff;
  margin-bottom: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TeamDescription = styled.p`
  font-size: ${props => props.theme.fontSize.body};
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 2rem;
`;


const ViewTeamButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.color.accentDeep};
  color: #ffffff;
  padding: 0.8rem 1.5rem;
  text-decoration: none;
  border-radius: 6px;
  font-size: ${props => props.theme.fontSize.body};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    background: ${({ theme }) => theme.color.accent};
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(3px);
  }
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
    <PageSection>
      <Container>
        <Title
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our <span>Teams</span>
        </Title>

        <Subtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Three specialized teams. One mission: cultivating elite Web3 talent at Purdue through development, research, and operations.
        </Subtitle>

        <TeamsGrid
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {teams.map((team, index) => (
            <TeamCard
              key={team.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
            >
              <TeamName>{team.name}</TeamName>
              
              <TeamDescription>{team.description}</TeamDescription>
              
              <ViewTeamButton to={team.path}>
                View Team <Arrow size={18} />
              </ViewTeamButton>
            </TeamCard>
          ))}
        </TeamsGrid>
      </Container>
    </PageSection>
  );
};

export default TeamsLanding;
