import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FaLinkedin, FaTwitter } from 'react-icons/fa';
import Navigation from '../Navigation';
import Footer from '../Footer';

const PageSection = styled.section`
  min-height: 100vh;
  width: 100%;
  background-color: #000000;
  position: relative;
  overflow: hidden;
  padding: 8rem 0 0;
  font-family: 'Tomorrow', sans-serif;
  display: flex;
  flex-direction: column;
  
  * {
    font-family: 'Tomorrow', sans-serif;
  }
`;

const Container = styled.div`
  width: 90%;
  max-width: 1400px;
  margin: 8rem auto 0;
  position: relative;
  z-index: 2;
  
  @media (max-width: 70em) {
    width: 95%;
    margin: 6rem auto 0;
  }

  @media (max-width: 768px) {
    width: 95%;
    margin: 4rem auto 0;
    padding: 0 1rem;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 0 0.75rem;
    margin: 3rem auto 0;
  }
`;

const Title = styled(motion.h1)`
  font-size: 4rem; 
  color: #ffffff;
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 3px;
  line-height: 1.2;

  span {
    color: #7120b0;
    background: linear-gradient(135deg, #7120b0 0%, #bb20ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 40em) {
    font-size: 2.8rem;
    letter-spacing: 2px;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.15rem;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
  max-width: 850px;
  margin: 0 auto 5rem;
  line-height: 1.7;
  font-weight: 400;
  letter-spacing: 0.3px;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 4rem;
  }
`;

const FilterNav = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 5rem;
  flex-wrap: wrap;
  padding: 0.5rem;
  background: rgba(15, 15, 15, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: fit-content;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    gap: 0.4rem;
    padding: 0.4rem;
    border-radius: 10px;
  }
`;

const FilterButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background: ${props => props.active ? 'linear-gradient(135deg, #7120b0 0%, #8d2dd4 100%)' : 'transparent'};
  border: none;
  color: ${props => props.active ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'};
  font-size: 0.8rem;
  font-weight: ${props => props.active ? '600' : '500'};
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  font-family: 'Tomorrow', sans-serif;
  position: relative;
  white-space: nowrap;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 8px;
    padding: 1px;
    background: ${props => props.active ? 'linear-gradient(135deg, #7120b0, #8d2dd4)' : 'transparent'};
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    color: #ffffff;
    background: ${props => props.active ? 'linear-gradient(135deg, #8d2dd4 0%, #a040e8 100%)' : 'rgba(113, 32, 176, 0.15)'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.7rem;
    letter-spacing: 0.8px;
  }
`;

const TeamRow = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 2.5rem;
  flex-wrap: wrap;
  margin: 6rem 0;
  min-height: 400px;

  @media (max-width: 1200px) {
    gap: 2rem;
  }

  @media (max-width: 768px) {
    gap: 1.5rem;
    margin: 3rem 0;
  }
`;

const MemberCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 240px;
  position: relative;

  @media (max-width: 768px) {
    width: 200px;
  }

  @media (max-width: 480px) {
    width: 180px;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background: linear-gradient(135deg, #2a0f3d 0%, #3d1557 50%, #5a1f7a 100%);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  margin-bottom: 1.25rem;
  box-shadow: 0 8px 30px rgba(113, 32, 176, 0.3), 0 0 0 1px rgba(113, 32, 176, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid rgba(113, 32, 176, 0.2);

  ${MemberCard}:hover & {
    transform: translateY(-8px);
    box-shadow: 0 16px 50px rgba(113, 32, 176, 0.6), 0 0 0 1px rgba(113, 32, 176, 0.3);
    border-color: rgba(113, 32, 176, 0.5);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    z-index: 1;
    position: relative;
  }

  /* Placeholder background for missing images */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(42, 15, 61, 0.95) 0%, rgba(61, 21, 87, 0.95) 50%, rgba(90, 31, 122, 0.95) 100%);
    z-index: 0;
  }
`;

const PlaceholderIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90px;
  height: 90px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);

  &::before {
    content: '👤';
    font-size: 2.8rem;
    opacity: 0.5;
  }
`;

const SocialIconsContainer = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 8px;
  z-index: 3;
`;

const SocialIcon = styled(motion.a)`
  width: 38px;
  height: 38px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.type === 'linkedin' ? '#0077b5' : '#000000'};
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  &:hover {
    background: #ffffff;
    transform: translateY(-3px) scale(1.08);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(-1px) scale(1.05);
  }

  svg {
    font-size: 1.1rem;
  }
`;

const RoleLabel = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #7120b0 0%, #8d2dd4 100%);
  padding: 0.75rem 0.9rem;
  color: #ffffff;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  text-align: center;
  z-index: 2;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.4);
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

const MemberName = styled.h3`
  font-size: 1.15rem;
  color: #ffffff;
  font-weight: 600;
  text-align: center;
  margin-top: 0.75rem;
  letter-spacing: 0.3px;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 1.05rem;
  }
`;

// Placeholder team member data
const teamMembers = {
  all: [
    {
      id: 1,
      name: "Team Member",
      role: "ROLE",
      image: null,
      category: "executive",
      socials: {
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      id: 2,
      name: "Team Member",
      role: "ROLE",
      image: null,
      category: "executive",
      socials: {
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      id: 3,
      name: "Team Member",
      role: "ROLE",
      image: null,
      category: "developer",
      socials: {
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      id: 4,
      name: "Team Member",
      role: "ROLE",
      image: null,
      category: "developer",
      socials: {
        linkedin: "#",
        twitter: "#"
      }
    }
  ],
  executive: [
    {
      id: 1,
      name: "Team Member",
      role: "ROLE",
      image: null,
      category: "executive",
      socials: {
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      id: 2,
      name: "Team Member",
      role: "ROLE",
      image: null,
      category: "executive",
      socials: {
        linkedin: "#",
        twitter: "#"
      }
    }
  ],
  developer: [
    {
      id: 3,
      name: "Team Member",
      role: "ROLE",
      image: null,
      category: "developer",
      socials: {
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      id: 4,
      name: "Team Member",
      role: "ROLE",
      image: null,
      category: "developer",
      socials: {
        linkedin: "#",
        twitter: "#"
      }
    }
  ],
  research: [
    {
      id: 5,
      name: "Team Member",
      role: "ROLE",
      image: null,
      category: "research",
      socials: {
        linkedin: "#",
        twitter: "#"
      }
    }
  ],
  operations: [
    {
      id: 6,
      name: "Team Member",
      role: "ROLE",
      image: null,
      category: "operations",
      socials: {
        linkedin: "#",
        twitter: "#"
      }
    }
  ]
};

const PeopleTeam = () => {
  const [particleKey, setParticleKey] = useState(Date.now());
  const [activeFilter, setActiveFilter] = useState('all');

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  useEffect(() => {
    setParticleKey(Date.now());
  }, []);

  const filters = [
    { id: 'all', label: 'ALL' },
    { id: 'executive', label: 'EXECUTIVE BOARD' },
    { id: 'developer', label: 'DEVELOPER TEAM' },
    { id: 'research', label: 'RESEARCH TEAM' },
    { id: 'operations', label: 'OPERATIONS TEAM' }
  ];

  const displayedMembers = teamMembers[activeFilter] || teamMembers.all;

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
          OUR <span>TEAM</span>
        </Title>

        <Subtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Meet the passionate individuals who lead and drive innovation at Boiler Blockchain
        </Subtitle>

        <FilterNav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {filters.map((filter) => (
            <FilterButton
              key={filter.id}
              active={activeFilter === filter.id}
              onClick={() => setActiveFilter(filter.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filter.label}
            </FilterButton>
          ))}
        </FilterNav>

        <AnimatePresence mode="wait">
          <TeamRow
            key={activeFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            {displayedMembers.map((member, index) => (
              <MemberCard
                key={member.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.08,
                  ease: [0.4, 0, 0.2, 1]
                }}
                whileHover={{ y: -6, scale: 1.02 }}
              >
                <ImageContainer>
                  {member.image ? (
                    <img src={member.image} alt={member.name} />
                  ) : null}
                  {!member.image && <PlaceholderIcon />}
                  <SocialIconsContainer>
                    {member.socials.linkedin && member.socials.linkedin !== "#" && (
                      <SocialIcon
                        type="linkedin"
                        href={member.socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaLinkedin />
                      </SocialIcon>
                    )}
                    {member.socials.twitter && member.socials.twitter !== "#" && (
                      <SocialIcon
                        type="twitter"
                        href={member.socials.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaTwitter />
                      </SocialIcon>
                    )}
                  </SocialIconsContainer>
                  <RoleLabel>{member.role}</RoleLabel>
                </ImageContainer>
                <MemberName>{member.name}</MemberName>
              </MemberCard>
            ))}
          </TeamRow>
        </AnimatePresence>
      </Container>
      <Footer />
    </PageSection>
  );
};

export default PeopleTeam;
