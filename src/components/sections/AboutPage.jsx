import styled from 'styled-components';
import { motion } from 'framer-motion';

import { Arrow, ExternalLink } from '../ui/Arrow';
import {
  Section,
  Container,
  GridBackdrop,
  Eyebrow,
  SectionTitle,
  Lead,
  Button,
  ButtonLink,
} from '../ui/primitives';

/**
 * The four images here used to point at a placeholder-image CDN that has since
 * shut down, so the page rendered four broken images. They now reference real
 * club photos that exist in public/images.
 */
const sections = [
  {
    title: 'About Us',
    content:
      "At Boiler Blockchain, we're building the future of Web3 at Purdue University.",
    image: '/images/club/bb_group_photo_solana_across_camp.webp',
    imageWidth: 1280,
    imageHeight: 960,
    list: [
      'Leading student-run blockchain organization fostering innovation and learning since 2021',
      'Collaborative environment bringing together developers, researchers, and industry partners',
      'Strong focus on practical implementation and real-world applications',
      'Active community of 200+ members from diverse academic backgrounds',
    ],
    button: {
      text: 'Join Our Discord',
      link: 'https://discord.gg/vNwXZ39vmG',
    },
    imageFirst: false,
  },
  {
    title: 'Hackathons & Innovation',
    content:
      'Creating breakthrough blockchain solutions through competitive innovation.',
    image: '/images/development/dev1.webp',
    imageWidth: 1600,
    imageHeight: 1200,
    list: [
      'Annual flagship hackathon with over $10,000 in prizes and industry sponsorships',
      'Focused tracks in DeFi, NFTs, Web3 infrastructure, and social impact',
      'Direct mentorship from experienced developers and industry professionals',
      'Opportunity to develop projects with real-world implementation potential',
    ],
    button: {
      text: 'Hackathons',
      link: '/hackathons',
    },
    imageFirst: true,
  },
  {
    title: 'Learning & Development',
    content:
      'Comprehensive blockchain education from fundamentals to advanced implementation.',
    image: '/images/education/edu1.webp',
    imageWidth: 1280,
    imageHeight: 960,
    list: [
      'Structured technical workshops covering Ethereum, Solidity, and Web3 development',
      'Hands-on experience with smart contracts and decentralized applications',
      'Access to industry-standard tools and development frameworks',
      'Collaborative learning environment with peer programming sessions',
    ],
    button: {
      text: 'Education',
      link: '/education',
    },
    imageFirst: false,
  },
  {
    title: 'Community & Network',
    content: 'Building lasting connections in the blockchain ecosystem.',
    image: '/images/operations/op1.webp',
    imageWidth: 1600,
    imageHeight: 1200,
    list: [
      'Regular networking events with industry professionals and alumni',
      'Opportunities to join specialized project teams and research groups',
      'Mentorship program connecting experienced members with newcomers',
      'Social events and collaborative learning sessions to strengthen community bonds',
    ],
    button: {
      text: 'Join Our Discord',
      link: 'https://discord.gg/vNwXZ39vmG',
    },
    imageFirst: true,
  },
];

const Accent = styled.span`
  color: ${({ theme }) => theme.color.accent};
`;

const Head = styled.div`
  margin-bottom: ${({ theme }) => theme.space[10]};
`;

/**
 * The rows used to be a bordered card floating beside a photo, both centred,
 * with 3rem of padding above and below each. The card is gone: the text is now
 * a plain column headed by a numbered index plate, so the alternation reads as
 * a deliberate sequence rather than four identical grey boxes.
 */
const Row = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${({ theme }) => theme.space[6]};
  align-items: start;
  padding-block: ${({ theme }) => theme.space[10]};
  border-top: 1px solid ${({ theme }) => theme.color.border};

  ${({ theme }) => theme.media.lg} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: ${({ theme }) => theme.space[12]};
    padding-block: ${({ theme }) => theme.space[12]};
  }
`;

/* On mobile the photo always leads; on desktop it alternates sides. */
const Media = styled.div`
  position: relative;
  order: -1;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.color.border};
  background: ${({ theme }) => theme.color.surface};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* Desaturated at rest so four unrelated snapshots read as one set. */
    filter: grayscale(1) brightness(0.62);
    transition: transform ${({ theme }) => theme.motion.slow},
                filter ${({ theme }) => theme.motion.slow};
  }

  &:hover img {
    filter: grayscale(0) brightness(0.85);
    transform: scale(1.03);
  }

  ${({ theme }) => theme.media.lg} {
    order: ${({ $flip }) => ($flip ? -1 : 1)};
    position: sticky;
    top: calc(${({ theme }) => theme.layout.navHeight} + ${({ theme }) => theme.space[8]});
  }
`;

const Index = styled.span`
  position: absolute;
  left: 0;
  bottom: 0;
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  letter-spacing: 0.2em;
  color: ${({ theme }) => theme.color.text};
  background: ${({ theme }) => theme.color.black};
  border-top: 1px solid ${({ theme }) => theme.color.border};
  border-right: 1px solid ${({ theme }) => theme.color.border};
`;

const Block = styled.div`
  min-width: 0;
`;

const BlockTitle = styled.h2`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.h2};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.color.text};
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const BlockBody = styled.p`
  font-family: ${({ theme }) => theme.fontFamily.body};
  font-size: ${({ theme }) => theme.fontSize.bodyLarge};
  line-height: 1.6;
  color: ${({ theme }) => theme.color.textMuted};
  padding-bottom: ${({ theme }) => theme.space[6]};
  margin-bottom: ${({ theme }) => theme.space[2]};
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`;

/* Hairline rows rather than dashes: gives the four bullets structure without
   adding another surface. */
const List = styled.ul`
  list-style: none;
  margin-bottom: ${({ theme }) => theme.space[8]};

  li {
    display: grid;
    grid-template-columns: 1.5rem minmax(0, 1fr);
    gap: ${({ theme }) => theme.space[2]};
    align-items: baseline;
    padding-block: ${({ theme }) => theme.space[3]};
    border-bottom: 1px solid ${({ theme }) => theme.color.border};
    font-family: ${({ theme }) => theme.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSize.body};
    line-height: 1.6;
    color: ${({ theme }) => theme.color.textMuted};
  }

  li::before {
    content: '';
    width: 10px;
    height: 1px;
    background: ${({ theme }) => theme.color.accent};
    transform: translateY(-0.3em);
  }
`;

const AboutPage = () => {
  return (
    <Section>
      <GridBackdrop />
      <Container $wide>
        <Head
          as={motion.div}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <Eyebrow>About</Eyebrow>
          <SectionTitle>
            Discover <Accent>Who we are</Accent>
          </SectionTitle>
          <Lead style={{ marginTop: '1rem' }}>
            Purdue&apos;s premier student-led organization dedicated to advancing
            blockchain technology through innovation, education, and community
            building.
          </Lead>
        </Head>

        {sections.map((section, index) => {
          const isExternal = section.button.link.startsWith('http');

          return (
            <Row
              key={section.title}
              as={motion.div}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <Block>
                <BlockTitle>{section.title}</BlockTitle>
                <BlockBody>{section.content}</BlockBody>
                <List>
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </List>
                {isExternal ? (
                  <Button
                    href={section.button.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    $variant="outline"
                  >
                    {section.button.text}
                    <ExternalLink size={16} />
                  </Button>
                ) : (
                  <ButtonLink to={section.button.link} $variant="outline">
                    {section.button.text}
                    <Arrow size={16} />
                  </ButtonLink>
                )}
              </Block>

              <Media $flip={section.imageFirst}>
                <img
                  src={section.image}
                  alt={section.title}
                  loading="lazy"
                  width={section.imageWidth}
                  height={section.imageHeight}
                />
                <Index>{String(index + 1).padStart(2, '0')}</Index>
              </Media>
            </Row>
          );
        })}
      </Container>
    </Section>
  );
};

export default AboutPage;
