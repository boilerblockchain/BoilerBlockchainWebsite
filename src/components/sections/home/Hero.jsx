import styled from 'styled-components';
import { motion } from 'framer-motion';

import Discord from '../../../Icons/Discord';
import { Button, ButtonLink, Eyebrow, GridBackdrop } from '../../ui/primitives';

const clubPhoto = '/images/club/bb_group_photo_solana_across_camp.webp';

/**
 * Split hero: type on a solid block, photograph in its own panel.
 *
 * An earlier pass ran the headline over a full-bleed version of this photo.
 * It does not work — the shot is a wide, busy lecture hall, so the copy either
 * disappeared into it or needed a scrim so heavy the photo was pointless. The
 * club is still the first thing on the page, just not underneath the text.
 */
const Wrap = styled.section`
  position: relative;
  width: 100%;
  background: ${({ theme }) => theme.color.black};
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
  display: grid;
  grid-template-columns: minmax(0, 1fr);

  ${({ theme }) => theme.media.lg} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: stretch;
    min-height: min(92svh, 940px);
  }
`;

const Copy = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-inline: ${({ theme }) => theme.sectionPadding.inline};
  padding-block: clamp(3rem, 2rem + 6vw, 5rem);

  ${({ theme }) => theme.media.lg} {
    /* Align the text column's left edge with the site container. */
    padding-left: max(
      ${({ theme }) => theme.sectionPadding.inline},
      calc((100vw - ${({ theme }) => theme.layout.maxWidthWide}) / 2)
    );
    padding-right: clamp(2rem, 4vw, 4rem);
  }
`;

const Inner = styled.div`
  position: relative;
  z-index: 1;
`;

const Title = styled(motion.h1)`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.display};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  line-height: 0.92;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.text};
  margin-bottom: ${({ theme }) => theme.space[5]};

  span {
    display: block;
    color: ${({ theme }) => theme.color.accent};
  }
`;

const Lead = styled(motion.p)`
  font-family: ${({ theme }) => theme.fontFamily.body};
  font-size: ${({ theme }) => theme.fontSize.bodyLarge};
  line-height: 1.55;
  color: ${({ theme }) => theme.color.textMuted};
  max-width: 42ch;
  margin-bottom: ${({ theme }) => theme.space[8]};
`;

const Actions = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[3]};
`;

const Media = styled.div`
  position: relative;
  overflow: hidden;
  border-top: 1px solid ${({ theme }) => theme.color.border};
  /* Reserve the box before the image lands so nothing reflows. */
  aspect-ratio: 16 / 11;

  ${({ theme }) => theme.media.lg} {
    aspect-ratio: auto;
    border-top: 0;
    border-left: 1px solid ${({ theme }) => theme.color.border};
  }
`;

const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* The group sits centre-low in the frame; bias the crop toward them so the
     ceiling tiles are what gets cut, not the people. */
  object-position: center 62%;
  display: block;
`;

/** Just enough to stop the photo competing with the type beside it. */
const Tint = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.28);
  pointer-events: none;
`;

const Caption = styled.figcaption`
  position: absolute;
  left: 0;
  bottom: 0;
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.text};
  background: rgba(0, 0, 0, 0.72);
`;

const fade = (delay) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] },
});

export default function Hero() {
  return (
    <Wrap>
      <Copy>
        <GridBackdrop />
        <Inner>
          <motion.div {...fade(0)}>
            <Eyebrow>Purdue University</Eyebrow>
          </motion.div>
          <Title {...fade(0.06)}>
            Boiler
            <span>Blockchain</span>
          </Title>
          <Lead {...fade(0.12)}>
            The next generation of blockchain engineers, researchers and
            founders.
          </Lead>
          <Actions {...fade(0.18)}>
            <Button
              href="https://discord.gg/vNwXZ39vmG"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Discord width={18} height={18} />
              Join Discord
            </Button>
            <ButtonLink to="/teams" $variant="outline">
              Explore Teams
            </ButtonLink>
          </Actions>
        </Inner>
      </Copy>

      <Media as="figure">
        <Photo
          src={clubPhoto}
          alt="Boiler Blockchain members at the Solana Across Campuses event at Purdue"
          width="2400"
          height="1600"
          fetchpriority="high"
        />
        <Tint />
        <Caption>Solana Across Campuses — Purdue</Caption>
      </Media>
    </Wrap>
  );
}
