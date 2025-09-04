import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FaGithub, FaDiscord, FaLinkedin, FaTwitter, FaTelegram, FaInstagram, FaGlobe } from 'react-icons/fa';
import Navigation from '../Navigation';

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
`;

const TeamGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 3rem 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MemberCard = styled(motion.div)`
  background: rgba(15, 15, 15, 0.6);
  border: 1px solid rgba(113, 32, 176, 0.3);
  border-radius: 8px;
  padding: 1.8rem;
  backdrop-filter: blur(5px);
  box-shadow: 0 2px 10px rgba(113, 32, 176, 0.1);
  transition: all 0.3s ease;
  text-align: center;
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

const ProfileImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 1.5rem;
  border: 3px solid rgba(113, 32, 176, 0.5);
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
`;

const Name = styled.h3`
  font-size: 1.4rem;
  color: #ffffff;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const Role = styled.p`
  font-size: 1rem;
  color: #7120b0;
  margin-bottom: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Bio = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

const SocialIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 35px;
    height: 35px;
    background: rgba(113, 32, 176, 0.2);
    border: 1px solid rgba(113, 32, 176, 0.4);
    border-radius: 50%;
    color: #7120b0;
    font-size: 0.9rem;
    text-decoration: none;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(113, 32, 176, 0.3);
      border-color: rgba(113, 32, 176, 1);
      color: #bb20ff;
      transform: translateY(-2px);
    }
  }
`;

// Team member data
const boardMembers = [
  {
    id: 1,
    name: "Ethan Haeberle",
    role: "President",
    bio: "Computer Science student passionate about blockchain development and cryptocurrency trading. Leading Boiler Blockchain's mission to educate and innovate.",
    image: ethan,
    socials: {
      linkedin: "https://linkedin.com/in/ethanhaeberle",
      twitter: "https://twitter.com/ethanhaeberle",
      github: "https://github.com/ethanhaeberle",
      discord: "#",
      telegram: "#",
      instagram: "#",
      website: "#"
    }
  },
  {
    id: 2,
    name: "Soham Jog",
    role: "Vice President",
    bio: "Data Science major with expertise in machine learning and blockchain analytics. Focused on building the future of decentralized data systems.",
    image: soham,
    socials: {
      linkedin: "https://linkedin.com/in/sohamjog",
      twitter: "#",
      github: "https://github.com/sohamjog",
      discord: "#",
      telegram: "#",
      instagram: "#",
      website: "#"
    }
  },
  {
    id: 3,
    name: "Adithya Ganesh",
    role: "Treasurer",
    bio: "Finance and Computer Science double major specializing in DeFi protocols and smart contract development. Managing our financial strategy.",
    image: adithya,
    socials: {
      linkedin: "https://linkedin.com/in/adithyaganesh",
      twitter: "#",
      github: "https://github.com/adithyaganesh",
      discord: "#",
      telegram: "#",
      instagram: "#",
      website: "#"
    }
  },
  {
    id: 4,
    name: "Vincent Palmerio",
    role: "Secretary",
    bio: "Computer Engineering student with a focus on cryptocurrency mining and hardware optimization. Documenting our journey and achievements.",
    image: vincent,
    socials: {
      linkedin: "https://linkedin.com/in/vincentpalmerio",
      twitter: "#",
      github: "https://github.com/vincentpalmerio",
      discord: "#",
      telegram: "#",
      instagram: "#",
      website: "#"
    }
  },
  {
    id: 5,
    name: "Eli Dubizh",
    role: "Technical Lead",
    bio: "Experienced blockchain developer and smart contract auditor. Leading our technical initiatives and development projects.",
    image: eli,
    socials: {
      linkedin: "https://linkedin.com/in/elidubizh",
      twitter: "#",
      github: "https://github.com/elidubizh",
      discord: "#",
      telegram: "#",
      instagram: "#",
      website: "#"
    }
  },
  {
    id: 6,
    name: "Pradyumn Malik",
    role: "Research Director",
    bio: "PhD candidate in Computer Science researching consensus mechanisms and scalability solutions for blockchain networks.",
    image: pradyumm,
    socials: {
      linkedin: "https://linkedin.com/in/pradyumnmalik",
      twitter: "#",
      github: "https://github.com/pradyumnmalik",
      discord: "#",
      telegram: "#",
      instagram: "#",
      website: "#"
    }
  },
  {
    id: 7,
    name: "Albert Wu",
    role: "Marketing Lead",
    bio: "Marketing and Communications major driving brand awareness and community engagement for Boiler Blockchain.",
    image: albert,
    socials: {
      linkedin: "https://linkedin.com/in/albertwu",
      twitter: "#",
      github: "#",
      discord: "#",
      telegram: "#",
      instagram: "#",
      website: "#"
    }
  },
  {
    id: 8,
    name: "Aditya Kattil",
    role: "Developer",
    bio: "Full-stack developer specializing in Web3 applications and DApp development. Building the next generation of decentralized applications.",
    image: aditya,
    socials: {
      linkedin: "https://linkedin.com/in/adityakattil",
      twitter: "#",
      github: "https://github.com/adityakattil",
      discord: "#",
      telegram: "#",
      instagram: "#",
      website: "https://adityakk.com"
    }
  },
  {
    id: 9,
    name: "Mahi Tripathi",
    role: "Developer",
    bio: "Software engineering student passionate about blockchain scalability and Layer 2 solutions. Contributing to our development efforts.",
    image: mahi,
    socials: {
      linkedin: "https://linkedin.com/in/mahitripathi",
      twitter: "#",
      github: "https://github.com/mahitripathi",
      discord: "#",
      telegram: "#",
      instagram: "#",
      website: "#"
    }
  }
];

const PeopleTeam = () => {
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
          Our <span>Team</span>
        </Title>

        <Subtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Meet the passionate individuals who lead and drive innovation at Boiler Blockchain
        </Subtitle>

        <TeamGrid
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {boardMembers.map((member, index) => (
            <MemberCard
              key={member.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              whileHover={{ y: -2 }}
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
                    whileHover={{ y: -2 }}
                  >
                    <FaLinkedin />
                  </motion.a>
                )}
                {member.socials.twitter && member.socials.twitter !== "#" && (
                  <motion.a 
                    href={member.socials.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    whileHover={{ y: -2 }}
                  >
                    <FaTwitter />
                  </motion.a>
                )}
                {member.socials.github && member.socials.github !== "#" && (
                  <motion.a 
                    href={member.socials.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    whileHover={{ y: -2 }}
                  >
                    <FaGithub />
                  </motion.a>
                )}
                {member.socials.telegram && member.socials.telegram !== "#" && (
                  <motion.a 
                    href={member.socials.telegram} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    whileHover={{ y: -2 }}
                  >
                    <FaTelegram />
                  </motion.a>
                )}
                {member.socials.instagram && member.socials.instagram !== "#" && (
                  <motion.a 
                    href={member.socials.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    whileHover={{ y: -2 }}
                  >
                    <FaInstagram />
                  </motion.a>
                )}
                {member.socials.website && member.socials.website !== "#" && (
                  <motion.a 
                    href={member.socials.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    whileHover={{ y: -2 }}
                  >
                    <FaGlobe />
                  </motion.a>
                )}
                {member.socials.discord && member.socials.discord !== "#" && (
                  <motion.a 
                    href={member.socials.discord} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    whileHover={{ y: -2 }}
                  >
                    <FaDiscord />
                  </motion.a>
                )}
              </SocialIcons>
            </MemberCard>
          ))}
        </TeamGrid>
      </Container>
    </PageSection>
  );
};

export default PeopleTeam;