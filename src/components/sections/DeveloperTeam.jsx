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
    ButtonLink,
} from '../ui/primitives';

/**
 * Developer team page.
 *
 * Density pass, following the choose-a-team page: explicit column counts for
 * the known sets (3 partners, 4 internal projects), photography instead of
 * text on black at the top, and the stat row rebuilt as a hairline-divided
 * strip rather than two lonely boxes.
 */

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

/* ---------------------------------------------------------------- hero band */

const HeroSection = styled(Section)`
    padding-block: clamp(3rem, 2rem + 4.5vw, 5.5rem);
`;

const HeroGrid = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: ${({ theme }) => theme.space[10]};
    align-items: center;

    ${({ theme }) => theme.media.lg} {
        grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
        gap: ${({ theme }) => theme.space[12]};
    }
`;

/* Leading accent rule, so the top of the page has one piece of structure that
   is not another grey box. */
const HeroCopy = styled.div`
    min-width: 0;
    border-left: 2px solid ${({ theme }) => theme.color.accent};
    padding-left: ${({ theme }) => theme.space[5]};

    ${({ theme }) => theme.media.md} {
        padding-left: ${({ theme }) => theme.space[6]};
    }
`;

const PageTitle = styled(SectionTitle)`
    font-size: ${({ theme }) => theme.fontSize.h1};
    line-height: 0.98;
    letter-spacing: -0.03em;
`;

const Frame = styled.div`
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    border: 1px solid ${({ theme }) => theme.color.border};

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        /* Greyscale at rest so unrelated snapshots read as one set. */
        filter: grayscale(1) brightness(0.62);
        transition: transform ${({ theme }) => theme.motion.slow},
                    filter ${({ theme }) => theme.motion.slow};
    }

    &:hover img {
        filter: grayscale(0) brightness(0.88);
        transform: scale(1.03);
    }
`;

/* ---------------------------------------------------------------- stat strip */

/* Hairline-divided inline row spanning the container, like home/Stats. Two
   bordered boxes floating in black is what made this page read as empty. */
const StatStrip = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    margin-top: ${({ theme }) => theme.space[10]};
    border-top: 1px solid ${({ theme }) => theme.color.border};

    ${({ theme }) => theme.media.sm} {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
`;

const StatCell = styled(motion.div)`
    min-width: 0;
    padding-block: ${({ theme }) => theme.space[6]};
    border-bottom: 1px solid ${({ theme }) => theme.color.border};

    ${({ theme }) => theme.media.sm} {
        border-bottom: 0;
        border-left: 1px solid ${({ theme }) => theme.color.border};
        padding-inline: ${({ theme }) => theme.space[6]};

        &:first-child {
            border-left: 0;
            padding-left: 0;
        }
    }
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
        color: ${({ theme }) => theme.color.text};
    }
`;

/* ---------------------------------------------------------------- sections */

const Head = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: ${({ theme }) => theme.space[4]};
    margin-bottom: ${({ theme }) => theme.space[8]};
    padding-bottom: ${({ theme }) => theme.space[5]};
    border-bottom: 1px solid ${({ theme }) => theme.color.border};
`;

const Count = styled.span`
    font-family: ${({ theme }) => theme.fontFamily.mono};
    font-size: ${({ theme }) => theme.fontSize.micro};
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.color.textFaint};
`;

/* The reveal sits on a wrapper so framer's inline transform never fights a
   card's own hover translate. */
const Reveal = styled(motion.div)`
    display: flex;
    min-width: 0;
`;

/* Three partners is a known set: explicit columns, so the row fills. */
const PartnerGrid = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: ${({ theme }) => theme.space[5]};

    ${({ theme }) => theme.media.md} {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
`;

/* Four internal projects: 2-up from sm, 4-up once there is room. */
const ProjectGrid = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: ${({ theme }) => theme.space[5]};

    ${({ theme }) => theme.media.sm} {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    ${({ theme }) => theme.media.lg} {
        grid-template-columns: repeat(4, minmax(0, 1fr));
    }
`;

const Panel = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    padding: ${({ theme }) => theme.space[6]};
    background: ${({ theme }) => theme.color.surfaceRaised};
    border: 1px solid ${({ theme }) => theme.color.border};
    transition: border-color ${({ theme }) => theme.motion.base},
                transform ${({ theme }) => theme.motion.base};

    &:hover {
        border-color: ${({ theme }) => theme.color.accentBorderStrong};
        transform: translateY(-3px);
    }
`;

const PanelTop = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: ${({ theme }) => theme.space[4]};
    margin-bottom: ${({ theme }) => theme.space[5]};
`;

/* Numbered index plate: the one piece of contrast on an otherwise flat card. */
const Index = styled.span`
    font-family: ${({ theme }) => theme.fontFamily.mono};
    font-size: ${({ theme }) => theme.fontSize.micro};
    letter-spacing: 0.2em;
    color: ${({ theme }) => theme.color.text};
    background: ${({ theme }) => theme.color.black};
    border: 1px solid ${({ theme }) => theme.color.border};
    padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[2]};
`;

const ExtIcon = styled.a`
    display: block;
    width: 56px;
    height: 56px;
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
    margin-bottom: ${({ theme }) => theme.space[5]};
`;

/* Hairline spec line: label left, accent value right. */
const Spec = styled.div`
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: ${({ theme }) => theme.space[3]};
    margin-top: auto;
    padding-top: ${({ theme }) => theme.space[3]};
    border-top: 1px solid ${({ theme }) => theme.color.border};
    font-family: ${({ theme }) => theme.fontFamily.mono};
    font-size: ${({ theme }) => theme.fontSize.micro};
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.color.textFaint};

    span:last-child {
        color: ${({ theme }) => theme.color.accent};
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        min-width: 0;
    }
`;

const ProjectLinks = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.space[4]};
    margin-bottom: ${({ theme }) => theme.space[5]};

    a {
        display: inline-flex;
        align-items: center;
        gap: ${({ theme }) => theme.space[2]};
        /* 44px tap target without a visible box. */
        min-height: 44px;
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

/* ------------------------------------------------------------ hackathon band */

/* One short paragraph and a button does not need full section padding. */
const BandSection = styled(Section)`
    padding-block: clamp(2.5rem, 1.75rem + 3.5vw, 4.5rem);
`;

const Band = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: ${({ theme }) => theme.space[8]};
    align-items: center;

    ${({ theme }) => theme.media.lg} {
        grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
        gap: ${({ theme }) => theme.space[12]};
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

/* Spec values are derived from the links already in the data rather than
   invented, so the cards gain a line without gaining new copy. */
const hostOf = (url) => {
    try {
        return new URL(url).hostname.replace(/^www\./, '');
    } catch {
        return url;
    }
};

const repoOf = (url) => {
    try {
        return new URL(url).pathname.replace(/^\//, '');
    } catch {
        return url;
    }
};

const pad = (index) => String(index + 1).padStart(2, '0');

const reveal = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
};

const DeveloperTeam = () => {
    return (
        <>
            <HeroSection $divided={false}>
                <GridBackdrop />
                <Container>
                    <HeroGrid>
                        <HeroCopy>
                            <Eyebrow>Development</Eyebrow>
                            <PageTitle as="h1">Developer Team</PageTitle>
                            <Lead style={{ marginTop: '1rem' }}>
                                Building the future of decentralized technology with cutting-edge blockchain solutions
                            </Lead>
                        </HeroCopy>

                        <Frame>
                            <img
                                src="/images/development/dev1.webp"
                                alt=""
                                loading="lazy"
                                width="1600"
                                height="1200"
                            />
                        </Frame>
                    </HeroGrid>

                    <StatStrip>
                        <StatCell {...reveal} transition={{ duration: 0.4 }}>
                            <StatLabel>Deploying</StatLabel>
                            <StatNumber><CountUp end={40} suffix="+" /></StatNumber>
                            <StatLabel>Developers</StatLabel>
                        </StatCell>
                        <StatCell {...reveal} transition={{ duration: 0.4, delay: 0.06 }}>
                            <StatLabel>Across</StatLabel>
                            <StatNumber><CountUp end={7} /></StatNumber>
                            <StatLabel>Active Projects</StatLabel>
                        </StatCell>
                    </StatStrip>
                </Container>
            </HeroSection>

            <Section>
                <GridBackdrop />
                <Container>
                    <Head>
                        <div>
                            <Eyebrow>Partners</Eyebrow>
                            <SectionTitle>External Projects</SectionTitle>
                        </div>
                        <Count>{String(ExternalProjects.length).padStart(2, '0')} Collaborations</Count>
                    </Head>

                    <PartnerGrid>
                        {ExternalProjects.map((tech, index) => (
                            <Reveal
                                key={tech.name}
                                {...reveal}
                                transition={{ duration: 0.4, delay: index * 0.06 }}
                            >
                                <Panel>
                                    <PanelTop>
                                        <ExtIcon href={tech.link} target="_blank" rel="noopener noreferrer">
                                            <img
                                                src={tech.icon}
                                                alt={`${tech.name} logo`}
                                                loading="lazy"
                                                width="56"
                                                height="56"
                                            />
                                        </ExtIcon>
                                        <Index>{pad(index)}</Index>
                                    </PanelTop>
                                    <CardTitle>{tech.name}</CardTitle>
                                    <CardText>{tech.description}</CardText>
                                    <Spec>
                                        <span>Site</span>
                                        <span>{hostOf(tech.link)}</span>
                                    </Spec>
                                </Panel>
                            </Reveal>
                        ))}
                    </PartnerGrid>
                </Container>
            </Section>

            <Section>
                <GridBackdrop />
                <Container>
                    <Head>
                        <div>
                            <Eyebrow>In-house</Eyebrow>
                            <SectionTitle>Internal Projects</SectionTitle>
                        </div>
                        <Count>{String(InternalProjects.length).padStart(2, '0')} Builds</Count>
                    </Head>

                    <ProjectGrid>
                        {InternalProjects.map((project, index) => (
                            <Reveal
                                key={project.title}
                                {...reveal}
                                transition={{ duration: 0.4, delay: index * 0.06 }}
                            >
                                <Panel>
                                    <PanelTop>
                                        <Index>{pad(index)}</Index>
                                    </PanelTop>
                                    <CardTitle>{project.title}</CardTitle>
                                    <CardText>{project.description}</CardText>
                                    <ProjectLinks>
                                        <a href={project.github} target="_blank" rel="noopener noreferrer">
                                            <Github width={16} height={16} /> View Code
                                        </a>
                                    </ProjectLinks>
                                    <Spec>
                                        <span>Repo</span>
                                        <span>{repoOf(project.github)}</span>
                                    </Spec>
                                </Panel>
                            </Reveal>
                        ))}
                    </ProjectGrid>
                </Container>
            </Section>

            <BandSection>
                <GridBackdrop />
                <Container>
                    <Band>
                        <Frame>
                            <img
                                src="/images/development/dev2.webp"
                                alt=""
                                loading="lazy"
                                width="1600"
                                height="1200"
                            />
                        </Frame>

                        <div>
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
                        </div>
                    </Band>
                </Container>
            </BandSection>
        </>
    );
};

export default DeveloperTeam;
