import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FiSearch, FiBook, FiTrendingUp, FiUsers, FiExternalLink, FiFileText } from 'react-icons/fi';

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

const TopicList = styled.ul`
  list-style: none;
  padding: 0;

  li {
    color: rgba(255, 255, 255, 0.9);
    padding: 0.5rem 0;
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    line-height: 1.4;

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

const PaperCard = styled(motion.div)`
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

const PaperTitle = styled.h3`
  font-size: 1.4rem;
  color: #ffffff;
  margin-bottom: 0.8rem;
  font-weight: 600;
  line-height: 1.3;
`;

const PaperAuthors = styled.p`
  color: #7120b0;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  font-weight: 500;
`;

const PaperAbstract = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
`;

const PaperStatus = styled.span`
  background: rgba(113, 32, 176, 0.2);
  color: #bb20ff;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-right: 1rem;
`;

const PaperLink = styled.a`
  color: #7120b0;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: color 0.3s ease;
  
  &:hover {
    color: #bb20ff;
  }
`;

const researchAreas = [
  {
    icon: FiSearch,
    title: 'Consensus Mechanisms',
    description: 'Researching novel consensus algorithms, proof-of-stake mechanisms, and Byzantine fault tolerance.',
    topics: [
      'Proof-of-Stake Variations',
      'Hybrid Consensus Models', 
      'Finality and Safety',
      'Validator Selection',
      'Slashing Conditions'
    ]
  },
  {
    icon: FiTrendingUp,
    title: 'Scalability Solutions',
    description: 'Exploring layer 2 solutions, sharding, and other approaches to improve blockchain scalability.',
    topics: [
      'Layer 2 Protocols',
      'Sharding Mechanisms',
      'State Channels',
      'Rollup Technologies',
      'Cross-chain Bridges'
    ]
  },
  {
    icon: FiBook,
    title: 'Cryptoeconomics',
    description: 'Studying token economics, mechanism design, and incentive structures in decentralized systems.',
    topics: [
      'Token Distribution',
      'Staking Economics',
      'MEV Analysis',
      'Governance Mechanisms',
      'Market Dynamics'
    ]
  },
  {
    icon: FiUsers,
    title: 'Decentralized Governance',
    description: 'Investigating DAO structures, voting mechanisms, and collective decision-making processes.',
    topics: [
      'Voting Systems',
      'Delegation Models',
      'Proposal Mechanisms',
      'Community Coordination',
      'Governance Attacks'
    ]
  }
];

const publications = [
  {
    title: 'Optimizing Validator Selection in Proof-of-Stake Networks',
    authors: 'Smith, J., Johnson, M., Williams, K.',
    abstract: 'This paper presents a novel approach to validator selection that improves decentralization while maintaining network security. We analyze various selection algorithms and propose improvements.',
    status: 'Published',
    link: 'https://arxiv.org/example1'
  },
  {
    title: 'Cross-Chain Interoperability: Challenges and Solutions',
    authors: 'Davis, L., Brown, A., Wilson, R.',
    abstract: 'An analysis of current cross-chain protocols and their limitations, with proposed solutions for improving interoperability between different blockchain networks.',
    status: 'Under Review',
    link: 'https://arxiv.org/example2'
  },
  {
    title: 'MEV Extraction and Its Impact on Network Fairness',
    authors: 'Taylor, S., Anderson, P., Thomas, D.',
    abstract: 'This research examines maximum extractable value (MEV) and its effects on transaction ordering fairness, proposing mitigation strategies.',
    status: 'In Progress',
    link: 'https://arxiv.org/example3'
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
      
      <BackButton to="/teams">Back to Teams</BackButton>
      
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
          Exploring the frontiers of blockchain technology through rigorous academic research, 
          cutting-edge analysis, and innovative solutions to complex distributed systems challenges
        </Subtitle>

        <StatsContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <StatCard whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(113, 32, 176, 0.4)" }}>
            <StatNumber>12+</StatNumber>
            <StatTitle>Researchers</StatTitle>
          </StatCard>

          <StatCard whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(113, 32, 176, 0.4)" }}>
            <StatNumber>8+</StatNumber>
            <StatTitle>Publications</StatTitle>
          </StatCard>

          <StatCard whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(113, 32, 176, 0.4)" }}>
            <StatNumber>5+</StatNumber>
            <StatTitle>Partnerships</StatTitle>
          </StatCard>

          <StatCard whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(113, 32, 176, 0.4)" }}>
            <StatNumber>15+</StatNumber>
            <StatTitle>Research Areas</StatTitle>
          </StatCard>
        </StatsContainer>

        <ContentSection
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <SectionTitle>Research <span>Areas</span></SectionTitle>
          <Grid>
            {researchAreas.map((area, index) => (
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
                <TopicList>
                  {area.topics.map((topic, i) => (
                    <li key={i}>{topic}</li>
                  ))}
                </TopicList>
              </Card>
            ))}
          </Grid>
        </ContentSection>

        <ContentSection
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <SectionTitle>Recent <span>Publications</span></SectionTitle>
          <Grid>
            {publications.map((paper, index) => (
              <PaperCard
                key={paper.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <PaperTitle>{paper.title}</PaperTitle>
                <PaperAuthors>{paper.authors}</PaperAuthors>
                <PaperAbstract>{paper.abstract}</PaperAbstract>
                <div>
                  <PaperStatus>{paper.status}</PaperStatus>
                  <PaperLink href={paper.link} target="_blank" rel="noopener noreferrer">
                    <FiFileText /> Read Paper
                  </PaperLink>
                </div>
              </PaperCard>
            ))}
          </Grid>
        </ContentSection>
      </Container>
    </PageSection>
  );
};

export default ResearchTeam;
