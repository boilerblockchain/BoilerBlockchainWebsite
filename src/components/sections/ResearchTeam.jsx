import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FiSearch, FiBook, FiTrendingUp, FiUsers, FiExternalLink } from 'react-icons/fi';
import Navigation from '../Navigation';

// CountUp Animation Component
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
  font-family: 'Tomorrow', sans-serif;

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
  font-family: 'Tomorrow', sans-serif;
`;

const StatsContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin: 4rem 0;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const StatCard = styled(motion.div)`
  background: rgba(15, 15, 15, 0.6);
  border: 1px solid rgba(113, 32, 176, 0.3);
  border-radius: 8px;
  padding: 1.8rem;
  backdrop-filter: blur(5px);
  box-shadow: 0 2px 10px rgba(113, 32, 176, 0.1);
  transition: all 0.3s ease;
  text-align: center;
  min-width: 180px;
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

const StatNumber = styled.h3`
  font-size: 2.5rem;
  color: #7120b0;
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-family: 'Tomorrow', sans-serif;
`;

const StatLabel = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: ${props => props.theme.fontmd};
  font-weight: 500;
  font-family: 'Tomorrow', sans-serif;
`;

const ResearchGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  margin: 3rem 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ResearchCard = styled(motion.div)`
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

const ResearchIcon = styled.div`
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

const ResearchTitle = styled.h3`
  color: #ffffff;
  font-size: ${props => props.theme.fontlg};
  margin-bottom: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'Tomorrow', sans-serif;
`;

const ResearchDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  font-family: 'Tomorrow', sans-serif;
`;

const ResearchLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #7120b0;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  font-family: 'Tomorrow', sans-serif;
  
  &:hover {
    color: #bb20ff;
  }
  
  svg {
    font-size: 1rem;
  }
`;

const PublicationsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  margin: 3rem 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PublicationCard = styled(motion.div)`
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

const PublicationTitle = styled.h4`
  color: #ffffff;
  font-size: ${props => props.theme.fontlg};
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-family: 'Tomorrow', sans-serif;
`;

const PublicationAuthors = styled.p`
  color: #7120b0;
  font-size: ${props => props.theme.fontmd};
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-family: 'Tomorrow', sans-serif;
`;

const PublicationVenue = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: ${props => props.theme.fontsm};
  margin-bottom: 1rem;
  font-family: 'Tomorrow', sans-serif;
`;

const PublicationAbstract = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  line-height: 1.5;
  font-family: 'Tomorrow', sans-serif;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  color: #ffffff;
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Tomorrow', sans-serif;
  
  span {
    color: #7120b0;
  }
`;

const researchAreas = [
  {
    title: 'Consensus Mechanisms',
    description: 'Researching next-generation consensus protocols for improved scalability and energy efficiency in blockchain networks.',
    icon: FiTrendingUp,
    link: '#'
  },
  {
    title: 'DeFi Security',
    description: 'Analyzing smart contract vulnerabilities and developing automated security assessment tools for DeFi protocols.',
    icon: FiSearch,
    link: '#'
  },
  {
    title: 'Blockchain Scalability',
    description: 'Exploring Layer 2 solutions, sharding, and off-chain protocols to enhance blockchain transaction throughput.',
    icon: FiUsers,
    link: '#'
  },
  {
    title: 'Privacy-Preserving Protocols',
    description: 'Developing zero-knowledge proof systems and privacy-focused blockchain applications.',
    icon: FiBook,
    link: '#'
  }
];

const publications = [
  {
    title: 'Optimizing Proof-of-Stake Consensus Through Machine Learning',
    authors: 'Smith, J., Johnson, A., Williams, R.',
    venue: 'IEEE Blockchain Conference 2024',
    abstract: 'This paper presents a novel approach to optimizing validator selection in Proof-of-Stake networks using reinforcement learning algorithms.'
  },
  {
    title: 'Security Analysis of Cross-Chain Bridge Protocols',
    authors: 'Davis, M., Brown, K., Taylor, S.',
    venue: 'ACM Conference on Computer and Communications Security 2024',
    abstract: 'An empirical study of vulnerabilities in popular cross-chain bridges and proposed mitigation strategies.'
  },
  {
    title: 'Zero-Knowledge Proofs for Private Smart Contract Execution',
    authors: 'Wilson, L., Garcia, C., Martinez, D.',
    venue: 'USENIX Security Symposium 2024',
    abstract: 'Introducing a framework for executing smart contracts while preserving transaction privacy using zk-SNARKs.'
  }
];

const ResearchTeam = () => {
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
          Research <span>Team</span>
        </Title>

        <Subtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Advancing blockchain technology through rigorous academic research and innovative solutions
        </Subtitle>

        <StatsContainer
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <StatCard whileHover={{ y: -2 }}>
            <StatNumber><CountUp end={12} suffix="+" /></StatNumber>
            <StatLabel>Researchers</StatLabel>
          </StatCard>
          <StatCard whileHover={{ y: -2 }}>
            <StatNumber><CountUp end={15} /></StatNumber>
            <StatLabel>Published Papers</StatLabel>
          </StatCard>
          <StatCard whileHover={{ y: -2 }}>
            <StatNumber><CountUp end={6} /></StatNumber>
            <StatLabel>Research Areas</StatLabel>
          </StatCard>
          <StatCard whileHover={{ y: -2 }}>
            <StatNumber><CountUp end={25} suffix="K+" /></StatNumber>
            <StatLabel>Citations</StatLabel>
          </StatCard>
        </StatsContainer>

        <SectionTitle
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Research <span>Areas</span>
        </SectionTitle>
        
        <ResearchGrid
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {researchAreas.map((area, index) => (
            <ResearchCard
              key={area.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -2 }}
            >
              <ResearchIcon>
                <area.icon />
              </ResearchIcon>
              <ResearchTitle>{area.title}</ResearchTitle>
              <ResearchDescription>{area.description}</ResearchDescription>
              <ResearchLink href={area.link}>
                <FiExternalLink /> Learn More
              </ResearchLink>
            </ResearchCard>
          ))}
        </ResearchGrid>

        <SectionTitle
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Recent <span>Publications</span>
        </SectionTitle>
        
        <PublicationsGrid
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {publications.map((pub, index) => (
            <PublicationCard
              key={pub.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -2 }}
            >
              <PublicationTitle>{pub.title}</PublicationTitle>
              <PublicationAuthors>{pub.authors}</PublicationAuthors>
              <PublicationVenue>{pub.venue}</PublicationVenue>
              <PublicationAbstract>{pub.abstract}</PublicationAbstract>
            </PublicationCard>
          ))}
        </PublicationsGrid>
      </Container>
    </PageSection>
  );
};

export default ResearchTeam;