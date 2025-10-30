import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FiUsers, FiCode, FiSearch, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import Navigation from '../Navigation';

const PageSection = styled.section`
  min-height: 100vh;
  width: 100%;
  background-color: #000000;
  position: relative;
  overflow: hidden;
  padding: 4rem 0;
  font-family: 'Tomorrow', sans-serif;
  
  * {
    font-family: 'Tomorrow', sans-serif;
  }
`;



const Container = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 6rem auto 0;
  position: relative;
  z-index: 2;
  
  @media (max-width: 70em) {
    width: 95%;
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
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  margin: 3rem 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TeamCard = styled(motion.div)`
  background: rgba(15, 15, 15, 0.6);
  border: 1px solid rgba(113, 32, 176, 0.3);
  border-radius: 8px;
  padding: 1.8rem;
  backdrop-filter: blur(5px);
  box-shadow: 0 2px 10px rgba(113, 32, 176, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    box-shadow: 0 4px 20px rgba(113, 32, 176, 0.2);
    transform: translateY(-2px);
    border-color: rgba(113, 32, 176, 0.6);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, rgba(113, 32, 176, 0.6), rgba(187, 32, 255, 0.6));
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
  }/*,
  {
    id: 'marketing',
    name: 'Marketing Team',
    icon: FiTrendingUp,
    description: 'Promoting blockchain adoption, organizing events, and building our community presence across digital platforms.',
    stats: { members: '18+', events: '20+', followers: '2K+' },
    path: '/teams/marketing'
  }*/
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
              opacity: 0.3,
              width: 1,
            },
            move: { enable: true, speed: 0.5 },
            number: { value: 40 },
            opacity: { value: 0.2 },
            size: { value: 1.5 },
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
                distance: 100,
                links: { opacity: 0.3 }
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
          Discover the talented individuals driving innovation across development, research, and marketing at Boiler Blockchain
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
    </PageSection>
  );
};

export default TeamsLanding;
