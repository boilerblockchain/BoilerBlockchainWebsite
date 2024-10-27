import { useRef } from 'react';
import GlobalStyles from "./styles/GlobalStyles";
import { dark, light } from "./styles/Themes";
import { ThemeProvider } from "styled-components";
import styled from 'styled-components';

import Navigation from "./components/Navigation";
import About from "./components/sections/About";
import Home from "./components/sections/Home";
import Hackathons from "./components/sections/Hackathons";
import Team from "./components/sections/Team";
import Footer from "./components/Footer";
import Showcase from "./components/sections/Showcase";
import Faq from "./components/sections/Faq";
import ScrollToTop from "./components/ScrollToTop";

// Styled wrappers for components to control z-index and layout
const NavigationWrapper = styled.div`
  position: relative;
  z-index: 20; /* Higher z-index for Navigation */
`;

const SectionWrapper = styled.section`
  position: relative;
  z-index: ${props => props.zIndex || 1}; /* Dynamic z-index for different sections */
`;

const FooterWrapper = styled.footer`
  position: relative;
  z-index: 5; /* Footer z-index (can be lower if needed) */
`;

function App() {
  const aboutRef = useRef(null); // Create ref for About section

  // Custom scroll function to control duration
  const customScroll = (targetRef, duration) => {
    const targetPosition = targetRef.current.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const animateScroll = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animateScroll);
    };

    // Ease in-out function for smooth animation
    const easeInOutQuad = (t, b, c, d) => {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    };

    requestAnimationFrame(animateScroll);
  };

  // Scroll to About section using the custom scroll function
  const scrollToAbout = () => {
    if (aboutRef.current) {
      customScroll(aboutRef, 2000); // Adjust the duration (2000ms = 2 seconds)
    }
  };

  return (
    <main>
      <ThemeProvider theme={light}>
        <GlobalStyles />

        {/* Higher z-index applied to Navigation */}
        <NavigationWrapper>
          <Navigation />
        </NavigationWrapper>

        {/* Home Component */}
        <Home onScrollToNext={scrollToAbout} />

        {/* About Section with ref */}
        <SectionWrapper ref={aboutRef} zIndex={10}>
          <About />
        </SectionWrapper>

        {/* Hackathons Section */}
        <SectionWrapper zIndex={15}>
          <Hackathons />
        </SectionWrapper>

        {/* Showcase Section */}
        <SectionWrapper zIndex={12}>
          <Showcase />
        </SectionWrapper>

        {/* Team Section */}
        <SectionWrapper zIndex={15}>
          <Team />
        </SectionWrapper>

        {/* Footer */}
        <FooterWrapper>
          <Footer />
        </FooterWrapper>

        {/* <ScrollToTop /> */}
      </ThemeProvider>
    </main>
  );
}

export default App;
