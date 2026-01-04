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
  max-width: 1400px;
  margin: 0 auto 4rem;
  padding: 120px 2rem 0;
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 20px;
  
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 3rem 4rem;
  margin: 3rem 0;
  align-items: center;
  justify-items: center;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 2.5rem 3.5rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 2rem 2.5rem;
    margin: 2rem 0;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem 2rem;
  }
`;

const PartnerLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 2.5rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  width: 100%;
  min-height: 120px;

  img {
    height: 60px;
    width: auto;
    max-width: 100%;
    object-fit: contain;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    filter: grayscale(100%) brightness(0.3) contrast(1.2);
    opacity: 0.7;
  }

  @media (max-width: 1200px) {
    padding: 1.75rem 2rem;
    min-height: 110px;
    
    img {
      height: 55px;
    }
  }

  @media (max-width: 768px) {
    padding: 1.5rem 1.75rem;
    min-height: 100px;
    
    img {
      height: 50px;
    }
  }

  @media (max-width: 480px) {
    padding: 1.25rem 1.5rem;
    min-height: 90px;
    
    img {
      height: 40px;
    }
  }

  &:hover {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    
    img {
      opacity: 0.9;
      filter: grayscale(100%) brightness(0.2) contrast(1.3);
    }
  }
`;


const PartnerCard = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;

  &:hover {
    ${PartnerLogo} {
      transform: translateY(-2px);
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
              whileHover={{ y: -2 }}
              style={{ cursor: partner.url !== '#' ? 'pointer' : 'default' }}
            >
              <PartnerLogo>
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
