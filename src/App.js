import { useRef } from "react";
import GlobalStyles from "./styles/GlobalStyles";
import { dark, light } from "./styles/Themes";
import { ThemeProvider } from "styled-components";
import styled from "styled-components";

import Navigation from "./components/Navigation";
import About from "./components/sections/About";
import Home from "./components/sections/Home";
import Hackathons from "./components/sections/Hackathons";
import Team from "./components/sections/Team";
import Footer from "./components/Footer";
import Showcase from "./components/sections/Showcase";


const NavigationWrapper = styled.div`
  position: relative;
  z-index: 20; /* Higher z-index for Navigation */
`;

const SectionWrapper = styled.section`
  position: relative;
  z-index: ${(props) =>
    props.zIndex || 1}; /* Dynamic z-index for different sections */
`;

const FooterWrapper = styled.footer`
  position: relative;
  z-index: 5; /* Footer z-index (can be lower if needed) */
`;

function App() {
  const aboutRef = useRef(null);

  const customScroll = (targetRef, duration) => {
    const targetPosition =
      targetRef.current.getBoundingClientRect().top + window.pageYOffset;
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

    const easeInOutQuad = (t, b, c, d) => {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    };

    requestAnimationFrame(animateScroll);
  };

  const scrollToAbout = () => {
    if (aboutRef.current) {
      customScroll(aboutRef, 2000);
    }
  };

  return (
    <main className='bg-gradient-to-tl from-black via-zinc-900/50 to-black/14'>
      <ThemeProvider theme={light}>
        <GlobalStyles />

        <NavigationWrapper>
          <Navigation />
        </NavigationWrapper>

        <Home onScrollToNext={scrollToAbout} />

        <SectionWrapper ref={aboutRef} zIndex={10}>
          <About />
        </SectionWrapper>

        <SectionWrapper zIndex={15}>
          <Hackathons />
        </SectionWrapper>

        <SectionWrapper zIndex={12}>
          <Showcase />
        </SectionWrapper>

        <SectionWrapper zIndex={15}>
          <Team />
        </SectionWrapper>

        <FooterWrapper>
          <Footer />
        </FooterWrapper>

      </ThemeProvider>
    </main>
  );
}

export default App;
