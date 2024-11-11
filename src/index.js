import React from "react";
import App from "./App";
import "../node_modules/normalize.css/normalize.css";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import '@fontsource/inter';
import '@fontsource/tomorrow/600.css';

const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);