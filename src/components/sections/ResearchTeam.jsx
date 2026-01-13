import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FiSearch, FiBook, FiTrendingUp, FiUsers, FiExternalLink } from 'react-icons/fi';
import Navigation from '../Navigation';
import Footer from '../Footer';

// CountUp Animation Component
const CountUp = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!hasAnimated) {
      setHasAnimated(true);
      let startTime;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        setCount(Math.floor(progress * end));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [end, duration, hasAnimated]);

  return <span>{count}{suffix}</span>;
};

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
  width: 90%;
  max-width: 1200px;
  margin: 0 auto 0;
  padding: 120px 2rem 0;
  position: relative;
  z-index: 2;
  
  @media (max-width: 1024px) {
    width: 95%;
    padding: 110px 1.75rem 0;
  }

  @media (max-width: 768px) {
    width: 95%;
    padding: 100px 1.5rem 0;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 80px 1rem 0;
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
  font-family: 'Tomorrow', sans-serif;

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
  font-family: 'Tomorrow', sans-serif;
`;

const StatsContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin: 4rem 0;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const StatCard = styled(motion.div)`
  background: rgba(15, 15, 15, 0.6);
  border: 1px solid rgba(113, 32, 176, 0.3);
  border-radius: 8px;
  padding: 1.8rem;
  backdrop-filter: blur(5px);
  box-shadow: 0 2px 10px rgba(113, 32, 176, 0.1);
  transition: all 0.3s ease;
  text-align: center;
  min-width: 180px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;

  &:hover {
    box-shadow: 0 4px 20px rgba(113, 32, 176, 0.2);
    transform: translateY(-2px);
    border-color: rgba(113, 32, 176, 0.6);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, rgba(113, 32, 176, 0.6), rgba(187, 32, 255, 0.6));
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1.25rem;
    min-width: 150px;
  }

  @media (max-width: 360px) {
    padding: 1.25rem 1rem;
    min-width: 130px;
  }
`;

const StatNumber = styled.h3`
  font-size: 2.5rem;
  color: #7120b0;
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-family: 'Tomorrow', sans-serif;
`;

const StatLabel = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: ${props => props.theme.fontmd};
  font-weight: 500;
  font-family: 'Tomorrow', sans-serif;
`;

const ResearchGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  margin: 3rem 0;

  @media (max-width: 968px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.25rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin: 2rem 0;
  }

  @media (max-width: 480px) {
    gap: 0.75rem;
  }
`;

const ResearchCard = styled(motion.div)`
  background: rgba(15, 15, 15, 0.7);
  border: 1px solid rgba(113, 32, 176, 0.3);
  border-radius: 12px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(113, 32, 176, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-sizing: border-box;

  &:hover {
    box-shadow: 0 12px 40px rgba(113, 32, 176, 0.3);
    transform: translateY(-6px);
    border-color: rgba(113, 32, 176, 0.6);
    background: rgba(15, 15, 15, 0.85);
  }

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

  &:hover::before {
    opacity: 1;
  }

  @media (max-width: 768px) {
    padding: 1.75rem 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1.25rem;
  }

  @media (max-width: 360px) {
    padding: 1.25rem 1rem;
  }
`;

const ResearchIcon = styled.div`
  width: 45px;
  height: 45px;
  background: rgba(113, 32, 176, 0.15);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  
  svg {
    color: #7120b0;
    font-size: 1.3rem;
  }
`;

const ResearchTitle = styled.h3`
  color: #ffffff;
  font-size: ${props => props.theme.fontlg};
  margin-bottom: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'Tomorrow', sans-serif;
`;

const ResearchDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  font-family: 'Tomorrow', sans-serif;
`;

const ResearchLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #7120b0;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  font-family: 'Tomorrow', sans-serif;
  
  &:hover {
    color: #bb20ff;
  }
  
  svg {
    font-size: 1rem;
  }
`;

const PublicationsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin: 3rem 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PublicationCard = styled(motion.div)`
  background: rgba(15, 15, 15, 0.7);
  border: 1px solid rgba(113, 32, 176, 0.3);
  border-radius: 12px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(113, 32, 176, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-sizing: border-box;

  &:hover {
    box-shadow: 0 12px 40px rgba(113, 32, 176, 0.3);
    transform: translateY(-6px);
    border-color: rgba(113, 32, 176, 0.6);
    background: rgba(15, 15, 15, 0.85);
  }

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

  &:hover::before {
    opacity: 1;
  }

  @media (max-width: 768px) {
    padding: 1.75rem 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1.25rem;
  }

  @media (max-width: 360px) {
    padding: 1.25rem 1rem;
  }
`;

const PublicationTitle = styled.h4`
  color: #ffffff;
  font-size: ${props => props.theme.fontlg};
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-family: 'Tomorrow', sans-serif;
`;

const PublicationAuthors = styled.p`
  color: #7120b0;
  font-size: ${props => props.theme.fontmd};
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-family: 'Tomorrow', sans-serif;
`;

const PublicationVenue = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: ${props => props.theme.fontsm};
  margin-bottom: 1rem;
  font-family: 'Tomorrow', sans-serif;
`;

const PublicationAbstract = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  line-height: 1.5;
  font-family: 'Tomorrow', sans-serif;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  color: #ffffff;
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Tomorrow', sans-serif;
  
  span {
    color: #7120b0;
  }
`;

const researchAreas = [
  {
    title: 'TradFi & DeFi',
    description: 'Researching the breakthroughs decentralized finance offers over traditional institutions. ',
    icon: FiTrendingUp,
    link: '#'
  },
  {
    title: 'Decentralization & Regulation',
    description: 'Analyzing the mechanisms, benefits, and tradeoffs of using a decentralized system.',
    icon: FiSearch,
    link: '#'
  },
  {
    title: 'Blockchain Architecture',
    description: 'Exploring the backbone behind what makes Blockchain Possible.',
    icon: FiUsers,
    link: '#'
  },
  {
    title: 'Privacy & Cryptography',
    description: 'Investigating zero-knowledge proof systems and privacy-focused blockchain applications.',
    icon: FiBook,
    link: '#'
  },
];

const publications = [
    {
        title: 'Why Crypto Tokens Aren\'t Just Stocks',
        authors: 'Alex Belanger, Viswa Choudhary, Vincent Zeng, Gavin Kulak, Adrian Mathew',
        abstract: 'TradFi & Defi'
    },
    {
        title: 'Tokenization Made Simple: Turning Real Things into Crypto',
        authors: 'Alex Belanger, Tobey Uhm, Preston Bunch, Sreevar Rao Patiyara, Nuraly Sermagambet, Abraham Kabon, Pratyush Ananth',
        abstract: 'TradFi & Defi'
    },
    {
        title: 'Stablecoins Explained: Why Crypto Needs a Dollar Twin',
        authors: 'Jacob Gutwein, Christopher Herzog, Jazib Qureshi, Sahil Jain, Aamiya Hashim',
        abstract: 'TradFi & Defi'
    },
    {
        title: 'Banks vs Blockchain: Who Holds Your Money?',
        authors: 'Jacob Gutwein, Eric Sadowski, Saahas Kandru, Keval S, Jackson Fuelling',
        abstract: 'TradFi & Defi'
    },
    {
        title: 'Proof of Work vs Proof of Stake: Which Is Better?',
        authors: 'Mahi Tripathi, Elizabeth Guo, Rohit Kelkar, Arnav Nayak, Ivy Wei',
        abstract: 'Blockchain Architecture'
    },
    {
        title: 'What Makes a Blockchain Different from a Database?',
        authors: 'Neena Naikar, Nikhil Aerabati, Daniel Jin, Adwika Mourya, Aryan Kondapalli',
        abstract: 'Blockchain Architecture'
    },
    {
        title: 'Smart Contracts: Digital Agreements Without Lawyers',
        authors: 'Albert Wu, Gleb Yanchenko, Venkat Mamidi, Nikhil Madakasira, Aayush Rao',
        abstract: 'Blockchain Architecture'
    },
    {
        title: 'Layer 0, 1, 2, 3: The Easy Guide to Blockchain Layers',
        authors: 'Albert Wu, Advait Bhowmik, Saket Banda, Aditya Tyagi, Vedh Janardhanan',
        abstract: 'Blockchain Architecture'
    },
    {
        title: 'Zero Knowledge Proofs: How to Prove Without Showing',
        authors: 'Eli Dubizh, Divyansh Pramanick, Samuel Stearns, Davis Renner, Peijia Guo',
        abstract: 'Privacy & Cryptography'
    },
    {
        title: 'What Is Bitcoin Mining? A Beginner’s Guide',
        authors: 'Siya Jariwala, Shrey Jain, Aniketh Upadhya, Srinidhi Tammana, Jason Kohut, Saketh Subramanian',
        abstract: 'Privacy & Cryptography'
    },
    {
        title: 'How Do DAOs Actually Make Decisions?',
        authors: 'Shariq Kapadia, Oscar Velasco, Arnav Mody, Sarathi Velmurugan, Ayaan Ameen, Lakulish Saini',
        abstract: 'Decentralization & Regulation'
    },
    {
        title: 'Centralization vs Decentralization: Pros and Cons of DAOs',
        authors: 'Pradyumn Malik, Vaibhav Sunkada, Aryan Patel, Sohum Kashyap, Nick Diaz',
        abstract: 'Decentralization & Regulation'
    }
];

const ResearchTeam = () => {
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
          initial={{ opacity: .5, y: 0, scale: .85 }}
          animate={{ opacity: 1, y: 0, scale: .95 }}
          transition={{ duration: 0.9, delay: .2, ease: "easeInOut" }}
        >
          Research <span>Team</span>
        </Title>

        <Subtitle
          initial={{ opacity: 0, y: 20, scale: .85}}
          animate={{ opacity: 1, y: 0, scale: .85 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeInOut" }}
        >
          Advancing blockchain technology through rigorous academic research and innovative solutions
        </Subtitle>

        <StatsContainer
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -40 }}
          transition={{ duration: 0.8, delay: 0.3 , ease: "easeInOut"}}
        >
          <StatCard whileHover={{ y: -2 }}>
            <StatNumber><CountUp end={50} suffix="+" /></StatNumber>
            <StatLabel>Researchers</StatLabel>
          </StatCard>
          <StatCard whileHover={{ y: -2 }}>
            <StatNumber><CountUp end={12} /></StatNumber>
            <StatLabel>Teams</StatLabel>
          </StatCard>
          <StatCard whileHover={{ y: -2 }}>
            <StatNumber><CountUp end={4} /></StatNumber>
            <StatLabel>Research Areas</StatLabel>
          </StatCard>
        </StatsContainer>

        <SectionTitle
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Research <span>Areas</span>
        </SectionTitle>
        
        <ResearchGrid
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {researchAreas.map((area, index) => (
            <ResearchCard
              key={area.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -2 }}
            >
              <ResearchIcon>
                <area.icon />
              </ResearchIcon>
              <ResearchTitle>{area.title}</ResearchTitle>
              <ResearchDescription>{area.description}</ResearchDescription>
              <ResearchLink href={area.link}>
                <FiExternalLink /> Learn More
              </ResearchLink>
            </ResearchCard>
          ))}
        </ResearchGrid>

        <SectionTitle
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Recent <span>Publications</span>
        </SectionTitle>
        
        <PublicationsGrid
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1}}
        >
          {publications.map((pub, index) => (
            <PublicationCard
              key={pub.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1}}
              whileHover={{ y: -2 }}
            >
              <PublicationTitle>{pub.title}</PublicationTitle>
              <PublicationAuthors>{pub.authors}</PublicationAuthors>
              <PublicationAbstract>{pub.abstract}</PublicationAbstract>
            </PublicationCard>
          ))}
        </PublicationsGrid>
      </Container>
      <Footer />
    </PageSection>
  );
};

export default ResearchTeam;