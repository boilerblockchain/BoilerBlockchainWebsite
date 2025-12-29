import React from "react";
import App from "./App";
import "../node_modules/normalize.css/normalize.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import AboutPage from "./components/sections/AboutPage";
import Devs from './components/sections/Devs';
import '@fontsource/inter';
import '@fontsource/tomorrow/600.css';
import EducationPage from './components/sections/EducationPage.jsx'
import Hackathons from "./components/sections/Hackathons";

// Teams
import TeamsLanding from "./components/sections/TeamsLanding";
import DeveloperTeam from "./components/sections/DeveloperTeam";
import ResearchTeam from "./components/sections/ResearchTeam";
import MarketingTeam from "./components/sections/MarketingTeam";
import OperationsTeam from "./components/sections/OperationsTeam";

// Courses
import CoursesLanding from "./components/sections/CoursesLanding";

// People
import PeopleLanding from "./components/sections/PeopleLanding";
import PeopleTeam from "./components/sections/PeopleTeam";
import PeopleAlumni from "./components/sections/PeopleAlumni";

// Other Pages
import PartnersPage from "./components/sections/PartnersPage";
import ContactPage from "./components/sections/ContactPage";

// Utilities
import ScrollToTop from "./components/ScrollToTop";

const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <ScrollToTop />
    <Routes>
      <Route path="/about" element={<AboutPage />} />
      
      {/* Teams Routes */}
      <Route path="/teams" element={<TeamsLanding />} />
      <Route path="/teams/developer" element={<DeveloperTeam />} />
      <Route path="/teams/research" element={<ResearchTeam />} />
      <Route path="/teams/marketing" element={<MarketingTeam />} />
      <Route path="/teams/operations" element={<OperationsTeam />} />
      
      {/* Courses Routes */}
      <Route path="/courses" element={<CoursesLanding />} />
      <Route path="/courses/technical" element={<EducationPage />} />
      
      {/* People Routes */}
      <Route path="/people" element={<PeopleLanding />} />
      <Route path="/people/team" element={<PeopleTeam />} />
      <Route path="/people/alumni" element={<PeopleAlumni />} />
      
      {/* Other Routes */}
      <Route path="/partners" element={<PartnersPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/devs" element={<Devs />} />
      <Route path="/hackathons" element={<Hackathons />} />
      <Route path="/" element={<App />} />
    </Routes>
  </BrowserRouter>,
);
