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
      <main style={{ background: '#000000', minHeight: '100vh', display: 'flex', flexDirection: 'column', maxWidth: '100vw', overflowX: 'hidden', boxSizing: 'border-box' }}>
        <Navigation />
        <div style={{ flex: 1, maxWidth: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}>
          <Home />
        </div>
        <Footer />
      </main>
    </ThemeProvider>
  );
}

export default App;
