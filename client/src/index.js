import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App"; // Replace './App' with the path to your main App component file

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
