import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FiBook, FiCode, FiUsers, FiArrowRight, FiClock, FiAward } from 'react-icons/fi';
import Navigation from '../Navigation';
import Footer from '../Footer';

const PageSection = styled.section`
  min-height: 100vh;
  width: 100%;
  background-color: #000000;
  position: relative;
  overflow: hidden;
  padding: 4rem 0 0;
  font-family: 'Tomorrow', sans-serif;
  display: flex;
  flex-direction: column;
  
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
  border-radius: 12px;
  padding: 2.5rem 1.5rem;
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
  border: 2px solid ${props => props.available ? '#7120b0' : 'rgba(113, 32, 176, 0.3)'};
  border-radius: 16px;
  padding: 3rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(113, 32, 176, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  opacity: ${props => props.available ? 1 : 0.7};

  &:hover {
    box-shadow: 0 16px 50px rgba(113, 32, 176, 0.4);
    transform: translateY(-8px);
    border-color: ${props => props.available ? 'rgba(113, 32, 176, 1)' : 'rgba(113, 32, 176, 0.5)'};
    background: rgba(15, 15, 15, 0.85);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.available 
      ? 'linear-gradient(90deg, rgba(113, 32, 176, 0.8), rgba(187, 32, 255, 0.8))'
      : 'linear-gradient(90deg, rgba(113, 32, 176, 0.3), rgba(187, 32, 255, 0.3))'
    };
    opacity: ${props => props.available ? 1 : 0.5};
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
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
  background: ${props => props.available 
    ? 'linear-gradient(45deg, #7120b0, #bb20ff)'
    : 'rgba(113, 32, 176, 0.3)'
  };
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
  cursor: ${props => props.available ? 'pointer' : 'not-allowed'};
  width: 100%;
  justify-content: center;
  opacity: ${props => props.available ? 1 : 0.6};

  &:hover {
    transform: ${props => props.available ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props.available ? '0 8px 20px rgba(113, 32, 176, 0.4)' : 'none'};
    background: ${props => props.available 
      ? 'linear-gradient(45deg, #9d20b0, #d175ff)'
      : 'rgba(113, 32, 176, 0.3)'
    };
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: ${props => props.available ? 'translateX(3px)' : 'none'};
  }
`;

const ComingSoonBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 165, 0, 0.9);
  color: #000;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  z-index: 10;
`;

const LaunchDate = styled.p`
  color: #ff9500;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  margin: 1rem 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const courses = [
  {
    id: 'technical',
    name: 'Technical Course',
    icon: FiCode,
    description: 'Comprehensive hands-on blockchain development course covering smart contracts, DApps, and Web3 technologies. Build real projects and gain industry-ready skills.',
    features: [
      'Solidity smart contract development',
      'DApp frontend development with React',
      'Web3.js and Ethers.js integration',
      'Testing and deployment strategies',
      'Security best practices and auditing',
      'Real-world project portfolio'
    ],
    stats: { duration: '12 weeks', projects: '5+', students: '150+' },
    path: '/courses/technical',
    available: true,
    highlights: [
      'Industry mentors and guest speakers',
      'Capstone project with real clients',
      'Job placement assistance',
      'Access to exclusive hackathons'
    ]
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
              available={course.available}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
              whileHover={{ y: course.available ? -5 : -2 }}
            >
              {!course.available && <ComingSoonBadge>Coming Soon</ComingSoonBadge>}
              
              <CourseIcon>
                <course.icon />
              </CourseIcon>
              
              <CourseName>{course.name}</CourseName>
              
              <CourseDescription>{course.description}</CourseDescription>
              
              {course.highlights && course.available && (
                <CourseFeatures>
                  {course.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </CourseFeatures>
              )}
              
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

              {!course.available && course.launchDate && (
                <LaunchDate>Expected Launch: {course.launchDate}</LaunchDate>
              )}
              
              <ViewCourseButton 
                to={course.available ? course.path : '#'}
                available={course.available}
                onClick={(e) => !course.available && e.preventDefault()}
              >
                {course.available ? 'View Course Details' : 'Coming Soon'} 
                {course.available && <FiArrowRight />}
              </ViewCourseButton>
            </CourseCard>
          ))}
        </CoursesGrid>
      </Container>
      <Footer />
    </PageSection>
  );
};

export default CoursesLanding;
