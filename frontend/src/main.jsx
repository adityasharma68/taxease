// src/main.jsx
// React application entry point — mounts the App into the HTML #root div

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* BrowserRouter enables client-side routing via React Router */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
