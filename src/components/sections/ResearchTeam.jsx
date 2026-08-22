import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import { ExternalLink } from '../ui/Arrow';
import {
  Section,
  Container,
  GridBackdrop,
  Eyebrow,
  SectionTitle,
  Lead,
} from '../ui/primitives';

/**
 * Research team page.
 *
 * Density pass, following the choose-a-team page. Four research areas is a
 * known set, so the columns are explicit; twelve publications are a list, so
 * they render as a numbered hairline index rather than twelve identical grey
 * boxes, which gives the page two levels of hierarchy instead of one.
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

/* Leading accent rule, so the top of the page carries some structure. */
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
  aspect-ratio: ${({ $ratio }) => $ratio || '4 / 3'};
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

const WideFrame = styled(Frame)`
  aspect-ratio: 16 / 9;
  margin-bottom: ${({ theme }) => theme.space[10]};

  ${({ theme }) => theme.media.md} {
    aspect-ratio: 3 / 1;
  }
`;

/* ---------------------------------------------------------------- stat strip */

/* Hairline-divided inline row spanning the container, like home/Stats. Three
   bordered boxes with acres of black around them is what read as empty. */
const StatStrip = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  margin-top: ${({ theme }) => theme.space[10]};
  border-top: 1px solid ${({ theme }) => theme.color.border};

  ${({ theme }) => theme.media.sm} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
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
  margin-bottom: ${({ theme }) => theme.space[3]};
`;

const StatLabel = styled.div`
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textFaint};
`;

/* ------------------------------------------------------------------ headers */

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

/* Four areas is a known set: explicit columns, so the row fills. */
const AreaGrid = styled.div`
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

/* Numbered index plate: the one piece of contrast on an otherwise flat card. */
const Index = styled.span`
  align-self: flex-start;
  margin-bottom: ${({ theme }) => theme.space[5]};
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  letter-spacing: 0.2em;
  color: ${({ theme }) => theme.color.text};
  background: ${({ theme }) => theme.color.black};
  border: 1px solid ${({ theme }) => theme.color.border};
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[2]};
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

/* Hairline spec line: label left, accent value right. The value is counted
   from the publications already in this file, not invented. */
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
  }
`;

const ResearchLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  /* 44px tap target without a visible box. */
  min-height: 44px;
  margin-bottom: ${({ theme }) => theme.space[2]};
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
`;

/* ------------------------------------------------------------- publications */

/* Twelve papers as a numbered hairline index. Two columns of rows, so the
   list fills the container instead of running as one narrow ribbon. */
const PubList = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  column-gap: ${({ theme }) => theme.space[12]};
  border-top: 1px solid ${({ theme }) => theme.color.border};

  ${({ theme }) => theme.media.lg} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const PubRow = styled(motion.article)`
  display: grid;
  grid-template-columns: 2.5rem minmax(0, 1fr);
  gap: ${({ theme }) => theme.space[4]};
  padding-block: ${({ theme }) => theme.space[5]};
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
  transition: background ${({ theme }) => theme.motion.base};

  &:hover {
    background: ${({ theme }) => theme.color.accentWash};
  }
`;

const PubIndex = styled.span`
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  letter-spacing: 0.1em;
  line-height: 1.6;
  color: ${({ theme }) => theme.color.textFaint};
  font-variant-numeric: tabular-nums;
`;

const PublicationTitle = styled.h3`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.h4};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  line-height: 1.25;
  color: ${({ theme }) => theme.color.text};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const PublicationAuthors = styled.p`
  font-family: ${({ theme }) => theme.fontFamily.body};
  font-size: ${({ theme }) => theme.fontSize.small};
  line-height: 1.5;
  color: ${({ theme }) => theme.color.textMuted};
  margin-bottom: ${({ theme }) => theme.space[3]};
`;

const PublicationAbstract = styled.p`
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.accent};
`;

const researchAreas = [
  {
    title: 'TradFi & DeFi',
    description: 'Researching the breakthroughs decentralized finance offers over traditional institutions. ',
    link: '#'
  },
  {
    title: 'Decentralization & Regulation',
    description: 'Analyzing the mechanisms, benefits, and tradeoffs of using a decentralized system.',
    link: '#'
  },
  {
    title: 'Blockchain Architecture',
    description: 'Exploring the backbone behind what makes Blockchain Possible.',
    link: '#'
  },
  {
    title: 'Privacy & Cryptography',
    description: 'Investigating zero-knowledge proof systems and privacy-focused blockchain applications.',
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

/* Papers filed under each area, counted rather than authored, so every area
   card gets a spec line without any new copy. */
const paperCount = (areaTitle) =>
  publications.filter(
    (pub) => pub.abstract.toLowerCase() === areaTitle.toLowerCase(),
  ).length;

const pad = (index) => String(index + 1).padStart(2, '0');

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
};

const stats = [
  { end: 50, suffix: '+', label: 'Researchers' },
  { end: 12, suffix: '', label: 'Teams' },
  { end: 4, suffix: '', label: 'Research Areas' },
];

const ResearchTeam = () => {
  return (
    <>
      <HeroSection $divided={false}>
        <GridBackdrop />
        <Container>
          <HeroGrid>
            <HeroCopy>
              <Eyebrow>Research</Eyebrow>
              <PageTitle as="h1">Research Team</PageTitle>
              <Lead style={{ marginTop: '1rem' }}>
                Advancing blockchain technology through rigorous academic research and innovative solutions
              </Lead>
            </HeroCopy>

            <Frame>
              <img
                src="/images/research/res1.webp"
                alt=""
                loading="lazy"
                width="1600"
                height="1200"
              />
            </Frame>
          </HeroGrid>

          <StatStrip>
            {stats.map((stat, index) => (
              <StatCell
                key={stat.label}
                {...reveal}
                transition={{ duration: 0.4, delay: index * 0.06 }}
              >
                <StatNumber><CountUp end={stat.end} suffix={stat.suffix} /></StatNumber>
                <StatLabel>{stat.label}</StatLabel>
              </StatCell>
            ))}
          </StatStrip>
        </Container>
      </HeroSection>

      <Section>
        <GridBackdrop />
        <Container>
          <Head>
            <div>
              <Eyebrow>Focus</Eyebrow>
              <SectionTitle>Research Areas</SectionTitle>
            </div>
            <Count>{String(researchAreas.length).padStart(2, '0')} Areas</Count>
          </Head>

          <AreaGrid>
            {researchAreas.map((area, index) => (
              <Reveal
                key={area.title}
                {...reveal}
                transition={{ duration: 0.4, delay: index * 0.06 }}
              >
                <Panel>
                  <Index>{pad(index)}</Index>
                  <CardTitle>{area.title}</CardTitle>
                  <CardText>{area.description}</CardText>
                  <ResearchLink href={area.link}>
                    <ExternalLink size={16} /> Learn More
                  </ResearchLink>
                  <Spec>
                    <span>Papers</span>
                    <span>{String(paperCount(area.title)).padStart(2, '0')}</span>
                  </Spec>
                </Panel>
              </Reveal>
            ))}
          </AreaGrid>
        </Container>
      </Section>

      <Section>
        <GridBackdrop />
        <Container>
          <WideFrame>
            <img
              src="/images/research/res2.webp"
              alt=""
              loading="lazy"
              width="1600"
              height="1200"
            />
          </WideFrame>

          <Head>
            <div>
              <Eyebrow>Published</Eyebrow>
              <SectionTitle>Recent Publications</SectionTitle>
            </div>
            <Count>{String(publications.length).padStart(2, '0')} Papers</Count>
          </Head>

          <PubList>
            {publications.map((pub, index) => (
              <PubRow
                key={pub.title}
                {...reveal}
                transition={{ duration: 0.4, delay: Math.min(index, 6) * 0.05 }}
              >
                <PubIndex>{pad(index)}</PubIndex>
                <div>
                  <PublicationTitle>{pub.title}</PublicationTitle>
                  <PublicationAuthors>{pub.authors}</PublicationAuthors>
                  <PublicationAbstract>{pub.abstract}</PublicationAbstract>
                </div>
              </PubRow>
            ))}
          </PubList>
        </Container>
      </Section>
    </>
  );
};

export default ResearchTeam;
