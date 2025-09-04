import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';

import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FiLinkedin, FiExternalLink, FiUser, FiGithub } from 'react-icons/fi';
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
  width: 85%;
  max-width: 1400px;
  margin: 6rem auto 0;
  position: relative;
  z-index: 2;
  
  @media (max-width: 70em) {
    width: 90%;
  }

  @media (max-width: 48em) {
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
  font-size: ${props => props.theme.fontxl};
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  max-width: 800px;
  margin: 0 auto 4rem;
  line-height: 1.6;
`;

const StatsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin: 2rem 0 5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)`
  background: rgba(15, 15, 15, 0.7);
  border: 1px solid #7120b0;
  border-radius: 8px;
  padding: 2rem 1.5rem;
  text-align: center;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 20px rgba(113, 32, 176, 0.15);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 30px rgba(113, 32, 176, 0.3);
    transform: translateY(-5px);
  }
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #7120b0;
  margin-bottom: 0.5rem;
`;

const StatTitle = styled.div`
  font-size: 1rem;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const AlumniSection = styled(motion.div)`
  margin: 5rem 0;
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  color: #ffffff;
  text-align: center;
  margin-bottom: 3rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  span {
    color: #7120b0;
  }
`;

const AlumniGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const AlumniCard = styled(motion.div)`
  background: rgba(15, 15, 15, 0.7);
  border: 1px solid #7120b0;
  border-radius: 12px;
  padding: 2.5rem;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 20px rgba(113, 32, 176, 0.15);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    box-shadow: 0 8px 30px rgba(113, 32, 176, 0.3);
    transform: translateY(-5px);
    border-color: rgba(113, 32, 176, 1);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, rgba(113, 32, 176, 0.8), rgba(187, 32, 255, 0.8));
  }
`;

const AlumniHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const AlumniImage = styled.div`
  width: 80px;
  height: 80px;
  background: rgba(113, 32, 176, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(113, 32, 176, 0.5);
  margin-right: 1.5rem;
  
  svg {
    color: #7120b0;
    font-size: 2rem;
  }
`;

const AlumniInfo = styled.div`
  flex: 1;
`;

const AlumniName = styled.h3`
  font-size: 1.6rem;
  color: #ffffff;
  margin-bottom: 0.3rem;
  font-weight: 700;
`;

const AlumniClass = styled.p`
  color: #7120b0;
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const CurrentRole = styled.div`
  background: rgba(113, 32, 176, 0.1);
  border: 1px solid rgba(113, 32, 176, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const RoleTitle = styled.h4`
  font-size: 1.2rem;
  color: #ffffff;
  margin-bottom: 0.3rem;
  font-weight: 600;
`;

const Company = styled.p`
  color: #7120b0;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const RoleDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.5;
`;

const Achievements = styled.div`
  margin-bottom: 1.5rem;
`;

const AchievementTitle = styled.h5`
  color: #ffffff;
  font-size: 1rem;
  margin-bottom: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const AchievementsList = styled.ul`
  list-style: none;
  padding: 0;

  li {
    color: rgba(255, 255, 255, 0.8);
    padding: 0.3rem 0;
    display: flex;
    align-items: center;
    font-size: 0.9rem;

    &:before {
      content: "";
      display: inline-block;
      width: 6px;
      height: 6px;
      margin-right: 0.8rem;
      background-color: #7120b0;
      border-radius: 50%;
    }
  }
`;

const AlumniLinks = styled.div`
  display: flex;
  gap: 1rem;
  
  a {
    color: #7120b0;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    padding: 0.5rem;
    border-radius: 50%;
    background: rgba(113, 32, 176, 0.1);
    
    &:hover {
      color: #bb20ff;
      background: rgba(113, 32, 176, 0.2);
      transform: translateY(-2px);
    }
  }
`;

const NotableAlumni = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 3rem 0;
`;

const NotableCard = styled(motion.div)`
  background: rgba(15, 15, 15, 0.7);
  border: 1px solid rgba(113, 32, 176, 0.5);
  border-radius: 8px;
  padding: 1.5rem;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 15px rgba(113, 32, 176, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 25px rgba(113, 32, 176, 0.2);
    transform: translateY(-3px);
    border-color: rgba(113, 32, 176, 0.8);
  }
`;

const NotableName = styled.h4`
  font-size: 1.3rem;
  color: #ffffff;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const NotableRole = styled.p`
  color: #7120b0;
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
  font-weight: 500;
`;

const NotableCompany = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
`;

const featuredAlumni = [
  {
    name: 'Jennifer Martinez',
    class: 'Class of 2022',
    role: 'Senior Blockchain Engineer',
    company: 'Coinbase',
    description: 'Leading the development of next-generation DeFi protocols and Layer 2 scaling solutions.',
    achievements: [
      'Led development of major DeFi protocol',
      'Published 3 research papers on consensus mechanisms',
      'Mentors 5+ current BB members',
      'Speaker at EthCC and DevCon conferences'
    ],
    linkedin: 'https://linkedin.com/in/jennifermartinez',
    github: 'https://github.com/jennifermartinez'
  },
  {
    name: 'Robert Chen',
    class: 'Class of 2021',
    role: 'Co-Founder & CTO',
    company: 'ChainFlow (YC S22)',
    description: 'Building infrastructure for cross-chain liquidity and automated market making.',
    achievements: [
      'Raised $15M Series A for ChainFlow',
      'Y Combinator alumnus',
      'Former blockchain lead at Uniswap Labs',
      'Named to Forbes 30 Under 30'
    ],
    linkedin: 'https://linkedin.com/in/robertchen',
    website: 'https://chainflow.co'
  },
  {
    name: 'Dr. Amanda Wilson',
    class: 'Class of 2020',
    role: 'Research Scientist',
    company: 'Ethereum Foundation',
    description: 'Researching Ethereum 2.0 consensus mechanisms and scalability improvements.',
    achievements: [
      'Core contributor to Ethereum 2.0',
      'PhD in Distributed Systems from MIT',
      '20+ publications in top-tier conferences',
      'Technical advisor to 3 blockchain startups'
    ],
    linkedin: 'https://linkedin.com/in/amandawilson',
    github: 'https://github.com/amandawilson'
  },
  {
    name: 'Carlos Rodriguez',
    class: 'Class of 2023',
    role: 'Blockchain Developer',
    company: 'Polygon Labs',
    description: 'Working on zkEVM development and Layer 2 ecosystem growth.',
    achievements: [
      'Contributed to Polygon zkEVM launch',
      'Winner of 3 major hackathons',
      'Open source contributor to web3.js',
      'Technical writer for major crypto publications'
    ],
    linkedin: 'https://linkedin.com/in/carlosrodriguez',
    github: 'https://github.com/carlosrodriguez'
  }
];

const notableAlumni = [
  { name: 'Steve Kim', role: 'Smart Contract Engineer', company: 'Aave' },
  { name: 'Lisa Park', role: 'Product Manager', company: 'OpenSea' },
  { name: 'Mike Johnson', role: 'Security Engineer', company: 'Trail of Bits' },
  { name: 'Sarah Thompson', role: 'Research Engineer', company: 'Chainlink Labs' },
  { name: 'Kevin Lee', role: 'Frontend Developer', company: 'MetaMask' },
  { name: 'Rachel Brown', role: 'Data Scientist', company: 'Dune Analytics' },
  { name: 'Tom Wilson', role: 'DevOps Engineer', company: 'Alchemy' },
  { name: 'Maya Patel', role: 'Business Development', company: 'ConsenSys' },
  { name: 'Jake Davis', role: 'Protocol Engineer', company: 'Lido' },
  { name: 'Anna Garcia', role: 'Quantitative Trader', company: 'Jump Trading' }
];

const PeopleAlumni = () => {
  const [particleKey, setParticleKey] = useState(Date.now());

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  useEffect(() => {
    setParticleKey(Date.now());
  }, []);

  return (
    <PageSection>
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
              opacity: 0.5,
              width: 1,
            },
            move: { enable: true, speed: 0.8 },
            number: { value: 60 },
            opacity: { value: 0.3 },
            size: { value: 2 },
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
                links: { opacity: 0.4 }
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
      
      <Navigation />
      
      <Container>
        <Title
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Alumni <span>Network</span>
        </Title>

        <Subtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Celebrating our graduates who have gone on to make significant impacts 
          in the blockchain industry and technology sector worldwide
        </Subtitle>

        <StatsContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <StatCard whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(113, 32, 176, 0.4)" }}>
            <StatNumber>50+</StatNumber>
            <StatTitle>Alumni</StatTitle>
          </StatCard>

          <StatCard whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(113, 32, 176, 0.4)" }}>
            <StatNumber>25+</StatNumber>
            <StatTitle>Companies</StatTitle>
          </StatCard>

          <StatCard whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(113, 32, 176, 0.4)" }}>
            <StatNumber>5+</StatNumber>
            <StatTitle>Startups Founded</StatTitle>
          </StatCard>

          <StatCard whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(113, 32, 176, 0.4)" }}>
            <StatNumber>$50M+</StatNumber>
            <StatTitle>Funding Raised</StatTitle>
          </StatCard>
        </StatsContainer>

        <AlumniSection
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <SectionTitle>Featured <span>Alumni</span></SectionTitle>
          <AlumniGrid>
            {featuredAlumni.map((alumni, index) => (
              <AlumniCard
                key={alumni.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <AlumniHeader>
                  <AlumniImage>
                    <FiUser />
                  </AlumniImage>
                  <AlumniInfo>
                    <AlumniName>{alumni.name}</AlumniName>
                    <AlumniClass>{alumni.class}</AlumniClass>
                  </AlumniInfo>
                </AlumniHeader>

                <CurrentRole>
                  <RoleTitle>{alumni.role}</RoleTitle>
                  <Company>{alumni.company}</Company>
                  <RoleDescription>{alumni.description}</RoleDescription>
                </CurrentRole>

                <Achievements>
                  <AchievementTitle>Key Achievements</AchievementTitle>
                  <AchievementsList>
                    {alumni.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </AchievementsList>
                </Achievements>

                <AlumniLinks>
                  {alumni.linkedin && (
                    <a href={alumni.linkedin} target="_blank" rel="noopener noreferrer">
                      <FiLinkedin />
                    </a>
                  )}
                  {alumni.github && (
                    <a href={alumni.github} target="_blank" rel="noopener noreferrer">
                      <FiGithub />
                    </a>
                  )}
                  {alumni.website && (
                    <a href={alumni.website} target="_blank" rel="noopener noreferrer">
                      <FiExternalLink />
                    </a>
                  )}
                </AlumniLinks>
              </AlumniCard>
            ))}
          </AlumniGrid>
        </AlumniSection>

        <AlumniSection
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <SectionTitle>Notable <span>Alumni</span></SectionTitle>
          <NotableAlumni>
            {notableAlumni.map((alumni, index) => (
              <NotableCard
                key={alumni.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.05 }}
                whileHover={{ y: -3 }}
              >
                <NotableName>{alumni.name}</NotableName>
                <NotableRole>{alumni.role}</NotableRole>
                <NotableCompany>{alumni.company}</NotableCompany>
              </NotableCard>
            ))}
          </NotableAlumni>
        </AlumniSection>
      </Container>
    </PageSection>
  );
};

export default PeopleAlumni;
