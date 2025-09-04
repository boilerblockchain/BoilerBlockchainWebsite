import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FiSpeaker, FiTrendingUp, FiUsers, FiBarChart, FiInstagram, FiTwitter } from 'react-icons/fi';
import Navigation from '../Navigation';

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
  padding: 4rem 0;
  font-family: 'Tomorrow', sans-serif;
  
  * {
    font-family: 'Tomorrow', sans-serif;
  }
`;

const Container = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 6rem auto 0;
  position: relative;
  z-index: 2;
  
  @media (max-width: 70em) {
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

const CampaignsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  margin: 3rem 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CampaignCard = styled(motion.div)`
  background: rgba(15, 15, 15, 0.6);
  border: 1px solid rgba(113, 32, 176, 0.3);
  border-radius: 8px;
  padding: 1.8rem;
  backdrop-filter: blur(5px);
  box-shadow: 0 2px 10px rgba(113, 32, 176, 0.1);
  transition: all 0.3s ease;
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

const CampaignIcon = styled.div`
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

const CampaignTitle = styled.h3`
  color: #ffffff;
  font-size: ${props => props.theme.fontlg};
  margin-bottom: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'Tomorrow', sans-serif;
`;

const CampaignDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  font-family: 'Tomorrow', sans-serif;
`;

const CampaignStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
  
  span {
    display: block;
    color: #7120b0;
    font-weight: 700;
    font-size: 1.2rem;
    font-family: 'Tomorrow', sans-serif;
  }
  
  small {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.8rem;
    text-transform: uppercase;
    font-family: 'Tomorrow', sans-serif;
  }
`;

const SocialGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  margin: 3rem 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SocialCard = styled(motion.div)`
  background: rgba(15, 15, 15, 0.6);
  border: 1px solid rgba(113, 32, 176, 0.3);
  border-radius: 8px;
  padding: 1.8rem;
  backdrop-filter: blur(5px);
  box-shadow: 0 2px 10px rgba(113, 32, 176, 0.1);
  transition: all 0.3s ease;
  text-align: center;
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

const SocialIcon = styled.div`
  width: 45px;
  height: 45px;
  background: rgba(113, 32, 176, 0.15);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  
  svg {
    color: #7120b0;
    font-size: 1.3rem;
  }
`;

const SocialName = styled.h4`
  color: #ffffff;
  font-size: ${props => props.theme.fontlg};
  margin-bottom: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'Tomorrow', sans-serif;
`;

const SocialMetric = styled.p`
  color: #7120b0;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-family: 'Tomorrow', sans-serif;
`;

const SocialGrowth = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
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

const campaigns = [
  {
    title: 'Blockchain Education Series',
    description: 'Monthly educational content series covering blockchain fundamentals, targeting students and professionals new to the space.',
    icon: FiUsers,
    reach: '50K',
    engagement: '12%',
  },
  {
    title: 'DeFi Awareness Campaign',
    description: 'Multi-platform campaign educating users about DeFi protocols, yield farming, and risk management strategies.',
    icon: FiTrendingUp,
    reach: '75K',
    engagement: '8%',
  },
  {
    title: 'Community Growth Initiative',
    description: 'Comprehensive strategy to grow our Discord community through events, AMAs, and exclusive content.',
    icon: FiSpeaker,
    reach: '100K',
    engagement: '15%',
  },
  {
    title: 'Partner Collaboration Program',
    description: 'Strategic partnerships with other blockchain organizations to cross-promote events and educational content.',
    icon: FiBarChart,
    reach: '200K',
    engagement: '6%',
  }
];

const socialChannels = [
  {
    name: 'Instagram',
    icon: FiInstagram,
    followers: '15K',
    growth: '+25% this month'
  },
  {
    name: 'Twitter',
    icon: FiTwitter,
    followers: '8.5K',
    growth: '+18% this month'
  },
  {
    name: 'Discord',
    icon: FiUsers,
    members: '2.3K',
    growth: '+30% this month'
  }
];

const MarketingTeam = () => {
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
              opacity: 0.3,
              width: 1,
            },
            move: { enable: true, speed: 0.5 },
            number: { value: 40 },
            opacity: { value: 0.2 },
            size: { value: 1.5 },
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
                distance: 100,
                links: { opacity: 0.3 }
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
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Marketing <span>Team</span>
        </Title>

        <Subtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Building brand awareness and community engagement through strategic marketing initiatives
        </Subtitle>

        <StatsContainer
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <StatCard whileHover={{ y: -2 }}>
            <StatNumber><CountUp end={500} suffix="K+" /></StatNumber>
            <StatLabel>Total Reach</StatLabel>
          </StatCard>
          <StatCard whileHover={{ y: -2 }}>
            <StatNumber><CountUp end={25} suffix="K+" /></StatNumber>
            <StatLabel>Community Members</StatLabel>
          </StatCard>
          <StatCard whileHover={{ y: -2 }}>
            <StatNumber><CountUp end={12} suffix="+" /></StatNumber>
            <StatLabel>Active Campaigns</StatLabel>
          </StatCard>
          <StatCard whileHover={{ y: -2 }}>
            <StatNumber><CountUp end={85} suffix="%" /></StatNumber>
            <StatLabel>Engagement Rate</StatLabel>
          </StatCard>
        </StatsContainer>

        <SectionTitle
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Active <span>Campaigns</span>
        </SectionTitle>
        
        <CampaignsGrid
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {campaigns.map((campaign, index) => (
            <CampaignCard
              key={campaign.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -2 }}
            >
              <CampaignIcon>
                <campaign.icon />
              </CampaignIcon>
              <CampaignTitle>{campaign.title}</CampaignTitle>
              <CampaignDescription>{campaign.description}</CampaignDescription>
              <CampaignStats>
                <StatItem>
                  <span><CountUp end={parseInt(campaign.reach.replace('K', ''))} suffix="K" /></span>
                  <small>Reach</small>
                </StatItem>
                <StatItem>
                  <span><CountUp end={parseInt(campaign.engagement.replace('%', ''))} suffix="%" /></span>
                  <small>Engagement</small>
                </StatItem>
              </CampaignStats>
            </CampaignCard>
          ))}
        </CampaignsGrid>

        <SectionTitle
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Social <span>Channels</span>
        </SectionTitle>
        
        <SocialGrid
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {socialChannels.map((channel, index) => (
            <SocialCard
              key={channel.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -2 }}
            >
              <SocialIcon>
                <channel.icon />
              </SocialIcon>
              <SocialName>{channel.name}</SocialName>
              <SocialMetric>
                <CountUp end={parseFloat(channel.followers?.replace('K', '') || channel.members?.replace('K', ''))} 
                         suffix={channel.followers?.includes('K') || channel.members?.includes('K') ? 'K' : ''} />
              </SocialMetric>
              <SocialGrowth>{channel.growth}</SocialGrowth>
            </SocialCard>
          ))}
        </SocialGrid>
      </Container>
    </PageSection>
  );
};

export default MarketingTeam;