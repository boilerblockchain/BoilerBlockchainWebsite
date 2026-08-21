import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

/**
 * Shared layout and text primitives.
 *
 * The design direction is flat and hard-edged: square corners, 1px borders,
 * one accent, a faint dot grid for depth, and generous whitespace. Nothing
 * glows, nothing shimmers, nothing loops.
 */

/**
 * The site's single background treatment. Sits behind a section's content and
 * fades out at the edges so it never reads as wallpaper.
 */
export const GridBackdrop = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image: ${({ theme }) => theme.dotGrid};
  background-size: ${({ theme }) => theme.dotGridSize};
  mask-image: radial-gradient(ellipse 70% 60% at 50% 45%, #000 20%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 45%, #000 20%, transparent 100%);
`;

export const Section = styled.section`
  position: relative;
  width: 100%;
  padding-block: ${({ theme }) => theme.sectionPadding.block};
  padding-inline: ${({ theme }) => theme.sectionPadding.inline};
  background: ${({ theme }) => theme.color.black};

  /* Hairline separator instead of a glowing divider element. */
  ${({ $divided = true }) =>
    $divided &&
    css`
      border-top: 1px solid ${({ theme }) => theme.color.border};
    `}
`;

export const Container = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: ${({ theme, $wide }) =>
    $wide ? theme.layout.maxWidthWide : theme.layout.maxWidth};
  margin-inline: auto;
`;

/** Monospaced, wide-tracked, uppercase. The one recurring typographic motif. */
export const Eyebrow = styled.p`
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.accent};
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

export const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.h2};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.color.text};
`;

export const Lead = styled.p`
  font-family: ${({ theme }) => theme.fontFamily.body};
  font-size: ${({ theme }) => theme.fontSize.bodyLarge};
  line-height: 1.6;
  color: ${({ theme }) => theme.color.textMuted};
  max-width: ${({ theme }) => theme.layout.maxWidthText};
`;

/**
 * Square, flat, bordered. Hover changes the border and lifts slightly —
 * that is the entire interaction vocabulary.
 */
export const Card = styled.div`
  position: relative;
  background: ${({ theme }) => theme.color.surfaceRaised};
  border: 1px solid ${({ theme }) => theme.color.border};
  padding: ${({ theme }) => theme.space[6]};
  transition: border-color ${({ theme }) => theme.motion.base},
              transform ${({ theme }) => theme.motion.base};

  &:hover {
    border-color: ${({ theme }) => theme.color.accentBorderStrong};
    transform: translateY(-3px);
  }
`;

const buttonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space[2]};
  padding: 0.9rem 1.75rem;
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.small};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
  border-radius: ${({ theme }) => theme.radius.none};
  transition: background ${({ theme }) => theme.motion.base},
              border-color ${({ theme }) => theme.motion.base},
              color ${({ theme }) => theme.motion.base};

  svg {
    flex-shrink: 0;
    transition: transform ${({ theme }) => theme.motion.base};
  }

  &:hover svg {
    transform: translateX(3px);
  }
`;

const solid = css`
  background: ${({ theme }) => theme.color.accentDeep};
  border: 1px solid ${({ theme }) => theme.color.accentDeep};
  color: #ffffff;

  &:hover {
    background: ${({ theme }) => theme.color.accent};
    border-color: ${({ theme }) => theme.color.accent};
  }
`;

const outline = css`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.color.borderStrong};
  color: ${({ theme }) => theme.color.text};

  &:hover {
    border-color: ${({ theme }) => theme.color.accent};
    color: ${({ theme }) => theme.color.accent};
  }
`;

const variantStyles = { solid, outline };

export const Button = styled.a`
  ${buttonBase}
  ${({ $variant = 'solid' }) => variantStyles[$variant] ?? solid}
`;

export const ButtonLink = styled(Link)`
  ${buttonBase}
  ${({ $variant = 'solid' }) => variantStyles[$variant] ?? solid}
`;

/** Small bordered tag, e.g. "12 WEEKS". */
export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.7rem;
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textMuted};
  border: 1px solid ${({ theme }) => theme.color.border};
`;
