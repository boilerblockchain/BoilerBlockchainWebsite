import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FiCode, FiLayers, FiZap, FiShield, FiTool, FiGithub, FiExternalLink, FiCheck } from 'react-icons/fi';

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

const CourseOverview = styled(motion.div)`
  background: rgba(15, 15, 15, 0.7);
  border: 1px solid #7120b0;
  border-radius: 12px;
  padding: 3rem;
  margin: 3rem 0;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 20px rgba(113, 32, 176, 0.15);
`;

const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const OverviewContent = styled.div`
  h3 {
    font-size: 2rem;
    color: #ffffff;
    margin-bottom: 1.5rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  p {
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
    margin-bottom: 1.5rem;
    font-size: ${props => props.theme.fontmd};
  }
`;

const CourseStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: rgba(113, 32, 176, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(113, 32, 176, 0.3);
  
  .number {
    font-size: 2.5rem;
    font-weight: 700;
    color: #7120b0;
    display: block;
    margin-bottom: 0.5rem;
  }
  
  .label {
    font-size: 1rem;
    color: #ffffff;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

const ContentSection = styled(motion.div)`
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

const CurriculumGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const ModuleCard = styled(motion.div)`
  background: rgba(15, 15, 15, 0.7);
  border: 1px solid #7120b0;
  border-radius: 8px;
  padding: 2rem;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 20px rgba(113, 32, 176, 0.15);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 30px rgba(113, 32, 176, 0.3);
    transform: translateY(-5px);
    border-color: rgba(113, 32, 176, 1);
  }
`;

const ModuleIcon = styled.div`
  width: 50px;
  height: 50px;
  background: rgba(113, 32, 176, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  
  svg {
    color: #7120b0;
    font-size: 1.5rem;
  }
`;

const ModuleTitle = styled.h3`
  font-size: 1.5rem;
  color: #ffffff;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const ModuleWeeks = styled.span`
  color: #7120b0;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 1rem;
  display: block;
`;

const ModuleDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const ModuleTopics = styled.ul`
  list-style: none;
  padding: 0;

  li {
    color: rgba(255, 255, 255, 0.9);
    padding: 0.3rem 0;
    display: flex;
    align-items: center;
    font-size: 0.9rem;

    &:before {
      content: "";
      display: inline-block;
      width: 6px;
      height: 6px;
      margin-right: 0.8rem;
      background-color: #7120b0;
      border-radius: 50%;
    }
  }
`;

const ProjectsSection = styled.div`
  margin: 3rem 0;
`;

const ProjectCard = styled(motion.div)`
  background: rgba(15, 15, 15, 0.7);
  border: 1px solid #7120b0;
  border-radius: 8px;
  padding: 2.5rem;
  margin: 2rem 0;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 20px rgba(113, 32, 176, 0.15);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 30px rgba(113, 32, 176, 0.3);
    transform: translateY(-5px);
    border-color: rgba(113, 32, 176, 1);
  }
`;

const ProjectTitle = styled.h3`
  font-size: 1.8rem;
  color: #ffffff;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const ProjectDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;

  span {
    background: rgba(113, 32, 176, 0.2);
    color: #bb20ff;
    padding: 0.4rem 0.8rem;
    border-radius: 15px;
    font-size: 0.85rem;
    font-weight: 500;
  }
`;

const PrerequisitesList = styled.ul`
  list-style: none;
  padding: 0;
  background: rgba(15, 15, 15, 0.7);
  border: 1px solid #7120b0;
  border-radius: 8px;
  padding: 2rem;
  margin: 3rem 0;

  li {
    color: rgba(255, 255, 255, 0.9);
    padding: 0.5rem 0;
    display: flex;
    align-items: center;
    font-size: 1rem;

    svg {
      margin-right: 1rem;
      color: #7120b0;
    }
  }
`;

const modules = [
  {
    icon: FiCode,
    title: 'Smart Contract Fundamentals',
    weeks: 'Weeks 1-3',
    description: 'Introduction to Solidity programming and basic smart contract development.',
    topics: [
      'Solidity syntax and data types',
      'Contract structure and functions',
      'State variables and modifiers',
      'Events and error handling',
      'Basic contract patterns'
    ]
  },
  {
    icon: FiLayers,
    title: 'Advanced Contract Development',
    weeks: 'Weeks 4-6',
    description: 'Complex smart contract patterns, inheritance, and advanced Solidity features.',
    topics: [
      'Contract inheritance and interfaces',
      'Libraries and abstract contracts',
      'Gas optimization techniques',
      'Proxy patterns and upgradability',
      'Inter-contract communication'
    ]
  },
  {
    icon: FiShield,
    title: 'Security & Testing',
    weeks: 'Weeks 7-8',
    description: 'Smart contract security best practices and comprehensive testing strategies.',
    topics: [
      'Common security vulnerabilities',
      'Reentrancy and overflow protection',
      'Unit testing with Hardhat/Truffle',
      'Test coverage and fuzzing',
      'Security audit checklist'
    ]
  },
  {
    icon: FiZap,
    title: 'DApp Frontend Development',
    weeks: 'Weeks 9-10',
    description: 'Building user interfaces that interact with smart contracts using modern web technologies.',
    topics: [
      'Web3.js and Ethers.js integration',
      'React.js for blockchain apps',
      'Wallet connection (MetaMask)',
      'Transaction handling and error management',
      'Event listening and real-time updates'
    ]
  },
  {
    icon: FiTool,
    title: 'Deployment & DevOps',
    weeks: 'Weeks 11-12',
    description: 'Deploying contracts to testnets and mainnet, plus development workflow optimization.',
    topics: [
      'Testnet deployment strategies',
      'Mainnet deployment considerations',
      'Environment configuration',
      'CI/CD for blockchain projects',
      'Monitoring and maintenance'
    ]
  }
];

const projects = [
  {
    title: 'DEX (Decentralized Exchange)',
    description: 'Build a full-featured decentralized exchange with liquidity pools, token swapping, and yield farming capabilities.',
    tech: ['Solidity', 'React', 'Web3.js', 'Hardhat', 'OpenZeppelin']
  },
  {
    title: 'NFT Marketplace',
    description: 'Create a complete NFT marketplace with minting, buying, selling, and auction functionality.',
    tech: ['Solidity', 'React', 'IPFS', 'Ethers.js', 'Pinata']
  },
  {
    title: 'DAO Governance Platform',
    description: 'Develop a decentralized autonomous organization with proposal creation, voting, and treasury management.',
    tech: ['Solidity', 'React', 'The Graph', 'Snapshot', 'Aragon']
  }
];

const TechnicalCourse = () => {
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
      
      <BackButton to="/courses">Back to Courses</BackButton>
      
      <Container>
        <Title
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Technical <span>Course</span>
        </Title>

        <Subtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Master blockchain development through hands-on experience with smart contracts, 
          DApps, and cutting-edge Web3 technologies
        </Subtitle>

        <CourseOverview
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <OverviewGrid>
            <OverviewContent>
              <h3>Course Overview</h3>
              <p>
                Our comprehensive technical course is designed for developers who want to master blockchain technology. 
                You'll learn to build secure smart contracts, create decentralized applications, and deploy to real blockchain networks.
              </p>
              <p>
                Through hands-on projects and expert mentorship, you'll gain the skills needed to become a professional 
                blockchain developer and contribute to the decentralized future.
              </p>
            </OverviewContent>
            
            <CourseStats>
              <StatItem>
                <span className="number">12</span>
                <span className="label">Weeks</span>
              </StatItem>
              <StatItem>
                <span className="number">5+</span>
                <span className="label">Projects</span>
              </StatItem>
              <StatItem>
                <span className="number">150+</span>
                <span className="label">Students</span>
              </StatItem>
            </CourseStats>
          </OverviewGrid>
        </CourseOverview>

        <ContentSection
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <SectionTitle>Course <span>Curriculum</span></SectionTitle>
          <CurriculumGrid>
            {modules.map((module, index) => (
              <ModuleCard
                key={module.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <ModuleIcon>
                  <module.icon />
                </ModuleIcon>
                <ModuleTitle>{module.title}</ModuleTitle>
                <ModuleWeeks>{module.weeks}</ModuleWeeks>
                <ModuleDescription>{module.description}</ModuleDescription>
                <ModuleTopics>
                  {module.topics.map((topic, i) => (
                    <li key={i}>{topic}</li>
                  ))}
                </ModuleTopics>
              </ModuleCard>
            ))}
          </CurriculumGrid>
        </ContentSection>

        <ContentSection
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <SectionTitle>Capstone <span>Projects</span></SectionTitle>
          <ProjectsSection>
            {projects.map((project, index) => (
              <ProjectCard
                key={project.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <ProjectTitle>{project.title}</ProjectTitle>
                <ProjectDescription>{project.description}</ProjectDescription>
                <TechStack>
                  {project.tech.map((tech, i) => (
                    <span key={i}>{tech}</span>
                  ))}
                </TechStack>
              </ProjectCard>
            ))}
          </ProjectsSection>
        </ContentSection>

        <ContentSection
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <SectionTitle><span>Prerequisites</span></SectionTitle>
          <PrerequisitesList>
            <li><FiCheck /> Basic programming experience (any language)</li>
            <li><FiCheck /> Understanding of web development concepts</li>
            <li><FiCheck /> Familiarity with JavaScript and React (helpful but not required)</li>
            <li><FiCheck /> Basic understanding of blockchain concepts</li>
            <li><FiCheck /> Willingness to learn and experiment with new technologies</li>
          </PrerequisitesList>
        </ContentSection>
      </Container>
    </PageSection>
  );
};

export default TechnicalCourse;
