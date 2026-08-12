import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import logo from "../assets/images/elimu (3).png";
import defaultUser from "../assets/images/default-user.png";

function Navbar() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate("/login");
  };

  // build the profile image URL
  const profileImageSrc = user?.profileImage
    ? `${import.meta.env.VITE_API_URL}${user.profileImage}`
    : defaultUser;

  return (
    <>
      {/* Top Line */}
      <div className="top-line"></div>

      {/* Header */}
      <div className="container-fluid bg-light py-2">
        <div className="container d-flex justify-content-between align-items-center">

          <div className="logo">
            <img src={logo} alt="Elimu Yetu Logo" width="100" />
          </div>

          <div className="upload-btn">
            {user?.role === "teacher" && (
              <Link to="/dashboard" className="btn btn-warning fs-6">
                <i className="bi bi-upload me-1"></i>Upload materials
              </Link>
            )}
            {user?.role === "admin" && (
              <Link to="/dashboard" className="btn btn-warning fs-6">
                <i className="bi bi-speedometer2 me-1"></i>Admin Dashboard
              </Link>
            )}
          </div>

        </div>
      </div>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container">

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">

              <li className="nav-item">
                <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} end>
                  Home
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/materials" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                  Learning materials
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                  About Us
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/support" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                  Support
                </NavLink>
              </li>

            </ul>

            <ThemeToggle className="me-lg-3 mb-2 mb-lg-0" />

            {/* ── Auth section ─────────────────────────────── */}
            {user ? (

              // Logged in — show avatar with dropdown
              <div className="nav-profile-wrap" ref={dropdownRef}>

                <img
                  src={profileImageSrc}
                  alt={user.name}
                  className="nav-avatar"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onError={(e) => { e.target.src = defaultUser; }}
                />

                {dropdownOpen && (
                  <div className="nav-dropdown">

                    {/* Header with name and role */}
                    <div className="nav-dropdown-header">
                      <div className="nav-avatar-row d-flex align-items-center gap-2 mb-1">
                        <img
                          src={profileImageSrc}
                          alt={user.name}
                          style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
                          onError={(e) => { e.target.src = defaultUser; }}
                        />
                        <div>
                          <div className="nav-dropdown-name">{user.name}</div>
                          <div className="nav-dropdown-role">{user.role}</div>
                        </div>
                      </div>
                    </div>

                    {/* Links */}
                    {(user.role === "teacher" || user.role === "admin") && (
                      <Link
                        to="/dashboard"
                        className="nav-dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <i className="bi bi-speedometer2"></i>
                        Dashboard
                      </Link>
                    )}

                    <Link
                      to="/dashboard/settings"
                      className="nav-dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <i className="bi bi-person-gear"></i>
                      Profile Settings
                    </Link>

                    <div className="nav-dropdown-divider" />

                    <button
                      className="nav-dropdown-item logout-item"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right"></i>
                      Logout
                    </button>

                  </div>
                )}

              </div>

            ) : (

              // Guest — show Login button
              <Link to="/login" className="btn btn-outline-dark">
                Login
              </Link>

            )}

          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;