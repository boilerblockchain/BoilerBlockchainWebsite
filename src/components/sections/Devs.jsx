import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaGithub, FaDiscord, FaLinkedin, FaTwitter, FaTelegram, FaInstagram, FaGlobe } from 'react-icons/fa';
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

// Import images
import ethan from "../../assets/images/18_Ethan_Haeberle.jpg";
import soham from "../../assets/images/16_Soham_Jog.jpg";
import adithya from "../../assets/images/17_Adithya_Ganesh.jpg";
import vincent from "../../assets/images/19_Vincent_Palmerio.jpg";
import eli from "../../assets/images/20_Eli_Dubizh.jpeg";
import pradyumm from "../../assets/images/21_Pradyumn_Malik.jpg";
import albert from "../../assets/images/22_Albert_Wu.jpg";
import aditya from "../../assets/images/23_Aditya_Kattil.jpeg";
import mahi from "../../assets/images/24_Mahi_Tripathi.jpg";

// Animation variants
const fadeInUp = {
  initial: {
    y: 60,
    opacity: 0
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Style components
const PageSection = styled.section`
  min-height: 100vh;
  width: 100%;
  background-color: #000000;
  position: relative;
  overflow: hidden;
  padding-top: 4rem;
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

const Container = styled(motion.div)`
  width: 85%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 0;
  position: relative;
  z-index: 2;
  
  @media (max-width: 70em) {
    width: 90%;
  }
`;

const Title = styled(motion.h1)`
  font-size: 6rem; 
  color: #ffffff;
  text-align: center;
  margin-bottom: 0.5rem;
  margin-top: 1.5rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: 'Tomorrow', sans-serif; 

  @media (max-width: 40em) {
    font-size: 4rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: ${props => props.theme.fontxl};
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  max-width: 800px;
  margin: 0 auto 4rem auto;
  font-family: 'Tomorrow', sans-serif;
  line-height: 1.6;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  color: #ffffff;
  margin: 3rem 0 2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
  text-align: center;

  span {
    color: #7120b0;
  }
`;

const CardGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
`;

const Card = styled(motion.div)`
  background: rgba(15, 15, 15, 0.7);
  border: 1px solid #7120b0;
  border-radius: 8px;
  padding: 2rem;
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 20px rgba(113, 32, 176, 0.15);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 30px rgba(113, 32, 176, 0.3);
    transform: translateY(-5px);
  }
`;

const ProfileImage = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 3px solid #7120b0;
  overflow: hidden;
  margin-bottom: 1.5rem;
  position: relative;
  box-shadow: 0 4px 10px rgba(113, 32, 176, 0.3);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &:hover img {
    transform: scale(1.1);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(0deg, rgba(113, 32, 176, 0.2), transparent);
    pointer-events: none;
  }
`;

const Name = styled(motion.h3)`
  font-size: 1.5rem;
  color: #ffffff;
  margin: 0.5rem 0;
  font-weight: 700;
  text-align: center;
`;

const Role = styled(motion.h4)`
  font-size: 1rem;
  color: #7120b0;
  margin: 0.3rem 0 1rem;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Bio = styled(motion.p)`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin: 0 0 1.5rem;
  line-height: 1.6;
`;

const SocialIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: auto;

  a {
    color: #ffffff;
    background: rgba(113, 32, 176, 0.2);
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 1rem;
    transition: all 0.3s ease;
    border: 1px solid rgba(113, 32, 176, 0.3);

    &:hover {
      background: #7120b0;
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(113, 32, 176, 0.4);
    }
  }
`;

// Team data
const boardMembers = [
  {
    id: 1,
    name: "Ethan Haeberle",
    role: "Co-president",
    bio: "Leading Boiler Blockchain's strategy and vision, Ethan focuses on ecosystem growth and partnership development.",
    image: ethan,
    socials: {
      linkedin: "https://www.linkedin.com/in/ethan-haeberle-a127b1203/",
      twitter: "https://x.com/EthanHaeberle",
      github: "https://github.com/EthanHaeberle",
      telegram: "https://t.me/HaeberleEthan",
      instagram: "https://www.instagram.com/ethan_haeberle/",
      website: "https://github.com/EthanHaeberle"
    }
  },
  {
    id: 2,
    name: "Soham Jog",
    role: "Co-president",
    bio: "Technical lead focused on blockchain integration and Web3 product development across the organization.",
    image: soham,
    socials: {
      linkedin: "https://www.linkedin.com/in/soham-jog-ba4b62237/",
      twitter: "#",
      github: "https://github.com/SohamJog",
      telegram: "https://t.me/sohamJog",
      instagram: "#",
      website: "https://www.sohamjog.com"
    }
  },
  {
    id: 3,
    name: "Adithya Ganesh",
    role: "Head of Strategy",
    bio: "Overseeing strategic initiatives and future planning for the organization's growth and impact.",
    image: adithya,
    socials: {
      linkedin: "https://www.linkedin.com/in/adithya-ganesh-68906023b/",
      twitter: "#",
      github: "#",
      telegram: "https://t.me/AdithyaGanesh03",
      instagram: "#",
      website: "#"
    }
  },
  {
    id: 4,
    name: "Vincent Palmerio",
    role: "Head of Development",
    bio: "Leading the technical development team and overseeing all engineering initiatives and projects.",
    image: vincent,
    socials: {
      linkedin: "https://www.linkedin.com/in/vpalmerio/",
      twitter: "https://x.com/vincentpalmerio",
      github: "https://github.com/vpalmerio",
      telegram: "https://t.me/vpalmerio",
      instagram: "#",
      website: "#"
    }
  },
  {
    id: 5,
    name: "Mahi Tripathi",
    role: "Head of Marketing",
    bio: "Leading the marketing team and overseeing all brand, growth, and campaign initiatives across channels.",
    image: mahi,
    socials: {
      linkedin: "www.linkedin.com/in/mahi-tripathi",
      twitter: "#",
      github: "#",
      telegram: "https://t.me/mahiiluv",
      instagram: "https://www.instagram.com/art_by_mahi/",
      website: "#"
    }
  },
  {
    id: 6,
    name: "Eli Dubizh",
    role: "Head of Research",
    bio: "Spearheading research initiatives focused on blockchain innovations and investment opportunities.",
    image: eli,
    socials: {
      linkedin: "https://www.linkedin.com/in/eli-dubizh/",
      twitter: "https://x.com/EliDubizh",
      github: "#",
      telegram: "https://t.me/eli_dubizh",
      instagram: "https://www.instagram.com/eli_dubizh/",
      website: "https://mahitripathi.myportfolio.com/"
    }
  },
  {
    id: 7,
    name: "Pradyumm Malik",
    role: "Lead Governance Delegate",
    bio: "Representing Boiler Blockchain in governance decisions for various blockchain protocols and DAOs.",
    image: pradyumm,
    socials: {
      linkedin: "https://www.linkedin.com/in/pradyumn-malik/",
      twitter: "#",
      github: "#",
      telegram: "#",
      instagram: "#",
      website: "#"
    }
  },
  {
    id: 8,
    name: "Albert Wu",
    role: "Lead Governance Delegate",
    bio: "Managing protocol governance participation and representing the organization in ecosystem discussions.",
    image: albert,
    socials: {
      linkedin: "https://www.linkedin.com/in/ajxwu/",
      twitter: "#",
      github: "#",
      telegram: "https://t.me/ajxwu",
      instagram: "#",
      website: "#"
    }
  },
  {
    id: 9,
    name: "Aditya Kuniyil Kattil",
    role: "Course Instructor",
    bio: "Leading blockchain education initiatives and developing technical curriculum for members and students.",
    image: aditya,
    socials: {
      linkedin: "https://www.linkedin.com/in/aditya-kuniyil-kattil/",
      twitter: "https://x.com/iamadityakk?s=21&t=Aw27j3VM8u8ewB9mb4Ga-w",
      github: "https://github.com/Akk525",
      telegram: "https://t.me/adityakk525",
      instagram: "#",
      website: "https://adityakk.com"
    }
  }
];

const memberExamples = [
  {
    id: 9,
    name: "Joey",
    role: "Developer",
    bio: "ELI",
    image: eli, // Using an existing image as placeholder
    socials: {
      linkedin: "#",
      twitter: "#",
      github: "#",
      discord: "#"
    }
  },
  {
    id: 10,
    name: "ELI",
    role: "ELI",
    bio: "ELI",
    image: eli, // Using an existing image as placeholder
    socials: {
      linkedin: "#",
      twitter: "#",
      github: "#",
      discord: "#"
    }
  },
  {
    id: 11,
    name: "ELI",
    role: "ELI",
    bio: "ELI",
    image: eli, // Using an existing image as placeholder
    socials: {
      linkedin: "#",
      twitter: "#",
      github: "#",
      discord: "#"
    }
  }
];

const TeamPage = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

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
            size: { value: 2 },
            opacity: { value: 0.3 },
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
    
      <Container
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <Title
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          The <span style={{ color: "#7120b0" }}>Team</span>
        </Title>
        <Subtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Meet the innovative minds behind Boiler Blockchain - passionate technologists and leaders driving Web3 adoption at Purdue
        </Subtitle>
      
        <SectionTitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Executive <span>Board</span>
        </SectionTitle>
        
        <CardGrid
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {boardMembers.map((member, index) => (
            <Card
              key={member.id}
              variants={fadeInUp}
              custom={index}
              initial="initial"
              animate="animate"
              whileHover={{ y: -5 }}
            >
              <ProfileImage>
                <img src={member.image} alt={member.name} />
              </ProfileImage>
              <Name>{member.name}</Name>
              <Role>{member.role}</Role>
              <Bio>{member.bio}</Bio>
              <SocialIcons>
                {member.socials.linkedin && member.socials.linkedin !== "#" && (
                  <motion.a 
                    href={member.socials.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    whileHover={{ y: -3 }}
                  >
                    <FaLinkedin />
                  </motion.a>
                )}
                {member.socials.twitter && member.socials.twitter !== "#" && (
                  <motion.a 
                    href={member.socials.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    whileHover={{ y: -3 }}
                  >
                    <FaTwitter />
                  </motion.a>
                )}
                {member.socials.github && member.socials.github !== "#" && (
                  <motion.a 
                    href={member.socials.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    whileHover={{ y: -3 }}
                  >
                    <FaGithub />
                  </motion.a>
                )}
                {member.socials.telegram && member.socials.telegram !== "#" && (
                  <motion.a 
                    href={member.socials.telegram} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    whileHover={{ y: -3 }}
                  >
                    <FaTelegram />
                  </motion.a>
                )}
                {member.socials.instagram && member.socials.instagram !== "#" && (
                  <motion.a 
                    href={member.socials.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    whileHover={{ y: -3 }}
                  >
                    <FaInstagram />
                  </motion.a>
                )}
                {member.socials.website && member.socials.website !== "#" && (
                  <motion.a 
                    href={member.socials.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    whileHover={{ y: -3 }}
                  >
                    <FaGlobe />
                  </motion.a>
                )}
              </SocialIcons>
            </Card>
          ))}
        </CardGrid>
        
        {/* <SectionTitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Active <span>Members</span>
        </SectionTitle> */}
        
        {/* <CardGrid
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {memberExamples.map((member, index) => (
            <Card
              key={member.id}
              variants={fadeInUp}
              custom={index}
              initial="initial"
              animate="animate"
              whileHover={{ y: -5 }}
            >
              <ProfileImage>
                <img src={member.image} alt={member.name} />
              </ProfileImage>
              <Name>{member.name}</Name>
              <Role>{member.role}</Role>
              <Bio>{member.bio}</Bio>
              <SocialIcons>
                <motion.a href={member.socials.linkedin} whileHover={{ y: -3 }}>
                  <FaLinkedin />
                </motion.a>
                <motion.a href={member.socials.twitter} whileHover={{ y: -3 }}>
                  <FaTwitter />
                </motion.a>
                <motion.a href={member.socials.github} whileHover={{ y: -3 }}>
                  <FaGithub />
                </motion.a>
                <motion.a href={member.socials.discord} whileHover={{ y: -3 }}>
                  <FaDiscord />
                </motion.a>
              </SocialIcons>
            </Card>
          ))}
        </CardGrid> */}
      </Container>
    </PageSection>
  );
};

export default TeamPage;
