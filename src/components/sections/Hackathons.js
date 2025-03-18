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

// New Honeycomb Components
const HoneycombContainer = styled(motion.div)`
  position: relative;
  margin: 4rem auto;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HoneycombRow = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: -50px; /* Increased negative margin for better spacing */
  
  &:nth-child(even) {
    margin-left: calc(0.866 * var(--hex-size)); /* Offset even rows by sqrt(3)/2 * size */
  }
  
  @media (max-width: 768px) {
    margin-bottom: -30px; /* Less overlap on mobile */
  }
`;

const HexCard = styled(motion.div)`
  --hex-size: 280px; /* Increased base size of hexagon */
  width: var(--hex-size);
  height: calc(var(--hex-size) * 1.1547); /* height = width * sqrt(3)/2 * 1.1 for padding */
  background: rgba(113, 32, 176, 0.2); /* More purple background */
  position: relative;
  margin: 0 10px; /* Increased horizontal spacing between hexagons */
  transform-origin: center;
  border: 2px solid rgba(113, 32, 176, 0.7); /* More visible border */
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(113, 32, 176, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 25px;
  cursor: pointer;
  z-index: 1;
  
  /* Create hexagon shape using clip-path */
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  
  /* Grid background pattern */
  background-image: 
    linear-gradient(rgba(113, 32, 176, 0.2) 1px, transparent 1px),
    linear-gradient(90deg, rgba(113, 32, 176, 0.2) 1px, transparent 1px);
  background-size: 20px 20px;
  
  /* Radial gradient overlay for depth */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(113, 32, 176, 0.3) 0%, rgba(15, 15, 15, 0.9) 100%);
    z-index: -1;
  }
  
  &:hover {
    transform: scale(1.05);
    border-color: #7120b0;
    box-shadow: 0 10px 30px rgba(113, 32, 176, 0.4);
    z-index: 2;
    background: rgba(113, 32, 176, 0.25); /* Slightly more purple on hover */
  }
  
  /* Responsive sizing */
  @media (max-width: 1200px) {
    --hex-size: 240px; /* Still larger than original */
    margin: 0 8px;
  }
  
  @media (max-width: 900px) {
    --hex-size: 220px;
    padding: 20px;
  }
  
  @media (max-width: 768px) {
    --hex-size: 190px;
    padding: 15px;
  }
  
  @media (max-width: 500px) {
    --hex-size: 160px;
    padding: 10px;
  }
`;

const HexContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: auto;
  padding: 15px;
  position: relative;
  z-index: 2;
  
  /* Hide scrollbar but keep functionality */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const HackathonTitle = styled.h3`
  font-size: 1.5rem;
  color: #ffffff;
  margin-bottom: 0.5rem;
  font-weight: 700;
  line-height: 1.2;
  text-shadow: 0 0 10px rgba(113, 32, 176, 0.8);
`;

const ProjectName = styled.div`
  font-size: 1.1rem;
  color: #bb20ff; /* Brighter purple */
  margin-bottom: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  text-shadow: 0 0 8px rgba(113, 32, 176, 0.6);
  
  a {
    color: inherit;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    transition: all 0.3s ease;
    
    &:hover {
      color: #d175ff;
      text-decoration: underline;
    }
  }
`;

const TeamMembers = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
  line-height: 1.4;
  
  strong {
    color: #ffffff;
    font-weight: 600;
  }
`;

const PrizesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0;
  
  li {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
    padding: 0.3rem 0;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.85rem;
    text-align: center;
    
    svg {
      color: #7120b0;
      flex-shrink: 0;
    }
  }
`;

// Expanded Hexagon Modal
const ExpandedHexModal = styled(motion.div)`
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
  margin-bottom: 1rem;
  font-weight: 700;
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

  // Function to organize data into honeycomb rows
  const organizeHoneycombRows = (data) => {
    // Determine row pattern based on screen width
    let itemsPerRow;

    if (windowSize.width <= 768) {
      // For mobile: 2-1-2 pattern
      itemsPerRow = [2, 1, 2, 1, 2, 1, 2];
    } else if (windowSize.width <= 1100) {
      // For tablets: 3-2-3 pattern
      itemsPerRow = [3, 2, 3, 2, 3, 2, 3];
    } else {
      // For desktop: 3-4-3 pattern (reduced number of items per row to fit larger hexagons)
      itemsPerRow = [3, 4, 3, 4, 3, 4, 3];
    }

    const rows = [];
    let currentIndex = 0;

    // Create rows with appropriate number of items
    for (let i = 0; i < itemsPerRow.length; i++) {
      const itemsNeeded = itemsPerRow[i];
      const rowItems = data.slice(currentIndex, currentIndex + itemsNeeded);
      currentIndex += itemsNeeded;

      if (rowItems.length > 0) {
        rows.push(rowItems);
      }

      // Stop if we've used all data
      if (currentIndex >= data.length) break;
    }

    return rows;
  };

  const honeycombRows = organizeHoneycombRows(sortedHackathonData);

  const handleHexClick = (hackathon) => {
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

        <HoneycombContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {honeycombRows.map((row, rowIndex) => (
            <HoneycombRow key={rowIndex}>
              {row.map((hackathon, hexIndex) => (
                <HexCard
                  key={hackathon.id}
                  onClick={() => handleHexClick(hackathon)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{
                    opacity: 1,
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 100,
                      damping: 12,
                      delay: (rowIndex * 0.1) + (hexIndex * 0.05)
                    }
                  }}
                  viewport={{ once: false, amount: 0.3 }}
                  whileHover={{
                    scale: 1.05,
                    transition: { type: "spring", stiffness: 400, damping: 10 }
                  }}
                >
                  <HexContent>
                    <HackathonTitle>{hackathon.date}</HackathonTitle>
                    <ProjectName>
                      {hackathon.project}
                    </ProjectName>

                    <TeamMembers>
                      <strong>Team:</strong> {hackathon.devs.length > 25
                        ? hackathon.devs.substring(0, 25) + '...'
                        : hackathon.devs
                      }
                    </TeamMembers>

                    {(hackathon.prize && hackathon.prize !== "") || (hackathon.prizes && hackathon.prizes.length > 0) ? (
                      <div style={{
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        background: 'rgba(113, 32, 176, 0.6)',
                        padding: '5px 10px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 0 10px rgba(113, 32, 176, 0.4)'
                      }}>
                        <FiAward size={14} /> Prize Winner
                      </div>
                    ) : null}
                  </HexContent>
                </HexCard>
              ))}
            </HoneycombRow>
          ))}
        </HoneycombContainer>

        {selectedHackathon && (
          <ExpandedHexModal
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
              <ModalTitle>{selectedHackathon.date}</ModalTitle>
              <ProjectName style={{ justifyContent: 'flex-start', fontSize: '1.3rem' }}>
                <a href={selectedHackathon.link} target="_blank" rel="noopener noreferrer">
                  {selectedHackathon.project} <FiExternalLink size={18} />
                </a>
              </ProjectName>

              <TeamMembers style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>
                <strong>Team:</strong> {selectedHackathon.devs}
              </TeamMembers>

              {selectedHackathon.prizes ? (
                <>
                  <strong>Prizes:</strong>
                  <PrizesList style={{ alignItems: 'flex-start' }}>
                    {selectedHackathon.prizes.map((prize, i) => (
                      <li key={i} style={{ justifyContent: 'flex-start', fontSize: '1rem' }}>
                        <FiAward size={18} /> {prize}
                      </li>
                    ))}
                  </PrizesList>
                </>
              ) : selectedHackathon.prize && selectedHackathon.prize !== "" ? (
                <>
                  <strong>Prize:</strong>
                  <PrizesList style={{ alignItems: 'flex-start' }}>
                    <li style={{ justifyContent: 'flex-start', fontSize: '1rem' }}>
                      <FiAward size={18} /> {selectedHackathon.prize}
                    </li>
                  </PrizesList>
                </>
              ) : null}
            </ModalContent>
          </ExpandedHexModal>
        )}
      </Container>
    </PageSection>
  );
};
export default HackathonsPage;
