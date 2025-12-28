import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import Navigation from '../Navigation';
import Footer from '../Footer';

const PageSection = styled.section`
  min-height: 100vh;
  width: 100%;
  background-color: #000000;
  position: relative;
  overflow: hidden;
  font-family: 'Tomorrow', sans-serif;
  display: flex;
  flex-direction: column;
  
  * {
    font-family: 'Tomorrow', sans-serif;
  }
`;

const HeroSection = styled(motion.section)`
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 12rem 2rem 8rem;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    padding: 10rem 1.5rem 6rem;
    min-height: 50vh;
  }
`;

const HeroTitle = styled(motion.h1)`
  font-size: 4.5rem;
  color: #ffffff;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 1.5rem;
  line-height: 1.2;

  span {
    background: linear-gradient(135deg, #7120b0 0%, #bb20ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 768px) {
    font-size: 2.8rem;
    letter-spacing: 2px;
  }

  @media (max-width: 480px) {
    font-size: 2.2rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.85);
  max-width: 900px;
  line-height: 1.8;
  font-weight: 400;
  letter-spacing: 0.3px;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    line-height: 1.6;
  }
`;

const Container = styled.div`
  width: 90%;
  max-width: 1600px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  padding: 0 2rem 8rem;

  @media (max-width: 70em) {
    width: 95%;
    padding: 0 1.5rem 6rem;
  }

  @media (max-width: 768px) {
    width: 95%;
    padding: 0 1rem 4rem;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 0 0.75rem 3rem;
  }
`;

const PartnersGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 3rem;
  margin: 6rem 0;
  padding: 3rem 0;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.5rem;
    margin: 3rem 0;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
`;

const LogoPlaceholder = styled.div`
  width: 120px;
  height: 120px;
  background: rgba(113, 32, 176, 0.15);
  border: 2px solid rgba(113, 32, 176, 0.3);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(113, 32, 176, 0.1), rgba(187, 32, 255, 0.1));
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &::after {
    content: '🏢';
    font-size: 3rem;
    opacity: 0.4;
  }

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    
    &::after {
      font-size: 2.5rem;
    }
  }

  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
    
    &::after {
      font-size: 2rem;
    }
  }
`;

const CompanyName = styled.h3`
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  text-align: center;
  margin: 0;
  letter-spacing: 0.5px;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const PartnerCard = styled(motion.a)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(15, 15, 15, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 3rem 2rem;
  min-height: 220px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  text-decoration: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, rgba(113, 32, 176, 0.8), rgba(187, 32, 255, 0.8));
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: translateY(-12px) scale(1.03);
    background: rgba(15, 15, 15, 0.85);
    border-color: rgba(113, 32, 176, 0.6);
    box-shadow: 0 20px 60px rgba(113, 32, 176, 0.5);

    &::before {
      opacity: 1;
    }

    ${LogoPlaceholder} {
      background: linear-gradient(135deg, rgba(113, 32, 176, 0.3), rgba(187, 32, 255, 0.3));
      border-color: rgba(113, 32, 176, 0.6);
      transform: scale(1.1);
    }

    ${CompanyName} {
      color: #ffffff;
    }
  }

  @media (max-width: 768px) {
    padding: 2.5rem 1.5rem;
    min-height: 200px;
  }

  @media (max-width: 480px) {
    padding: 2rem 1rem;
    min-height: 180px;
  }
`;

// Placeholder partner data
const partners = [
  {
    name: 'Company Name',
    url: '#'
  },
  {
    name: 'Company Name',
    url: '#'
  },
  {
    name: 'Company Name',
    url: '#'
  },
  {
    name: 'Company Name',
    url: '#'
  },
  {
    name: 'Company Name',
    url: '#'
  },
  {
    name: 'Company Name',
    url: '#'
  },
  {
    name: 'Company Name',
    url: '#'
  },
  {
    name: 'Company Name',
    url: '#'
  }
];

const PartnersPage = () => {
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
              opacity: 0.15,
              width: 1,
            },
            move: { enable: true, speed: 0.5 },
            number: { value: 50 },
            opacity: { value: 0.1 },
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
                links: { opacity: 0.15 }
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

      <HeroSection
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <HeroTitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Our <span>Partners</span>
        </HeroTitle>
        <HeroSubtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Building the future of blockchain together with leading organizations, 
          hackathon platforms, and industry pioneers who share our vision for innovation
        </HeroSubtitle>
      </HeroSection>

      <Container>
        <PartnersGrid
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {partners.map((partner, index) => (
            <PartnerCard
              key={`${partner.name}-${index}`}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.05,
                ease: [0.4, 0, 0.2, 1]
              }}
              whileHover={{ y: -10, scale: 1.03 }}
            >
              <LogoPlaceholder />
              <CompanyName>{partner.name}</CompanyName>
            </PartnerCard>
          ))}
        </PartnersGrid>
      </Container>
      <Footer />
    </PageSection>
  );
};

export default PartnersPage;
