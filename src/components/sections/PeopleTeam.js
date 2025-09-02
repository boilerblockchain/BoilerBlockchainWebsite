import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FiLinkedin, FiGithub, FiMail, FiUser, FiStar } from 'react-icons/fi';

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
  border-bottom: 1px solid rgba(113, 32, 176, 0.3);
  z-index: 100;
  backdrop-filter: blur(10px);
  text-transform: uppercase;
  font-weight: 600;

  &:before {
    content: "←";
    color: #7120b0;
  }

  &:hover {
    background: rgba(113, 32, 176, 0.1);
  }

  @media (max-width: 40em) {
    padding: 0.8rem 1rem;
    font-size: ${(props) => props.theme.fontsm};
  }
`;

const Container = styled.div`
  width: 85%;
  max-width: 1400px;
  margin: 3rem auto 0;
  position: relative;
  z-index: 2;
  
  @media (max-width: 70em) {
    width: 90%;
  }

  @media (max-width: 48em) {
    width: 95%;
  }
`;

const Title = styled(motion.h1)`
  font-size: 6rem; 
  color: #ffffff;
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;

  span {
    color: #7120b0;
  }

  @media (max-width: 40em) {
    font-size: 4rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: ${props => props.theme.fontxl};
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  max-width: 800px;
  margin: 0 auto 4rem;
  line-height: 1.6;
`;

const LeadershipSection = styled(motion.div)`
  margin: 5rem 0;
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  color: #ffffff;
  text-align: center;
  margin-bottom: 3rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  span {
    color: #7120b0;
  }
`;

const LeadershipGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const MemberCard = styled(motion.div)`
  background: rgba(15, 15, 15, 0.7);
  border: 1px solid #7120b0;
  border-radius: 12px;
  padding: 2rem;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 20px rgba(113, 32, 176, 0.15);
  transition: all 0.3s ease;
  text-align: center;
  position: relative;
  overflow: hidden;

  &:hover {
    box-shadow: 0 8px 30px rgba(113, 32, 176, 0.3);
    transform: translateY(-5px);
    border-color: rgba(113, 32, 176, 1);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, rgba(113, 32, 176, 0.8), rgba(187, 32, 255, 0.8));
  }
`;

const MemberImage = styled.div`
  width: 120px;
  height: 120px;
  background: rgba(113, 32, 176, 0.2);
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(113, 32, 176, 0.5);
  
  svg {
    color: #7120b0;
    font-size: 3rem;
  }
`;

const MemberName = styled.h3`
  font-size: 1.8rem;
  color: #ffffff;
  margin-bottom: 0.5rem;
  font-weight: 700;
`;

const MemberRole = styled.p`
  font-size: 1.1rem;
  color: #7120b0;
  margin-bottom: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const MemberBio = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
`;

const MemberLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  
  a {
    color: #7120b0;
    font-size: 1.2rem;
    transition: all 0.3s ease;
    padding: 0.5rem;
    border-radius: 50%;
    background: rgba(113, 32, 176, 0.1);
    
    &:hover {
      color: #bb20ff;
      background: rgba(113, 32, 176, 0.2);
      transform: translateY(-2px);
    }
  }
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const SimpleCard = styled(motion.div)`
  background: rgba(15, 15, 15, 0.7);
  border: 1px solid rgba(113, 32, 176, 0.5);
  border-radius: 8px;
  padding: 1.5rem;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 15px rgba(113, 32, 176, 0.1);
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    box-shadow: 0 4px 25px rgba(113, 32, 176, 0.2);
    transform: translateY(-3px);
    border-color: rgba(113, 32, 176, 0.8);
  }
`;

const SimpleImage = styled.div`
  width: 80px;
  height: 80px;
  background: rgba(113, 32, 176, 0.15);
  border-radius: 50%;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(113, 32, 176, 0.3);
  
  svg {
    color: #7120b0;
    font-size: 2rem;
  }
`;

const SimpleName = styled.h4`
  font-size: 1.3rem;
  color: #ffffff;
  margin-bottom: 0.3rem;
  font-weight: 600;
`;

const SimpleRole = styled.p`
  font-size: 0.9rem;
  color: #7120b0;
  font-weight: 500;
`;

const leadership = [
  {
    name: 'Alex Johnson',
    role: 'President',
    bio: 'Senior in Computer Science leading our vision for blockchain education and innovation. Previously interned at ConsenSys and passionate about DeFi protocols.',
    linkedin: 'https://linkedin.com/in/alexjohnson',
    github: 'https://github.com/alexjohnson',
    email: 'alex@boilerblockchain.org'
  },
  {
    name: 'Sarah Chen',
    role: 'Vice President',
    bio: 'Junior in Engineering with focus on smart contract development. Leads our technical workshops and has built several DApps for hackathons.',
    linkedin: 'https://linkedin.com/in/sarahchen',
    github: 'https://github.com/sarahchen',
    email: 'sarah@boilerblockchain.org'
  },
  {
    name: 'Michael Rodriguez',
    role: 'Head of Development',
    bio: 'Computer Science major specializing in blockchain infrastructure. Oversees our development projects and mentors new programmers.',
    linkedin: 'https://linkedin.com/in/michaelrodriguez',
    github: 'https://github.com/michaelrodriguez',
    email: 'michael@boilerblockchain.org'
  },
  {
    name: 'Emily Thompson',
    role: 'Head of Research',
    bio: 'PhD candidate in Computer Science researching consensus mechanisms. Leads our academic initiatives and publication efforts.',
    linkedin: 'https://linkedin.com/in/emilythompson',
    github: 'https://github.com/emilythompson',
    email: 'emily@boilerblockchain.org'
  },
  {
    name: 'David Kim',
    role: 'Head of Marketing',
    bio: 'Marketing major with expertise in community building. Manages our social media presence and organizes networking events.',
    linkedin: 'https://linkedin.com/in/davidkim',
    email: 'david@boilerblockchain.org'
  },
  {
    name: 'Jessica Wang',
    role: 'Treasurer',
    bio: 'Finance and Economics double major. Manages our budget, sponsorships, and financial operations for events and hackathons.',
    linkedin: 'https://linkedin.com/in/jessicawang',
    email: 'jessica@boilerblockchain.org'
  }
];

const developers = [
  'Ryan Parker - Senior Developer',
  'Lisa Zhang - Frontend Developer',
  'Tom Wilson - Smart Contract Developer',
  'Maya Patel - Full Stack Developer',
  'Chris Brown - Backend Developer',
  'Anna Lee - UI/UX Developer'
];

const researchers = [
  'Dr. James Smith - Faculty Advisor',
  'Kevin Liu - Graduate Researcher',
  'Sofia Martinez - Research Assistant',
  'Jake Taylor - Undergraduate Researcher',
  'Priya Sharma - Research Analyst'
];

const marketers = [
  'Ashley Davis - Social Media Manager',
  'Marcus Johnson - Content Creator',
  'Rachel Green - Event Coordinator',
  'Tyler Adams - Community Manager',
  'Nicole Foster - Brand Designer',
  'Jordan White - Outreach Specialist'
];

const PeopleTeam = () => {
  const [particleKey, setParticleKey] = useState(Date.now());

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  useEffect(() => {
    setParticleKey(Date.now());
  }, []);

  return (
    <PageSection>
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
              opacity: 0.5,
              width: 1,
            },
            move: { enable: true, speed: 0.8 },
            number: { value: 60 },
            opacity: { value: 0.3 },
            size: { value: 2 },
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
      
      <BackButton to="/people">Back to People</BackButton>
      
      <Container>
        <Title
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our <span>Team</span>
        </Title>

        <Subtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Meet the passionate individuals who lead and drive innovation at Boiler Blockchain, 
          from executive leadership to dedicated team members
        </Subtitle>

        <LeadershipSection
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <SectionTitle>Executive <span>Leadership</span></SectionTitle>
          <LeadershipGrid>
            {leadership.map((member, index) => (
              <MemberCard
                key={member.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <MemberImage>
                  <FiUser />
                </MemberImage>
                
                <MemberName>{member.name}</MemberName>
                <MemberRole>{member.role}</MemberRole>
                <MemberBio>{member.bio}</MemberBio>
                
                <MemberLinks>
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                      <FiLinkedin />
                    </a>
                  )}
                  {member.github && (
                    <a href={member.github} target="_blank" rel="noopener noreferrer">
                      <FiGithub />
                    </a>
                  )}
                  <a href={`mailto:${member.email}`}>
                    <FiMail />
                  </a>
                </MemberLinks>
              </MemberCard>
            ))}
          </LeadershipGrid>
        </LeadershipSection>

        <LeadershipSection
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <SectionTitle>Development <span>Team</span></SectionTitle>
          <TeamGrid>
            {developers.map((member, index) => (
              <SimpleCard
                key={member}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 + index * 0.05 }}
                whileHover={{ y: -3 }}
              >
                <SimpleImage>
                  <FiUser />
                </SimpleImage>
                <SimpleName>{member.split(' - ')[0]}</SimpleName>
                <SimpleRole>{member.split(' - ')[1]}</SimpleRole>
              </SimpleCard>
            ))}
          </TeamGrid>
        </LeadershipSection>

        <LeadershipSection
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <SectionTitle>Research <span>Team</span></SectionTitle>
          <TeamGrid>
            {researchers.map((member, index) => (
              <SimpleCard
                key={member}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.05 }}
                whileHover={{ y: -3 }}
              >
                <SimpleImage>
                  <FiStar />
                </SimpleImage>
                <SimpleName>{member.split(' - ')[0]}</SimpleName>
                <SimpleRole>{member.split(' - ')[1]}</SimpleRole>
              </SimpleCard>
            ))}
          </TeamGrid>
        </LeadershipSection>

        <LeadershipSection
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <SectionTitle>Marketing <span>Team</span></SectionTitle>
          <TeamGrid>
            {marketers.map((member, index) => (
              <SimpleCard
                key={member}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.4 + index * 0.05 }}
                whileHover={{ y: -3 }}
              >
                <SimpleImage>
                  <FiUser />
                </SimpleImage>
                <SimpleName>{member.split(' - ')[0]}</SimpleName>
                <SimpleRole>{member.split(' - ')[1]}</SimpleRole>
              </SimpleCard>
            ))}
          </TeamGrid>
        </LeadershipSection>
      </Container>
    </PageSection>
  );
};

export default PeopleTeam;
