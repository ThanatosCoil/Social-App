import "./navBar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { DarkModeContext } from "../../context/darkModeContext";
import { Link } from "react-router";
import { useContext, useState, useRef } from "react";
import { AuthContext } from "../../context/authContext";
import LogoutIcon from "@mui/icons-material/Logout";
import api from "../../../axios";
import { Link as RouterLink } from "react-router";

const NavBar = ({ onToggleLeftBar }) => {
  const { darkMode, toggle } = useContext(DarkModeContext);
  const { currentUser, DEFAULT_PROFILE_PICTURE, logout } =
    useContext(AuthContext);

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchTimeout = useRef();

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    setShowDropdown(!!value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!value.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await api.get(
          `/posts/search?query=${encodeURIComponent(value)}`
        );
        setResults(res.data);
      } catch (err) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 150);
  };

  return (
    <div className="navbar">
      <div className="left">
        <MenuIcon className="menuIcon" onClick={onToggleLeftBar} />
        <Link to="/" style={{ textDecoration: "none" }}>
          <img
            src="https://img.freepik.com/premium-vector/modern-elegant-letter-pa-ap-line-logo_327835-2367.jpg?semt=ais_hybrid&w=740"
            alt="Logo"
            className="logo"
          />
        </Link>

        <div className="icons">
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <HomeOutlinedIcon />
          </Link>

          {darkMode ? (
            <LightModeOutlinedIcon onClick={toggle} />
          ) : (
            <DarkModeOutlinedIcon onClick={toggle} />
          )}

          <GridViewOutlinedIcon />
        </div>
        <div
          className="search"
          onClick={(e) => {
            const input = e.currentTarget.querySelector(".input");
            if (input) {
              input.focus();
            }
          }}
        >
          <SearchOutlinedIcon className="searchIcon" />
          <input
            type="text"
            placeholder="Search..."
            className="input"
            value={search}
            onChange={handleSearch}
            onFocus={() => setShowDropdown(!!search)}
            onBlur={handleBlur}
            autoComplete="off"
          />
          {showDropdown && (
            <div className="search-dropdown">
              {loading ? (
                <div className="search-loading">Searching...</div>
              ) : results.length === 0 ? (
                <div className="search-empty">No results</div>
              ) : (
                results.slice(0, 8).map((post) => (
                  <RouterLink
                    to={`/profile/${post.userId}`}
                    className="search-result"
                    key={post.id}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <img
                      src={
                        post.profilePicture
                          ? `/uploads/${post.profilePicture}`
                          : DEFAULT_PROFILE_PICTURE
                      }
                      alt="author"
                    />
                    <div className="search-result-info">
                      <span className="search-result-author">{post.name}</span>
                      <span className="search-result-desc">
                        {post.desc?.slice(0, 60)}
                      </span>
                    </div>
                  </RouterLink>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      <div className="right">
        <PersonOutlineOutlinedIcon />
        <EmailOutlinedIcon />
        <NotificationsOutlinedIcon />
        <Link
          to={`/profile/${currentUser.id}`}
          className="hover-underline-animation"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="user">
            <img
              src={
                currentUser.profilePicture
                  ? `/uploads/${currentUser.profilePicture}`
                  : DEFAULT_PROFILE_PICTURE
              }
              alt="Profile"
            />
            <span>{currentUser.name}</span>
          </div>
        </Link>
        <button className="logout-btn" onClick={logout} title="Logout">
          <LogoutIcon />
        </button>
      </div>
    </div>
  );
};
export default NavBar;
