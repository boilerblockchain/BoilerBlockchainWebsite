import { useRef } from "react";
import GlobalStyles from "./styles/GlobalStyles";
import { light } from "./styles/Themes";
import { ThemeProvider } from "styled-components";
import styled from "styled-components";

import Navigation from "./components/Navigation";
import Home from "./components/sections/Home";
import Hackathons from "./components/sections/Hackathons";
import Team from "./components/sections/courses";
import Footer from "./components/Footer";
import Showcase from "./components/sections/Showcase";
import About from "./components/sections/about_section";
import HackathonSummary from "./components/sections/hackathons_summary";
import CTASection from "./components/sections/join_discord";

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
  return (
    <main className='bg-gradient-to-tl from-black via-zinc-900/50 to-black/14'>
      <ThemeProvider theme={light}>
        <GlobalStyles />

        <Navigation />
        <Home />
        <About/>
        
        <SectionWrapper zIndex={15}>
          <HackathonSummary />
        </SectionWrapper>

        <SectionWrapper zIndex={15}>
          <Team />
        </SectionWrapper>

        <CTASection />

        <FooterWrapper>
          <Footer />
        </FooterWrapper>

      </ThemeProvider>
    </main>
  );
}

export default App;
