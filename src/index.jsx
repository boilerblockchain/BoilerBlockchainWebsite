import React from "react";
import App from "./App";
import "normalize.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import AboutPage from "./components/sections/AboutPage";
// Real weight files. Previously only 600 was loaded while the CSS asked for
// 800/900, so every heading was synthetically (badly) bolded by the browser.
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/tomorrow/400.css';
import '@fontsource/tomorrow/500.css';
import '@fontsource/tomorrow/600.css';
import '@fontsource/tomorrow/700.css';
import Hackathons from "./components/sections/Hackathons";

// Teams
import TeamsLanding from "./components/sections/TeamsLanding";
import DeveloperTeam from "./components/sections/DeveloperTeam";
import ResearchTeam from "./components/sections/ResearchTeam";
import OperationsTeam from "./components/sections/OperationsTeam";

// Courses
import CoursesPage from "./components/sections/CoursesPage";

// People
import PeopleTeam from "./components/sections/PeopleTeam";

// Other Pages
import PartnersPage from "./components/sections/PartnersPage";
import ContactPage from "./components/sections/ContactPage";
import NotFound from "./components/sections/NotFound";

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
      <Route path="/teams/operations" element={<OperationsTeam />} />
      
      {/* Courses Routes */}
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/courses/technical" element={<CoursesPage />} />
      
      {/* People Routes */}
      <Route path="/people/team" element={<PeopleTeam />} />
      
      {/* Other Routes */}
      <Route path="/partners" element={<PartnersPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/hackathons" element={<Hackathons />} />
      <Route path="/" element={<App />} />
      
      {/* 404 Not Found - Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>,
);
