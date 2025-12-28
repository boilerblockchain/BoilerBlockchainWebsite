import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FiCode, FiUsers, FiAward, FiBook, FiZap, FiTrendingUp, FiGithub, FiTarget } from 'react-icons/fi';

const PageContainer = styled.div`
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  background: #000000;
  color: #ffffff;
  position: relative;
`;

const HeroSection = styled.section`
  min-height: calc(100vh - 80px);
  width: 100%;
  max-width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000000;
  padding: 120px 2rem 4rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    padding: 110px 1.75rem 3.5rem;
  }

  @media (max-width: 768px) {
    padding: 100px 1.5rem 3rem;
    min-height: calc(100vh - 60px);
  }

  @media (max-width: 480px) {
    padding: 80px 1rem 2rem;
    min-height: auto;
  }

  @media (max-width: 360px) {
    padding: 70px 0.75rem 1.5rem;
  }
`;

const ParticlesContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const HeroContent = styled(motion.div)`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  padding: 0 1rem;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
  }

  @media (max-width: 480px) {
    padding: 0 0.5rem;
  }

  @media (max-width: 360px) {
    padding: 0 0.25rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;

  @media (max-width: 768px) {
    font-size: 0.875rem;
    letter-spacing: 2px;
    margin-bottom: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    letter-spacing: 1px;
  }
`;

const HeroTitle = styled(motion.h1)`
  font-size: 5.5rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.1;
  margin-bottom: 2rem;
  letter-spacing: -1px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;

  .gradient-text {
    background: linear-gradient(135deg, #7120b0 0%, #bb20ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;
  }

  @media (max-width: 1024px) {
    font-size: 4.5rem;
  }

  @media (max-width: 768px) {
    font-size: 3rem;
    letter-spacing: 0;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2.25rem;
    margin-bottom: 1rem;
    line-height: 1.2;
  }
`;

const HeroDescription = styled(motion.p)`
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.8;
  max-width: 800px;
  margin: 0 auto 3rem;
  font-weight: 400;
  letter-spacing: 0.3px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    line-height: 1.6;
    margin: 0 auto 2rem;
    padding: 0 1rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    line-height: 1.5;
    margin: 0 auto 1.5rem;
    padding: 0 0.5rem;
  }
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 0.75rem;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
`;

const Button = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 0.875rem 1.5rem;
    font-size: 0.9375rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem 1.25rem;
    font-size: 0.875rem;
    gap: 0.375rem;
  }

  &.primary {
    background: linear-gradient(135deg, #7120b0 0%, #bb20ff 100%);
    color: #ffffff;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(113, 32, 176, 0.4);
    }
  }

  &.secondary {
    background: transparent;
    color: #7120b0;
    border: 2px solid #7120b0;

    &:hover {
      background: rgba(113, 32, 176, 0.1);
    }
  }
`;

const Section = styled.section`
  width: 100%;
  max-width: 100vw;
  padding: 6rem 2rem;
  background: #000000;
  position: relative;
  z-index: 1;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    padding: 5rem 1.75rem;
  }

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 3rem 1rem;
  }

  @media (max-width: 360px) {
    padding: 2.5rem 0.75rem;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 2;
  padding: 0 1rem;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
  }

  @media (max-width: 480px) {
    padding: 0 0.5rem;
  }

  @media (max-width: 360px) {
    padding: 0 0.25rem;
  }
`;

const SectionTitle = styled(motion.h2)`
  font-size: 3rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1rem;
  text-align: center;
  letter-spacing: -0.5px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;

  .gradient-text {
    background: linear-gradient(135deg, #7120b0 0%, #bb20ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 1024px) {
    font-size: 2.5rem;
  }

  @media (max-width: 768px) {
    font-size: 2.25rem;
    margin-bottom: 0.875rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
    margin-bottom: 0.75rem;
    letter-spacing: 0;
  }

  @media (max-width: 360px) {
    font-size: 1.5rem;
  }
`;

const SectionDescription = styled(motion.p)`
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
  max-width: 700px;
  margin: 0 auto 3rem;
  text-align: center;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.6;
    margin: 0 auto 2rem;
    padding: 0 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9375rem;
    line-height: 1.5;
    margin: 0 auto 1.5rem;
    padding: 0 0.5rem;
  }
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;

  @media (max-width: 968px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-top: 2rem;
  }

  @media (max-width: 480px) {
    gap: 1rem;
    margin-top: 1.5rem;
  }

  @media (max-width: 360px) {
    gap: 0.75rem;
  }
`;

const Card = styled(motion.div)`
  background: rgba(15, 15, 15, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 768px) {
    padding: 2rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, rgba(113, 32, 176, 0.6), rgba(187, 32, 255, 0.6));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: rgba(113, 32, 176, 0.6);
    transform: translateY(-8px);
    box-shadow: 0 16px 40px rgba(113, 32, 176, 0.3);
    background: rgba(15, 15, 15, 0.85);

    &::before {
      opacity: 1;
    }
  }
`;

const CardIcon = styled.div`
  width: 48px;
  height: 48px;
  background: rgba(113, 32, 176, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  
  svg {
    color: #7120b0;
    font-size: 24px;
  }

  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
    margin-bottom: 1.25rem;

    svg {
      font-size: 22px;
    }
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    margin-bottom: 1rem;

    svg {
      font-size: 20px;
    }
  }
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 1rem;
  letter-spacing: 0.3px;
  line-height: 1.3;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;

  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin-bottom: 0.875rem;
  }

  @media (max-width: 480px) {
    font-size: 1.125rem;
    margin-bottom: 0.75rem;
  }
`;

const CardText = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.7;
  letter-spacing: 0.2px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;

  @media (max-width: 768px) {
    font-size: 0.9375rem;
    line-height: 1.6;
  }

  @media (max-width: 480px) {
    font-size: 0.875rem;
    line-height: 1.5;
  }
`;

const StatCard = styled(motion.div)`
  background: rgba(15, 15, 15, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  text-align: center;

  @media (max-width: 768px) {
    padding: 2rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, rgba(113, 32, 176, 0.6), rgba(187, 32, 255, 0.6));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: rgba(113, 32, 176, 0.6);
    transform: translateY(-8px);
    box-shadow: 0 16px 40px rgba(113, 32, 176, 0.3);
    background: rgba(15, 15, 15, 0.85);

    &::before {
      opacity: 1;
    }
  }
`;

const StatNumber = styled.div`
  font-size: 3.5rem;
  font-weight: 800;
  color: #7120b0;
  margin-bottom: 0.5rem;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: linear-gradient(135deg, #7120b0 0%, #bb20ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const StatLabel = styled.div`
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9375rem;
  }
`;

const StatCardText = styled(CardText)`
  margin-top: 1rem;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8125rem;
  }
`;

const TwoColumn = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  @media (max-width: 480px) {
    gap: 1.5rem;
  }
`;

const TextContent = styled.div`
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;

  p {
    margin-bottom: 1.5rem;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.6;

    p {
      margin-bottom: 1.25rem;
    }
  }

  @media (max-width: 480px) {
    font-size: 0.9375rem;
    line-height: 1.5;

    p {
      margin-bottom: 1rem;
    }
  }
`;

// CountUp Animation Component
const CountUp = ({ end, duration = 2000, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const countRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
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
      },
      { threshold: 0.3 }
    );

    const currentRef = countRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [end, duration, hasAnimated]);

  return <span ref={countRef}>{prefix}{count}{suffix}</span>;
};

const Home = () => {
  const [particleKey, setParticleKey] = useState(Date.now());

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  useEffect(() => {
    setParticleKey(Date.now());
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <PageContainer>
      {/* Hero Section */}
      <HeroSection>
        <ParticlesContainer>
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
                  opacity: 0.2,
                  width: 1,
                },
                move: { enable: true, speed: 0.5 },
                number: { value: 50 },
                opacity: { value: 0.15 },
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
                    links: { opacity: 0.2 }
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
            }}
          />
        </ParticlesContainer>
        <HeroContent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <HeroSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Purdue University
          </HeroSubtitle>
          <HeroTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Boiler <span className="gradient-text">Blockchain</span>
          </HeroTitle>
          <HeroDescription
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Purdue's premier student-led organization dedicated to advancing blockchain technology through innovation, education, and community building.
          </HeroDescription>
          <ButtonGroup
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Button to="/about" className="primary">
              Learn More
            </Button>
            <Button to="/contact" className="secondary">
              Contact Us
            </Button>
          </ButtonGroup>
        </HeroContent>
      </HeroSection>

      {/* Who We Are Section */}
      <Section>
        <Container>
          <SectionTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Who <span className="gradient-text">We Are</span>
          </SectionTitle>
          <SectionDescription
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Boiler Blockchain is Purdue's leading student organization for blockchain technology, empowering students through education, innovation, and community.
          </SectionDescription>
          <TwoColumn>
            <TextContent
              as={motion.div}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p>
                At Boiler Blockchain, we provide comprehensive educational programs, hands-on development opportunities, and a vibrant community for students passionate about blockchain technology.
              </p>
              <p>
                Our mission is to bridge the gap between academic learning and real-world blockchain applications, preparing students for careers in the rapidly evolving Web3 ecosystem.
              </p>
            </TextContent>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardIcon>
                  <FiCode />
                </CardIcon>
                <CardTitle>Technical Courses</CardTitle>
                <CardText>
                  Comprehensive 16-week courses covering blockchain fundamentals, smart contract development, and decentralized applications.
                </CardText>
              </Card>
            </motion.div>
          </TwoColumn>
        </Container>
      </Section>

      {/* What We Do Section */}
      <Section style={{ background: '#0a0a0a' }}>
        <Container>
          <SectionTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            What <span className="gradient-text">We Do</span>
          </SectionTitle>
          <SectionDescription
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            We provide comprehensive programs and opportunities for students passionate about blockchain technology.
          </SectionDescription>
          <Grid
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Card variants={itemVariants}>
              <CardIcon>
                <FiBook />
              </CardIcon>
              <CardTitle>Educational Courses</CardTitle>
              <CardText>
                Comprehensive technical and non-technical courses designed to empower students with blockchain knowledge and practical skills.
              </CardText>
            </Card>
            <Card variants={itemVariants}>
              <CardIcon>
                <FiCode />
              </CardIcon>
              <CardTitle>Development Projects</CardTitle>
              <CardText>
                Hands-on experience building real-world blockchain applications, smart contracts, and decentralized systems.
              </CardText>
            </Card>
            <Card variants={itemVariants}>
              <CardIcon>
                <FiUsers />
              </CardIcon>
              <CardTitle>Community Building</CardTitle>
              <CardText>
                Connect with like-minded peers, industry professionals, and blockchain enthusiasts in a supportive environment.
              </CardText>
            </Card>
            <Card variants={itemVariants}>
              <CardIcon>
                <FiZap />
              </CardIcon>
              <CardTitle>Hackathon Participation</CardTitle>
              <CardText>
                Compete in premier blockchain hackathons, win prizes, and showcase innovative solutions to industry leaders.
              </CardText>
            </Card>
            <Card variants={itemVariants}>
              <CardIcon>
                <FiTrendingUp />
              </CardIcon>
              <CardTitle>Research Initiatives</CardTitle>
              <CardText>
                Contribute to cutting-edge blockchain research, exploring new protocols, consensus mechanisms, and applications.
              </CardText>
            </Card>
            <Card variants={itemVariants}>
              <CardIcon>
                <FiTarget />
              </CardIcon>
              <CardTitle>Industry Partnerships</CardTitle>
              <CardText>
                Collaborate with leading blockchain companies and organizations to drive innovation and create opportunities.
              </CardText>
            </Card>
          </Grid>
        </Container>
      </Section>

      {/* Achievements Section */}
      <Section>
        <Container>
          <SectionTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Our <span className="gradient-text">Achievements</span>
          </SectionTitle>
          <SectionDescription
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            From ETH SF to ETH Denver, our journey through the blockchain ecosystem has been marked by innovation and success.
          </SectionDescription>
          <Grid
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <StatCard variants={itemVariants}>
              <StatNumber>
                <CountUp end={11} suffix="+" />
              </StatNumber>
              <StatLabel>Hackathons</StatLabel>
              <StatCardText>
                Participated in premier blockchain hackathons including ETH SF, ETH Denver, ETH NYC, and more.
              </StatCardText>
            </StatCard>
            <StatCard variants={itemVariants}>
              <StatNumber>
                <CountUp end={15} suffix="+" />
              </StatNumber>
              <StatLabel>Prizes Won</StatLabel>
              <StatCardText>
                Recognized for innovative solutions and outstanding projects across multiple competitions.
              </StatCardText>
            </StatCard>
            <StatCard variants={itemVariants}>
              <StatNumber>
                <CountUp end={25} prefix="$" suffix="K+" />
              </StatNumber>
              <StatLabel>Prize Value</StatLabel>
              <StatCardText>
                Total value of prizes and awards won through hackathon participation and competitions.
              </StatCardText>
            </StatCard>
            <StatCard variants={itemVariants}>
              <StatNumber>
                <CountUp end={150} suffix="+" />
              </StatNumber>
              <StatLabel>Students Taught</StatLabel>
              <StatCardText>
                Empowered students through comprehensive courses and hands-on learning experiences.
              </StatCardText>
            </StatCard>
          </Grid>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section style={{ background: '#0a0a0a' }}>
        <Container style={{ textAlign: 'center' }}>
          <SectionTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Join Our <span className="gradient-text">Community</span>
          </SectionTitle>
          <SectionDescription
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Connect with 400+ fellow blockchain enthusiasts, get exclusive updates, and access specialized resources in our growing Discord community.
          </SectionDescription>
          <ButtonGroup
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              as="a"
              href="https://discord.gg/hnjtVpb9H5"
              target="_blank"
              rel="noopener noreferrer"
              className="primary"
            >
              Join Discord
            </Button>
            <Button to="/contact" className="secondary">
              Contact Us
            </Button>
          </ButtonGroup>
        </Container>
      </Section>
    </PageContainer>
  );
};

export default Home;
