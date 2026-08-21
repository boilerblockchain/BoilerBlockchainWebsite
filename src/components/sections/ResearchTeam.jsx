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
  Card,
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
    grid-template-columns: repeat(3, minmax(0, 1fr));
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
  margin-bottom: ${({ theme }) => theme.space[3]};
`;

const StatLabel = styled.div`
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textFaint};
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: ${({ theme }) => theme.space[6]};
`;

const ItemCard = styled(Card)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
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

const ResearchLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  margin-top: auto;
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

const PublicationAuthors = styled.p`
  font-family: ${({ theme }) => theme.fontFamily.body};
  font-size: ${({ theme }) => theme.fontSize.small};
  line-height: 1.5;
  color: ${({ theme }) => theme.color.accent};
  margin-bottom: ${({ theme }) => theme.space[3]};
`;

const PublicationAbstract = styled.p`
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textFaint};
  margin-top: auto;
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
      <Section $divided={false}>
        <GridBackdrop />
        <Container>
          <Eyebrow>Research</Eyebrow>
          <SectionTitle as="h1">Research Team</SectionTitle>
          <Lead style={{ marginTop: '1rem' }}>
            Advancing blockchain technology through rigorous academic research and innovative solutions
          </Lead>

          <StatsRow>
            {stats.map((stat, index) => (
              <Reveal
                key={stat.label}
                {...reveal}
                transition={{ duration: 0.4, delay: index * 0.06 }}
              >
                <StatCard>
                  <StatNumber><CountUp end={stat.end} suffix={stat.suffix} /></StatNumber>
                  <StatLabel>{stat.label}</StatLabel>
                </StatCard>
              </Reveal>
            ))}
          </StatsRow>
        </Container>
      </Section>

      <Section>
        <GridBackdrop />
        <Container>
          <Head>
            <Eyebrow>Focus</Eyebrow>
            <SectionTitle>Research Areas</SectionTitle>
          </Head>

          <CardGrid>
            {researchAreas.map((area, index) => (
              <Reveal
                key={area.title}
                {...reveal}
                transition={{ duration: 0.4, delay: index * 0.06 }}
              >
                <ItemCard>
                  <CardTitle>{area.title}</CardTitle>
                  <CardText>{area.description}</CardText>
                  <ResearchLink href={area.link}>
                    <ExternalLink size={16} /> Learn More
                  </ResearchLink>
                </ItemCard>
              </Reveal>
            ))}
          </CardGrid>
        </Container>
      </Section>

      <Section>
        <GridBackdrop />
        <Container>
          <Head>
            <Eyebrow>Published</Eyebrow>
            <SectionTitle>Recent Publications</SectionTitle>
          </Head>

          <CardGrid>
            {publications.map((pub, index) => (
              <Reveal
                key={pub.title}
                {...reveal}
                transition={{ duration: 0.4, delay: Math.min(index, 6) * 0.05 }}
              >
                <ItemCard>
                  <CardTitle>{pub.title}</CardTitle>
                  <PublicationAuthors>{pub.authors}</PublicationAuthors>
                  <PublicationAbstract>{pub.abstract}</PublicationAbstract>
                </ItemCard>
              </Reveal>
            ))}
          </CardGrid>
        </Container>
      </Section>
    </>
  );
};

export default ResearchTeam;
