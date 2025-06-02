import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.jsx";
import { DarkModeContextProvider } from "./context/darkModeContext.jsx";
import { AuthContextProvider } from "./context/authContext.jsx";
const root = document.getElementById("root");

createRoot(root).render(
  <StrictMode>
    <AuthContextProvider>
      <DarkModeContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </DarkModeContextProvider>
    </AuthContextProvider>
  </StrictMode>
);
