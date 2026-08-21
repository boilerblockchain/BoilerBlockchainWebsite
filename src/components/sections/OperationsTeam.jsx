import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ExternalLink } from '../ui/Arrow';

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
    color: ${({ theme }) => theme.color.accent};
  }

  @media (max-width: 40em) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: ${props => props.theme.fontSize.bodyLarge};
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
  background: ${({ theme }) => theme.color.surfaceRaised};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 1.8rem;
  box-shadow: ${({ theme }) => theme.elevation[1]};
  transition: transform ${({ theme }) => theme.motion.base},
              border-color ${({ theme }) => theme.motion.base},
              box-shadow ${({ theme }) => theme.motion.base};
  text-align: center;
  min-width: 180px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;

  &:hover {
    box-shadow: ${({ theme }) => theme.elevation[2]};
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.color.accentBorderStrong};
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
  color: ${({ theme }) => theme.color.accent};
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-family: 'Tomorrow', sans-serif;
`;

const StatLabel = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: ${props => props.theme.fontSize.body};
  font-weight: 500;
  font-family: 'Tomorrow', sans-serif;
`;

const OperationsGrid = styled(motion.div)`
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

const OperationsCard = styled(motion.div)`
  background: ${({ theme }) => theme.color.surfaceRaised};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.elevation[1]};
  transition: transform ${({ theme }) => theme.motion.base},
              border-color ${({ theme }) => theme.motion.base},
              box-shadow ${({ theme }) => theme.motion.base};
  position: relative;
  overflow: hidden;
  box-sizing: border-box;

  &:hover {
    box-shadow: ${({ theme }) => theme.elevation[2]};
    transform: translateY(-4px);
    border-color: ${({ theme }) => theme.color.accentBorderStrong};
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

const OperationsTitle = styled.h3`
  color: #ffffff;
  font-size: ${props => props.theme.fontSize.bodyLarge};
  margin-bottom: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'Tomorrow', sans-serif;
`;

const OperationsDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  font-family: 'Tomorrow', sans-serif;
`;

const OperationsLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.color.accent};
  text-decoration: none;
  font-weight: 500;
  transition: color ${({ theme }) => theme.motion.base};
  font-family: 'Tomorrow', sans-serif;

  &:hover {
    color: ${({ theme }) => theme.color.accentBright};
  }
  
  svg {
    font-size: 1rem;
  }
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
    color: ${({ theme }) => theme.color.accent};
  }
`;

const operationsAreas = [
  {
    title: 'Event Management',
    description: 'Organizing hackathons, workshops, and community events to foster blockchain innovation and engagement.',
    link: '#'
  },
  {
    title: 'Finance & Budgeting',
    description: 'Managing organizational finances, budgets, and resource allocation to support our mission.',
    link: '#'
  },
  {
    title: 'Community Operations',
    description: 'Building and maintaining our community presence across platforms and managing member engagement.',
    link: '#'
  },
  {
    title: 'Infrastructure & Systems',
    description: 'Maintaining organizational infrastructure, tools, and systems to ensure smooth operations.',
    link: '#'
  },
];

const OperationsTeam = () => {
  return (
    <PageSection>
      <Container>
        <Title
          initial={{ opacity: .5, y: 0, scale: .85 }}
          animate={{ opacity: 1, y: 0, scale: .95 }}
          transition={{ duration: 0.9, delay: .2, ease: "easeInOut" }}
        >
          Operations <span>Team</span>
        </Title>

        <Subtitle
          initial={{ opacity: 0, y: 20, scale: .85}}
          animate={{ opacity: 1, y: 0, scale: .85 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeInOut" }}
        >
          Ensuring smooth operations and organizational excellence to support our mission and community
        </Subtitle>

        <StatsContainer
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -40 }}
          transition={{ duration: 0.8, delay: 0.3 , ease: "easeInOut"}}
        >
          <StatCard whileHover={{ y: -2 }}>
            <StatNumber><CountUp end={20} suffix="+" /></StatNumber>
            <StatLabel>Team Members</StatLabel>
          </StatCard>
          <StatCard whileHover={{ y: -2 }}>
            <StatNumber><CountUp end={4} /></StatNumber>
            <StatLabel>Operations Areas</StatLabel>
          </StatCard>
          <StatCard whileHover={{ y: -2 }}>
            <StatNumber><CountUp end={50} suffix="+" /></StatNumber>
            <StatLabel>Events Organized</StatLabel>
          </StatCard>
        </StatsContainer>

        <SectionTitle
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Operations <span>Areas</span>
        </SectionTitle>
        
        <OperationsGrid
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {operationsAreas.map((area, index) => (
            <OperationsCard
              key={area.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -2 }}
            >
              <OperationsTitle>{area.title}</OperationsTitle>
              <OperationsDescription>{area.description}</OperationsDescription>
              <OperationsLink href={area.link}>
                <ExternalLink size={16} /> Learn More
              </OperationsLink>
            </OperationsCard>
          ))}
        </OperationsGrid>
      </Container>
    </PageSection>
  );
};

export default OperationsTeam;

