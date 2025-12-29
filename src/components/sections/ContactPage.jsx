import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FiMail, FiMessageSquare, FiMapPin, FiInstagram, FiTwitter, FiLinkedin, FiGithub } from 'react-icons/fi';
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
  width: 85%;
  max-width: 1200px;
  margin: 6rem auto 0;
  position: relative;
  z-index: 2;
  
  @media (max-width: 70em) {
    width: 90%;
  }

  @media (max-width: 768px) {
    width: 95%;
    margin: 4rem auto 0;
    padding: 0 1rem;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 0 0.75rem;
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
  font-size: ${props => props.theme.fontxl};
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  max-width: 800px;
  margin: 0 auto 4rem;
  line-height: 1.6;
`;

const ContentWrapper = styled(motion.div)`
  display: flex;
  justify-content: center;
  margin: 4rem 0;

  @media (max-width: 768px) {
    margin: 3rem 0;
  }

  @media (max-width: 480px) {
    margin: 2rem 0;
  }
`;

const ContactInfo = styled.div`
  background: rgba(15, 15, 15, 0.7);
  border: 1px solid #7120b0;
  border-radius: 12px;
  padding: 3rem;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 20px rgba(113, 32, 176, 0.15);
  width: 100%;
  max-width: 600px;

  @media (max-width: 768px) {
    padding: 2rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

const ContactTitle = styled.h2`
  font-size: 2.5rem;
  color: #ffffff;
  margin-bottom: 2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  span {
    color: #7120b0;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
    margin-bottom: 1.25rem;
  }
`;

const ContactItem = styled(motion.div)`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(113, 32, 176, 0.1);
  border: 1px solid rgba(113, 32, 176, 0.3);
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(113, 32, 176, 0.15);
    border-color: rgba(113, 32, 176, 0.6);
    transform: translateY(-2px);
  }
`;

const ContactIcon = styled.div`
  width: 50px;
  height: 50px;
  background: rgba(113, 32, 176, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.5rem;
  
  svg {
    color: #7120b0;
    font-size: 1.5rem;
  }
`;

const ContactDetails = styled.div`
  flex: 1;
`;

const ContactLabel = styled.h4`
  color: #ffffff;
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const ContactText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  margin: 0;
  
  a {
    color: #7120b0;
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: #bb20ff;
    }
  }
`;

const SocialSection = styled(motion.div)`
  margin-top: 3rem;
  text-align: center;
`;

const SocialTitle = styled.h3`
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    background: rgba(113, 32, 176, 0.2);
    border: 2px solid rgba(113, 32, 176, 0.5);
    border-radius: 50%;
    color: #7120b0;
    font-size: 1.5rem;
    text-decoration: none;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(113, 32, 176, 0.3);
      border-color: rgba(113, 32, 176, 1);
      color: #bb20ff;
      transform: translateY(-3px);
    }
  }
`;



const ContactPage = () => {
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
      
      <Navigation />
      
      <Container>
        <Title
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Contact <span>Us</span>
        </Title>

        <Subtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Connect with Boiler Blockchain through our social channels and Discord community
        </Subtitle>

        <ContentWrapper
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <ContactInfo>
            <ContactTitle>Get in <span>Touch</span></ContactTitle>
            
            <ContactItem
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ x: 5 }}
            >
              <ContactIcon>
                <FiMail />
              </ContactIcon>
              <ContactDetails>
                <ContactLabel>Email</ContactLabel>
                <ContactText>
                  <a href="mailto:contact@boilerblockchain.org">contact@boilerblockchain.org</a>
                </ContactText>
              </ContactDetails>
            </ContactItem>

            <ContactItem
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              whileHover={{ x: 5 }}
            >
              <ContactIcon>
                <FiMapPin />
              </ContactIcon>
              <ContactDetails>
                <ContactLabel>Location</ContactLabel>
                <ContactText>Purdue University<br />West Lafayette, IN 47907</ContactText>
              </ContactDetails>
            </ContactItem>

            <ContactItem
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{ x: 5 }}
            >
              <ContactIcon>
                <FiMessageSquare />
              </ContactIcon>
              <ContactDetails>
                <ContactLabel>Discord</ContactLabel>
                <ContactText>
                  <a href="https://discord.gg/hnjtVpb9H5" target="_blank" rel="noopener noreferrer">
                    Join our Discord server
                  </a>
                </ContactText>
              </ContactDetails>
            </ContactItem>

            <SocialSection
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <SocialTitle>Follow Us</SocialTitle>
              <SocialLinks>
                <a href="https://instagram.com/boilerblockchain" target="_blank" rel="noopener noreferrer">
                  <FiInstagram />
                </a>
                <a href="https://twitter.com/boilerblockchain" target="_blank" rel="noopener noreferrer">
                  <FiTwitter />
                </a>
                <a href="https://linkedin.com/company/boilerblockchain" target="_blank" rel="noopener noreferrer">
                  <FiLinkedin />
                </a>
                <a href="https://github.com/boilerblockchain" target="_blank" rel="noopener noreferrer">
                  <FiGithub />
                </a>
              </SocialLinks>
            </SocialSection>
          </ContactInfo>
        </ContentWrapper>
      </Container>
    </PageSection>
  );
};

export default ContactPage;
