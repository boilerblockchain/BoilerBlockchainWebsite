import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "normalize.css";

// Real weight files. Previously only 600 was loaded while the CSS asked for
// 800/900, so every heading was synthetically (badly) bolded by the browser.
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/tomorrow/400.css";
import "@fontsource/tomorrow/500.css";
import "@fontsource/tomorrow/600.css";
import "@fontsource/tomorrow/700.css";

import App from "./App";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./components/sections/Home";
import AboutPage from "./components/sections/AboutPage";
import Hackathons from "./components/sections/Hackathons";
import TeamsLanding from "./components/sections/TeamsLanding";
import DeveloperTeam from "./components/sections/DeveloperTeam";
import ResearchTeam from "./components/sections/ResearchTeam";
import OperationsTeam from "./components/sections/OperationsTeam";
import CoursesPage from "./components/sections/CoursesPage";
import PeopleTeam from "./components/sections/PeopleTeam";
import PartnersPage from "./components/sections/PartnersPage";
import ContactPage from "./components/sections/ContactPage";
import NotFound from "./components/sections/NotFound";

const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <ScrollToTop />
    <Routes>
      {/* App is the shared shell: Navigation + <Outlet /> + Footer.
          Every route nests under it, so no page can ship without a navbar. */}
      <Route element={<App />}>
        <Route index element={<Home />} />
        <Route path="about" element={<AboutPage />} />

        <Route path="teams" element={<TeamsLanding />} />
        <Route path="teams/developer" element={<DeveloperTeam />} />
        <Route path="teams/research" element={<ResearchTeam />} />
        <Route path="teams/operations" element={<OperationsTeam />} />

        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/technical" element={<CoursesPage />} />

        <Route path="people/team" element={<PeopleTeam />} />

        <Route path="partners" element={<PartnersPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="hackathons" element={<Hackathons />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>,
);
