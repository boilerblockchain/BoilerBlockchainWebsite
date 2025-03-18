import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { FiExternalLink, FiAward, FiLink } from 'react-icons/fi';

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

// New Blockchain Components
const BlockchainContainer = styled(motion.div)`
  position: relative;
  margin: 4rem auto;
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 3rem;
`;

const BlockchainTrack = styled.div`
  position: relative;
  width: 90%;
  margin: 0 auto;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, rgba(113, 32, 176, 0.2), rgba(113, 32, 176, 0.8), rgba(113, 32, 176, 0.2));
    transform: translateY(-50%);
    border-radius: 4px;
    box-shadow: 0 0 15px rgba(113, 32, 176, 0.4);
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const BlockRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin: 3rem 0;
  position: relative;
  z-index: 2;
  
  &:nth-child(even) {
    flex-direction: row-reverse;
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    margin: 1.5rem 0;
  }
`;

const BlockCard = styled(motion.div)`
  width: 300px;
  background: rgba(15, 15, 15, 0.8);
  border: 2px solid #7120b0;
  border-radius: 10px;
  padding: 1.5rem;
  margin: 0 1rem 2rem;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 20px rgba(113, 32, 176, 0.2);
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  min-height: 280px;
  
  /* Grid background pattern */
  background-image: 
    linear-gradient(rgba(113, 32, 176, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(113, 32, 176, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  
  /* Hash pattern at the top */
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: 0;
    right: 0;
    height: 8px;
    background: linear-gradient(90deg, 
      rgba(113, 32, 176, 0.1) 0%, 
      rgba(113, 32, 176, 0.8) 20%, 
      rgba(113, 32, 176, 0.2) 40%,
      rgba(113, 32, 176, 0.8) 60%,
      rgba(113, 32, 176, 0.2) 80%,
      rgba(113, 32, 176, 0.9) 100%
    );
    border-radius: 8px 8px 0 0;
  }
  
  /* Block number */
  &::after {
    content: 'Block #${props => props.blockNumber || 0}';
    position: absolute;
    bottom: -10px;
    right: 10px;
    font-size: 0.7rem;
    color: rgba(113, 32, 176, 0.8);
    font-family: monospace;
    background: rgba(0, 0, 0, 0.8);
    padding: 2px 8px;
    border-radius: 4px;
    border: 1px solid rgba(113, 32, 176, 0.4);
  }
  
  /* Connector from block to main chain */
  .connector {
    position: absolute;
    width: 2px;
    background: linear-gradient(0deg, rgba(113, 32, 176, 0.2), rgba(113, 32, 176, 0.8));
    z-index: -1;
    
    &.top {
      top: -40px;
      left: 50%;
      height: 40px;
    }
    
    &.bottom {
      bottom: -40px;
      left: 50%;
      height: 40px;
    }
  }
  
  /* Link node circles */
  .node {
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #7120b0;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 0 10px rgba(113, 32, 176, 0.6);
    z-index: 3;
    
    &.top {
      top: -8px;
    }
    
    &.bottom {
      bottom: -8px;
    }
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(113, 32, 176, 0.3);
    border-color: rgba(113, 32, 176, 1);
    
    &::after {
      color: rgba(113, 32, 176, 1);
    }
  }
  
  @media (max-width: 768px) {
    width: 85%;
    max-width: 300px;
    margin-bottom: 3rem;
  }
`;

const BlockContent = styled.div`
  position: relative;
  z-index: 2;
  padding-bottom: 50px; /* space for footer */
`;

const Hash = styled.div`
  font-family: monospace;
  font-size: 0.7rem;
  color: rgba(113, 32, 176, 0.7);
  background: rgba(0, 0, 0, 0.5);
  padding: 4px 8px;
  border-radius: 4px;
  margin-bottom: 1rem;
  border: 1px dashed rgba(113, 32, 176, 0.4);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  user-select: all;
`;

const BlockHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const BlockDate = styled.h3`
  font-size: 1.3rem;
  color: #ffffff;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 0 10px rgba(113, 32, 176, 0.5);
`;

const BlockTime = styled.span`
  font-size: 0.8rem;
  color: rgba(113, 32, 176, 0.9);
  background: rgba(0, 0, 0, 0.5);
  padding: 2px 8px;
  border-radius: 12px;
`;

const BlockTitle = styled.h4`
  font-size: 1.1rem;
  color: #bb20ff;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const BlockTeam = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
  line-height: 1.4;
  
  strong {
    color: #ffffff;
  }
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

const BlockFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  position: absolute;
  bottom: 15px;
  left: 15px;
  right: 15px;
`;

const PrizeTag = styled.div`
  background: rgba(113, 32, 176, 0.3);
  color: #ffffff;
  font-size: 0.85rem;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid rgba(113, 32, 176, 0.5);
  
  svg {
    color: #bb20ff;
  }
`;

const ViewButton = styled.div`
  background: rgba(113, 32, 176, 0.2);
  color: #ffffff;
  font-size: 0.85rem;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  border: 1px solid rgba(113, 32, 176, 0.3);
  margin-left: auto;
  
  &:hover {
    background: rgba(113, 32, 176, 0.4);
    border-color: rgba(113, 32, 176, 0.7);
  }
  
  svg {
    color: #bb20ff;
  }
`;

// Expanded Block Modal
const ExpandedModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(10px);
`;

const ModalContent = styled(motion.div)`
  background: rgba(15, 15, 15, 0.9);
  width: 90%;
  max-width: 600px;
  border-radius: 10px;
  padding: 2.5rem;
  position: relative;
  border: 2px solid #7120b0;
  box-shadow: 0 0 30px rgba(113, 32, 176, 0.4);
  
  /* Grid background pattern */
  background-image: 
    linear-gradient(rgba(113, 32, 176, 0.2) 1px, transparent 1px),
    linear-gradient(90deg, rgba(113, 32, 176, 0.2) 1px, transparent 1px);
  background-size: 20px 20px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  
  &:hover {
    color: #7120b0;
  }
`;

const ModalTitle = styled.h2`
  font-size: 2rem;
  color: #ffffff;
  margin-bottom: 0.5rem;
  font-weight: 700;
`;

const ModalHash = styled.div`
  font-family: monospace;
  font-size: 0.8rem;
  color: rgba(113, 32, 176, 0.7);
  background: rgba(0, 0, 0, 0.5);
  padding: 6px 10px;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  border: 1px dashed rgba(113, 32, 176, 0.4);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  user-select: all;
`;

const ModalProjectName = styled.div`
  font-size: 1.3rem;
  color: #bb20ff;
  margin-bottom: 1.5rem;
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
      color: #d175ff;
      text-decoration: underline;
    }
  }
`;

const ModalTeam = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  line-height: 1.6;
  
  strong {
    color: #ffffff;
    font-weight: 600;
  }
`;

const PrizesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
  
  li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
    color: rgba(255, 255, 255, 0.9);
    font-size: 1rem;
    
    svg {
      color: #bb20ff;
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
  {
    id: 12,
    date: "ETH Denver 25'",
    project: "Cosmos Pool",
    link: "https://devfolio.co/projects/cosmospool-c15c",
    devs: "Joey, Mugdha, Garv, Adithya",
    prize: null,
    prizes: null,
  },
  {
    id: 13,
    date: "Eigen Games 25'",
    project: "Insert here",
    link: "#",
    devs: "Vincent, Pranav",
    prize: "🥇 Third Place",
    prizes: null
  },
];

// Generate fake hash for each hackathon
const generateHash = (id, project) => {
  const characters = '0123456789abcdef';
  let hash = '0x';

  // Use the project name and id to ensure consistent hash generation
  const seed = id.toString() + project;

  for (let i = 0; i < 64; i++) {
    const charIndex = (seed.charCodeAt(i % seed.length) + i) % characters.length;
    hash += characters.charAt(charIndex);
  }

  return hash;
};

// Add hash and timestamps to data
const enhancedHackathonData = hackathonData.map(item => ({
  ...item,
  hash: generateHash(item.id, item.project),
  timestamp: `${(2022 + Math.floor(item.id / 4))}:${(item.id * 11) % 60}:${(item.id * 7) % 60}`
}));

const HackathonsPage = () => {
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate statistics - accurate count of unique hackathons
  const uniqueHackathonNames = new Set();
  hackathonData.forEach(item => {
    // Extract just the hackathon name without year
    const hackathonBaseName = item.date.split("'")[0].trim();
    uniqueHackathonNames.add(hackathonBaseName);
  });

  const totalHackathons = uniqueHackathonNames.size;
  const totalProjects = hackathonData.length;
  const totalPrizes = hackathonData.reduce((count, item) => {
    if (item.prizes) return count + item.prizes.length;
    if (item.prize && item.prize !== "") return count + 1;
    return count;
  }, 0);

  // Reverse the hackathon data to show newest first (keeping original block numbers)
  const sortedHackathonData = [...enhancedHackathonData].reverse().map(item => ({
    ...item,
    displayBlockNumber: item.id // Keep original block number
  }));

  // Organize hackathons into rows (3 per row)
  const organizeHackathonsIntoRows = (data) => {
    const result = [];
    for (let i = 0; i < data.length; i += 3) {
      result.push(data.slice(i, i + 3));
    }
    return result;
  };

  const rows = organizeHackathonsIntoRows(sortedHackathonData);

  const handleBlockClick = (hackathon) => {
    setSelectedHackathon(hackathon);
  };

  const closeModal = () => {
    setSelectedHackathon(null);
  };

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

        <BlockchainContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <BlockchainTrack />

          {rows.map((row, rowIndex) => (
            <BlockRow key={rowIndex}>
              {row.map((block, blockIndex) => (
                <BlockCard
                  key={block.id}
                  blockNumber={block.displayBlockNumber}
                  onClick={() => handleBlockClick(block)}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      stiffness: 100,
                      damping: 12,
                      delay: blockIndex * 0.1
                    }
                  }}
                  viewport={{ once: false, amount: 0.3 }}
                  whileHover={{
                    y: -5,
                    transition: { type: "spring", stiffness: 400, damping: 10 }
                  }}
                >
                  <span className="connector top"></span>
                  <span className="node top"></span>

                  <BlockContent>
                    <Hash title={block.hash}>{block.hash.substring(0, 20)}...</Hash>

                    <BlockHeader>
                      <BlockDate>{block.date}</BlockDate>
                      <BlockTime>{block.timestamp}</BlockTime>
                    </BlockHeader>

                    <BlockTitle>{block.project}</BlockTitle>

                    <BlockTeam>
                      <strong>Team:</strong> {block.devs}
                    </BlockTeam>

                    <BlockFooter>
                      {(block.prize && block.prize !== "") || (block.prizes && block.prizes.length > 0) ? (
                        <PrizeTag>
                          <FiAward size={14} /> Winner
                        </PrizeTag>
                      ) : (
                        <div></div>
                      )}

                      <ViewButton>
                        <FiLink size={14} /> View
                      </ViewButton>
                    </BlockFooter>
                  </BlockContent>

                  <span className="connector bottom"></span>
                  <span className="node bottom"></span>
                </BlockCard>
              ))}
            </BlockRow>
          ))}
        </BlockchainContainer>

        {selectedHackathon && (
          <ExpandedModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <CloseButton onClick={closeModal}>×</CloseButton>
              <ModalTitle>Block #{selectedHackathon.displayBlockNumber} - {selectedHackathon.date}</ModalTitle>
              <ModalHash title={selectedHackathon.hash}>{selectedHackathon.hash}</ModalHash>

              <ModalProjectName>
                <a href={selectedHackathon.link} target="_blank" rel="noopener noreferrer">
                  {selectedHackathon.project} <FiExternalLink size={18} />
                </a>
              </ModalProjectName>

              <ModalTeam>
                <strong>Team:</strong> {selectedHackathon.devs}
              </ModalTeam>

              {selectedHackathon.prizes ? (
                <>
                  <strong>Prizes:</strong>
                  <PrizesList>
                    {selectedHackathon.prizes.map((prize, i) => (
                      <li key={i}>
                        <FiAward size={18} /> {prize}
                      </li>
                    ))}
                  </PrizesList>
                </>
              ) : selectedHackathon.prize && selectedHackathon.prize !== "" ? (
                <>
                  <strong>Prize:</strong>
                  <PrizesList>
                    <li>
                      <FiAward size={18} /> {selectedHackathon.prize}
                    </li>
                  </PrizesList>
                </>
              ) : null}
            </ModalContent>
          </ExpandedModal>
        )}
      </Container>
    </PageSection>
  );
};

export default HackathonsPage;
