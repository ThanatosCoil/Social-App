import { Navigate, Outlet } from "react-router";
import { Routes, Route } from "react-router";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import NavBar from "./components/navbar/NavBar";
import LeftBar from "./components/leftBar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import "./style.scss";
import { memo, useContext, useState } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

const Layout = memo(({ showLeftBar, setShowLeftBar, darkMode }) => {
  return (
    <div className={darkMode ? "theme-dark" : "theme-light"}>
      <NavBar onToggleLeftBar={() => setShowLeftBar(!showLeftBar)} />
      <div className="app-container">
        <LeftBar show={showLeftBar} />
        <div className="main-content">
          <Outlet />
        </div>
        <RightBar />
      </div>
    </div>
  );
});

const App = () => {
  const { currentUser } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);
  const [showLeftBar, setShowLeftBar] = useState(false);
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        staleTime: 10000,
        cacheTime: 300000,
      },
    },
  });

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        className="toast-container"
      />

      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout
                  showLeftBar={showLeftBar}
                  setShowLeftBar={setShowLeftBar}
                  darkMode={darkMode}
                />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Home />} />

            <Route path="/profile/:id" element={<Profile />} />
          </Route>
        </Routes>
      </div>
    </QueryClientProvider>
  );
};
export default App;
