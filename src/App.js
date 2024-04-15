

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
  return (
    <main>
      <ThemeProvider theme={light}>
      <GlobalStyles />
          <Navigation />
          <Home />
          <About />
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
