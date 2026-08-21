import styled from 'styled-components';
import { motion } from 'framer-motion';

import {
  Section,
  Container,
  GridBackdrop,
  Eyebrow,
  SectionTitle,
} from '../../ui/primitives';

/**
 * The positioning statement.
 *
 * Was a glass panel under four animated glitch/scanline overlays with a 150px
 * logo rotated 5 degrees stuck to the corner like a sticker. Now it is type on
 * a dot grid, which is the whole point.
 */
const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[8]};

  ${({ theme }) => theme.media.lg} {
    grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
    gap: ${({ theme }) => theme.space[16]};
    align-items: start;
  }
`;

const Body = styled.div`
  font-family: ${({ theme }) => theme.fontFamily.body};
  font-size: ${({ theme }) => theme.fontSize.body};
  line-height: 1.7;
  color: ${({ theme }) => theme.color.textMuted};

  p + p {
    margin-top: ${({ theme }) => theme.space[5]};
  }

  strong {
    color: ${({ theme }) => theme.color.text};
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
  }
`;

const Rule = styled.hr`
  border: 0;
  border-top: 1px solid ${({ theme }) => theme.color.border};
  margin-block: ${({ theme }) => theme.space[8]};
`;

const Micro = styled.p`
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textFaint};
`;

export default function Identity() {
  return (
    <Section>
      <GridBackdrop />
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <Grid>
            <div>
              <Eyebrow>Who we are</Eyebrow>
              <SectionTitle>
                A new standard for Web3 talent
              </SectionTitle>
            </div>
            <Body>
              <p>
                Boiler Blockchain exists to do one thing exceptionally well:
                identify, cultivate and launch the strongest Web3 talent at
                Purdue.
              </p>
              <p>
                We are not an internship pipeline. We are not a hackathon team.
                We are not a media organization.
              </p>
              <p>
                We are a <strong>training ground</strong> for builders,
                engineers, researchers and founders.
              </p>
              <Rule />
              <Micro>Talent first. Outcomes follow.</Micro>
            </Body>
          </Grid>
        </motion.div>
      </Container>
    </Section>
  );
}
