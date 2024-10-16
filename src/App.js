
import { useRef } from 'react';
import GlobalStyles from "./styles/GlobalStyles";
import { dark, light } from "./styles/Themes";
import { ThemeProvider } from "styled-components";

import Navigation from "./components/Navigation";
import About from "./components/sections/About";
import Home from "./components/sections/Home";
import Hackathons from "./components/sections/Hackathons";
import Team from "./components/sections/Team";
import Footer from "./components/Footer";
import Showcase from "./components/sections/Showcase";
import Faq from "./components/sections/Faq";
import ScrollToTop from "./components/ScrollToTop";

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
        <Navigation />
        <Home onScrollToNext={scrollToAbout} />
        <section ref={aboutRef}>
          <About />
        </section>
        <Hackathons />
        <Showcase />
        <Team />
        {/* <Faq /> */}
        <Footer />
        <ScrollToTop />
      </ThemeProvider>
    </main>
  );
}

export default App;
