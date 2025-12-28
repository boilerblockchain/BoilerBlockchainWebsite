import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FiUsers, FiAward, FiArrowRight, FiStar, FiTrendingUp, FiHeart } from 'react-icons/fi';
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
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin: 2rem 0 5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)`
  background: rgba(15, 15, 15, 0.7);
  border: 1px solid #7120b0;
  border-radius: 12px;
  padding: 2rem 1.5rem;
  text-align: center;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(113, 32, 176, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, rgba(113, 32, 176, 0.8), rgba(187, 32, 255, 0.8));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    box-shadow: 0 12px 40px rgba(113, 32, 176, 0.4);
    transform: translateY(-8px);
    background: rgba(15, 15, 15, 0.85);
  }

  &:hover::before {
    opacity: 1;
  }
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #7120b0;
  margin-bottom: 0.5rem;
`;

const StatTitle = styled.div`
  font-size: 1rem;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const SectionsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 3rem;
  margin: 4rem 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SectionCard = styled(motion.div)`
  background: rgba(15, 15, 15, 0.7);
  border: 2px solid #7120b0;
  border-radius: 16px;
  padding: 3rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(113, 32, 176, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:hover {
    box-shadow: 0 16px 50px rgba(113, 32, 176, 0.4);
    transform: translateY(-8px);
    border-color: rgba(113, 32, 176, 1);
    background: rgba(15, 15, 15, 0.85);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, rgba(113, 32, 176, 0.8), rgba(187, 32, 255, 0.8));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const SectionIcon = styled.div`
  width: 70px;
  height: 70px;
  background: rgba(113, 32, 176, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  
  svg {
    color: #7120b0;
    font-size: 2.2rem;
  }
`;

const SectionName = styled.h3`
  font-size: 2.5rem;
  color: #ffffff;
  margin-bottom: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const SectionDescription = styled.p`
  font-size: ${props => props.theme.fontmd};
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const SectionHighlights = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 2.5rem;

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

const ViewSectionButton = styled(Link)`
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
  border: none;
  cursor: pointer;
  width: 100%;
  justify-content: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(113, 32, 176, 0.4);
    background: linear-gradient(45deg, #9d20b0, #d175ff);
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(3px);
  }
`;

const ValueSection = styled(motion.div)`
  background: rgba(15, 15, 15, 0.7);
  border: 1px solid #7120b0;
  border-radius: 12px;
  padding: 3rem;
  margin: 5rem 0;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 20px rgba(113, 32, 176, 0.15);
  text-align: center;
`;

const ValueTitle = styled.h2`
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

const ValueDescription = styled.p`
  font-size: ${props => props.theme.fontlg};
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto 2rem;
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const ValueCard = styled(motion.div)`
  background: rgba(113, 32, 176, 0.1);
  border: 1px solid rgba(113, 32, 176, 0.3);
  border-radius: 12px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(113, 32, 176, 0.2);
    border-color: rgba(113, 32, 176, 0.6);
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(113, 32, 176, 0.3);
  }
`;

const ValueIcon = styled.div`
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

const ValueName = styled.h4`
  font-size: 1.2rem;
  color: #ffffff;
  margin-bottom: 0.5rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const ValueText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.5;
`;

const sections = [
  {
    id: 'team',
    name: 'Our Team',
    icon: FiUsers,
    description: 'Meet the passionate individuals driving innovation at Boiler Blockchain - our current members, leadership, and active contributors.',
    highlights: [
      'Executive board and team leadership',
      'Active members across all departments',
      'Student developers and researchers',
      'Marketing and community managers',
      'Current project contributors'
    ],
    path: '/people/team'
  },
  {
    id: 'alumni',
    name: 'Alumni Network',
    icon: FiAward,
    description: 'Celebrating our graduates who have gone on to make significant impacts in the blockchain and technology industries.',
    highlights: [
      'Industry leaders and entrepreneurs',
      'Successful startup founders',
      'Blockchain developers at major companies',
      'Research contributors and academics',
      'Mentors for current members'
    ],
    path: '/people/alumni'
  }
];

const values = [
  {
    icon: FiStar,
    name: 'Excellence',
    description: 'We strive for the highest standards in everything we do, from education to innovation.'
  },
  {
    icon: FiTrendingUp,
    name: 'Growth',
    description: 'We believe in continuous learning and development, both personally and professionally.'
  },
  {
    icon: FiUsers,
    name: 'Collaboration',
    description: 'We work together to achieve more than we could individually, fostering teamwork and respect.'
  },
  {
    icon: FiHeart,
    name: 'Passion',
    description: 'We are driven by genuine enthusiasm for blockchain technology and its potential to change the world.'
  }
];

const PeopleLanding = () => {
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
          Our <span>People</span>
        </Title>

        <Subtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Meet the talented individuals who make Boiler Blockchain a thriving community 
          of innovators, builders, and blockchain enthusiasts
        </Subtitle>

        <StatsContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <StatCard whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(113, 32, 176, 0.4)" }}>
            <StatNumber>200+</StatNumber>
            <StatTitle>Total Members</StatTitle>
          </StatCard>

          <StatCard whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(113, 32, 176, 0.4)" }}>
            <StatNumber>50+</StatNumber>
            <StatTitle>Alumni</StatTitle>
          </StatCard>

          <StatCard whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(113, 32, 176, 0.4)" }}>
            <StatNumber>15+</StatNumber>
            <StatTitle>Leadership Team</StatTitle>
          </StatCard>

          <StatCard whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(113, 32, 176, 0.4)" }}>
            <StatNumber>3</StatNumber>
            <StatTitle>Years Active</StatTitle>
          </StatCard>
        </StatsContainer>

        <SectionsGrid
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {sections.map((section, index) => (
            <SectionCard
              key={section.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
              whileHover={{ y: -5 }}
            >
              <SectionIcon>
                <section.icon />
              </SectionIcon>
              
              <SectionName>{section.name}</SectionName>
              
              <SectionDescription>{section.description}</SectionDescription>
              
              <SectionHighlights>
                {section.highlights.map((highlight, i) => (
                  <li key={i}>{highlight}</li>
                ))}
              </SectionHighlights>
              
              <ViewSectionButton to={section.path}>
                Explore {section.name} <FiArrowRight />
              </ViewSectionButton>
            </SectionCard>
          ))}
        </SectionsGrid>

        <ValueSection
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <ValueTitle>Our <span>Values</span></ValueTitle>
          <ValueDescription>
            The principles that guide our community and drive our mission to advance blockchain education and innovation.
          </ValueDescription>
          
          <ValuesGrid>
            {values.map((value, index) => (
              <ValueCard
                key={value.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                whileHover={{ y: -3 }}
              >
                <ValueIcon>
                  <value.icon />
                </ValueIcon>
                <ValueName>{value.name}</ValueName>
                <ValueText>{value.description}</ValueText>
              </ValueCard>
            ))}
          </ValuesGrid>
        </ValueSection>
      </Container>
    </PageSection>
  );
};

export default PeopleLanding;
