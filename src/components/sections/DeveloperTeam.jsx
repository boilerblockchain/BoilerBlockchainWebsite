import React, { useCallback, useState, useEffect } from 'react';
import styled, {keyframes} from 'styled-components';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FiGithub, FiCode, FiLayers, FiZap, FiExternalLink } from 'react-icons/fi';
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
    max-width: 1300px;
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
    font-weight: 500;
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
    margin: 0.5rem;
    font-family: 'Tomorrow', sans-serif;
`;

const StatLabel = styled.p`
    color: rgba(255, 255, 255, 0.8);
    font-size: ${props => props.theme.fontmd};
    font-weight: 500;
    font-family: 'Tomorrow', sans-serif;
`;

const ExtGrid = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 2.5rem;
    margin: 4rem 0;
    margin-bottom: 8rem;

    @media (max-width: 1000px) {
        grid-template-columns: 1fr;
    }
`;

const ExtCard = styled(motion.div)`
    background: rgba(15, 15, 15, 0.7);
    border: 1px solid ${props => props.borderColor || 'rgba(113, 32, 176, 0.3)'};
    border-radius: 12px;
    padding: 2rem;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-align: center;
    font-size: 1.5rem;
    position: relative;
    overflow: hidden;

    &:hover {
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        transform: translateY(-6px);
        border-color: ${props => props.borderColor || 'rgba(113, 32, 176, 0.6)'};
        background: rgba(15, 15, 15, 0.85);
    }

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: ${props => props.borderColor || 'rgba(113, 32, 176, 0.8)'};
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    &:hover::before {
        opacity: 1;
    }
`;

const ExtIcon = styled.div`
    width: 80px;
    height: 80px;
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

const ExtName = styled.h4`
    color: #ffffff;
    font-size: ${props => props.theme.fontlg};
    margin-bottom: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-family: 'Tomorrow', sans-serif;
`;

const ExtDescription = styled.p`
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.5;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
    font-family: 'Tomorrow', sans-serif;
`;

const ProjectsGrid = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1.5rem;
    margin: 3rem 0;

    @media (max-width: 968px) {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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

const ProjectCard = styled(motion.div)`
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
`;

const ProjectTitle = styled.h3`
    color: #ffffff;
    font-size: ${props => props.theme.fontlg};
    margin-bottom: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-family: 'Tomorrow', sans-serif;
`;

const ProjectDescription = styled.p`
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.5;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
    font-family: 'Tomorrow', sans-serif;
`;

const ProjectLinks = styled.div`
    display: flex;
    gap: 1rem;

    a {
        display: flex;
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
        color: #7120b0;
    }
`;

const technologies = [
    {
        name: 'Solidity',
        description: 'Smart contract development',
        icon: FiCode
    },
    {
        name: 'React',
        description: 'Frontend framework',
        icon: FiLayers
    },
    {
        name: 'Node.js',
        description: 'Backend runtime',
        icon: FiZap
    },
    {
        name: 'Web3.js',
        description: 'Blockchain integration',
        icon: FiExternalLink
    }
];
const ExternalProjects = [
    {
        name: 'MOI Labs',
        description: 'Developing X for Moi Labs...',
        icon: 'https://www.daas4pro.com/dass4pro-mist/images-mist/images/webimages/about-us/4.png',
        borderColor: 'rgba(68, 54, 194, 0.6)',
        link: 'https://moi.technology/'
    },
    {
        name: 'SUI',
        description: 'Working alongside SUI... ',
        icon: 'https://s3.coinmarketcap.com/static-gravity/image/5bd0f43855f6434386c59f2341c5aaf0.png',
        borderColor: 'rgba(70, 132, 232, 0.6)',
        link: 'https://sui.io/'
    },
    {
        name: 'Eigen Layer',
        description: 'Building new protocols...',
        icon: 'https://canada1.discourse-cdn.com/flex028/uploads/eigenlayer/original/2X/c/c7059fe3480f52c3324c3c8c5f9e40c2eaca18fc.png',
        borderColor: 'rgba(91, 102, 117, 0.6)',
        link: 'https://app.eigenlayer.xyz/'
    },
];

const InternalProjects = [
    {
        title: 'NFT Collection',
        description: 'Creating an Exclusive NFT Collection for Boiler Blockchain',
        github: 'https://github.com/boilerblockchain/defi-platform',
        demo: 'https://demo.boilerblockchain.org'
    },
    {
        title: 'On-Chain Attendance',
        description: 'Using X to enable attendance using assigned NFTs from our collection.',
        github: 'https://github.com/boilerblockchain/nft-marketplace',
        demo: 'https://nft.boilerblockchain.org'
    },
    {
        title: 'Boiler Blockchain LLM',
        description: 'Creating an LLM for the BoilerBlockchain website',
        github: 'https://github.com/boilerblockchain/dao-governance',
        demo: 'https://dao.boilerblockchain.org'
    },
    {
        title: 'This Website',
        description: 'Managing and improving the Boiler Blockchain website.',
        github: 'https://github.com/boilerblockchain/dao-governance',
        demo: 'https://dao.boilerblockchain.org'
    }


];


const projects = [
    {
        title: 'DeFi Trading Platform',
        description: 'Comprehensive decentralized finance platform for automated trading and yield farming with advanced portfolio management.',
        github: 'https://github.com/boilerblockchain/defi-platform',
        demo: 'https://demo.boilerblockchain.org'
    },
    {
        title: 'NFT Marketplace',
        description: 'Full-stack NFT marketplace with minting, trading, and auction features built on Ethereum blockchain.',
        github: 'https://github.com/boilerblockchain/nft-marketplace',
        demo: 'https://nft.boilerblockchain.org'
    },
    {
        title: 'DAO Governance Tool',
        description: 'Decentralized autonomous organization management platform with voting mechanisms and proposal systems.',
        github: 'https://github.com/boilerblockchain/dao-governance',
        demo: 'https://dao.boilerblockchain.org'
    }
];

const trueSize = keyframes`
    0% {
        height: 100vh;
    }
    100% {
        height: 30vh;
    }
`;

const fadeUp = keyframes`
    0% {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
`;

const DeveloperTeam = () => {
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
                    background: { color: "000000" },
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
                    initial={{ opacity: .5, scale: .85}}
                    animate={{ opacity: 1, scale: .90}}
                    transition={{ duration: 0.9, delay: .2, ease: [0.42, 0, 0.58, 1]}}
                >
                    Developer <span>Team</span>
                </Title>

                <Subtitle
                    initial={{ opacity: 1 , y: 20, scale: .85}}
                    animate={{ opacity: 1 , y: 0, scale: .85}}
                    transition={{ duration: 0.7, delay: .4, ease: [0.42, 0, 0.58, 1]}}
                >
                    Building the future of decentralized technology with cutting-edge blockchain solutions
                </Subtitle>

                {<StatsContainer
                    initial={{ opacity: 0, y: 0}}
                    animate={{ opacity: 1, y: -40 }}
                    transition={{ duration: .8, delay: 0.3, ease: [.42, 0, .58, 1]}}
                >
                    <StatCard whileHover={{ y: -2 }}>
                        <StatLabel>Deploying</StatLabel>
                        <StatNumber><CountUp end={30} suffix="+" /></StatNumber>
                        <StatLabel>Developers</StatLabel>
                    </StatCard>
                    <StatCard whileHover={{ y: -2 }}>
                        <StatLabel>Across</StatLabel>
                        <StatNumber><CountUp end={7} /></StatNumber>
                        <StatLabel>Active Projects</StatLabel>
                    </StatCard>
                </StatsContainer>}

                <SectionTitle
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span>External</span> Projects
                </SectionTitle>

                <ExtGrid
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {ExternalProjects.map((tech, index) => (
                        <ExtCard
                            key={tech.name}
                            borderColor={tech.borderColor}
                            initial={{ opacity: 0, y: 20}}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1}}
                            whileHover={{ y: -2 }}
                        >
                            <a href={tech.link} target="_blank" rel="noopener noreferrer">
                                <ExtIcon>
                                    <img src={tech.icon} alt={`${tech.name} logo`} />
                                </ExtIcon>
                            </a>
                            <ExtName>{tech.name}</ExtName>
                            <ExtDescription>{tech.description}</ExtDescription>
                        </ExtCard>
                    ))}
                </ExtGrid>


                <SectionTitle
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Internal <span>Projects</span>
                </SectionTitle>

                <ProjectsGrid
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6}}
                >
                    {InternalProjects.map((project, index) => (
                        <ProjectCard
                            key={project.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1}}
                        >
                            <ProjectTitle>{project.title}</ProjectTitle>
                            <ProjectDescription>{project.description}</ProjectDescription>
                            <ProjectLinks>
                                <a href={project.github} target="_blank" rel="noopener noreferrer">
                                    <FiGithub /> View Code
                                </a>
                                {/*<a href={project.demo} target="_blank" rel="noopener noreferrer">
                                    <FiExternalLink/> Live Demo
                                </a>*/}
                            </ProjectLinks>
                        </ProjectCard>
                    ))}
                </ProjectsGrid>
            </Container>
            <Footer />
        </PageSection>
    );
};

export default DeveloperTeam;