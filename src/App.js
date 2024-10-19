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

// Styled wrappers for components to control z-index
const NavigationWrapper = styled.div`
  position: relative;
  z-index: 20; /* Higher z-index for Navigation */
`;

const AboutSection = styled.section`
  position: relative;
  z-index: 10; /* Higher z-index to layer this section above others */
`;

const HackathonsSection = styled.section`
  position: relative;
  z-index: 15; /* Higher z-index for Hackathons */
`;

const TeamSection = styled.section`
  position: relative;
  z-index: 15; /* Higher z-index for Team */
`;

const ShowcaseSection = styled.section`
  position: relative;
  z-index: 12; /* Higher z-index to layer this section above others */
`;


const FooterWrapper = styled.footer`
  position: relative;
  z-index: 5; /* Footer z-index (can be lower if needed) */
`;

function App() {
  const aboutRef = useRef(null);
  const scrollToAbout = () => {
    if (aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: 'smooth' });
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

        <Home onScrollToNext={scrollToAbout} />

        <AboutSection ref={aboutRef}>
          <About />
        </AboutSection>

        <HackathonsSection>
          <Hackathons />
        </HackathonsSection>

        <ShowcaseSection>
          <Showcase />
        </ShowcaseSection>

        <TeamSection>
          <Team />
        </TeamSection>

        <FooterWrapper>
          <Footer />
        </FooterWrapper>

        <ScrollToTop />
      </ThemeProvider>
    </main>
  );
}

export default App;
