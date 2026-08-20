import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ThemeToggle";
import defaultUser from "../../assets/images/default-user.png";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../services/notificationsService";

// Maps a notification's "type" (from the backend) to the icon shown
const TYPE_ICONS = {
  success: "bi-check-circle-fill",
  danger:  "bi-x-circle-fill",
  info:    "bi-info-circle-fill",
  warning: "bi-exclamation-circle-fill",
};

// Turns a timestamp into "2 hours ago" / "Yesterday" / "3 days ago"
const timeAgo = (dateString) => {
  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);

  if (seconds < 60)    return "Just now";
  if (seconds < 3600)  return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;

  const days = Math.floor(seconds / 86400);
  if (days === 1) return "Yesterday";
  if (days < 7)   return `${days} days ago`;

  return new Date(dateString).toLocaleDateString();
};

function Topbar({ toggleSidebar }) {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen]     = useState(false);
  const [notifOpen,   setNotifOpen]       = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);

  const profileRef = useRef(null);
  const notifRef   = useRef(null);

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

  // Load notifications on mount, then refresh every 60s so the
  // badge count stays reasonably current without needing sockets
  useEffect(() => {
    //
    if (!token) return;

    const loadNotifications = async () => {
      try {
        const data = await fetchNotifications(token);
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      } catch (error) {
        console.error("Failed to load notifications:", error.message);
      }
    };

    loadNotifications();
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, [token]);

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate("/login");
  };

  const markAllRead = async () => {
    // Update the UI immediately, then confirm with the server
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    try {
      await markAllNotificationsRead(token);
    } catch (error) {
      console.error("Failed to mark all as read:", error.message);
    }
  };

  const markOneRead = async (id) => {
    const wasUnread = notifications.find((n) => n._id === id)?.read === false;

    setNotifications((prev) =>
      prev.map((n) => n._id === id ? { ...n, read: true } : n)
    );
    if (wasUnread) setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await markNotificationRead(token, id);
    } catch (error) {
      console.error("Failed to mark as read:", error.message);
    }
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
                      key={n._id}
                      className={`notif-item ${!n.read ? "unread" : ""}`}
                      onClick={() => markOneRead(n._id)}
                    >
                      <div className={`notif-icon ${n.type}`}>
                        <i className={`bi ${TYPE_ICONS[n.type]}`}></i>
                      </div>
                      <div>
                        <div className="notif-text">{n.message}</div>
                        <div className="notif-time">{timeAgo(n.createdAt)}</div>
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