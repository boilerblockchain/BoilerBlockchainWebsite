import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FiBook, FiCode, FiUsers, FiArrowRight, FiClock, FiAward } from 'react-icons/fi';

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

const Container = styled.div`
  width: 85%;
  max-width: 1400px;
  margin: 3rem auto 0;
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
  font-size: 6rem; 
  color: #ffffff;
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;

  span {
    color: #7120b0;
  }

  @media (max-width: 40em) {
    font-size: 4rem;
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

const CoursesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 3rem;
  margin: 4rem 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CourseCard = styled(motion.div)`
  background: rgba(15, 15, 15, 0.7);
  border: 2px solid #7120b0;
  border-radius: 12px;
  padding: 3rem;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 20px rgba(113, 32, 176, 0.15);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

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
  }
`;

const CourseIcon = styled.div`
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

const CourseName = styled.h3`
  font-size: 2.5rem;
  color: #ffffff;
  margin-bottom: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const CourseDescription = styled.p`
  font-size: ${props => props.theme.fontmd};
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const CourseFeatures = styled.ul`
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

const CourseStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const CourseStat = styled.div`
  text-align: center;
  
  .number {
    font-size: 1.8rem;
    font-weight: 700;
    color: #7120b0;
    display: block;
  }
  
  .label {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

const ViewCourseButton = styled(Link)`
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

const courses = [
  {
    id: 'technical',
    name: 'Technical Course',
    icon: FiCode,
    description: 'Comprehensive hands-on blockchain development course covering smart contracts, DApps, and Web3 technologies.',
    features: [
      'Solidity smart contract development',
      'DApp frontend development with React',
      'Web3.js and Ethers.js integration',
      'Testing and deployment strategies',
      'Security best practices',
      'Real-world project experience'
    ],
    stats: { duration: '12 weeks', projects: '5+', students: '150+' },
    path: '/courses/technical'
  },
  {
    id: 'non-technical',
    name: 'Non-Technical Course',
    icon: FiBook,
    description: 'Foundational blockchain course focusing on concepts, economics, and applications without heavy programming.',
    features: [
      'Blockchain fundamentals and history',
      'Cryptocurrency and tokenomics',
      'DeFi and NFT ecosystems',
      'Blockchain use cases and applications',
      'Investment and trading strategies',
      'Industry trends and analysis'
    ],
    stats: { duration: '8 weeks', modules: '10+', students: '200+' },
    path: '/courses/non-technical'
  }
];

const CoursesLanding = () => {
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
      
      <BackButton to="/">Back</BackButton>
      
      <Container>
        <Title
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our <span>Courses</span>
        </Title>

        <Subtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Comprehensive blockchain education designed for all skill levels, from complete beginners to advanced developers
        </Subtitle>

        <StatsContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <StatCard whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(113, 32, 176, 0.4)" }}>
            <StatNumber>350+</StatNumber>
            <StatTitle>Students Taught</StatTitle>
          </StatCard>

          <StatCard whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(113, 32, 176, 0.4)" }}>
            <StatNumber>2</StatNumber>
            <StatTitle>Course Tracks</StatTitle>
          </StatCard>

          <StatCard whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(113, 32, 176, 0.4)" }}>
            <StatNumber>95%</StatNumber>
            <StatTitle>Completion Rate</StatTitle>
          </StatCard>
        </StatsContainer>

        <CoursesGrid
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {courses.map((course, index) => (
            <CourseCard
              key={course.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
              whileHover={{ y: -5 }}
            >
              <CourseIcon>
                <course.icon />
              </CourseIcon>
              
              <CourseName>{course.name}</CourseName>
              
              <CourseDescription>{course.description}</CourseDescription>
              
              <CourseFeatures>
                {course.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </CourseFeatures>
              
              <CourseStats>
                {Object.entries(course.stats).map(([key, value]) => (
                  <CourseStat key={key}>
                    <span className="number">{value}</span>
                    <span className="label">{key}</span>
                  </CourseStat>
                ))}
              </CourseStats>
              
              <ViewCourseButton to={course.path}>
                View Course Details <FiArrowRight />
              </ViewCourseButton>
            </CourseCard>
          ))}
        </CoursesGrid>
      </Container>
    </PageSection>
  );
};

export default CoursesLanding;
