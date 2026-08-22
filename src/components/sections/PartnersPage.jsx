import styled from 'styled-components';
import { motion } from 'framer-motion';

import {
  Section,
  Container,
  GridBackdrop,
  Eyebrow,
  SectionTitle,
  Lead,
} from '../ui/primitives';

const partners = [
  { name: 'Aptos', logo: '/images/partners/aptos.webp', url: '#' },
  { name: 'Caffeine', logo: '/images/partners/caffeine.webp', url: '#' },
  { name: 'Celo', logo: '/images/partners/celo.webp', url: '#' },
  { name: 'College DAO', logo: '/images/partners/collegedao.webp', url: '#' },
  { name: 'College XYZ', logo: '/images/partners/collegexyz.webp', url: '#' },
  { name: 'DormDAO', logo: '/images/partners/dormdao.webp', url: '#' },
  { name: 'Eigen', logo: '/images/partners/eigen.webp', url: '#' },
  { name: 'Flojo', logo: '/images/partners/flojo.webp', url: '#' },
  { name: 'Gemini', logo: '/images/partners/gemini.webp', url: '#' },
  { name: 'ICP', logo: '/images/partners/icp.webp', url: '#' },
  { name: 'Ledger', logo: '/images/partners/ledger.webp', url: '#' },
  { name: 'Meteora', logo: '/images/partners/meteora.webp', url: '#' },
  { name: 'MOI', logo: '/images/partners/moi.webp', url: '#' },
  { name: 'OP', logo: '/images/partners/op.webp', url: '#' },
  { name: 'Origin', logo: '/images/partners/origin.webp', url: '#' },
  { name: 'Polymarket', logo: '/images/partners/polymarket.webp', url: '#' },
  { name: 'Purdue', logo: '/images/partners/purdue.webp', url: '#' },
  { name: 'SharkLabs', logo: '/images/partners/sharklabs.webp', url: '#' },
  { name: 'Solana', logo: '/images/partners/solana.webp', url: '#' },
  { name: 'Sonic', logo: '/images/partners/sonic.webp', url: '#' },
  { name: 'Stader', logo: '/images/partners/stader.webp', url: '#' },
  { name: 'Sui', logo: '/images/partners/sui.webp', url: '#' },
  { name: 'SWC', logo: '/images/partners/swc.webp', url: '#' },
  { name: 'Symphony', logo: '/images/partners/symphony.webp', url: '#' },
];

/**
 * Header sets title against the blurb across a hairline rather than stacking
 * both down the left edge, which is what left a band of black above the wall.
 */
const Head = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${({ theme }) => theme.space[6]};
  align-items: end;
  padding-bottom: ${({ theme }) => theme.space[8]};
  margin-bottom: ${({ theme }) => theme.space[8]};
  border-bottom: 1px solid ${({ theme }) => theme.color.borderStrong};

  ${({ theme }) => theme.media.lg} {
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    gap: ${({ theme }) => theme.space[12]};
  }
`;

const HeadTitle = styled.div`
  min-width: 0;

  h1 {
    font-size: ${({ theme }) => theme.fontSize.h1};
  }
`;

const Accent = styled.span`
  color: ${({ theme }) => theme.color.accent};
`;

/* Genuinely unbounded list, so auto-fill stays here. Tighter tracks and a
   tighter gutter put more of the wall on screen at once. */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: ${({ theme }) => theme.space[3]};

  ${({ theme }) => theme.media.md} {
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    gap: ${({ theme }) => theme.space[4]};
  }
`;

/**
 * The one near-white surface on the site, and it earns the exception: the logos
 * are transparent webps, some drawn in white ink and some in black, so neither
 * a pure dark nor a pure light plate keeps all 24 legible on its own.
 *
 * At rest the plate is light and every logo is forced to a dark monochrome, so
 * white wordmarks stay visible. On hover the plate flips dark and the logo
 * returns to full color, which is legible the other way round. Still square,
 * still a 1px border, no gradient.
 */
const Plate = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 5 / 3;
  padding: ${({ theme }) => theme.space[5]};
  background: #f2f2f4;
  border: 1px solid ${({ theme }) => theme.color.border};
  transition: background ${({ theme }) => theme.motion.base},
              border-color ${({ theme }) => theme.motion.base};

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    filter: grayscale(100%) brightness(0.3) contrast(1.2);
    opacity: 0.75;
    transition: filter ${({ theme }) => theme.motion.base},
                opacity ${({ theme }) => theme.motion.base};
  }
`;

const PartnerCard = styled(motion.a)`
  display: block;
  min-width: 0;
  text-decoration: none;

  &:hover ${Plate} {
    background: ${({ theme }) => theme.color.surfaceRaised};
    border-color: ${({ theme }) => theme.color.accentBorderStrong};
  }

  &:hover ${Plate} img {
    filter: none;
    opacity: 1;
  }
`;

const PartnersPage = () => {
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
          <HeadTitle>
            <Eyebrow>Partners</Eyebrow>
            <SectionTitle as="h1">
              Our <Accent>Partners</Accent>
            </SectionTitle>
          </HeadTitle>
          <Lead>
            Building the future of blockchain together with leading
            organizations, hackathon platforms, and industry pioneers who share
            our vision for innovation
          </Lead>
        </Head>

        <Grid>
          {partners.map((partner, index) => (
            <PartnerCard
              key={`${partner.name}-${index}`}
              href={partner.url !== '#' ? partner.url : undefined}
              target={partner.url !== '#' ? '_blank' : undefined}
              rel={partner.url !== '#' ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              style={{ cursor: partner.url !== '#' ? 'pointer' : 'default' }}
            >
              <Plate>
                {/* The plate owns the aspect ratio, so no width/height here:
                    the logos have 24 different intrinsic ratios. */}
                <img src={partner.logo} alt={partner.name} loading="lazy" />
              </Plate>
            </PartnerCard>
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

export default PartnersPage;
