import React, { useCallback } from 'react';
import styled from "styled-components";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { motion } from "framer-motion";
import img5 from "../../assets/images/5.jpg";
import img4 from "../../assets/images/4.jpg";
import img3 from "../../assets/images/3.jpg";
import Navigation from '../Navigation';

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
  background-color: #000000;
  position: relative;
  overflow: hidden;
  padding-top: 4rem;
  font-family: 'Tomorrow', sans-serif; 
  
  * {
    font-family: 'Tomorrow', sans-serif; 
  }
`;



const Container = styled(motion.div)`
  width: 92%;
  max-width: 1400px;
  margin: 6rem auto 0;
  padding: 2rem 0;
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    width: 85%;
    padding: 4rem 0;
    gap: 2rem;
  }
  
  @media (min-width: 1200px) {
    grid-template-columns: 0.8fr 1.2fr;
    align-items: stretch;
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

  @media (max-width: 40em) {
    font-size: 4rem;
  }
`;

const ImageSection = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
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
  background: rgba(15, 15, 15, 0.7);
  padding: 2.5rem;
  border: 1px solid #7120b0;
  border-radius: 8px;
  backdrop-filter: blur(5px);
  font-family: 'Tomorrow', sans-serif;
  box-shadow: 0 4px 20px rgba(113, 32, 176, 0.15);
  transition: all 0.3s ease;
  position: relative;

  @media (min-width: 768px) {
    border-radius: 8px;
  }

  &:hover {
    box-shadow: 0 4px 30px rgba(113, 32, 176, 0.3);
    transform: translateY(-5px);
  }
`;

const CourseTitle = styled.h2`
  font-family: 'Tomorrow', sans-serif;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  color: #ffffff;
  margin-bottom: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const CourseInfo = styled.div`
  padding: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Tomorrow', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;

  > * {
    width: 100%; 
  }

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const InfoGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const InfoCard = styled(motion.div)`
  background: rgba(15, 15, 15, 0.7);
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid rgba(113, 32, 176, 0.3);
  box-shadow: 0 4px 20px rgba(113, 32, 176, 0.15);

  @media (min-width: 768px) {
    padding: 1.5rem;
  }

  &.large {
    grid-column: 1 / -1;
    
    p {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      
      span {
        background: rgba(113, 32, 176, 0.1);
        padding: 0.3rem 0.8rem;
        border-radius: 15px;
        font-size: 0.85rem;
        border: 1px solid rgba(113, 32, 176, 0.3);

        @media (min-width: 768px) {
          font-size: 0.9rem;
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

    @media (min-width: 768px) {
      font-size: 0.9rem;
    }
  }

  p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;

    @media (min-width: 768px) {
      font-size: 1rem;
    }
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;

  li {
    color: #ffffff;
    padding: 0.8rem 0;
    display: flex;
    align-items: center;
    font-family: 'Tomorrow', sans-serif;
    font-size: ${(props) => props.theme.fontmd};
    line-height: 1.6;

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

const DetailsSection = styled(motion.div)`
  padding: 2rem;
  background: rgba(15, 15, 15, 0.7);
  border-radius: 8px;
  margin: 1.25rem 0; 
  border: 1px solid rgba(113, 32, 176, 0.3);
  display: flex;
  flex-direction: column;
  width: 100%;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 20px rgba(113, 32, 176, 0.15);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 30px rgba(113, 32, 176, 0.3);
    transform: translateY(-5px);
  }

  @media (min-width: 768px) {
    padding: 2.5rem;
    margin: 2rem 0;
  }

  h3 {
    color: #ffffff;
    margin-bottom: 1.5rem;
    font-size: 2rem;
    width: 100%;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  p {
    color: rgba(255, 255, 255, 0.8); 
    font-size: ${props => props.theme.fontlg};
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }

  ${List} {
    width: 100%;
    margin-bottom: 0;
  }
`;

const ImageContainer = styled.div`
  height: 250px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  flex: 1;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(113, 32, 176, 0.3);
  
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

const DownloadButton = styled.a`
  display: inline-block;
  margin: 2rem auto 0;
  background-color: #7120b0;
  color: white;
  padding: 1rem 2rem;
  text-decoration: none;
  font-size: ${(props) => props.theme.fontmd};
  transition: all 0.3s ease;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  width: fit-content;
  max-width: 100%;

  &:hover {
    background-color: #9d20b0;
    box-shadow: 0 0 20px rgba(113, 32, 176, 0.6);
    transform: translateY(-3px);
  }

  @media (max-width: 40em) {
    font-size: ${(props) => props.theme.fontsm};
    padding: 0.8rem 1.5rem;
  }
`;

const EducationPage = () => {
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
              opacity: 0.5,
              width: 1,
            },
            move: { enable: true, speed: 0.8 },
            number: { value: 60 },
            size: { value: 2 },
            opacity: { value: 0.3 },
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
          Technical <span style={{ color: "#7120b0" }}>Course</span>
        </Title>

        <ImageSection
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {[img5, img4, img3].map((img, index) => (
            <ImageContainer
              as={motion.div}
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
            >
              <img src={img} alt={`Education pic ${index + 1}`} />
            </ImageContainer>
          ))}
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
            Principles and Practices of Blockchain
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
                <p>WANG 2579</p>
              </InfoCard>
              <InfoCard as={motion.div} variants={fadeInUp}>
                <h4>Schedule</h4>
                <p>Monday @ 5 pm</p>
              </InfoCard>
              <InfoCard className="large" as={motion.div} variants={fadeInUp}>
                <h4>Course Staff</h4>
                <p>
                  {["Prof. Mithuna thottethodi", "Vincent Palmerio", "Shivam Rastogi", "Adithya Ganesh",
                    "Mugdha Patil (TA)", "Aditya Kuniyil Kattil (TA)"].map((staff, index) => (
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
    </PageSection>
  );
};

export default EducationPage;