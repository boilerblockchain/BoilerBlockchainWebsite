import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import { Arrow } from '../../ui/Arrow';
import {
  Section,
  Container,
  GridBackdrop,
  Eyebrow,
  SectionTitle,
  Lead,
  ButtonLink,
  Tag,
} from '../../ui/primitives';

/** Cross-fading image panel. Pauses on hover, and stops entirely under
 *  prefers-reduced-motion (it showed the first image only in that case). */
function Carousel({ images, alt }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }
    const id = setInterval(
      () => setIndex((prev) => (prev + 1) % images.length),
      4500,
    );
    return () => clearInterval(id);
  }, [paused, images.length]);

  return (
    <Frame
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((src, i) => (
        <Slide
          key={src}
          src={src}
          alt={`${alt} ${i + 1}`}
          $active={i === index}
          loading="lazy"
          width="1600"
          height="1000"
        />
      ))}
      <Dots>
        {images.map((src, i) => (
          <Dot
            key={src}
            type="button"
            $active={i === index}
            onClick={() => setIndex(i)}
            aria-label={`Show ${alt} image ${i + 1}`}
          />
        ))}
      </Dots>
    </Frame>
  );
}

const Frame = styled.div`
  position: relative;
  width: 100%;
  /* aspect-ratio instead of a fixed px height, so the panel never letterboxes
     and never reflows once the image loads. */
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.color.border};
  background: ${({ theme }) => theme.color.surface};
`;

const Slide = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transition: opacity 600ms ease;
`;

const Dots = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.space[3]};
  bottom: ${({ theme }) => theme.space[3]};
  display: flex;
  gap: ${({ theme }) => theme.space[2]};
`;

const Dot = styled.button`
  width: 22px;
  height: 3px;
  padding: 0;
  border: 0;
  cursor: pointer;
  background: ${({ $active, theme }) =>
    $active ? theme.color.accent : 'rgba(255, 255, 255, 0.35)'};
  transition: background ${({ theme }) => theme.motion.base};
`;

/**
 * Two-column grid, alternating sides.
 *
 * The old version was a flex row holding a fixed 650px image and a fixed 550px
 * card with a 3rem gap — 1296px of demand — that did not stack until 768px. So
 * everything from 769px to 1200px squeezed the card to roughly 250px of usable
 * width. minmax(0, 1fr) on both columns is the actual fix: the default
 * min-width:auto is what lets a grid child refuse to shrink.
 */
const Row = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${({ theme }) => theme.space[8]};
  align-items: center;
  padding-block: ${({ theme }) => theme.space[12]};
  border-top: 1px solid ${({ theme }) => theme.color.border};

  ${({ theme }) => theme.media.lg} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: ${({ theme }) => theme.space[16]};
  }
`;

/* On desktop, even rows put the image on the left. On mobile the image is
   always first, so the rhythm stays consistent instead of alternating. */
const Media = styled.div`
  order: -1;

  ${({ theme }) => theme.media.lg} {
    order: ${({ $flip }) => ($flip ? -1 : 1)};
  }
`;

const Body = styled.div`
  min-width: 0;
`;

const BlockLabel = styled.div`
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.accent};
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const Title = styled.h3`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.h2};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.color.text};
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[2]};
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

const Bullets = styled.ul`
  list-style: none;
  margin-bottom: ${({ theme }) => theme.space[8]};

  li {
    position: relative;
    padding-left: ${({ theme }) => theme.space[5]};
    font-family: ${({ theme }) => theme.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSize.body};
    line-height: 1.6;
    color: ${({ theme }) => theme.color.textMuted};
  }

  li + li {
    margin-top: ${({ theme }) => theme.space[3]};
  }

  li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.65em;
    width: 8px;
    height: 1px;
    background: ${({ theme }) => theme.color.accent};
  }
`;

const Hash = styled.div`
  margin-top: ${({ theme }) => theme.space[6]};
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.color.textFaint};
  overflow-wrap: anywhere;
`;

const Head = styled.div`
  margin-bottom: ${({ theme }) => theme.space[10]};
`;

const pillars = [
  {
    id: 'education',
    label: 'Block #01',
    title: 'Education',
    tags: ['12 Weeks', 'Full-Stack', 'Workshops'],
    bullets: [
      '12-week technical course covering Web3 fundamentals',
      'Student instructors and dedicated TAs for weekly support',
      'Guest lectures, protocol workshops and company visits',
    ],
    to: '/courses',
    hash: '0x4e64a1b2c3d4e5f6',
    images: [
      '/images/education/edu1.webp',
      '/images/education/edu2.webp',
      '/images/education/edu3.webp',
    ],
  },
  {
    id: 'development',
    label: 'Block #02',
    title: 'Development',
    tags: ['Hackathons', 'Grants', 'Bounties'],
    bullets: [
      'Ship products through hackathons, grants and bounties',
      'Small builder teams with weekly sprints and code review',
      'Demo days with protocol feedback and iteration',
    ],
    to: '/teams/developer',
    hash: '0x7f8a9b0c1d2e3f4a',
    images: [
      '/images/development/dev1.webp',
      '/images/development/dev2.webp',
      '/images/development/dev3.webp',
    ],
  },
  {
    id: 'research',
    label: 'Block #03',
    title: 'Research',
    tags: ['Investments', 'Consulting', 'Due Diligence'],
    bullets: [
      'Investment and protocol research with real deliverables',
      'Formal due diligence for partners and sponsors',
      'Publish theses on emerging crypto markets and sectors',
    ],
    to: '/teams/research',
    hash: '0x1a2b3c4d5e6f7a8b',
    images: [
      '/images/research/res1.webp',
      '/images/research/res2.webp',
      '/images/research/res3.webp',
    ],
  },
  {
    id: 'operations',
    label: 'Block #04',
    title: 'Operations',
    tags: ['Events', 'Funding', 'Growth'],
    bullets: [
      'Organize and run all events, speakers and workshops',
      'Secure funding and manage sponsorship relationships',
      'Scale teams through media, recruiting and onboarding',
    ],
    to: '/teams/operations',
    hash: '0x9c8d7e6f5a4b3c2d',
    images: [
      '/images/operations/op1.webp',
      '/images/operations/op2.webp',
      '/images/operations/op3.webp',
    ],
  },
];

export default function Pillars() {
  const ref = useRef(null);

  return (
    <Section ref={ref}>
      <GridBackdrop />
      <Container $wide>
        <Head>
          <Eyebrow>What we do</Eyebrow>
          <SectionTitle>Four pillars, one outcome</SectionTitle>
          <Lead style={{ marginTop: '1rem' }}>
            Education, development, research and operations — each one a route
            into elite Web3 work.
          </Lead>
        </Head>

        {pillars.map((pillar, index) => (
          <Row
            key={pillar.id}
            id={`block-${pillar.id}`}
            as={motion.div}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <Body>
              <BlockLabel>{pillar.label}</BlockLabel>
              <Title>{pillar.title}</Title>
              <Tags>
                {pillar.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </Tags>
              <Bullets>
                {pillar.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </Bullets>
              <ButtonLink to={pillar.to} $variant="outline">
                Explore
                <Arrow size={16} />
              </ButtonLink>
              <Hash>HASH: {pillar.hash}…</Hash>
            </Body>

            <Media $flip={index % 2 === 1}>
              <Carousel images={pillar.images} alt={pillar.title} />
            </Media>
          </Row>
        ))}
      </Container>
    </Section>
  );
}
