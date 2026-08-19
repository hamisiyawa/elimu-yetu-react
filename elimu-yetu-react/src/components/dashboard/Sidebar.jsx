import { forwardRef } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = forwardRef(function Sidebar({ collapsed, isMobile, onClose }, ref) {
  const { user } = useAuth();

  // Mobile: sidebar is a fixed drawer — visible when !collapsed, hidden when collapsed
  // Desktop: sidebar is always visible, just narrows to icons when collapsed
  const mobileStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    zIndex: 1050,
    transform: collapsed ? "translateX(-100%)" : "translateX(0)",
    transition: "transform 0.3s ease",
    width: "240px",
  };

  const desktopStyle = {
    width: collapsed ? "80px" : "240px",
    minHeight: "100vh",
    transition: "width 0.3s ease",
    flexShrink: 0,
  };

  return (
    <div
      ref={ref}
      className="bg-dark text-white p-3"
      style={isMobile ? mobileStyle : desktopStyle}
    >
      {/* Header row — shows logo and close button on mobile */}
  <div className="d-flex align-items-center justify-content-between mb-4">
      <Link
        to="/"
        style={{
          textDecoration: "none",
          color: "#FFA500",
          fontWeight: 600,
          fontSize: "1.1rem",
        }}
        title="Go to home page"
      >
        {!isMobile && collapsed ? "EY" : "Elimu Yetu"}
      </Link>

    {/* Close button — mobile only */}
    {isMobile && (
      <button
        className="btn btn-sm btn-outline-light"
        onClick={onClose}
        aria-label="Close sidebar"
      >
        <i className="bi bi-x-lg"></i>
      </button>
    )}
  </div>

      <ul className="nav flex-column">

        <li>
          <NavLink
            to="/dashboard"
            end
            className="sidebar-link"
            onClick={isMobile ? onClose : undefined}
          >
            <i className="bi bi-speedometer2"></i>
            {/* Hide text on desktop collapsed; always show on mobile drawer */}
            {(isMobile || !collapsed) && <span> Overview</span>}
          </NavLink>
        </li>

        {user?.role === "teacher" && (
          <li>
            <NavLink
              to="/dashboard/manage-materials"
              className="sidebar-link"
              onClick={isMobile ? onClose : undefined}
            >
              <i className="bi bi-upload"></i>
              {(isMobile || !collapsed) && <span> Manage Materials</span>}
            </NavLink>
          </li>
        )}

        {user?.role === "admin" && (
          <li>
            <NavLink
              to="/dashboard/approvals"
              className="sidebar-link"
              onClick={isMobile ? onClose : undefined}
            >
              <i className="bi bi-clipboard-check"></i>
              {(isMobile || !collapsed) && <span> Approvals</span>}
            </NavLink>
          </li>
        )}

        {user?.role === "admin" && (
          <li>
            <NavLink
              to="/dashboard/manage-users"
              className="sidebar-link"
              onClick={isMobile ? onClose : undefined}
            >
              <i className="bi bi-people"></i>
              {(isMobile || !collapsed) && <span> Manage Users</span>}
            </NavLink>
          </li>
        )}

        <li>
          <NavLink
            to="/dashboard/settings"
            className="sidebar-link"
            onClick={isMobile ? onClose : undefined}
          >
            <i className="bi bi-gear"></i>
            {(isMobile || !collapsed) && <span> Settings</span>}
          </NavLink>
        </li>

      </ul>
    </div>
  );
});

export default Sidebar;