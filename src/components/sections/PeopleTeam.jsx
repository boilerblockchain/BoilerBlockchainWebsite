import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FaLinkedin, FaTwitter } from 'react-icons/fa';
import Navigation from '../Navigation';
import Footer from '../Footer';

// Executive Board
import eliImage from '../../assets/images/pfps/exec/eli_dubizh.jpg';
import joeyImage from '../../assets/images/pfps/exec/joey_kokinda.jpg';
import mahiImage from '../../assets/images/pfps/exec/mahi_tripathi.jpg';
import neenaImage from '../../assets/images/pfps/exec/neena_naikar.jpg';


// Developer Team
import ansonImage from '../../assets/images/pfps/dev/anson_lam.JPG';
import anubhutiImage from '../../assets/images/pfps/dev/anubhuti_mittal.jpg';
import aryanSinghalImage from '../../assets/images/pfps/dev/aryan_singhal.png';
import christopherImage from '../../assets/images/pfps/dev/christopher_herzog.jpg';
import danielImage from '../../assets/images/pfps/dev/daniel_gong.png';
import jazibImage from '../../assets/images/pfps/dev/jazib_qureshi.jpg';
import matthewImage from '../../assets/images/pfps/dev/matthew_iskandar.png';

// Research Team
import aryanPatelImage from '../../assets/images/pfps/res/aryan_patel.png';
import divyanshImage from '../../assets/images/pfps/res/divyansh_pramanick.jpg';
import ishaanImage from '../../assets/images/pfps/res/ishaan_saxena.png';
import jacobImage from '../../assets/images/pfps/res/jacob_gutwein.jpeg';
import muhammadImage from '../../assets/images/pfps/res/muhammad_ayaan_ameen.jpeg';
import vaibhavImage from '../../assets/images/pfps/res/vaibhav_sunkada.jpg';
import nickImage from '../../assets/images/pfps/res/nick_diaz.jpg';

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
  margin: 0 auto 0;
  padding: 120px 2rem 0;
  position: relative;
  z-index: 2;
  
  @media (max-width: 1024px) {
    width: 95%;
    padding: 110px 1.75rem 0;
  }

  @media (max-width: 768px) {
    width: 95%;
    padding: 100px 1.5rem 0;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 80px 1rem 0;
  }

  @media (max-width: 360px) {
    padding: 70px 0.75rem 0;
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
  width: 290px;
  background: rgba(15, 15, 20, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(113, 32, 176, 0.2);
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(113, 32, 176, 0.1),
    0 0 40px rgba(113, 32, 176, 0.05);
  padding: 0;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      linear-gradient(135deg, rgba(113, 32, 176, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 50% 0%, rgba(113, 32, 176, 0.05) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
    z-index: 1;
  }

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(113, 32, 176, 0.4);
    box-shadow: 
      0 8px 30px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(113, 32, 176, 0.3),
      0 0 60px rgba(113, 32, 176, 0.15);
  }

  &:hover::before {
    opacity: 1;
  }

  @media (max-width: 768px) {
    width: 260px;
  }

  @media (max-width: 480px) {
    width: 240px;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 1;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1a0f2e 0%, #2d1a3d 100%);

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 100%);
    z-index: 1;
    pointer-events: none;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 50% 25%;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  ${MemberCard}:hover img {
    transform: scale(1.03);
  }
`;

const PlaceholderIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: rgba(113, 32, 176, 0.1);
  border-radius: 50%;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(113, 32, 176, 0.2);

  &::before {
    content: '👤';
    font-size: 2.5rem;
    opacity: 0.4;
  }
`;

const ContentContainer = styled.div`
  padding: 1.5rem 1.5rem 1.75rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
`;

const MemberName = styled.h3`
  font-size: 1.25rem;
  color: #ffffff;
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.2px;
  line-height: 1.3;
  transition: color 0.3s ease;

  ${MemberCard}:hover & {
    color: #7120b0;
  }

  @media (max-width: 768px) {
    font-size: 1.15rem;
  }
`;

const MemberTitle = styled.p`
  font-size: 0.7rem;
  color: rgba(113, 32, 176, 0.7);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  margin: 0;
  line-height: 1.4;
`;

const SocialIconsContainer = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  z-index: 2;
`;

const SocialIcon = styled(motion.a)`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  opacity: 0.85;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    opacity: 1;
    color: #ffffff;
    background: rgba(113, 32, 176, 0.4);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-color: rgba(113, 32, 176, 0.5);
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 4px 12px rgba(113, 32, 176, 0.3);
  }

  svg {
    font-size: 0.9rem;
  }
`;

// Extract name from image path (e.g., "eli_dubizh.jpg" -> "eli_dubizh")
const getNameFromImage = (imagePath) => {
  if (!imagePath) return null;
  
  // Handle both string paths and imported modules
  let path = '';
  if (typeof imagePath === 'string') {
    path = imagePath;
  } else if (imagePath.default) {
    path = imagePath.default;
  } else if (typeof imagePath === 'object' && imagePath.toString) {
    path = imagePath.toString();
  } else {
    return null;
  }
  
  // Extract filename from path
  const filename = path.split('/').pop().split('\\').pop();
  
  // Remove file extension (handles both regular and webpack hashed files)
  // Pattern: name.hash.ext or name.ext -> extract "name" part
  // For hashed files like "eli_dubizh.abc123.jpg", we want "eli_dubizh"
  const withoutExt = filename.replace(/\.(jpg|jpeg|png|JPG|JPEG|PNG|gif|GIF|webp|WEBP)$/i, '');
  
  // If it contains dots (webpack hash), take the part before the first dot after the underscore pattern
  // e.g., "eli_dubizh.abc123" -> "eli_dubizh"
  if (withoutExt.includes('.')) {
    // Find the pattern "first_last" before any hash
    const underscoreIndex = withoutExt.indexOf('_');
    if (underscoreIndex !== -1) {
      // Find the next dot after the underscore (this is where the hash starts)
      const dotAfterUnderscore = withoutExt.indexOf('.', underscoreIndex);
      if (dotAfterUnderscore !== -1) {
        return withoutExt.substring(0, dotAfterUnderscore);
      }
    }
  }
  
  return withoutExt;
};

// Format name from "first_last" to "First Last"
const formatName = (name, imagePath) => {
  // If explicit name is provided, use it
  if (name) {
    return name
      .split('_')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  }
  
  // Otherwise, extract from image path
  if (imagePath) {
    const extractedName = getNameFromImage(imagePath);
    if (extractedName) {
      return extractedName
        .split('_')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ');
    }
  }
  
  return 'Team Member';
};

// Helper function to get title based on category
const getTitleByCategory = (category) => {
  const titles = {
    developer: "Developer Team",
    research: "Research Team",
    operations: "Operations Team",
    executive: "Executive Board",
  };
  return titles[category] || "Team Member";
};

// Team member data - names will be extracted from image filenames
// Organized by folder structure: exec/, dev/, res/, ops/
const teamMembers = {
  all: [
    // Executive Board
    { id: 1, image: eliImage, category: "executive", socials: { linkedin: "#", twitter: "#" } },
    { id: 2, image: joeyImage, category: "executive", socials: { linkedin: "#", twitter: "#" } },
    { id: 3, image: mahiImage, category: "executive", socials: { linkedin: "#", twitter: "#" } },
    { id: 4, image: neenaImage, category: "executive", socials: { linkedin: "#", twitter: "#" } },
    // Developer Team
    { id: 5, image: ansonImage, category: "developer", socials: { linkedin: "#", twitter: "#" } },
    { id: 6, image: anubhutiImage, category: "developer", socials: { linkedin: "#", twitter: "#" } },
    { id: 7, image: aryanSinghalImage, category: "developer", socials: { linkedin: "#", twitter: "#" } },
    { id: 8, image: christopherImage, category: "developer", socials: { linkedin: "#", twitter: "#" } },
    { id: 9, image: danielImage, category: "developer", socials: { linkedin: "#", twitter: "#" } },
    { id: 10, image: jazibImage, category: "developer", socials: { linkedin: "#", twitter: "#" } },
    { id: 11, image: matthewImage, category: "developer", socials: { linkedin: "#", twitter: "#" } },
    // Research Team
    { id: 12, image: aryanPatelImage, category: "research", socials: { linkedin: "#", twitter: "#" } },
    { id: 13, image: divyanshImage, category: "research", socials: { linkedin: "#", twitter: "#" } },
    { id: 14, image: ishaanImage, category: "research", socials: { linkedin: "#", twitter: "#" } },
    { id: 15, image: jacobImage, category: "research", socials: { linkedin: "#", twitter: "#" } },
    { id: 16, image: muhammadImage, category: "research", socials: { linkedin: "#", twitter: "#" } },
    { id: 17, image: vaibhavImage, category: "research", socials: { linkedin: "#", twitter: "#" } },
    { id: 18, image: nickImage, category: "research", socials: { linkedin: "#", twitter: "#" } }
  ],
  executive: [
    { id: 1, image: eliImage, category: "executive", socials: { linkedin: "#", twitter: "#" } },
    { id: 2, image: joeyImage, category: "executive", socials: { linkedin: "#", twitter: "#" } },
    { id: 3, image: mahiImage, category: "executive", socials: { linkedin: "#", twitter: "#" } },
    { id: 4, image: neenaImage, category: "executive", socials: { linkedin: "#", twitter: "#" } }
  ],
  developer: [
    { id: 5, image: ansonImage, category: "developer", socials: { linkedin: "#", twitter: "#" } },
    { id: 6, image: anubhutiImage, category: "developer", socials: { linkedin: "#", twitter: "#" } },
    { id: 7, image: aryanSinghalImage, category: "developer", socials: { linkedin: "#", twitter: "#" } },
    { id: 8, image: christopherImage, category: "developer", socials: { linkedin: "#", twitter: "#" } },
    { id: 9, image: danielImage, category: "developer", socials: { linkedin: "#", twitter: "#" } },
    { id: 10, image: jazibImage, category: "developer", socials: { linkedin: "#", twitter: "#" } },
    { id: 11, image: matthewImage, category: "developer", socials: { linkedin: "#", twitter: "#" } }
  ],
  research: [
    { id: 12, image: aryanPatelImage, category: "research", socials: { linkedin: "#", twitter: "#" } },
    { id: 13, image: divyanshImage, category: "research", socials: { linkedin: "#", twitter: "#" } },
    { id: 14, image: ishaanImage, category: "research", socials: { linkedin: "#", twitter: "#" } },
    { id: 15, image: jacobImage, category: "research", socials: { linkedin: "#", twitter: "#" } },
    { id: 16, image: muhammadImage, category: "research", socials: { linkedin: "#", twitter: "#" } },
    { id: 17, image: vaibhavImage, category: "research", socials: { linkedin: "#", twitter: "#" } },
    { id: 18, image: nickImage, category: "research", socials: { linkedin: "#", twitter: "#" } }
  ],
  operations: []
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
    { id: 'developer', label: 'DEVELOPER TEAM' },
    { id: 'research', label: 'RESEARCH TEAM' },
    { id: 'operations', label: 'OPERATIONS TEAM' },
    { id: 'executive', label: 'EXECUTIVE BOARD' }
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
                     <img src={member.image} alt={formatName(null, member.image)} />
                   ) : null}
                   {!member.image && <PlaceholderIcon />}
                   <SocialIconsContainer>
                     <SocialIcon
                       type="linkedin"
                       href={member.socials?.linkedin && member.socials.linkedin !== "#" ? member.socials.linkedin : "#"}
                       target={member.socials?.linkedin && member.socials.linkedin !== "#" ? "_blank" : undefined}
                       rel={member.socials?.linkedin && member.socials.linkedin !== "#" ? "noopener noreferrer" : undefined}
                       whileHover={{ scale: 1.1 }}
                       whileTap={{ scale: 0.95 }}
                     >
                       <FaLinkedin />
                     </SocialIcon>
                     <SocialIcon
                       type="twitter"
                       href={member.socials?.twitter && member.socials.twitter !== "#" ? member.socials.twitter : "#"}
                       target={member.socials?.twitter && member.socials.twitter !== "#" ? "_blank" : undefined}
                       rel={member.socials?.twitter && member.socials.twitter !== "#" ? "noopener noreferrer" : undefined}
                       whileHover={{ scale: 1.1 }}
                       whileTap={{ scale: 0.95 }}
                     >
                       <FaTwitter />
                     </SocialIcon>
                   </SocialIconsContainer>
                 </ImageContainer>
                 <ContentContainer>
                   <MemberName>{formatName(member.name, member.image)}</MemberName>
                   <MemberTitle>{member.title || getTitleByCategory(member.category)}</MemberTitle>
                 </ContentContainer>
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
