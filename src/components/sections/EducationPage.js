import React from 'react';
import styled from "styled-components";
import { Link } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { motion } from "framer-motion";
import img5 from "../../assets/images/5.jpg";
import img4 from "../../assets/images/4.jpg";
import img3 from "../../assets/images/3.jpg";


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

const BackButton = styled(Link)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.95);
  color: #ffffff;
  text-decoration: none;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 100;
  backdrop-filter: blur(10px);
  font-family: 'Tomorrow', sans-serif;

  &:before {
    content: "←";
    color: #ffffff;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  @media (min-width: 768px) {
    padding: 1rem 2rem;
    font-size: 1.1rem;
  }
`;

const Container = styled(motion.div)`
  width: 92%;
  max-width: 1400px;
  margin: 0 auto;
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
  font-family: 'Tomorrow', sans-serif;
  font-size: clamp(2.5rem, 8vw, 6rem);
  color: #ffffff;
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: bold;
  grid-column: 1 / -1;
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
  background: rgba(13, 13, 13, 0.6);
  border-radius: 15px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;

  @media (min-width: 768px) {
    border-radius: 20px;
  }

 

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 30px rgba(255, 0, 204, 0.2);
  }
`;

const CardHeader = styled.div`
  background: linear-gradient(90deg, rgba(255, 0, 204, 0.1), rgba(51, 51, 204, 0.1));
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const CourseTitle = styled.h2`
  font-family: 'Tomorrow', sans-serif;
  font-size: clamp(1.5rem, 4vw, 2rem);
  color: #ffffff;
  margin-bottom: 1rem;
`;

const CourseInfo = styled.div`
  padding: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Sora', sans-serif;
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
  background: rgba(255, 255, 255, 0.05);
  padding: 1.25rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);

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
        background: rgba(255, 0, 204, 0.1);
        padding: 0.3rem 0.8rem;
        border-radius: 15px;
        font-size: 0.85rem;
        border: 1px solid rgba(255, 0, 204, 0.2);

        @media (min-width: 768px) {
          font-size: 0.9rem;
        }
      }
    }
  }

  h4 {
    color: #ff00cc;
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
  list-style-type: none;
  padding: 0;
  margin: 1rem 0;

  li {
    color: rgba(255, 255, 255, 0.8);
    padding: 0.6rem 0;
    display: flex;
    align-items: center;
    font-family: 'Tomorrow', sans-serif;
    font-size: 0.9rem;
    
    @media (min-width: 768px) {
      padding: 0.8rem 0;
      font-size: 1rem;
    }
    
    &:before {
      content: "→";
      margin-right: 1rem;
      color: #ff00cc;
    }
  }
`;

const DetailsSection = styled(motion.div)`
  padding: 1.25rem;
  background: rgba(13, 13, 13, 0.6);
  border-radius: 15px;
  margin: 1.25rem 0; 
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  width: 100%; // Ensure full width
  backdrop-filter: blur(10px);

  @media (min-width: 768px) {
    padding: 2rem;
    margin: 2rem 0; 
    border-radius: 20px;
  }

  h3 {
    color: #ffffff;
    margin-bottom: 1rem;
    font-size: clamp(1.25rem, 3vw, 1.5rem);
    width: 100%; 
  }

  p {
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
    margin-bottom: 0;
    width: 100%;
  }

  ${List} {
    width: 100%;
    margin-bottom: 0;
  }
`;

const ImageContainer = styled.div`
  height: 250px;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
  flex: 1; 
  
  @media (min-width: 768px) {
    height: calc((100% - 4rem) / 3); 
    min-height: 250px; 
    border-radius: 20px;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
`;

const DownloadButton = styled.a`
  display: inline-block;
  margin: 2rem auto 0;
  background-color: transparent;
  color: white;
  padding: 1rem 2rem;
  text-decoration: none;
  font-size: ${(props) => props.theme.fontlg};
  transition: box-shadow 0.3s ease;
  border: 1px solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(to right, #ff00cc, #3333cc);
  cursor: pointer;
  text-align: center;
  font-family: 'Sora', sans-serif;
  width: fit-content;
  max-width: 100%;

  &:hover {
    box-shadow: 0 0 10px 2px #ff00cc, 0 0 20px 4px #3333cc;
  }

  @media (max-width: 40em) {
    font-size: ${(props) => props.theme.fontmd};
    padding: 0.8rem 1.5rem;
  }
`;



const EducationPage = () => {
  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  return (
    <PageSection>
      <Particles
        init={particlesInit}
        options={{
          background: { color: "#000000" },
          particles: {
            color: { value: "#ffffff" },
            links: {
              color: "#ff00cc",
              distance: 150,
              enable: true,
              opacity: 0.2,
              width: 1,
            },
            move: { enable: true, speed: 1 },
            number: { 
              value: 80,
              density: {
                enable: true,
                area: 800
              }
            },
            size: { value: 2 },
            opacity: { value: 0.3 },
          },
          responsive: [
            {
              maxWidth: 768,
              options: {
                particles: {
                  number: {
                    value: 40
                  }
                }
              }
            }
          ]
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

      <Container
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <Title
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Education
        </Title>

        <ImageSection
          initial={{ opacity: 0, x: -100 }}
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
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <CardHeader>
            <CourseTitle
              as={motion.h2}
              variants={fadeInUp}
            >
              Principles and Practices of Blockchain
            </CourseTitle>
          </CardHeader>

          <CourseInfo>
            <InfoGrid
              as={motion.div}
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <InfoCard as={motion.div} variants={fadeInUp}>
                <h4>Location</h4>
                <p>WANG 2599</p>
              </InfoCard>
              <InfoCard as={motion.div} variants={fadeInUp}>
                <h4>Schedule</h4>
                <p>Tuesday @ 6 pm</p>
              </InfoCard>
              <InfoCard className="large" as={motion.div} variants={fadeInUp}>
                <h4>Course Staff</h4>
                <p>
                  {["Prof. Torres-Arias", "Vincent Palmerio", "Adithya Ganesh", 
                    "Soham Jog", "Ansh Kothari (TA)", "Ansh Tandon (TA)"].map((staff, index) => (
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
              <p>
                This comprehensive course provides hands-on experience with blockchain technology 
                and decentralized applications from a developer perspective. Students will learn 
                everything from basic cryptography concepts to the latest developments in Web3, 
                gaining practical skills through weekly coding assignments and a final group project.
              </p>
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