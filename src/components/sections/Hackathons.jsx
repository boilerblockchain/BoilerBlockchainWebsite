import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from '../ui/Arrow';
import {
  Section,
  Container,
  GridBackdrop,
  Eyebrow,
  Lead,
  Tag,
} from '../ui/primitives';

const Head = styled.div`
  margin-bottom: ${({ theme }) => theme.space[10]};
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  margin-bottom: ${({ theme }) => theme.space[6]};
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textFaint};
  text-decoration: none;
  transition: color ${({ theme }) => theme.motion.base};

  &::before {
    content: '←';
  }

  &:hover {
    color: ${({ theme }) => theme.color.accent};
  }
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.h1};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.color.text};
  margin-bottom: ${({ theme }) => theme.space[4]};

  span {
    color: ${({ theme }) => theme.color.accent};
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0;
  margin-bottom: ${({ theme }) => theme.space[16]};
  border-top: 1px solid ${({ theme }) => theme.color.border};

  ${({ theme }) => theme.media.sm} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const StatCard = styled.div`
  padding-block: ${({ theme }) => theme.space[8]};
  border-bottom: 1px solid ${({ theme }) => theme.color.border};

  ${({ theme }) => theme.media.sm} {
    border-bottom: 0;
    border-left: 1px solid ${({ theme }) => theme.color.border};
    padding-inline: ${({ theme }) => theme.space[6]};

    &:first-child {
      border-left: 0;
      padding-left: 0;
    }
  }
`;

const StatNumber = styled.div`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.stat};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  line-height: 1;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.color.accent};
  font-variant-numeric: tabular-nums;
`;

const StatTitle = styled.div`
  margin-top: ${({ theme }) => theme.space[3]};
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textMuted};
`;

const BlockGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: ${({ theme }) => theme.space[6]};
`;

/* `$blockNumber` is transient so styled-components does not forward it to the
   DOM node, which is what React was warning about. */
const BlockCard = styled(motion.button)`
  position: relative;
  display: block;
  width: 100%;
  min-height: 280px;
  text-align: left;
  background: ${({ theme }) => theme.color.surfaceRaised};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.none};
  padding: ${({ theme }) => theme.space[6]};
  cursor: pointer;
  color: inherit;
  transition: border-color ${({ theme }) => theme.motion.base},
    transform ${({ theme }) => theme.motion.base};

  &::after {
    content: 'BLOCK #${({ $blockNumber }) => $blockNumber || 0}';
    position: absolute;
    top: ${({ theme }) => theme.space[3]};
    right: ${({ theme }) => theme.space[4]};
    font-family: ${({ theme }) => theme.fontFamily.mono};
    font-size: ${({ theme }) => theme.fontSize.micro};
    letter-spacing: 0.16em;
    color: ${({ theme }) => theme.color.textFaint};
  }

  &:hover {
    border-color: ${({ theme }) => theme.color.accentBorderStrong};
    transform: translateY(-3px);
  }

  &:focus-visible {
    outline: 1px solid ${({ theme }) => theme.color.accent};
    outline-offset: 2px;
  }
`;

const BlockContent = styled.div`
  position: relative;
  z-index: 2;
  padding-bottom: 50px; /* space for footer */
`;

const Hash = styled.div`
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.color.textFaint};
  margin-bottom: ${({ theme }) => theme.space[4]};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  user-select: all;
`;

const BlockHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[2]};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const BlockDate = styled.h3`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.h4};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.color.text};
`;

const BlockTime = styled.span`
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  color: ${({ theme }) => theme.color.textFaint};
`;

const BlockTitle = styled.h4`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.body};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme.color.accent};
  margin-bottom: ${({ theme }) => theme.space[3]};
`;

const BlockTeam = styled.div`
  font-family: ${({ theme }) => theme.fontFamily.body};
  font-size: ${({ theme }) => theme.fontSize.small};
  line-height: 1.5;
  color: ${({ theme }) => theme.color.textMuted};

  strong {
    color: ${({ theme }) => theme.color.text};
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
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

const PrizeTag = styled(Tag)`
  color: ${({ theme }) => theme.color.accent};
  border-color: ${({ theme }) => theme.color.accentBorderStrong};
`;

const ViewButton = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  margin-left: auto;
  padding: 0.3rem 0.7rem;
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textMuted};
  border: 1px solid ${({ theme }) => theme.color.border};
  transition: color ${({ theme }) => theme.motion.base},
    border-color ${({ theme }) => theme.motion.base};

  ${BlockCard}:hover & {
    color: ${({ theme }) => theme.color.accent};
    border-color: ${({ theme }) => theme.color.accent};
  }
`;

const ExpandedModal = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space[4]};
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background: ${({ theme }) => theme.color.surfaceRaised};
  width: 100%;
  max-width: 600px;
  max-height: 85vh;
  overflow-y: auto;
  border-radius: ${({ theme }) => theme.radius.none};
  padding: ${({ theme }) => theme.space[8]};
  position: relative;
  border: 1px solid ${({ theme }) => theme.color.borderStrong};
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.space[3]};
  right: ${({ theme }) => theme.space[3]};
  width: 36px;
  height: 36px;
  background: none;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.none};
  color: ${({ theme }) => theme.color.textMuted};
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  transition: color ${({ theme }) => theme.motion.base},
    border-color ${({ theme }) => theme.motion.base};

  &:hover {
    color: ${({ theme }) => theme.color.accent};
    border-color: ${({ theme }) => theme.color.accent};
  }
`;

const ModalTitle = styled.h2`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.h3};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  line-height: 1.15;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.color.text};
  padding-right: ${({ theme }) => theme.space[10]};
  margin-bottom: ${({ theme }) => theme.space[3]};
`;

const ModalHash = styled.div`
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.color.textFaint};
  margin-bottom: ${({ theme }) => theme.space[6]};
  overflow-wrap: anywhere;
  user-select: all;
`;

const ModalProjectName = styled.div`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.h4};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.space[6]};

  a {
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.space[2]};
    color: ${({ theme }) => theme.color.accent};
    text-decoration: none;
    transition: color ${({ theme }) => theme.motion.base};

    &:hover {
      color: ${({ theme }) => theme.color.accentBright};
      text-decoration: underline;
    }
  }
`;

const ModalTeam = styled.div`
  font-family: ${({ theme }) => theme.fontFamily.body};
  font-size: ${({ theme }) => theme.fontSize.body};
  line-height: 1.6;
  color: ${({ theme }) => theme.color.textMuted};
  margin-bottom: ${({ theme }) => theme.space[6]};

  strong {
    color: ${({ theme }) => theme.color.text};
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
  }
`;

const PrizesLabel = styled.div`
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.accent};
`;

const PrizesList = styled.ul`
  list-style: none;
  margin-top: ${({ theme }) => theme.space[3]};

  li {
    padding: ${({ theme }) => theme.space[2]} 0;
    border-top: 1px solid ${({ theme }) => theme.color.border};
    font-family: ${({ theme }) => theme.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSize.body};
    color: ${({ theme }) => theme.color.textMuted};
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
    devs: "Joey, Mugdha, Garv, Aditya",
    prize: null,
    prizes: null,
  },
  {
    id: 13,
    date: "Eigen Games 25'",
    project: "EasyOrder",
    link: "https://devfolio.co/projects/easyorder-722b",
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

  const handleBlockClick = (hackathon) => {
    setSelectedHackathon(hackathon);
  };

  const closeModal = () => {
    setSelectedHackathon(null);
  };

  // Escape closes the modal, and the body stops scrolling behind it.
  useEffect(() => {
    if (!selectedHackathon) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedHackathon(null);
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedHackathon]);

  return (
    <Section $divided={false}>
      <GridBackdrop />
      <Container $wide>
        <Head>
          <BackButton to="/">Back</BackButton>
          <Eyebrow>Where we build</Eyebrow>
          <Title>
            Hackathon <span>Highlights</span>
          </Title>
          <Lead>
            Boiler Blockchain members participate in leading Web3 hackathons around the world, building innovative projects and winning recognition
          </Lead>
        </Head>

        <StatsContainer>
          <StatCard>
            <StatNumber>{totalHackathons}</StatNumber>
            <StatTitle>Hackathons</StatTitle>
          </StatCard>

          <StatCard>
            <StatNumber>{totalProjects}</StatNumber>
            <StatTitle>Projects Built</StatTitle>
          </StatCard>

          <StatCard>
            <StatNumber>{totalPrizes}</StatNumber>
            <StatTitle>Prizes Won</StatTitle>
          </StatCard>
        </StatsContainer>

        <BlockGrid>
          {sortedHackathonData.map((block, index) => (
            <BlockCard
              key={block.id}
              type="button"
              $blockNumber={block.displayBlockNumber}
              onClick={() => handleBlockClick(block)}
              aria-label={`${block.project} — ${block.date}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.4,
                delay: Math.min(index, 6) * 0.05,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
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
                      Winner
                    </PrizeTag>
                  ) : (
                    <div></div>
                  )}

                  <ViewButton>
                    <ExternalLink size={14} /> View
                  </ViewButton>
                </BlockFooter>
              </BlockContent>
            </BlockCard>
          ))}
        </BlockGrid>

        <AnimatePresence>
          {selectedHackathon && (
            <ExpandedModal
              role="dialog"
              aria-modal="true"
              aria-label={`Block ${selectedHackathon.displayBlockNumber} details`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              /* Only a click that starts and ends on the backdrop itself
                 closes: dragging a text selection out of the panel used to
                 dismiss it. */
              onClick={(event) => {
                if (event.target === event.currentTarget) closeModal();
              }}
            >
              <ModalContent
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              >
                <CloseButton onClick={closeModal} aria-label="Close">×</CloseButton>
                <ModalTitle>Block #{selectedHackathon.displayBlockNumber} - {selectedHackathon.date}</ModalTitle>
                <ModalHash title={selectedHackathon.hash}>{selectedHackathon.hash}</ModalHash>

                <ModalProjectName>
                  <a href={selectedHackathon.link} target="_blank" rel="noopener noreferrer">
                    {selectedHackathon.project} <ExternalLink size={18} />
                  </a>
                </ModalProjectName>

                <ModalTeam>
                  <strong>Team:</strong> {selectedHackathon.devs}
                </ModalTeam>

                {selectedHackathon.prizes ? (
                  <>
                    <PrizesLabel>Prizes:</PrizesLabel>
                    <PrizesList>
                      {selectedHackathon.prizes.map((prize, i) => (
                        <li key={i}>
                          {prize}
                        </li>
                      ))}
                    </PrizesList>
                  </>
                ) : selectedHackathon.prize && selectedHackathon.prize !== "" ? (
                  <>
                    <PrizesLabel>Prize:</PrizesLabel>
                    <PrizesList>
                      <li>
                        {selectedHackathon.prize}
                      </li>
                    </PrizesList>
                  </>
                ) : null}
              </ModalContent>
            </ExpandedModal>
          )}
        </AnimatePresence>
      </Container>
    </Section>
  );
};

export default HackathonsPage;
