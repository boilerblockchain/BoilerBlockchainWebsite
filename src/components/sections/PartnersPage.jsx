import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import Navigation from '../Navigation';
import Footer from '../Footer';

// Import all partner logos
import aptosLogo from '../../assets/images/partners/aptos.png';
import caffeineLogo from '../../assets/images/partners/caffeine.png';
import celoLogo from '../../assets/images/partners/celo.png';
import collegexyzLogo from '../../assets/images/partners/collegexyz.png';
import dormdaoLogo from '../../assets/images/partners/dormdao.png';
import eigenLogo from '../../assets/images/partners/eigen.png';
import flojoLogo from '../../assets/images/partners/flojo.png';
import geminiLogo from '../../assets/images/partners/gemini.png';
import icpLogo from '../../assets/images/partners/icp.png';
import ledgerLogo from '../../assets/images/partners/ledger.png';
import meteoraLogo from '../../assets/images/partners/meteora.png';
import moiLogo from '../../assets/images/partners/moi.png';
import opLogo from '../../assets/images/partners/op.png';
import originLogo from '../../assets/images/partners/origin.png';
import purdueLogo from '../../assets/images/partners/purdue.png';
import sharklabsLogo from '../../assets/images/partners/sharklabs.png';
import solanaLogo from '../../assets/images/partners/solana.png';
import sonicLogo from '../../assets/images/partners/sonic.png';
import staderLogo from '../../assets/images/partners/stader.png';
import suiLogo from '../../assets/images/partners/sui.png';
import swcLogo from '../../assets/images/partners/swc.png';
import symphonyLogo from '../../assets/images/partners/symphony.png';

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

const Container = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 0 auto 4rem;
  padding: 120px 2rem 0;
  position: relative;
  z-index: 2;
  
  @media (max-width: 1024px) {
    padding: 110px 1.75rem 0;
  }

  @media (max-width: 768px) {
    width: 95%;
    padding: 100px 1.5rem 0;
    margin: 0 auto 3rem;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 80px 1rem 0;
    margin: 0 auto 2rem;
  }

  @media (max-width: 360px) {
    padding: 70px 0.75rem 0;
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

const PartnersGrid = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 3rem 4rem;
  margin: 3rem 0;

  @media (max-width: 1200px) {
    gap: 2.5rem 3.5rem;
  }

  @media (max-width: 768px) {
    gap: 2rem 3rem;
    margin: 2rem 0;
  }

  @media (max-width: 480px) {
    gap: 1.5rem 2rem;
  }
`;

const PartnerLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.needsBackground ? '1.5rem 2rem' : '0'};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background: ${props => props.needsBackground ? 'rgba(255, 255, 255, 0.95)' : 'transparent'};
  border-radius: ${props => props.needsBackground ? '12px' : '0'};

  img {
    height: 80px;
    width: auto;
    max-width: 200px;
    object-fit: contain;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @media (max-width: 1200px) {
    img {
      height: 70px;
      max-width: 180px;
    }
  }

  @media (max-width: 768px) {
    padding: ${props => props.needsBackground ? '1.25rem 1.75rem' : '0'};
    
    img {
      height: 60px;
      max-width: 150px;
    }
  }

  @media (max-width: 480px) {
    padding: ${props => props.needsBackground ? '1rem 1.5rem' : '0'};
    
    img {
      height: 50px;
      max-width: 120px;
    }
  }

  ${props => props.needsBackground && `
    &:hover {
      background: rgba(255, 255, 255, 1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  `}
`;


const PartnerCard = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    ${PartnerLogo} {
      transform: scale(1.1);
    }
  }
`;

// Helper function to format partner name from filename
const formatPartnerName = (filename) => {
  return filename
    .replace('.png', '')
    .replace('.jpg', '')
    .replace('.jpeg', '')
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Partner data - UPDATE URLs HERE when you have them
// Replace "#" with actual partner website URLs
// Set needsBackground: true for logos that have light text/light backgrounds and need white background to be visible
const partners = [
  { name: 'Aptos', logo: aptosLogo, url: '#', needsBackground: false },
  { name: 'Caffeine', logo: caffeineLogo, url: '#', needsBackground: false },
  { name: 'Celo', logo: celoLogo, url: '#', needsBackground: false },
  { name: 'College XYZ', logo: collegexyzLogo, url: '#', needsBackground: false },
  { name: 'DormDAO', logo: dormdaoLogo, url: '#', needsBackground: false },
  { name: 'Eigen', logo: eigenLogo, url: '#', needsBackground: false },
  { name: 'Flojo', logo: flojoLogo, url: '#', needsBackground: false },
  { name: 'Gemini', logo: geminiLogo, url: '#', needsBackground: false },
  { name: 'ICP', logo: icpLogo, url: '#', needsBackground: false },
  { name: 'Ledger', logo: ledgerLogo, url: '#', needsBackground: false },
  { name: 'Meteora', logo: meteoraLogo, url: '#', needsBackground: false },
  { name: 'MOI', logo: moiLogo, url: '#', needsBackground: false },
  { name: 'OP', logo: opLogo, url: '#', needsBackground: false },
  { name: 'Origin', logo: originLogo, url: '#', needsBackground: false },
  { name: 'Purdue', logo: purdueLogo, url: '#', needsBackground: false },
  { name: 'SharkLabs', logo: sharklabsLogo, url: '#', needsBackground: false },
  { name: 'Solana', logo: solanaLogo, url: '#', needsBackground: false },
  { name: 'Sonic', logo: sonicLogo, url: '#', needsBackground: false },
  { name: 'Stader', logo: staderLogo, url: '#', needsBackground: false },
  { name: 'Sui', logo: suiLogo, url: '#', needsBackground: false },
  { name: 'SWC', logo: swcLogo, url: '#', needsBackground: false },
  { name: 'Symphony', logo: symphonyLogo, url: '#', needsBackground: false }
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
          Our <span>Partners</span>
        </Title>

        <Subtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Building the future of blockchain together with leading organizations, 
          hackathon platforms, and industry pioneers who share our vision for innovation
        </Subtitle>
        <PartnersGrid
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {partners.map((partner, index) => (
            <PartnerCard
              key={`${partner.name}-${index}`}
              href={partner.url !== '#' ? partner.url : undefined}
              target={partner.url !== '#' ? "_blank" : undefined}
              rel={partner.url !== '#' ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.05,
                ease: [0.4, 0, 0.2, 1]
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              style={{ cursor: partner.url !== '#' ? 'pointer' : 'default' }}
            >
              <PartnerLogo needsBackground={partner.needsBackground || false}>
                <img src={partner.logo} alt={partner.name} />
              </PartnerLogo>
            </PartnerCard>
          ))}
        </PartnersGrid>
      </Container>
      <Footer />
    </PageSection>
  );
};

export default PartnersPage;
