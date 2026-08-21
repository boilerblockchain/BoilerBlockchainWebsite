import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import { Arrow } from '../ui/Arrow';
import Github from '../../Icons/Github';
import {
    Section,
    Container,
    GridBackdrop,
    Eyebrow,
    SectionTitle,
    Lead,
    Card,
    ButtonLink,
} from '../ui/primitives';

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

const Head = styled.div`
    margin-bottom: ${({ theme }) => theme.space[12]};
`;

/* The reveal sits on a wrapper so framer's inline transform never fights a
   card's own hover translate. */
const Reveal = styled(motion.div)`
    display: flex;
    min-width: 0;
`;

const StatsRow = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: ${({ theme }) => theme.space[6]};
    margin-top: ${({ theme }) => theme.space[12]};

    ${({ theme }) => theme.media.sm} {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
`;

const StatCard = styled(Card)`
    flex: 1;
    min-width: 0;
`;

const StatNumber = styled.div`
    font-family: ${({ theme }) => theme.fontFamily.display};
    font-size: ${({ theme }) => theme.fontSize.stat};
    font-weight: ${({ theme }) => theme.fontWeight.bold};
    line-height: 1;
    letter-spacing: -0.02em;
    color: ${({ theme }) => theme.color.accent};
    font-variant-numeric: tabular-nums;
`;

const StatLabel = styled.div`
    font-family: ${({ theme }) => theme.fontFamily.mono};
    font-size: ${({ theme }) => theme.fontSize.micro};
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.color.textFaint};

    & + ${StatNumber} {
        margin-top: ${({ theme }) => theme.space[2]};
    }

    ${StatNumber} + & {
        margin-top: ${({ theme }) => theme.space[3]};
    }
`;

const CardGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: ${({ theme }) => theme.space[6]};
`;

const ExtCard = styled(Card)`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 0;
`;

const ExtIcon = styled.a`
    display: block;
    width: 56px;
    height: 56px;
    margin-bottom: ${({ theme }) => theme.space[5]};
    border: 1px solid ${({ theme }) => theme.color.border};
    /* Light plate, matching the partners wall. Partner marks are a mix of
       light and dark artwork, so a dark tile makes the light ones vanish. */
    background: #f2f2f4;
    padding: 6px;

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
    }
`;

const CardTitle = styled.h3`
    font-family: ${({ theme }) => theme.fontFamily.display};
    font-size: ${({ theme }) => theme.fontSize.h4};
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
    line-height: 1.2;
    color: ${({ theme }) => theme.color.text};
    margin-bottom: ${({ theme }) => theme.space[3]};
`;

const CardText = styled.p`
    font-family: ${({ theme }) => theme.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSize.body};
    line-height: 1.6;
    color: ${({ theme }) => theme.color.textMuted};
    margin-bottom: ${({ theme }) => theme.space[6]};
`;

const ProjectLinks = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.space[4]};
    margin-top: auto;

    a {
        display: inline-flex;
        align-items: center;
        gap: ${({ theme }) => theme.space[2]};
        font-family: ${({ theme }) => theme.fontFamily.mono};
        font-size: ${({ theme }) => theme.fontSize.small};
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: ${({ theme }) => theme.color.accent};
        text-decoration: none;
        transition: color ${({ theme }) => theme.motion.base};

        &:hover {
            color: ${({ theme }) => theme.color.accentBright};
        }
    }
`;

const ExternalProjects = [
    {
        name: 'MOI Labs',
        description: 'Developing X for Moi Labs...',
        icon: '/images/partners/moi.webp',
        link: 'https://moi.technology/'
    },
    {
        name: 'SUI',
        description: 'Working alongside SUI... ',
        icon: '/images/partners/sui.webp',
        link: 'https://sui.io/'
    },
    {
        name: 'Eigen Layer',
        description: 'Building new protocols...',
        icon: '/images/partners/eigen.webp',
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

const reveal = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
};

const DeveloperTeam = () => {
    return (
        <>
            <Section $divided={false}>
                <GridBackdrop />
                <Container>
                    <Eyebrow>Development</Eyebrow>
                    <SectionTitle as="h1">Developer Team</SectionTitle>
                    <Lead style={{ marginTop: '1rem' }}>
                        Building the future of decentralized technology with cutting-edge blockchain solutions
                    </Lead>

                    <StatsRow>
                        <Reveal {...reveal} transition={{ duration: 0.4 }}>
                            <StatCard>
                                <StatLabel>Deploying</StatLabel>
                                <StatNumber><CountUp end={40} suffix="+" /></StatNumber>
                                <StatLabel>Developers</StatLabel>
                            </StatCard>
                        </Reveal>
                        <Reveal {...reveal} transition={{ duration: 0.4, delay: 0.06 }}>
                            <StatCard>
                                <StatLabel>Across</StatLabel>
                                <StatNumber><CountUp end={7} /></StatNumber>
                                <StatLabel>Active Projects</StatLabel>
                            </StatCard>
                        </Reveal>
                    </StatsRow>
                </Container>
            </Section>

            <Section>
                <GridBackdrop />
                <Container>
                    <Head>
                        <Eyebrow>Partners</Eyebrow>
                        <SectionTitle>External Projects</SectionTitle>
                    </Head>

                    <CardGrid>
                        {ExternalProjects.map((tech, index) => (
                            <Reveal
                                key={tech.name}
                                {...reveal}
                                transition={{ duration: 0.4, delay: index * 0.06 }}
                            >
                                <ExtCard>
                                    <ExtIcon href={tech.link} target="_blank" rel="noopener noreferrer">
                                        <img
                                            src={tech.icon}
                                            alt={`${tech.name} logo`}
                                            loading="lazy"
                                            width="56"
                                            height="56"
                                        />
                                    </ExtIcon>
                                    <CardTitle>{tech.name}</CardTitle>
                                    <CardText>{tech.description}</CardText>
                                </ExtCard>
                            </Reveal>
                        ))}
                    </CardGrid>
                </Container>
            </Section>

            <Section>
                <GridBackdrop />
                <Container>
                    <Head>
                        <Eyebrow>In-house</Eyebrow>
                        <SectionTitle>Internal Projects</SectionTitle>
                    </Head>

                    <CardGrid>
                        {InternalProjects.map((project, index) => (
                            <Reveal
                                key={project.title}
                                {...reveal}
                                transition={{ duration: 0.4, delay: index * 0.06 }}
                            >
                                <ExtCard>
                                    <CardTitle>{project.title}</CardTitle>
                                    <CardText>{project.description}</CardText>
                                    <ProjectLinks>
                                        <a href={project.github} target="_blank" rel="noopener noreferrer">
                                            <Github width={16} height={16} /> View Code
                                        </a>
                                    </ProjectLinks>
                                </ExtCard>
                            </Reveal>
                        ))}
                    </CardGrid>
                </Container>
            </Section>

            <Section>
                <GridBackdrop />
                <Container>
                    <Eyebrow>Competing</Eyebrow>
                    <SectionTitle>Hackathon Projects</SectionTitle>
                    <Lead style={{ marginTop: '1rem' }}>
                        Our team has participated in numerous hackathons, building innovative blockchain solutions and winning multiple awards. Explore our past hackathon projects and see what we&apos;ve built.
                    </Lead>

                    <div style={{ marginTop: '2rem' }}>
                        <ButtonLink to="/hackathons">
                            View All Hackathons
                            <Arrow size={16} />
                        </ButtonLink>
                    </div>
                </Container>
            </Section>
        </>
    );
};

export default DeveloperTeam;
