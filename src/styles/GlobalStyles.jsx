import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    /* Safety net for the horizontal scroll. 'clip' rather than 'hidden' so it
       does not silently create a scroll container and break position: sticky. */
    overflow-x: clip;

    /* Firefox */
    scrollbar-width: thin;
    scrollbar-color: #7120B0 #000000;
  }

  /* WebKit / Blink */
  ::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }

  ::-webkit-scrollbar-track {
    background: #000000;
  }

  ::-webkit-scrollbar-thumb {
    background: #7120B0;
    /* Inset border reads as padding, so the thumb looks slimmer than the
       track without shrinking the grab area. */
    border: 3px solid #000000;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #A855F7;
  }

  ::-webkit-scrollbar-corner {
    background: #000000;
  }

  body {
    font-family: 'Inter', sans-serif;
    background: #000000;
    color: #ffffff;
    width: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  #root {
    width: 100%;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    padding: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  img {
    max-width: 100%;
  }

  /* Visible focus ring for keyboard users only. */
  :focus-visible {
    outline: 2px solid #A855F7;
    outline-offset: 3px;
  }

  /*
   * Verification hook, opt-in via ?nomotion=1.
   *
   * Scroll-reveal uses framer's whileInView, which never fires in a headless
   * browser with a full-page viewport, so elements keep their initial inline
   * opacity and screenshots show empty sections. This forces framer's inline
   * start state to its end state. It matches inline styles only, so opacity
   * driven by styled-components (carousel slides, dropdowns) is untouched.
   */
  body.nomotion [style*="opacity: 0"] {
    opacity: 1 !important;
    transform: none !important;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

export default GlobalStyles;
