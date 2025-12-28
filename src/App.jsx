import GlobalStyles from "./styles/GlobalStyles";
import { light } from "./styles/Themes";
import { ThemeProvider } from "styled-components";

import Navigation from "./components/Navigation";
import Home from "./components/sections/Home";
import Footer from "./components/Footer";

function App() {
  return (
    <main style={{ background: '#000000', minHeight: '100vh' }}>
      <ThemeProvider theme={light}>
        <GlobalStyles />
        <Navigation />
        <Home />
        <Footer />
      </ThemeProvider>
    </main>
  );
}

export default App;
