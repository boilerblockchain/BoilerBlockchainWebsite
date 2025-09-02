import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FiGithub, FiCode, FiLayers, FiZap, FiUsers, FiExternalLink } from 'react-icons/fi';
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

const BackButton = styled(Link)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.95);
  color: #ffffff;
  text-decoration: none;
  font-size: ${(props) => props.theme.fontmd};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(113, 32, 176, 0.3);
  z-index: 100;
  backdrop-filter: blur(10px);
  text-transform: uppercase;
  font-weight: 600;

  &:before {
    content: "←";
    color: #7120b0;
  }

  &:hover {
    background: rgba(113, 32, 176, 0.1);
  }

  @media (max-width: 40em) {
    padding: 0.8rem 1rem;
    font-size: ${(props) => props.theme.fontsm};
  }
`;

const Container = styled.div`
  width: 85%;
  max-width: 1400px;
  margin: 3rem auto 0;
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
  font-size: 6rem; 
  color: #ffffff;
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;

  span {
    color: #7120b0;
  }

  @media (max-width: 40em) {
    font-size: 4rem;
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

const ContentSection = styled(motion.div)`
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const Card = styled(motion.div)`
  background: rgba(15, 15, 15, 0.7);
  border: 1px solid #7120b0;
  border-radius: 8px;
  padding: 2rem;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 20px rgba(113, 32, 176, 0.15);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 30px rgba(113, 32, 176, 0.3);
    transform: translateY(-5px);
    border-color: rgba(113, 32, 176, 1);
  }
`;

const CardIcon = styled.div`
  width: 50px;
  height: 50px;
  background: rgba(113, 32, 176, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  
  svg {
    color: #7120b0;
    font-size: 1.5rem;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  color: #ffffff;
  margin-bottom: 1rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const CardDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const TechList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  li {
    background: rgba(113, 32, 176, 0.2);
    color: #bb20ff;
    padding: 0.3rem 0.8rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 500;
  }
`;

const ProjectCard = styled(motion.div)`
  background: rgba(15, 15, 15, 0.7);
  border: 1px solid #7120b0;
  border-radius: 8px;
  padding: 2rem;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 20px rgba(113, 32, 176, 0.15);
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    box-shadow: 0 4px 30px rgba(113, 32, 176, 0.3);
    transform: translateY(-5px);
    border-color: rgba(113, 32, 176, 1);
  }
`;

const ProjectTitle = styled.h3`
  font-size: 1.8rem;
  color: #ffffff;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const ProjectDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 1rem;
  
  a {
    color: #7120b0;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
    transition: color 0.3s ease;
    
    &:hover {
      color: #bb20ff;
    }
  }
`;

const areas = [
  {
    icon: FiCode,
    title: 'Smart Contract Development',
    description: 'Building secure and efficient smart contracts using Solidity, Rust, and other blockchain programming languages.',
    technologies: ['Solidity', 'Rust', 'Vyper', 'Hardhat', 'Truffle', 'Foundry']
  },
  {
    icon: FiLayers,
    title: 'DApp Development',
    description: 'Creating full-stack decentralized applications with modern web technologies and blockchain integration.',
    technologies: ['React', 'Next.js', 'Web3.js', 'Ethers.js', 'IPFS', 'MetaMask']
  },
  {
    icon: FiZap,
    title: 'Blockchain Infrastructure',
    description: 'Working on core blockchain protocols, consensus mechanisms, and scalability solutions.',
    technologies: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Layer 2', 'Sidechains']
  },
  {
    icon: FiUsers,
    title: 'Developer Tools',
    description: 'Building tools and frameworks to improve the developer experience in the blockchain ecosystem.',
    technologies: ['TypeScript', 'Node.js', 'Docker', 'CI/CD', 'Testing', 'Documentation']
  }
];

const projects = [
  {
    title: 'Tokenized Education Platform',
    description: 'A decentralized learning platform that rewards students with tokens for completing courses and achievements.',
    github: 'https://github.com/boilerblockchain/tokenized-education',
    demo: 'https://tokenized-education.demo.com'
  },
  {
    title: 'DeFi Yield Optimizer',
    description: 'Smart contract system that automatically optimizes yield farming strategies across multiple protocols.',
    github: 'https://github.com/boilerblockchain/defi-optimizer',
    demo: 'https://defi-optimizer.demo.com'
  },
  {
    title: 'NFT Marketplace',
    description: 'Decentralized marketplace for trading NFTs with advanced filtering and royalty distribution.',
    github: 'https://github.com/boilerblockchain/nft-marketplace',
    demo: 'https://nft-marketplace.demo.com'
  }
];

const DeveloperTeam = () => {
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
          Developer <span>Team</span>
        </Title>

        <Subtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Building the future of blockchain technology through innovative smart contracts, 
          decentralized applications, and cutting-edge Web3 infrastructure
        </Subtitle>

        <StatsContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <StatCard whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(113, 32, 176, 0.4)" }}>
            <StatNumber>25+</StatNumber>
            <StatTitle>Active Developers</StatTitle>
          </StatCard>

          <StatCard whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(113, 32, 176, 0.4)" }}>
            <StatNumber>15+</StatNumber>
            <StatTitle>Projects Built</StatTitle>
          </StatCard>

          <StatCard whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(113, 32, 176, 0.4)" }}>
            <StatNumber>8+</StatNumber>
            <StatTitle>Languages Used</StatTitle>
          </StatCard>

          <StatCard whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(113, 32, 176, 0.4)" }}>
            <StatNumber>50+</StatNumber>
            <StatTitle>Smart Contracts</StatTitle>
          </StatCard>
        </StatsContainer>

        <ContentSection
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <SectionTitle>Focus <span>Areas</span></SectionTitle>
          <Grid>
            {areas.map((area, index) => (
              <Card
                key={area.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <CardIcon>
                  <area.icon />
                </CardIcon>
                <CardTitle>{area.title}</CardTitle>
                <CardDescription>{area.description}</CardDescription>
                <TechList>
                  {area.technologies.map((tech, i) => (
                    <li key={i}>{tech}</li>
                  ))}
                </TechList>
              </Card>
            ))}
          </Grid>
        </ContentSection>

        <ContentSection
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <SectionTitle>Featured <span>Projects</span></SectionTitle>
          <Grid>
            {projects.map((project, index) => (
              <ProjectCard
                key={project.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <ProjectTitle>{project.title}</ProjectTitle>
                <ProjectDescription>{project.description}</ProjectDescription>
                <ProjectLinks>
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <FiGithub /> GitHub
                  </a>
                  <a href={project.demo} target="_blank" rel="noopener noreferrer">
                    <FiExternalLink /> Demo
                  </a>
                </ProjectLinks>
              </ProjectCard>
            ))}
          </Grid>
        </ContentSection>
      </Container>
    </PageSection>
  );
};

export default DeveloperTeam;
