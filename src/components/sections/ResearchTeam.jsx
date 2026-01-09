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
  grid-template-columns: repeat(2, 1fr); /* Creates 2 large columns */
  gap: 2rem;
  margin: 5rem 0 8rem; /* Large bottom margin to separate from Publications */

  @media (max-width: 968px) {
    grid-template-columns: 1fr; /* Stacks them on tablets/phones */
    gap: 1.5rem;
  }
`;

const ResearchCard = styled(motion.div)`
  background: rgba(15, 15, 15, 0.7);
  border: 1px solid rgba(113, 32, 176, 0.3);
  border-radius: 16px;
  padding: 4rem 3rem; /* Extra padding makes the boxes feel massive and premium */
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, transparent, #7120b0, transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover::after {
    opacity: 1;
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
  font-size: 2rem; /* Much larger titles */
  color: #ffffff;
  margin: 1.5rem 0 1rem;
  font-family: 'Tomorrow', sans-serif;
  letter-spacing: 1px;
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

const PublicationsList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  margin: 2rem 0 8rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const PublicationRow = styled(motion.a)`
  display: grid;
  grid-template-columns: 120px 1fr 200px;
  align-items: center;
  padding: 1.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-decoration: none;
  transition: all 0.2s ease;
  group;

  &:hover {
    background: rgba(113, 32, 176, 0.03);
  }

  @media (max-width: 768px) {
    grid-template-columns: 80px 1fr;
    gap: 0.5rem;
  }
`;

const PubDate = styled.span`
  font-family: 'Space Mono', monospace;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.4);
`;

const PubTitle = styled.span`
  font-size: 1.1rem;
  color: #ffffff;
  font-weight: 500;
  transition: color 0.2s ease;

  ${PublicationRow}:hover & {
    color: #bb20ff;
  }
`;

const PubTeamBadge = styled.span`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #7120b0;
  background: rgba(113, 32, 176, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
  width: fit-content;
  justify-self: end;

  @media (max-width: 768px) {
    grid-column: 2;
    justify-self: start;
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
  { title: 'Investment Team', description: 'Deep-dive analysis on tokenomics and VC opportunities.', icon: FiTrendingUp, link: '#' },
  { title: 'Consulting Team', description: 'Advising protocols on governance and growth strategy.', icon: FiUsers, link: '#' },
  { title: 'Due Diligence Team', description: 'Technical audits and whitepaper fundamental analysis.', icon: FiSearch, link: '#' },
  { title: 'Trading Team', description: 'Quantitative strategies and MEV research.', icon: FiBook, link: '#' },
];

const publications = [
    {
        date: 'OCT 2025',
        title: 'Why Crypto Tokens Aren\'t Just Stocks',
        authors: 'Alex Belanger, Viswa Choudhary, Vincent Zeng, Gavin Kulak, Adrian Mathew',
        abstract: 'TradFi & Defi',
        team: 'Investment Team',
        url: '#'
    },
    {
        date: 'OCT 2025',
        title: 'Tokenization Made Simple: Turning Real Things into Crypto',
        authors: 'Alex Belanger, Tobey Uhm, Preston Bunch, Sreevar Rao Patiyara, Nuraly Sermagambet, Abraham Kabon, Pratyush Ananth',
        abstract: 'TradFi & Defi',
        team: 'Investment Team'
    },
    {
        date: 'OCT 2025',
        title: 'Stablecoins Explained: Why Crypto Needs a Dollar Twin',
        authors: 'Jacob Gutwein, Christopher Herzog, Jazib Qureshi, Sahil Jain, Aamiya Hashim',
        abstract: 'TradFi & Defi',
        team: 'Investment Team'
    },
    {
        date: 'OCT 2025',
        title: 'Banks vs Blockchain: Who Holds Your Money?',
        authors: 'Jacob Gutwein, Eric Sadowski, Saahas Kandru, Keval S, Jackson Fuelling',
        abstract: 'TradFi & Defi',
        team: 'Investment Team'
    },
    {
        date: 'OCT 2025',
        title: 'Proof of Work vs Proof of Stake: Which Is Better?',
        authors: 'Mahi Tripathi, Elizabeth Guo, Rohit Kelkar, Arnav Nayak, Ivy Wei',
        abstract: 'Blockchain Architecture',
        team: 'Consulting Team'
    },
    {
        date: 'OCT 2025',
        title: 'What Makes a Blockchain Different from a Database?',
        authors: 'Neena Naikar, Nikhil Aerabati, Daniel Jin, Adwika Mourya, Aryan Kondapalli',
        abstract: 'Blockchain Architecture',
        team: 'Consulting Team'
    },
    {
        date: 'OCT 2025',
        title: 'Smart Contracts: Digital Agreements Without Lawyers',
        authors: 'Albert Wu, Gleb Yanchenko, Venkat Mamidi, Nikhil Madakasira, Aayush Rao',
        abstract: 'Blockchain Architecture',
        team: 'Consulting Team'
    },
    {
        date: 'OCT 2025',
        title: 'Layer 0, 1, 2, 3: The Easy Guide to Blockchain Layers',
        authors: 'Albert Wu, Advait Bhowmik, Saket Banda, Aditya Tyagi, Vedh Janardhanan',
        abstract: 'Blockchain Architecture',
        team: 'Consulting Team'
    },
    {
        date: 'OCT 2025',
        title: 'Zero Knowledge Proofs: How to Prove Without Showing',
        authors: 'Eli Dubizh, Divyansh Pramanick, Samuel Stearns, Davis Renner, Peijia Guo',
        abstract: 'Privacy & Cryptography',
        team: 'Consulting Team'
    },
    {
        date: 'OCT 2025',
        title: 'What Is Bitcoin Mining? A Beginner’s Guide',
        authors: 'Siya Jariwala, Shrey Jain, Aniketh Upadhya, Srinidhi Tammana, Jason Kohut, Saketh Subramanian',
        abstract: 'Privacy & Cryptography',
        team: 'Consulting Team'

    },
    {
        date: 'OCT 2025', 
        title: 'How Do DAOs Actually Make Decisions?',
        authors: 'Shariq Kapadia, Oscar Velasco, Arnav Mody, Sarathi Velmurugan, Ayaan Ameen, Lakulish Saini',
        abstract: 'Decentralization & Regulation',
        team: 'Consulting Team'
    },
    {
        date: 'OCT 2025',
        title: 'Centralization vs Decentralization: Pros and Cons of DAOs',
        authors: 'Pradyumn Malik, Vaibhav Sunkada, Aryan Patel, Sohum Kashyap, Nick Diaz',
        abstract: 'Decentralization & Regulation',
        team: 'Consulting Team'
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
    <Particles /* ... same options as before ... */ />
    
    <Container>
      {/* Landing Text */}
      <Title
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Research <span>Team</span>
      </Title>

      <Subtitle
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Advancing blockchain technology through rigorous academic research and innovative solutions.
      </Subtitle>

      {/* The 4 Team Boxes */}
      <ResearchGrid
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {researchAreas.map((area) => (
          <ResearchCard key={area.title} whileHover={{ y: -10 }}>
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

      {/* Publications Section */}
      <SectionTitle
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Recent <span>Publications</span>
      </SectionTitle>
      
      <SectionTitle
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
  style={{ textAlign: 'left', marginBottom: '1rem' }} // Stripe style usually aligns left
>
  Recent <span>Publications</span>
</SectionTitle>

<PublicationsList>
  {publications.map((pub, index) => (
    <PublicationRow 
      key={index} 
      href={pub.url}
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <PubDate>{pub.date}</PubDate>
      <PubTitle>{pub.title}</PubTitle>
      <PubTeamBadge>{pub.team}</PubTeamBadge>
    </PublicationRow>
  ))}
</PublicationsList>
    </Container>
    <Footer />
  </PageSection>
  );
};

export default ResearchTeam;