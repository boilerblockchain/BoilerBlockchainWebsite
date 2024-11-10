import React from "react";
import App from "./App";
import "../node_modules/normalize.css/normalize.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import AboutPage from "./components/sections/AboutPage";

const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/about" element={<AboutPage />} />
      <Route path="/" element={<App />} />
    </Routes>
  </BrowserRouter>,
);
