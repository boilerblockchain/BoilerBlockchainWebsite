import GlobalStyles from "./styles/GlobalStyles";
import { light } from "./styles/Themes";
import { ThemeProvider } from "styled-components";

import Navigation from "./components/Navigation";
import Home from "./components/sections/Home";
import Footer from "./components/Footer";

function App() {
  return (
    <ThemeProvider theme={light}>
      <GlobalStyles />
      <main style={{ background: '#000000', minHeight: '100vh', maxWidth: '100vw', overflowX: 'hidden', boxSizing: 'border-box' }}>
        <Navigation />
        <Home />
        <Footer />
      </main>
    </ThemeProvider>
  );
}

export default App;
