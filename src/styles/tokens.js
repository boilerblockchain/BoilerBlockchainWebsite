/**
 * Design tokens for the Boiler Blockchain site.
 *
 * Two rules this file exists to enforce:
 *   1. Five breakpoints. Not twenty-nine.
 *   2. Flat color. No decorative gradients.
 */

/**
 * The only five breakpoints in the codebase.
 *
 * Anything narrower than `xs` is handled by fluid type and fluid spacing rather
 * than by another breakpoint, which is why there is no 360px or 320px entry.
 */
export const breakpoints = {
  xs: 480,   // phone
  sm: 640,   // large phone
  md: 768,   // tablet portrait
  lg: 1024,  // tablet landscape / small laptop
  xl: 1280,  // desktop
};

/**
 * Mobile-first min-width queries. Prefer these: they compose without the
 * specificity fights that stacked max-width overrides create.
 *
 *   ${media.md} { flex-direction: row; }
 */
export const media = Object.entries(breakpoints).reduce((acc, [key, value]) => {
  acc[key] = `@media (min-width: ${value}px)`;
  return acc;
}, {});

/**
 * Max-width queries, for the cases where overriding downward genuinely reads
 * better. Use sparingly.
 *
 *   ${mediaDown.md} { display: none; }
 */
export const mediaDown = Object.entries(breakpoints).reduce((acc, [key, value]) => {
  acc[key] = `@media (max-width: ${value - 0.02}px)`;
  return acc;
}, {});

/**
 * One accent hue, flat. `base` is the default; `deep` and `bright` exist for
 * hover and active states, NOT for gradient stops.
 */
export const color = {
  // Surfaces
  black: '#000000',
  surface: '#0E0E12',
  surfaceRaised: '#16161C',
  surfaceHover: '#1C1C24',

  // Accent
  accent: '#A855F7',
  accentDeep: '#7120B0',
  accentBright: '#C77DFF',

  // Accent at opacity, for borders and hover washes.
  accentBorder: 'rgba(168, 85, 247, 0.22)',
  accentBorderStrong: 'rgba(168, 85, 247, 0.45)',
  accentWash: 'rgba(168, 85, 247, 0.08)',
  accentGlow: 'rgba(168, 85, 247, 0.25)',

  // Text
  text: '#FFFFFF',
  textMuted: 'rgba(255, 255, 255, 0.72)',
  textFaint: 'rgba(255, 255, 255, 0.48)',

  // Hairlines
  border: 'rgba(255, 255, 255, 0.10)',
  borderStrong: 'rgba(255, 255, 255, 0.18)',
};

/**
 * Fluid type. Every size interpolates between a phone value and a desktop
 * value, so headings scale continuously from 320px to 2560px instead of
 * stepping at four breakpoints. This is what replaces the several hundred
 * per-breakpoint font-size overrides the codebase used to carry.
 */
export const fontSize = {
  micro: 'clamp(0.6875rem, 0.66rem + 0.14vw, 0.75rem)',
  small: 'clamp(0.8125rem, 0.78rem + 0.16vw, 0.875rem)',
  body: 'clamp(0.9375rem, 0.9rem + 0.19vw, 1.0625rem)',
  bodyLarge: 'clamp(1rem, 0.94rem + 0.31vw, 1.1875rem)',
  h4: 'clamp(1.125rem, 1.05rem + 0.38vw, 1.375rem)',
  h3: 'clamp(1.375rem, 1.2rem + 0.88vw, 1.875rem)',
  h2: 'clamp(1.75rem, 1.35rem + 2vw, 3rem)',
  h1: 'clamp(2.25rem, 1.5rem + 3.75vw, 4.5rem)',
  display: 'clamp(2.5rem, 1.4rem + 5.5vw, 5.5rem)',
  /* Capped so the widest value ("$50,000+") still fits a 4-up column at xl. */
  stat: 'clamp(1.75rem, 1.2rem + 2.4vw, 2.75rem)',
};

export const fontFamily = {
  // Display face. Rex likes it; it stays.
  display: "'Tomorrow', sans-serif",
  body: "'Inter', sans-serif",
  mono: "'Tomorrow', ui-monospace, monospace",
};

/**
 * Capped at 700. The codebase used to ask for 800/900 with only weight 600
 * loaded, so the browser faked it and every heading rendered smeared.
 */
export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

/** 4px base scale. */
export const space = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
};

/** Fluid vertical rhythm for section padding — one token, not a per-section ramp. */
export const sectionPadding = {
  block: 'clamp(3.5rem, 2rem + 7vw, 7.5rem)',
  inline: 'clamp(1rem, 0.5rem + 2.5vw, 2rem)',
};

/**
 * Square corners. The reference direction (staklabs.ai) uses literally zero
 * border-radius anywhere, and hard edges read as deliberate where 16px pill
 * cards read as a template. `sm` exists for the rare control that needs to look
 * clickable; `pill` is for tags only.
 */
export const radius = {
  none: '0',
  sm: '2px',
  md: '2px',
  lg: '0',
  xl: '0',
  pill: '999px',
};

/**
 * Flat design uses borders, not shadows, to separate surfaces. These are
 * near-invisible on black by design — the 1px border does the work. Cards sit
 * at `1` and rise to `2` on hover.
 */
export const elevation = {
  1: 'none',
  2: '0 8px 24px rgba(0, 0, 0, 0.5)',
  3: '0 16px 48px rgba(0, 0, 0, 0.6)',
};

/** Reserved for hover only, so a glow signals state instead of decorating. */
export const accentGlow = `0 0 0 1px ${color.accentBorderStrong}`;

/**
 * The one background treatment for the whole site: a faint dot grid.
 *
 * This is the exact recipe from the reference — 1px dots on a 30px cell —
 * retuned for a dark surface. It replaces the fullscreen particle canvas, the
 * glitch overlays, the network fields and the SVG node graphs. Apply it to a
 * section with `background-image: ${dotGrid}; background-size: 30px 30px;`
 * or use the shared <GridBackdrop /> component.
 */
export const dotGrid =
  'radial-gradient(circle, rgba(255, 255, 255, 0.07) 1px, transparent 1px)';
export const dotGridSize = '30px 30px';

/** Swap into GridBackdrop if square cells read better than dots on a section. */
export const lineGrid =
  'linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), ' +
  'linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)';

export const layout = {
  maxWidth: '1200px',
  maxWidthWide: '1400px',
  maxWidthText: '68ch',
  navHeight: '80px',
};

export const motion = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '220ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '320ms cubic-bezier(0.4, 0, 0.2, 1)',
};

/**
 * Scroll-reveal preset. One fade-and-rise, fired once. No blur filters — they
 * force text to render twice and look muddy mid-animation.
 */
export const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
};

const theme = {
  breakpoints,
  media,
  mediaDown,
  color,
  fontSize,
  fontFamily,
  fontWeight,
  space,
  sectionPadding,
  radius,
  elevation,
  accentGlow,
  dotGrid,
  dotGridSize,
  lineGrid,
  layout,
  motion,
  reveal,
};

export default theme;
