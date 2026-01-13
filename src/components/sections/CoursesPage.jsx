import React, { useCallback } from 'react';
import styled, { keyframes } from "styled-components";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { motion } from "framer-motion";
import Navigation from '../Navigation';
import Footer from '../Footer';
import BBLogo from '../../assets/images/logos/Boiler_BLockchain_Logo_SVG.png';

// Education images
import educationImage1 from '../../assets/images/education/edu1.jpg';
import educationImage3 from '../../assets/images/education/edu3.jpg';

const fadeInUp = {
  initial: {
    y: 60,
    opacity: 0
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const PageSection = styled.section`
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
  background-color: #000000;
  position: relative;
  overflow-x: hidden;
  padding-top: 4rem;
  font-family: 'Tomorrow', sans-serif;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  
  * {
    font-family: 'Tomorrow', sans-serif;
    box-sizing: border-box;
  }
`;

const Container = styled(motion.div)`
  width: 92%;
  max-width: 1400px;
  margin: 0 auto 0;
  padding: 120px 2rem 2rem;
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  box-sizing: border-box;
  
  @media (min-width: 768px) {
    width: 85%;
    padding: 120px 2rem 4rem;
    gap: 2rem;
  }
  
  @media (min-width: 1200px) {
    grid-template-columns: 0.8fr 1.2fr;
    align-items: stretch;
  }

  @media (max-width: 1024px) {
    padding: 110px 1.5rem 2rem;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 100px 1rem 2rem;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 80px 0.75rem 1.5rem;
  }

  @media (max-width: 360px) {
    padding: 70px 0.5rem 1.5rem;
  }
`;

const Title = styled(motion.h1)`
  font-size: 4.5rem; 
  color: #ffffff;
  text-align: center;
  margin-bottom: 0.5rem;
  margin-top: 1.5rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family:'Tomorrow', sans-serif; 
  grid-column: 1 / -1;
  word-wrap: break-word;
  max-width: 100%;
  padding: 0 0.5rem;

  @media (max-width: 1024px) {
    font-size: 3.5rem;
    letter-spacing: 1.5px;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
    letter-spacing: 1px;
    margin-top: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
    letter-spacing: 0.5px;
    margin-bottom: 1rem;
    padding: 0 0.25rem;
  }

  @media (max-width: 360px) {
    font-size: 1.75rem;
    letter-spacing: 0.25px;
  }
`;

const ImageSection = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  
  @media (min-width: 768px) {
    gap: 2rem;
  }
  
  @media (min-width: 1200px) {
    position: relative; 
    height: 100%; 
    display: flex;
    flex-direction: column;
    justify-content: space-between; 
  }
`;

const CourseCard = styled(motion.div)`
  background: linear-gradient(
    135deg,
    rgba(40, 35, 50, 0.95) 0%,
    rgba(35, 30, 45, 0.95) 100%
  );
  padding: 2.5rem;
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  font-family: 'Tomorrow', sans-serif;
  box-shadow: 
    0 4px 20px rgba(168, 85, 247, 0.15),
    0 0 0 1px rgba(168, 85, 247, 0.1) inset;
  transition: all 0.3s ease;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;

  @media (min-width: 768px) {
    border-radius: 8px;
  }

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1.75rem 1.25rem;
  }

  @media (max-width: 360px) {
    padding: 1.5rem 1rem;
  }

  &:hover {
    box-shadow: 
      0 12px 40px rgba(168, 85, 247, 0.3),
      0 0 0 1px rgba(168, 85, 247, 0.4) inset;
    transform: translateY(-5px);
    border-color: rgba(168, 85, 247, 0.6);
    background: linear-gradient(
      135deg,
      rgba(45, 40, 55, 1) 0%,
      rgba(40, 35, 50, 1) 100%
    );
  }
`;

const CourseTitle = styled.h2`
  font-family: 'Tomorrow', sans-serif;
  font-size: clamp(1.25rem, 4vw, 2.5rem);
  color: #ffffff;
  margin-bottom: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
  word-wrap: break-word;
  max-width: 100%;
  padding: 0 0.5rem;

  @media (max-width: 480px) {
    font-size: 1.375rem;
    letter-spacing: 0.5px;
    padding: 0 0.25rem;
  }

  @media (max-width: 360px) {
    font-size: 1.25rem;
  }
`;

const CourseInfo = styled.div`
  padding: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Tomorrow', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  > * {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }

  @media (min-width: 768px) {
    padding: 2rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }

  @media (max-width: 360px) {
    padding: 0.75rem;
  }
`;

const InfoGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
`;

const InfoCard = styled(motion.div)`
  background: rgba(15, 15, 15, 0.7);
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px solid rgba(113, 32, 176, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(113, 32, 176, 0.15);
  transition: all 0.3s ease;
  box-sizing: border-box;
  overflow: hidden;

  &:hover {
    border-color: rgba(113, 32, 176, 0.5);
    box-shadow: 0 8px 30px rgba(113, 32, 176, 0.25);
  }

  @media (min-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1.125rem;
  }

  @media (max-width: 360px) {
    padding: 1rem;
  }

  &.large {
    grid-column: 1 / -1;
    
    p {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      max-width: 100%;
      
      span {
        background: rgba(113, 32, 176, 0.1);
        padding: 0.3rem 0.8rem;
        border-radius: 15px;
        font-size: 0.85rem;
        border: 1px solid rgba(113, 32, 176, 0.3);
        word-wrap: break-word;
        max-width: 100%;

        @media (min-width: 768px) {
          font-size: 0.9rem;
        }

        @media (max-width: 480px) {
          font-size: 0.8rem;
          padding: 0.25rem 0.65rem;
        }

        @media (max-width: 360px) {
          font-size: 0.75rem;
          padding: 0.2rem 0.5rem;
        }
      }
    }
  }

  h4 {
    color: #7120b0;
    margin-bottom: 0.5rem;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    word-wrap: break-word;
    max-width: 100%;

    @media (min-width: 768px) {
      font-size: 0.9rem;
    }

    @media (max-width: 480px) {
      font-size: 0.8rem;
      letter-spacing: 0.5px;
    }
  }

  p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
    word-wrap: break-word;
    max-width: 100%;

    @media (min-width: 768px) {
      font-size: 1rem;
    }

    @media (max-width: 480px) {
      font-size: 0.85rem;
    }
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  li {
    color: #ffffff;
    padding: 0.8rem 0;
    display: flex;
    align-items: flex-start;
    font-family: 'Tomorrow', sans-serif;
    font-size: ${(props) => props.theme.fontmd};
    line-height: 1.6;
    word-wrap: break-word;
    max-width: 100%;

    @media (max-width: 480px) {
      font-size: 0.875rem;
      padding: 0.6rem 0;
      line-height: 1.5;
    }

    &:before {
      content: "";
      display: inline-block;
      width: 8px;
      height: 8px;
      min-width: 8px;
      margin-right: 1rem;
      margin-top: 0.5rem;
      background-color: #7120b0;
      border-radius: 50%;

      @media (max-width: 480px) {
        margin-right: 0.75rem;
        width: 6px;
        height: 6px;
        min-width: 6px;
      }
    }
  }
`;

const DetailsSection = styled(motion.div)`
  padding: 2rem;
  background: rgba(15, 15, 15, 0.7);
  border-radius: 12px;
  margin: 1.25rem 0; 
  border: 1px solid rgba(113, 32, 176, 0.3);
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(113, 32, 176, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-sizing: border-box;

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
    box-shadow: 0 12px 40px rgba(113, 32, 176, 0.35);
    transform: translateY(-6px);
    background: rgba(15, 15, 15, 0.85);
  }

  &:hover::before {
    opacity: 1;
  }

  @media (min-width: 768px) {
    padding: 2.5rem;
    margin: 2rem 0;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
    margin: 1rem 0;
    border-radius: 8px;
  }

  @media (max-width: 360px) {
    padding: 1.25rem 0.75rem;
  }

  h3 {
    color: #ffffff;
    margin-bottom: 1.5rem;
    font-size: 2rem;
    width: 100%;
    max-width: 100%;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    word-wrap: break-word;

    @media (max-width: 768px) {
      font-size: 1.5rem;
      margin-bottom: 1.25rem;
    }

    @media (max-width: 480px) {
      font-size: 1.25rem;
      letter-spacing: 0.5px;
      margin-bottom: 1rem;
    }

    @media (max-width: 360px) {
      font-size: 1.125rem;
    }
  }

  p {
    color: rgba(255, 255, 255, 0.8); 
    font-size: ${props => props.theme.fontlg};
    margin-bottom: 1.5rem;
    line-height: 1.6;
    word-wrap: break-word;
    max-width: 100%;

    @media (max-width: 480px) {
      font-size: 0.9375rem;
      line-height: 1.5;
      margin-bottom: 1rem;
    }
  }

  ${List} {
    width: 100%;
    max-width: 100%;
    margin-bottom: 0;
  }
`;

const ImageContainer = styled.div`
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  flex: 1;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(113, 32, 176, 0.3);
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  
  @media (min-width: 600px) {
    height: 230px;
  }
  
  @media (min-width: 768px) {
    height: calc((100% - 4rem) / 3); 
    min-height: 250px;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

// Logo animation - pulsing glow
const pulseGlow = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 40px rgba(113, 32, 176, 0.6)) drop-shadow(0 0 80px rgba(187, 32, 255, 0.4));
    transform: scale(1);
  }
  50% {
    filter: drop-shadow(0 0 60px rgba(113, 32, 176, 1)) drop-shadow(0 0 120px rgba(187, 32, 255, 0.8));
    transform: scale(1.05);
  }
`;

const FloatingLogoContainer = styled(motion.div)`
  height: 200px;
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  overflow: visible;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  
  @media (min-width: 600px) {
    height: 230px;
  }
  
  @media (min-width: 768px) {
    height: calc((100% - 4rem) / 3); 
    min-height: 250px;
  }
`;

const LogoImage = styled.img`
  width: 180px;
  height: 180px;
  object-fit: contain;
  animation: ${pulseGlow} 3s ease-in-out infinite;
  max-width: 100%;
  
  @media (min-width: 600px) {
    width: 220px;
    height: 220px;
  }
  
  @media (min-width: 768px) {
    width: 280px;
    height: 280px;
  }
  
  @media (min-width: 1200px) {
    width: 380px;
    height: 380px;
  }
`;

const DownloadButton = styled.a`
  display: inline-block;
  margin: 2rem auto 0;
  background-color: #7120b0;
  color: white;
  padding: 1rem 2rem;
  text-decoration: none;
  font-size: ${(props) => props.theme.fontmd};
  transition: all 0.3s ease;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  width: fit-content;
  max-width: calc(100% - 2rem);
  box-sizing: border-box;
  white-space: normal;

  &:hover {
    background-color: #9d20b0;
    box-shadow: 0 0 20px rgba(113, 32, 176, 0.6);
    transform: translateY(-3px);
  }

  @media (max-width: 768px) {
    margin: 1.5rem auto 0;
  }

  @media (max-width: 480px) {
    font-size: 0.875rem;
    padding: 0.875rem 1.5rem;
    letter-spacing: 0.5px;
    margin: 1.25rem auto 0;
  }

  @media (max-width: 360px) {
    padding: 0.75rem 1.25rem;
    font-size: 0.8125rem;
    letter-spacing: 0.25px;
  }
`;

const CoursesPage = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <PageSection>
      <Particles
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
            size: { value: 3 },
            opacity: { value: 0.5 },
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

      <Container
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <Title
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Intro to <span style={{ color: "#7120b0" }}>Blockchain</span>
        </Title>

        <ImageSection
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <ImageContainer
            as={motion.div}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <img src={educationImage1} alt="Education pic 1" />
          </ImageContainer>
          
          <FloatingLogoContainer
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <LogoImage src={BBLogo} alt="Boiler Blockchain Logo" />
          </FloatingLogoContainer>
          
          <ImageContainer
            as={motion.div}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <img src={educationImage3} alt="Education pic 3" />
          </ImageContainer>
        </ImageSection>

        <CourseCard
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <CourseTitle
            as={motion.h2}
            variants={fadeInUp}
          >
            Spring 2025 Techincal Course
          </CourseTitle>

          <CourseInfo>
            <InfoGrid
              as={motion.div}
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <InfoCard as={motion.div} variants={fadeInUp}>
                <h4>Location</h4>
                <p>TBD</p>
              </InfoCard>
              <InfoCard as={motion.div} variants={fadeInUp}>
                <h4>Schedule</h4>
                <p>TBD</p>
              </InfoCard>
              <InfoCard className="large" as={motion.div} variants={fadeInUp}>
                <h4>Course Staff</h4>
                <p>
                  {["Aditya Kuniyil Kattil", "Shivam Rastogi"].map((staff, index) => (
                    <motion.span
                      key={staff}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    >
                      {staff}
                    </motion.span>
                  ))}
                </p>
              </InfoCard>
            </InfoGrid>

            <DetailsSection
              as={motion.div}
              variants={fadeInUp}
            >
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                Course Description
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                This comprehensive course provides hands-on experience with blockchain technology 
                and decentralized applications from a developer perspective. Students will learn 
                everything from basic cryptography concepts to the latest developments in Web3, 
                gaining practical skills through weekly coding assignments and a final group project.
              </motion.p>
            </DetailsSection>

            <DetailsSection
              as={motion.div}
              variants={fadeInUp}
            >
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                Learning Outcomes
              </motion.h3>
              <List>
                {[
                  "Understand blockchain technologies at a technical level",
                  "Master cryptography fundamentals in blockchain systems",
                  "Develop with Ethereum's EVM",
                  "Write & deploy Solidity smart contracts",
                  "Utilize popular open-source solidity libraries",
                  "Build dApps with ethers.js & hardhat framework",
                  "Create real-world blockchain solutions"
                ].map((outcome, index) => (
                  <motion.li
                    key={outcome}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                  >
                    {outcome}
                  </motion.li>
                ))}
              </List>
            </DetailsSection>

            <DownloadButton
              as={motion.a}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              href="./Syllabus.pdf"
              download="Blockchain_Course_Syllabus.pdf"
            >
              Download Syllabus
            </DownloadButton>
          </CourseInfo>
        </CourseCard>
      </Container>
      <Footer />
    </PageSection>
  );
};

export default CoursesPage;

