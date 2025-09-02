import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FiGlobe, FiMail, FiHeart, FiTrendingUp, FiUsers, FiAward } from 'react-icons/fi';
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
  max-width: 1400px;
  margin: 6rem auto 0;
  position: relative;
  z-index: 2;
  
  @media (max-width: 70em) {
    width: 90%;
  }

  @media (max-width: 48em) {
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
  font-size: ${props => props.theme.fontxl};
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  max-width: 800px;
  margin: 0 auto 4rem;
  line-height: 1.6;
`;

const StatsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin: 2rem 0 5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)`
  background: rgba(15, 15, 15, 0.7);
  border: 1px solid #7120b0;
  border-radius: 8px;
  padding: 2.5rem 1.5rem;
  text-align: center;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 20px rgba(113, 32, 176, 0.15);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 30px rgba(113, 32, 176, 0.3);
    transform: translateY(-5px);
  }
`;

const StatNumber = styled.div`
  font-size: 3.5rem;
  font-weight: 700;
  color: #7120b0;
  margin-bottom: 0.5rem;
`;

const StatTitle = styled.div`
  font-size: 1.2rem;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const PartnersGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 4rem 0;
`;

const PartnerCard = styled(motion.div)`
  background: rgba(15, 15, 15, 0.7);
  border: 1px solid #7120b0;
  border-radius: 12px;
  padding: 2.5rem;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 20px rgba(113, 32, 176, 0.15);
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    box-shadow: 0 8px 30px rgba(113, 32, 176, 0.3);
    transform: translateY(-5px);
    border-color: rgba(113, 32, 176, 1);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, rgba(113, 32, 176, 0.8), rgba(187, 32, 255, 0.8));
    position: relative;
    border-radius: 12px 12px 0 0;
  }
`;

const PartnerLogo = styled.div`
  width: 100px;
  height: 100px;
  background: rgba(113, 32, 176, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  border: 2px solid rgba(113, 32, 176, 0.5);
  
  svg {
    color: #7120b0;
    font-size: 3rem;
  }
`;

const PartnerName = styled.h3`
  font-size: 1.8rem;
  color: #ffffff;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const PartnerType = styled.p`
  color: #7120b0;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const PartnerDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const CollaborationSection = styled(motion.div)`
  background: rgba(15, 15, 15, 0.7);
  border: 1px solid #7120b0;
  border-radius: 12px;
  padding: 3rem;
  margin: 5rem 0;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 20px rgba(113, 32, 176, 0.15);
  text-align: center;
`;

const CollaborationTitle = styled.h2`
  font-size: 3rem;
  color: #ffffff;
  margin-bottom: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  span {
    color: #7120b0;
  }
`;

const CollaborationDescription = styled.p`
  font-size: ${props => props.theme.fontlg};
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto 2rem;
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const BenefitCard = styled(motion.div)`
  background: rgba(113, 32, 176, 0.1);
  border: 1px solid rgba(113, 32, 176, 0.3);
  border-radius: 8px;
  padding: 2rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(113, 32, 176, 0.15);
    border-color: rgba(113, 32, 176, 0.6);
    transform: translateY(-3px);
  }
`;

const BenefitIcon = styled.div`
  width: 50px;
  height: 50px;
  background: rgba(113, 32, 176, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  
  svg {
    color: #7120b0;
    font-size: 1.5rem;
  }
`;

const BenefitTitle = styled.h4`
  color: #ffffff;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const BenefitDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.5;
`;

const ContactButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(45deg, #7120b0, #bb20ff);
  color: white;
  padding: 1rem 2rem;
  text-decoration: none;
  border-radius: 6px;
  font-size: ${props => props.theme.fontmd};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  margin-top: 2rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(113, 32, 176, 0.4);
    background: linear-gradient(45deg, #9d20b0, #d175ff);
  }
`;

const partners = [
  {
    name: 'ConsenSys',
    type: 'Technology Partner',
    description: 'Collaborating on Ethereum development tools and providing mentorship for our technical workshops.'
  },
  {
    name: 'Purdue Research Foundation',
    type: 'Academic Partner',
    description: 'Supporting our research initiatives and providing funding for blockchain-related academic projects.'
  },
  {
    name: 'EthGlobal',
    type: 'Event Partner',
    description: 'Sponsoring our hackathons and providing platforms for students to showcase their blockchain innovations.'
  },
  {
    name: 'Chainlink Labs',
    type: 'Industry Partner',
    description: 'Offering internship opportunities and guest lectures on oracle technology and decentralized data.'
  }
];

const benefits = [
  {
    icon: FiUsers,
    title: 'Talent Access',
    description: 'Connect with top blockchain talent from Purdue University and recruit exceptional graduates.'
  },
  {
    icon: FiTrendingUp,
    title: 'Innovation',
    description: 'Collaborate on cutting-edge research and development projects with our technical teams.'
  },
  {
    icon: FiAward,
    title: 'Brand Visibility',
    description: 'Increase your brand presence among blockchain enthusiasts and the academic community.'
  },
  {
    icon: FiHeart,
    title: 'Mentorship',
    description: 'Share expertise through guest lectures, workshops, and direct mentorship opportunities.'
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
          academic institutions, and industry pioneers
        </Subtitle>

        <StatsContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <StatCard whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(113, 32, 176, 0.4)" }}>
            <StatNumber>15+</StatNumber>
            <StatTitle>Active Partners</StatTitle>
          </StatCard>

          <StatCard whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(113, 32, 176, 0.4)" }}>
            <StatNumber>25+</StatNumber>
            <StatTitle>Collaboration Projects</StatTitle>
          </StatCard>

          <StatCard whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(113, 32, 176, 0.4)" }}>
            <StatNumber>50+</StatNumber>
            <StatTitle>Student Placements</StatTitle>
          </StatCard>
        </StatsContainer>

        <PartnersGrid
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {partners.map((partner, index) => (
            <PartnerCard
              key={partner.name}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <PartnerLogo>
                <FiGlobe />
              </PartnerLogo>
              
              <PartnerName>{partner.name}</PartnerName>
              <PartnerType>{partner.type}</PartnerType>
              <PartnerDescription>{partner.description}</PartnerDescription>
            </PartnerCard>
          ))}
        </PartnersGrid>

        <CollaborationSection
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <CollaborationTitle>Partner <span>With Us</span></CollaborationTitle>
          <CollaborationDescription>
            Join our network of industry leaders and academic institutions to drive blockchain innovation, 
            access top talent, and shape the future of decentralized technology.
          </CollaborationDescription>
          
          <BenefitsGrid>
            {benefits.map((benefit, index) => (
              <BenefitCard
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                whileHover={{ y: -3 }}
              >
                <BenefitIcon>
                  <benefit.icon />
                </BenefitIcon>
                <BenefitTitle>{benefit.title}</BenefitTitle>
                <BenefitDescription>{benefit.description}</BenefitDescription>
              </BenefitCard>
            ))}
          </BenefitsGrid>
          
          <ContactButton href="mailto:partnerships@boilerblockchain.org">
            <FiMail /> Start a Partnership
          </ContactButton>
        </CollaborationSection>
      </Container>
    </PageSection>
  );
};

export default PartnersPage;
