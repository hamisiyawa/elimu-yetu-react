import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ThemeToggle";
import defaultUser from "../../assets/images/default-user.png";

// ── Demo notifications — replace with real API data in V2 ──────
// In V2 these will come from GET /api/notifications
// and include material approval results sent to teachers
const DEMO_NOTIFICATIONS = [
  {
    id: 1,
    type:    "success",
    icon:    "bi-check-circle-fill",
    message: "Your material \"Grade 4 Maths Term 1\" was approved",
    time:    "2 hours ago",
    unread:  true,
  },
  {
    id: 2,
    type:    "danger",
    icon:    "bi-x-circle-fill",
    message: "Your material \"Grade 2 Science\" was rejected",
    time:    "Yesterday",
    unread:  true,
  },
  {
    id: 3,
    type:    "info",
    icon:    "bi-info-circle-fill",
    message: "New CBC curriculum guidelines have been published",
    time:    "3 days ago",
    unread:  false,
  },
];

function Topbar({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen]     = useState(false);
  const [notifOpen,   setNotifOpen]       = useState(false);
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);

  const profileRef = useRef(null);
  const notifRef   = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate("/login");
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markOneRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => n.id === id ? { ...n, unread: false } : n)
    );
  };

  const profileImageSrc = user?.profileImage
    ? `${import.meta.env.VITE_API_URL}${user.profileImage}`
    : defaultUser;

  return (
    <div className="topbar">

      {/* Left — sidebar toggle */}
      <button className="btn btn-light" onClick={toggleSidebar}>
        <i className="bi bi-list fs-5"></i>
      </button>

      {/* Right — notifications + profile */}
      <div className="d-flex align-items-center gap-3">
        <ThemeToggle />

        {/* ── Notification bell ─────────────────────────── */}
        <div className="notif-wrap" ref={notifRef}>

          <i
            className={`bi bi-bell${unreadCount > 0 ? "-fill" : ""} notif-bell`}
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
          ></i>

          {unreadCount > 0 && (
            <span className="notif-badge">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}

          {notifOpen && (
            <div className="notif-dropdown">

              <div className="notif-dropdown-header">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <button className="notif-mark-read" onClick={markAllRead}>
                    Mark all read
                  </button>
                )}
              </div>

              <div className="notif-list">
                {notifications.length === 0 ? (
                  <div className="notif-empty">
                    <i className="bi bi-bell-slash"></i>
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`notif-item ${n.unread ? "unread" : ""}`}
                      onClick={() => markOneRead(n.id)}
                    >
                      <div className={`notif-icon ${n.type}`}>
                        <i className={`bi ${n.icon}`}></i>
                      </div>
                      <div>
                        <div className="notif-text">{n.message}</div>
                        <div className="notif-time">{n.time}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}
        </div>

        {/* ── Profile avatar + dropdown ──────────────────── */}
        <div className="topbar-profile-wrap" ref={profileRef}>

          <img
            src={profileImageSrc}
            alt={user?.name}
            className="topbar-avatar"
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
            onError={(e) => { e.target.src = defaultUser; }}
          />

          {profileOpen && (
            <div className="topbar-dropdown">

              <div className="topbar-dropdown-header">
                <div className="topbar-dropdown-name">{user?.name}</div>
                <div className="topbar-dropdown-role">{user?.role}</div>
              </div>

              <Link
                to="/dashboard"
                className="topbar-dropdown-item"
                onClick={() => setProfileOpen(false)}
              >
                <i className="bi bi-speedometer2"></i>
                Overview
              </Link>

              <Link
                to="/dashboard/settings"
                className="topbar-dropdown-item"
                onClick={() => setProfileOpen(false)}
              >
                <i className="bi bi-person-gear"></i>
                Profile Settings
              </Link>

              <div className="topbar-divider" />

              <button
                className="topbar-dropdown-item logout-item"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right"></i>
                Logout
              </button>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Topbar;