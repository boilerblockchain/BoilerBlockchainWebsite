import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FiCode, FiSearch, FiSettings, FiArrowRight } from 'react-icons/fi';
import Navigation from '../Navigation';
import Footer from '../Footer';

const PageSection = styled.section`
  min-height: 100vh;
  width: 100%;
  background-color: #000000;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 4rem 0 4rem;
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
  margin: 6rem auto 4rem;
  position: relative;
  z-index: 2;
  flex: 1;
  
  @media (max-width: 70em) {
    width: 95%;
  }

  @media (max-width: 768px) {
    width: 95%;
    margin: 4rem auto 3rem;
    padding: 0 1rem;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 0 0.75rem;
    margin: 4rem auto 2rem;
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
  font-size: ${props => props.theme.fontlg};
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
  background: linear-gradient(
    135deg,
    rgba(40, 35, 50, 0.95) 0%,
    rgba(35, 30, 45, 0.95) 100%
  );
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 12px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 
    0 4px 20px rgba(168, 85, 247, 0.15),
    0 0 0 1px rgba(168, 85, 247, 0.1) inset;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:hover {
    box-shadow: 
      0 12px 40px rgba(168, 85, 247, 0.3),
      0 0 0 1px rgba(168, 85, 247, 0.4) inset;
    transform: translateY(-6px);
    border-color: rgba(168, 85, 247, 0.6);
    background: linear-gradient(
      135deg,
      rgba(45, 40, 55, 1) 0%,
      rgba(40, 35, 50, 1) 100%
    );
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, rgba(113, 32, 176, 0.8), rgba(187, 32, 255, 0.8));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const TeamIcon = styled.div`
  width: 45px;
  height: 45px;
  background: rgba(113, 32, 176, 0.15);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  
  svg {
    color: #7120b0;
    font-size: 1.3rem;
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
  font-size: ${props => props.theme.fontmd};
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const TeamStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const StatItem = styled.div`
  text-align: center;
  
  .number {
    font-size: 2rem;
    font-weight: 700;
    color: #7120b0;
    display: block;
  }
  
  .label {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

const ViewTeamButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(45deg, #7120b0, #bb20ff);
  color: white;
  padding: 0.8rem 1.5rem;
  text-decoration: none;
  border-radius: 6px;
  font-size: ${props => props.theme.fontmd};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(113, 32, 176, 0.4);
    background: linear-gradient(45deg, #9d20b0, #d175ff);
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
    icon: FiCode,
    description: 'Building the future of blockchain technology through innovative smart contracts, DApps, and Web3 infrastructure.',
    stats: { members: '30+', projects: '7', languages: '8+' },
    path: '/teams/developer'
  },
  {
    id: 'research',
    name: 'Research Team',
    icon: FiSearch,
    description: 'Exploring cutting-edge blockchain research, consensus mechanisms, and emerging technologies in the decentralized space.',
    stats: { members: '60+', papers: '12+', partnerships: '5+' },
    path: '/teams/research'
  },
  {
    id: 'operations',
    name: 'Operations Team',
    icon: FiSettings,
    description: 'The engine behind everything: partnerships, events, logistics, and systems that let builders focus and scale impact.',
    stats: { members: '25+', events: '15+', partners: '20+' },
    path: '/teams/operations'
  }
];

const TeamsLanding = () => {
  const [particleKey, setParticleKey] = useState(Date.now());

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  useEffect(() => {
    setParticleKey(Date.now());
  }, []);

  return (
    <PageSection>
      <Navigation />
      <Particles
        key={particleKey}
        init={particlesInit}
        options={{
          background: { color: "#000000" },
          particles: {
            color: { value: ["#7120b0", "#9d20b0"] },
            links: {
              color: "#7120b0",
              distance: 150,
              enable: true,
              opacity: 0.7,
              width: 1.5,
            },
            move: { enable: true, speed: 0.8 },
            number: { value: 70 },
            opacity: { value: 0.5 },
            size: { value: 3 },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "grab"
              },
            },
            modes: {
              grab: {
                distance: 140,
                links: { opacity: 0.6 }
              }
            }
          }
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      />
      
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
              whileHover={{ y: -5 }}
            >
              <TeamIcon>
                <team.icon />
              </TeamIcon>
              
              <TeamName>{team.name}</TeamName>
              
              <TeamDescription>{team.description}</TeamDescription>
              
              <TeamStats>
                {Object.entries(team.stats).map(([key, value]) => (
                  <StatItem key={key}>
                    <span className="number">{value}</span>
                    <span className="label">{key}</span>
                  </StatItem>
                ))}
              </TeamStats>
              
              <ViewTeamButton to={team.path}>
                View Team <FiArrowRight />
              </ViewTeamButton>
            </TeamCard>
          ))}
        </TeamsGrid>
      </Container>
      <Footer />
    </PageSection>
  );
};

export default TeamsLanding;
