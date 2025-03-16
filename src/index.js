import React from "react";
import App from "./App";
import "../node_modules/normalize.css/normalize.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import AboutPage from "./components/sections/AboutPage";
import Devs from './components/sections/Devs';
import '@fontsource/inter';
import '@fontsource/tomorrow/600.css';
import EducationPage from './components/sections/EducationPage.js'
import Hackathons from "./components/sections/Hackathons";

const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/about" element={<AboutPage />} />
      <Route path="/courses" element={<EducationPage />} />
      <Route path="/devs" element={<Devs />} />
      <Route path="/hackathons" element={<Hackathons />} />
      <Route path="/" element={<App />} />
    </Routes>
  </BrowserRouter>,
);
