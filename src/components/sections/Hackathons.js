import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { FiExternalLink, FiAward } from 'react-icons/fi';

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
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin: 2rem 0 5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)`
  background: rgba(15, 15, 15, 0.7);
  border: 1px solid #7120b0;
  border-radius: 8px;
  padding: 2.5rem 1.5rem;
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
  font-size: 3.5rem;
  font-weight: 700;
  color: #7120b0;
  margin-bottom: 0.5rem;
`;

const StatTitle = styled.div`
  font-size: 1.2rem;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const TimelineContainer = styled(motion.div)`
  position: relative;
  margin: 4rem 0;
  
  /* Remove the old straight timeline */
  &::before, &::after {
    display: none;
  }
`;

const TimelineItemsContainer = styled.div`
  position: relative;
  z-index: 2;
  
  /* Add the curving animation line */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 4px;
    background: #7120b0;
    border-radius: 4px;
    box-shadow: 0 0 20px rgba(113, 32, 176, 0.4);
    transform-origin: 50% 0;
    z-index: 1;
    animation: flowingLine 5s infinite alternate;
    
    @media (max-width: 768px) {
      left: 30px;
    }
  }
  
  /* Add animated glow effect */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    height: 200px;
    width: 12px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(to bottom, rgba(113, 32, 176, 0), #7120b0, rgba(113, 32, 176, 0));
    border-radius: 6px;
    opacity: 0.6;
    filter: blur(4px);
    z-index: 0;
    animation: trackScroll 2s linear infinite;
    
    @media (max-width: 768px) {
      left: 30px;
    }
  }
  
  @keyframes trackScroll {
    0% {
      top: 0;
      height: 200px;
    }
    100% {
      top: 100%;
      height: 200px;
    }
  }
  
  @keyframes flowingLine {
    0%, 100% {
      transform: translateX(-50%) scaleY(1);
    }
    50% {
      transform: translateX(-50%) scaleY(1.03) translateX(5px);
    }
  }
`;

const TimelineItem = styled(motion.div)`
  position: relative;
  display: flex;
  margin-bottom: 1.5rem; /* Closer spacing */
  opacity: 0.3;
  transition: all 0.5s ease;
  
  &.active {
    opacity: 1;
    
    /* Create a segment of the curved line for each active timeline item */
    &::before {
      content: '';
      position: absolute;
      background: #7120b0;
      width: 100px;
      height: 4px;
      top: 30px;
      border-radius: 4px;
      z-index: 0;
      box-shadow: 0 0 10px rgba(113, 32, 176, 0.6);
      
      @media (max-width: 768px) {
        width: 30px;
        left: 30px;
      }
    }
  }
  
  &:nth-child(odd) {
    justify-content: flex-start;
    
    @media (min-width: 769px) {
      padding-right: calc(50% + 1.5rem);
      
      &::before {
        right: 0;
      }
    }
  }
  
  &:nth-child(even) {
    @media (min-width: 769px) {
      justify-content: flex-end;
      padding-left: calc(50% + 1.5rem);
      
      &::before {
        left: 0;
      }
    }
    
    @media (max-width: 768px) {
      padding-left: 60px;
      
      &::before {
        left: 0;
      }
    }
  }
  
  @media (max-width: 768px) {
    padding-left: 60px;
    margin-bottom: 1.5rem; /* Even smaller on mobile */
  }
`;

/* Hide the timeline dots completely */
const TimelineDot = styled.div`
  display: none;
`;

const TimelineContent = styled(motion.div)`
  background: rgba(15, 15, 15, 0.7);
  border-radius: 8px;
  padding: 1rem; /* Further reduced padding */
  max-width: 430px; /* Even smaller */
  width: 100%;
  border: 1px solid rgba(113, 32, 176, 0.4);
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
  
  /* Add a dot connector effect to the box itself instead of separate dots */
  &::before {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #7120b0;
    z-index: 3;
    top: 30px;
    box-shadow: 0 0 15px rgba(113, 32, 176, 0.8);
  }
  
  &:hover {
    box-shadow: 0 10px 30px rgba(113, 32, 176, 0.2);
    transform: translateY(-5px);
    border-color: #7120b0;
  }
  
  /* Position the connector dot based on odd/even items */
  ${TimelineItem}:nth-child(odd) & {
    &::before {
      right: -6px;
      
      @media (max-width: 768px) {
        left: -36px;
        right: auto;
      }
    }
  }
  
  ${TimelineItem}:nth-child(even) & {
    &::before {
      left: -6px;
      
      @media (max-width: 768px) {
        left: -36px;
      }
    }
  }
`;

const HackathonTitle = styled.h3`
  font-size: 1.6rem; /* Slightly smaller */
  color: #ffffff;
  margin-bottom: 0.3rem; /* Reduced */
  font-weight: 700;
`;

const ProjectName = styled.div`
  font-size: 1.1rem; /* Slightly smaller */
  color: #7120b0;
  margin-bottom: 1rem; /* Reduced from 1.5rem */
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  a {
    color: inherit;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    
    &:hover {
      color: #9d20b0;
      text-decoration: underline;
    }
  }
`;

const TeamMembers = styled.div`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;
  
  strong {
    color: #ffffff;
  }
`;

const PrizesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0;
  
  li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.95rem;
    
    svg {
      color: #7120b0;
      flex-shrink: 0;
    }
  }
`;

const hackathonData = [
  {
    id: 1,
    date: "ETH SF '22",
    project: "Tokenized Education",
    link: "https://ethglobal.com/showcase/tokenized-education-fmixx",
    devs: "Kshtij, Adithya, Ian, Saumya, Ajay",
    prize: "👥 Triangle — Best Social Use",
    prizes: null,
  },
  {
    id: 2,
    date: "ETH SF '22",
    project: "Verf3d",
    link: "https://ethglobal.com/showcase/verf3d-gb7h9",
    devs: "Eashan, Soham, Andrean",
    prize: "🏊‍♂️ SKALE — Pool Prize",
    prizes: null,
  },
  {
    id: 3,
    date: "Penn Blockchain",
    project: "Koraline",
    link: "https://dorahacks.io/buidl/4274",
    devs: "Eashan, Soham, Kshtij, Devesh, Adithya",
    prize: "",
    prizes: null,
  },
  {
    id: 4,
    date: "ETH Denver 23'",
    project: "LiquidEase",
    link: "https://app.buidlbox.io/projects/liquidease",
    devs: "Adithya, Kshitij, Will",
    prize: "0x Bounty - Third Place",
    prizes: null,
  },
  {
    id: 5,
    date: "Scaling ETH 23'",
    project: "ToldYouSo",
    link: "https://ethglobal.com/showcase/told-you-so-auvch",
    devs: "Soham",
    prize: null,
    prizes: ["👯 Polybase — Pool Prize", "📜 Scroll — Just Deploy!"],
  },
  {
    id: 6,
    date: "ETH Online 23'",
    project: "DaoLingo",
    link: "https://ethglobal.com/showcase/daolingo-fd6uw",
    devs: "Soham",
    prize: "🏃 FVM — Runner Up",
    prizes: null,
  },
  {
    id: 7,
    date: "ETH NYC 23'",
    project: "Soho",
    link: "https://ethglobal.com/showcase/soho-xo1fi",
    devs: "Soham, Eli, Vincent, Ibrahim",
    prize: null,
    prizes: [
      "🎨 Nouns DAO — Best Use of Artwork",
      "🥈 XMTP — Best Use",
      "🏊‍♂️ The Graph — Pool Prize",
      "🏃 Scroll — Honorable Mentions",
      "🏊‍♂️ Scroll — Pool Prize",
    ],
  },
  {
    id: 8,
    date: "ETH NYC 23'",
    project: "Sndwch_protocol",
    link: "https://ethglobal.com/showcase/sndwch-protocol-cqsb0",
    devs: "Kshtij, Eashan, Stanley, Mihika",
    prize: "",
    prizes: null,
  },
  {
    id: 9,
    date: "ETH Online 23'",
    project: "Rio",
    link: "https://ethglobal.com/showcase/rio-fyams",
    devs: "Vincent, Eli",
    prize: null,
    prizes: ["🏊‍♀️ Mantle — Build on Mantle", "🏊 Scroll — Pool Prize"],
  },
  {
    id: 10,
    date: "ETH Denver 24'",
    project: "CrypTap",
    link: "https://devfolio.co/projects/boiler-blockchain-ee81",
    devs: "Soham, Armanya, Ansh",
    prize: null,
    prizes: [
      "Top 6 in Infrastructure Category",
      "3000 SPORK$ in Community Voting",
    ],
  },
  {
    id: 11,
    date: "SUI Network Grants 24'",
    project: "Kove",
    link: "https://twitter.com/BoilerChain/status/1768089308357910975",
    devs: "Vincent, Eli, Ansh",
    prize: "",
    prizes: null,
  },
];

const HackathonsPage = () => {
  const [activeItems, setActiveItems] = useState([]);
  
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);
  
  useEffect(() => {
    const calculateItemsInView = () => {
      const items = document.querySelectorAll('.timeline-item');
      const inViewItems = [];
      
      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const isVisible = 
          rect.top >= -viewportHeight * 0.3 && 
          rect.bottom <= viewportHeight * 1.3;
        
        if (isVisible) {
          inViewItems.push(index);
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
      
      setActiveItems(inViewItems);
    };
    
    window.addEventListener('scroll', calculateItemsInView);
    
    calculateItemsInView();
    
    return () => {
      window.removeEventListener('scroll', calculateItemsInView);
    };
  }, []);
  
  // Calculate statistics
  const totalHackathons = new Set(hackathonData.map(item => item.date)).size;
  const totalProjects = hackathonData.length;
  const totalPrizes = hackathonData.reduce((count, item) => {
    if (item.prizes) return count + item.prizes.length;
    if (item.prize && item.prize !== "") return count + 1;
    return count;
  }, 0);

  // Reverse the hackathon data to show newest first
  const sortedHackathonData = [...hackathonData].reverse();

  return (
    <PageSection>
      <Particles
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
      <BackButton to="/">Back</BackButton>
      <Container>
        <Title 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Hackathon <span>Highlights</span>
        </Title>
        
        <Subtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Boiler Blockchain members participate in leading Web3 hackathons around the world, building innovative projects and winning recognition
        </Subtitle>
        
        <StatsContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <StatCard whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(113, 32, 176, 0.4)" }}>
            <StatNumber>{totalHackathons}</StatNumber>
            <StatTitle>Hackathons</StatTitle>
          </StatCard>
          
          <StatCard whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(113, 32, 176, 0.4)" }}>
            <StatNumber>{totalProjects}</StatNumber>
            <StatTitle>Projects Built</StatTitle>
          </StatCard>
          
          <StatCard whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(113, 32, 176, 0.4)" }}>
            <StatNumber>{totalPrizes}</StatNumber>
            <StatTitle>Prizes Won</StatTitle>
          </StatCard>
        </StatsContainer>
        
        <TimelineContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <TimelineItemsContainer>
            {sortedHackathonData.map((item, index) => (
              <TimelineItem 
                key={item.id}
                className="timeline-item"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0,
                  scale: 1,
                  transition: { 
                    type: "spring", 
                    stiffness: 100,
                    damping: 12,
                    delay: index * 0.1 % 0.3 // Staggered but cyclical to keep it snappy 
                  }
                }}
                viewport={{ once: false, amount: 0.3 }}
              >
                <TimelineDot className="timeline-dot" />
                <TimelineContent
                  whileHover={{ 
                    scale: 1.03,
                    transition: { type: "spring", stiffness: 400, damping: 10 }
                  }}
                >
                  <HackathonTitle>{item.date}</HackathonTitle>
                  <ProjectName>
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      {item.project} <FiExternalLink size={16} />
                    </a>
                  </ProjectName>
                  
                  <TeamMembers>
                    <strong>Team:</strong> {item.devs}
                  </TeamMembers>
                  
                  {item.prizes ? (
                    <>
                      <strong>Prizes:</strong>
                      <PrizesList>
                        {item.prizes.map((prize, i) => (
                          <li key={i}><FiAward /> {prize}</li>
                        ))}
                      </PrizesList>
                    </>
                  ) : item.prize && item.prize !== "" ? (
                    <>
                      <strong>Prize:</strong>
                      <PrizesList>
                        <li><FiAward /> {item.prize}</li>
                      </PrizesList>
                    </>
                  ) : null}
                </TimelineContent>
              </TimelineItem>
            ))}
          </TimelineItemsContainer>
        </TimelineContainer>
      </Container>
    </PageSection>
  );
};
export default HackathonsPage;
