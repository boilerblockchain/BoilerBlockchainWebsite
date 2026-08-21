import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import styled from "styled-components";

import GlobalStyles from "./styles/GlobalStyles";
import theme from "./styles/tokens";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

/**
 * Shared shell for every route.
 *
 * Previously each page imported Navigation and Footer itself, which meant
 * /hackathons shipped without a navbar and the 404 page had neither. It also
 * remounted the whole nav on every navigation.
 */
const Shell = styled.div`
  display: flex;
  flex-direction: column;
  /* dvh, not vh: on iOS Safari 100vh sits under the address bar. */
  min-height: 100dvh;
  width: 100%;
  background: ${({ theme }) => theme.color.black};
`;

/* flex: 1 pins the footer to the bottom on short pages (the 404, mainly).
   padding-top clears the fixed, opaque nav. Doing it here once means no page
   can accidentally render its first element underneath the bar. */
const Main = styled.main`
  flex: 1;
  width: 100%;
  padding-top: ${({ theme }) => theme.layout.navHeight};
`;

function App() {
  // See GlobalStyles: ?nomotion=1 lets headless screenshots capture the
  // post-reveal state so layout can actually be verified.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("nomotion")) {
      document.body.classList.add("nomotion");
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Shell>
        <Navigation />
        <Main>
          <Outlet />
        </Main>
        <Footer />
      </Shell>
    </ThemeProvider>
  );
}

export default App;
