import React, { useCallback, useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";


import img5 from "../../assets/images/5.jpg";
import img6 from "../../assets/images/6.jpg";
import img7 from "../../assets/images/7.jpg";
import img9 from "../../assets/images/9.jpg";


const PageSection = styled.section`
  min-height: 100vh;
  width: 100%;
  background-color: #000000;
  position: relative;
  overflow: hidden;
  padding-top: 4rem;
`;


const Container = styled.div`
  width: 85%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 0;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;


  @media (max-width: 70em) {
    width: 90%;
  }
`;


const HeroTitle = styled.h1`
  font-size: ${(props) => props.theme.fontxxl};
  color: #ffffff;
  text-align: center;
  margin-bottom: 1.5rem;


  @media (max-width: 40em) {
    font-size: ${(props) => props.theme.fontxl};
  }
`;


const HeroSubtitle = styled.p`
  font-size: ${(props) => props.theme.fontlg};
  color: #ffffff;
  text-align: center;
  max-width: 800px;
  margin: 0 auto 4rem auto;
  opacity: 0.9;
`;


const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  width: 100%;


  @media (max-width: 64em) {
    grid-template-columns: 1fr;
  }
`;


const ContentBlock = styled.div`
  background: linear-gradient(to right, rgba(255, 0, 204, 0.05), rgba(51, 51, 204, 0.05));
  padding: 2rem;
  border: 1px solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(to right, #ff00cc, #3333cc);


  h2 {
    color: #ffffff;
    font-size: ${(props) => props.theme.fontxl};
    margin-bottom: 1.5rem;
  }


  p {
    color: #ffffff;
    font-size: ${(props) => props.theme.fontlg};
    margin-bottom: 1.5rem;
    line-height: 1.6;
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


const ImageContainer = styled.div`
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




const LinkButton = styled.a`
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
      key={keyId} // Unique key for each instance
      init={particlesInit}
      options={{
        background: { color: "#000000" },
        particles: {
          color: { value: "#ffffff" },
          links: {
            color: "#ff00cc",
            distance: 150,
            enable: true,
            opacity: 0.4,
            width: 1,
          },
          move: { enable: true, speed: 1 },
          number: { value: 100 },
          size: { value: 2 },
          opacity: { value: 0.5 },
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
      <Container>
        <HeroTitle>Who Are We?</HeroTitle>
        <HeroSubtitle>
          Boiler Blockchain is Purdue's premier student-led organization
          dedicated to advancing blockchain technology through innovation,
          education, and community.
        </HeroSubtitle>


        <Grid>
          <ContentBlock>
            <h2>About Us</h2>
            <p>
              At Boiler Blockchain, we're building the future of Web3 at Purdue
              University.
            </p>
            <List>
              <li>
                Leading student-run blockchain organization fostering innovation
                and learning since 2021
              </li>
              <li>
                Collaborative environment bringing together developers,
                researchers, and industry partners
              </li>
              <li>
                Strong focus on practical implementation and real-world
                applications
              </li>
              <li>
                Active community of 200+ members from diverse academic
                backgrounds
              </li>
            </List>
            <div className="button-container">
    <LinkButton
      href="https://discord.com/invite/YdBH68uXUQ"
      target="_blank"
      rel="noopener noreferrer"
    >
      Join Our Discord
    </LinkButton>
  </div>
          </ContentBlock>


          <ImageContainer>
            <img src={img6} alt="about" />
          </ImageContainer>


          <ImageContainer>
            <img src={img7} alt="Hackathons" />
          </ImageContainer>


          <ContentBlock>
            <h2>Hackathons & Innovation</h2>
            <p>
              Creating breakthrough blockchain solutions through competitive
              innovation.
            </p>
            <List>
              <li>
                Annual flagship hackathon with over $10,000 in prizes and
                industry sponsorships
              </li>
              <li>
                Focused tracks in DeFi, NFTs, Web3 infrastructure, and social
                impact
              </li>
              <li>
                Direct mentorship from experienced developers and industry
                professionals
              </li>
              <li>
                Opportunity to develop projects with real-world implementation
                potential
              </li>
             
         
            </List>
            <div className="button-container">
            <LinkButton
          // href="https://discord.com/invite/YdBH68uXUQ" // link to hackathons page
          // target="_blank"
          // rel="noopener noreferrer"
        >
          Hackathons
          </LinkButton>
          </div>
          </ContentBlock>


          <ContentBlock>
            <h2>Learning & Development</h2>
            <p>
              Comprehensive blockchain education from fundamentals to advanced
              implementation.
            </p>
            <List>
              <li>
                Structured technical workshops covering Ethereum, Solidity, and
                Web3 development
              </li>
              <li>
                Hands-on experience with smart contracts and decentralized
                applications
              </li>
              <li>
                Access to industry-standard tools and development frameworks
              </li>
              <li>
                Collaborative learning environment with peer programming
                sessions
              </li>
            </List>
            <div className="button-container">
            <LinkButton
          // href="https://discord.com/invite/YdBH68uXUQ" // link to classes page
          // target="_blank"
          // rel="noopener noreferrer"
           >
          Classes
          </LinkButton>
          </div>
          </ContentBlock>


          <ImageContainer>
            <img src={img5} alt="Learning" />
          </ImageContainer>


          <ImageContainer>
            <img src={img9} alt="Community" />
          </ImageContainer>


          <ContentBlock>
            <h2>Community & Network</h2>
            <p>Building lasting connections in the blockchain ecosystem.</p>
            <List>
              <li>
                Regular networking events with industry professionals and alumni
              </li>
              <li>
                Opportunities to join specialized project teams and research
                groups
              </li>
              <li>
                Mentorship program connecting experienced members with newcomers
              </li>
              <li>
                Social events and collaborative learning sessions to strengthen
                community bonds
              </li>
            </List>
            {/* <LinkButton
          // href="https://discord.com/invite/YdBH68uXUQ" // maybe add button here for schedule
          // target="_blank"
          // rel="noopener noreferrer"
           >


          </LinkButton> */}
          </ContentBlock>
        </Grid>


       
      </Container>
    </PageSection>
  );
};


export default AboutPage;



