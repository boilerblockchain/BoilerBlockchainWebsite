import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FaLinkedin } from 'react-icons/fa';
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
  max-width: 1400px;
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
  letter-spacing: 2px;

  span {
    color: #7120b0;
  }

  @media (max-width: 40em) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: ${props => props.theme.fontlg};
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  max-width: 800px;
  margin: 0 auto 3rem;
  line-height: 1.6;
`;

const FilterNav = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const FilterButton = styled(motion.button)`
  padding: 0.8rem 1.8rem;
  background: ${props => props.active ? '#7120b0' : 'transparent'};
  border: 1px solid ${props => props.active ? '#7120b0' : 'rgba(255, 255, 255, 0.25)'};
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 4px;
  font-family: 'Tomorrow', sans-serif;
  box-shadow: ${props => props.active ? '0 2px 10px rgba(113, 32, 176, 0.4)' : 'none'};

  &:hover {
    background: ${props => props.active ? '#8d2dd4' : 'rgba(113, 32, 176, 0.15)'};
    border-color: ${props => props.active ? '#8d2dd4' : '#7120b0'};
    box-shadow: ${props => props.active ? '0 4px 15px rgba(113, 32, 176, 0.5)' : '0 2px 8px rgba(113, 32, 176, 0.2)'};
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 0.65rem 1.2rem;
    font-size: 0.75rem;
    letter-spacing: 1px;
  }
`;

const TeamRow = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin: 3rem 0;

  @media (max-width: 1200px) {
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const MemberCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 220px;
  position: relative;

  @media (max-width: 768px) {
    width: 180px;
  }

  @media (max-width: 480px) {
    width: 160px;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background: linear-gradient(135deg, #3d1557 0%, #5a1f7a 50%, #7120b0 100%);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  margin-bottom: 1rem;
  box-shadow: 0 6px 25px rgba(113, 32, 176, 0.4);
  transition: all 0.3s ease;

  ${MemberCard}:hover & {
    transform: translateY(-4px);
    box-shadow: 0 10px 35px rgba(113, 32, 176, 0.6);
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
    background: linear-gradient(135deg, rgba(61, 21, 87, 0.9) 0%, rgba(90, 31, 122, 0.9) 50%, rgba(113, 32, 176, 0.9) 100%);
    z-index: 0;
  }
`;

const PlaceholderIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.2);

  &::before {
    content: '👤';
    font-size: 2.5rem;
    opacity: 0.6;
  }
`;

const LinkedInIcon = styled(motion.a)`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0077b5;
  text-decoration: none;
  z-index: 3;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);

  &:hover {
    background: #ffffff;
    transform: scale(1.1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.35);
  }

  svg {
    font-size: 1.2rem;
  }
`;

const RoleLabel = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #7120b0 0%, #8d2dd4 100%);
  padding: 0.7rem 0.8rem;
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
  z-index: 2;
  box-shadow: 0 -3px 15px rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const MemberName = styled.h3`
  font-size: 1.1rem;
  color: #ffffff;
  font-weight: 500;
  text-align: center;
  margin-top: 0.5rem;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    font-size: 1rem;
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
        linkedin: "#"
      }
    },
    {
      id: 2,
      name: "Team Member",
      role: "ROLE",
      image: null,
      category: "executive",
      socials: {
        linkedin: "#"
      }
    },
    {
      id: 3,
      name: "Team Member",
      role: "ROLE",
      image: null,
      category: "developer",
      socials: {
        linkedin: "#"
      }
    },
    {
      id: 4,
      name: "Team Member",
      role: "ROLE",
      image: null,
      category: "developer",
      socials: {
        linkedin: "#"
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
        linkedin: "#"
      }
    },
    {
      id: 2,
      name: "Team Member",
      role: "ROLE",
      image: null,
      category: "executive",
      socials: {
        linkedin: "#"
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
        linkedin: "#"
      }
    },
    {
      id: 4,
      name: "Team Member",
      role: "ROLE",
      image: null,
      category: "developer",
      socials: {
        linkedin: "#"
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
        linkedin: "#"
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
        linkedin: "#"
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
              opacity: 0.2,
              width: 1,
            },
            move: { enable: true, speed: 0.5 },
            number: { value: 40 },
            opacity: { value: 0.15 },
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
                links: { opacity: 0.2 }
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

        <TeamRow
          key={activeFilter}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {displayedMembers.map((member, index) => (
            <MemberCard
              key={member.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <ImageContainer>
                {member.image ? (
                  <img src={member.image} alt={member.name} />
                ) : null}
                {!member.image && <PlaceholderIcon />}
                {member.socials.linkedin && member.socials.linkedin !== "#" && (
                  <LinkedInIcon
                    href={member.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaLinkedin />
                  </LinkedInIcon>
                )}
                <RoleLabel>{member.role}</RoleLabel>
              </ImageContainer>
              <MemberName>{member.name}</MemberName>
            </MemberCard>
          ))}
        </TeamRow>
      </Container>
    </PageSection>
  );
};

export default PeopleTeam;
