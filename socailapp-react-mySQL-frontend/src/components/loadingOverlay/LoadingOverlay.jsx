import "./loadingOverlay.scss";
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";

const LoadingOverlay = () => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div
      className={`loading-overlay ${darkMode ? "theme-dark" : "theme-light"}`}
    >
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingOverlay;
