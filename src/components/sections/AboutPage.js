import React, { useCallback, useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { motion, useInView } from "framer-motion";

import img5 from "../../assets/images/5.jpg";
import img6 from "../../assets/images/6.jpg";
import img7 from "../../assets/images/7.jpg";
import img9 from "../../assets/images/9.jpg";

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
`;


const Container = styled(motion.div)`
  width: 85%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 0;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Tomorrow', sans-serif;

  @media (max-width: 70em) {
    width: 90%;
  }
`;


const HeroTitle = styled.h1`
  font-size: 6rem; 
  color: #ffffff;
  text-align: center;
  margin-bottom: 2rem;
  margin-top: 1.5rem;
  font-weight: bold;
  font-family:'Tomorrow', sans-serif; 
  animation: fadeIn 1s ease-in;

  @media (max-width: 40em) {
    font-size: 4rem;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;


const HeroSubtitle = styled.p`
  font-size: ${props => props.theme.fontxl};
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  max-width: 800px;
  margin: 0 auto 4rem auto;
  font-family: 'Tomorrow', sans-serif;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;


const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  width: 100%;

  @media (max-width: 64em) {
    grid-template-columns: 1fr;
  }
`;


const ContentBlock = styled(motion.div)`
  background: linear-gradient(to right, rgba(255, 0, 204, 0.03), rgba(51, 51, 204, 0.03));
  padding: 2rem;
  border: 1px solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(to right, #ff00cc, #3333cc);
  backdrop-filter: blur(5px);
  font-family: 'Tomorrow', sans-serif;

  * {
    font-family: 'Tomorrow', sans-serif;
  }

  h2 {
    color: #ffffff;
    font-size: 2.75rem;
    margin-bottom: 1.5rem;
    font-family: 'Tomorrow', sans-serif;
    font-weight: bold;
  }

  p {
    color: rgba(255, 255, 255, 0.8); 
    font-size: ${props => props.theme.fontlg};
    margin-bottom: 1.5rem;
    line-height: 1.6;
    font-family: 'Tomorrow', sans-serif;
  }
  .button-container {
    display: flex;
    justify-content: center;
    margin-top: 1.5rem;
  }
`;


const List = styled.ul`
  list-style: none;
  padding: 0;


  li {
    color: #ffffff;
    padding: 0.8rem 0;
    display: flex;
    align-items: center;
    font-size: ${(props) => props.theme.fontmd};
    line-height: 1.6;


    &:before {
      content: "→";
      margin-right: 1rem;
      color: #ffffff;
    }
  }
`;


const ImageContainer  = styled(motion.div)`
  width: 100%;
  height: 100%;
  min-height: 300px;
  border-radius: 15px;
  overflow: hidden;


  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 100;
  backdrop-filter: blur(10px);


  &:before {
    content: "←";
    color: #ffffff;
  }


  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }


  @media (max-width: 40em) {
    padding: 0.8rem 1rem;
    font-size: ${(props) => props.theme.fontsm};
  }
`;




const LinkButton  = styled(motion.div)`
  display: inline-block;
  margin: 0 auto;
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


  &:hover {
    box-shadow: 0 0 10px 2px #ff00cc, 0 0 20px 4px #3333cc;
  }


  @media (max-width: 40em) {
    font-size: ${(props) => props.theme.fontmd};
    padding: 0.8rem 1.5rem;
  }
`;




const ParticlesBackground = ({ keyId }) => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      key={keyId}
      init={particlesInit}
      options={{
        background: { color: "#000000" },
        particles: {
          color: { value: "#ffffff" },
          links: {
            color: "#ff00cc",
            distance: 150,
            enable: true,
            opacity: 0.2, // Reduced from 0.4
            width: 1,
          },
          move: { enable: true, speed: 1 },
          number: { value: 80 }, // Reduced from 100
          size: { value: 2 },
          opacity: { value: 0.3 }, // Reduced from 0.5
        },
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
  );
};



const AboutPage = () => {
  const [particleKey, setParticleKey] = useState(Date.now());

  useEffect(() => {
    setParticleKey(Date.now());
  }, []);

  return (
    <PageSection>
      <ParticlesBackground keyId={particleKey} />
      <BackButton to="/">Back</BackButton>
      
      <Container
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroTitle>Who Are We?</HeroTitle>
          <HeroSubtitle>
            Boiler Blockchain is Purdue's premier student-led organization
            dedicated to advancing blockchain technology through innovation,
            education, and community.
          </HeroSubtitle>
        </motion.div>

        <Grid
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {[
            {
              title: "About Us",
              content: "At Boiler Blockchain, we're building the future of Web3 at Purdue University.",
              image: img6,
              list: [
                "Leading student-run blockchain organization fostering innovation and learning since 2021",
                "Collaborative environment bringing together developers, researchers, and industry partners",
                "Strong focus on practical implementation and real-world applications",
                "Active community of 200+ members from diverse academic backgrounds"
              ],
              button: {
                text: "Join Our Discord",
                link: "https://discord.com/invite/YdBH68uXUQ"
              },
              imageFirst: false
            },
            {
              title: "Hackathons & Innovation",
              content: "Creating breakthrough blockchain solutions through competitive innovation.",
              image: img7,
              list: [
                "Annual flagship hackathon with over $10,000 in prizes and industry sponsorships",
                "Focused tracks in DeFi, NFTs, Web3 infrastructure, and social impact",
                "Direct mentorship from experienced developers and industry professionals",
                "Opportunity to develop projects with real-world implementation potential"
              ],
              button: {
                text: "Hackathons",
                link: "#"
              },
              imageFirst: true
            },
            {
              title: "Learning & Development",
              content: "Comprehensive blockchain education from fundamentals to advanced implementation.",
              image: img5,
              list: [
                "Structured technical workshops covering Ethereum, Solidity, and Web3 development",
                "Hands-on experience with smart contracts and decentralized applications",
                "Access to industry-standard tools and development frameworks",
                "Collaborative learning environment with peer programming sessions"
              ],
              button: {
                text: "Education",
                link: "/education"
              },
              imageFirst: false
            },
            {
              title: "Community & Network",
              content: "Building lasting connections in the blockchain ecosystem.",
              image: img9,
              list: [
                "Regular networking events with industry professionals and alumni",
                "Opportunities to join specialized project teams and research groups",
                "Mentorship program connecting experienced members with newcomers",
                "Social events and collaborative learning sessions to strengthen community bonds"
              ],
              button: {
                text: "Join Our Discord",
                link: "https://discord.com/invite/YdBH68uXUQ"
              },
              imageFirst: true
            }
          ].map((section, index) => {
            const ScrollAnimatedSection = ({ children }) => {
              const ref = useRef(null);
              const isInView = useInView(ref, { once: true, margin: "-100px" });
              
              return (
                <motion.div
                  ref={ref}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.6 }}
                >
                  {children}
                </motion.div>
              );
            };

            const content = (
              <ContentBlock
                variants={fadeInUp}
                custom={index}
                initial="initial"
                animate="animate"
              >
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {section.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {section.content}
                </motion.p>
                <List>
                  {section.list.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                    >
                      {item}
                    </motion.li>
                  ))}
                </List>
                {section.button && (
                  <div className="button-container">
                    <LinkButton
                      as={motion.a}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={section.button.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {section.button.text}
                    </LinkButton>
                  </div>
                )}
              </ContentBlock>
            );

            const image = (
              <ImageContainer
                as={motion.div}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <img src={section.image} alt={section.title} />
              </ImageContainer>
            );

            return (
              <React.Fragment key={section.title}>
                <ScrollAnimatedSection>
                  {section.imageFirst ? image : content}
                </ScrollAnimatedSection>
                <ScrollAnimatedSection>
                  {section.imageFirst ? content : image}
                </ScrollAnimatedSection>
              </React.Fragment>
            );
          })}
        </Grid>
      </Container>
    </PageSection>
  );
};

export default AboutPage;