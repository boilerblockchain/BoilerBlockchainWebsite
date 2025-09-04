import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';

import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FiClock, FiMail, FiBell } from 'react-icons/fi';
import Navigation from '../Navigation';

const PageSection = styled.section`
  min-height: 100vh;
  width: 100%;
  background-color: #000000;
  position: relative;
  overflow: hidden;
  padding: 4rem 0;
  font-family: 'Tomorrow', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  
  * {
    font-family: 'Tomorrow', sans-serif;
  }
`;



const Container = styled.div`
  width: 85%;
  max-width: 800px;
  margin: 6rem auto 0;
  position: relative;
  z-index: 2;
  text-align: center;
`;

const ComingSoonIcon = styled(motion.div)`
  width: 150px;
  height: 150px;
  background: rgba(113, 32, 176, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 3rem;
  border: 3px solid rgba(113, 32, 176, 0.5);
  
  svg {
    color: #7120b0;
    font-size: 4rem;
  }
`;

const Title = styled(motion.h1)`
  font-size: 3rem; 
  color: #ffffff;
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Tomorrow', sans-serif;

  span {
    color: #8B5CF6;
  }

  @media (max-width: 40em) {
    font-size: 2.2rem;
  }
`;

const Subtitle = styled(motion.h2)`
  font-size: 2rem;
  color: #ff9500;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;

  @media (max-width: 40em) {
    font-size: 1.5rem;
  }
`;

const Description = styled(motion.p)`
  font-size: ${props => props.theme.fontlg};
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  max-width: 600px;
  margin: 0 auto 3rem;
  line-height: 1.6;
`;

const LaunchInfo = styled(motion.div)`
  background: rgba(15, 15, 15, 0.7);
  border: 1px solid #7120b0;
  border-radius: 12px;
  padding: 3rem;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 20px rgba(113, 32, 176, 0.15);
  margin: 3rem 0;
`;

const LaunchDate = styled.h3`
  font-size: 2.5rem;
  color: #7120b0;
  margin-bottom: 1rem;
  font-weight: 700;
  text-transform: uppercase;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0;
  text-align: left;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;

  li {
    color: rgba(255, 255, 255, 0.9);
    padding: 0.8rem 0;
    display: flex;
    align-items: center;
    font-size: 1rem;
    line-height: 1.4;

    &:before {
      content: "";
      display: inline-block;
      width: 8px;
      height: 8px;
      margin-right: 1rem;
      background-color: #7120b0;
      border-radius: 50%;
    }
  }
`;

const NotifySection = styled(motion.div)`
  background: rgba(113, 32, 176, 0.1);
  border: 1px solid rgba(113, 32, 176, 0.3);
  border-radius: 8px;
  padding: 2rem;
  margin: 2rem 0;
`;

const NotifyTitle = styled.h4`
  color: #ffffff;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const NotifyDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const NotifyButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(45deg, #7120b0, #bb20ff);
  color: white;
  padding: 0.8rem 1.5rem;
  text-decoration: none;
  border-radius: 6px;
  font-size: ${props => props.theme.fontmd};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(113, 32, 176, 0.4);
    background: linear-gradient(45deg, #9d20b0, #d175ff);
  }
`;

const NonTechnicalCourse = () => {
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
      
      <Navigation />
      
      <Container>
        <ComingSoonIcon
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <FiClock />
        </ComingSoonIcon>

        <Title
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Non-Technical <span>Course</span>
        </Title>

        <Subtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Coming Soon
        </Subtitle>

        <Description
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          We're developing a comprehensive non-technical blockchain course perfect for business professionals, 
          investors, and anyone curious about the blockchain ecosystem without needing programming knowledge.
        </Description>

        <LaunchInfo
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <LaunchDate>Fall 2024</LaunchDate>
          
          <Description style={{ marginBottom: '2rem' }}>
            What you can expect from this course:
          </Description>

          <FeaturesList>
            <li>Blockchain fundamentals explained simply</li>
            <li>Cryptocurrency markets and trading</li>
            <li>DeFi ecosystem and investment strategies</li>
            <li>NFTs and the creator economy</li>
            <li>Business applications and use cases</li>
            <li>Industry trends and future opportunities</li>
          </FeaturesList>

          <NotifySection
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <NotifyTitle>
              <FiBell style={{ display: 'inline', marginRight: '0.5rem' }} />
              Get Notified
            </NotifyTitle>
            <NotifyDescription>
              Be the first to know when our Non-Technical Course launches. We'll send you updates on curriculum, 
              enrollment dates, and special early-bird pricing.
            </NotifyDescription>
            <NotifyButton href="mailto:contact@boilerblockchain.org?subject=Non-Technical Course Updates">
              <FiMail /> Notify Me When Available
            </NotifyButton>
          </NotifySection>
        </LaunchInfo>
      </Container>
    </PageSection>
  );
};

export default NonTechnicalCourse;