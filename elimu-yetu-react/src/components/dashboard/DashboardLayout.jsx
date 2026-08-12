import { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../../styles/dashboard.css";

function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 500);
  const sidebarRef = useRef(null);

  // track screen width changes
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 500;
      setIsMobile(mobile);
      if (!mobile) setCollapsed(false); // reset collapsed state when going back to desktop
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // on mobile: collapsed=true means HIDDEN, collapsed=false means DRAWER OPEN
  const mobileOpen = isMobile && !collapsed;

  return (
    <div className="d-flex" style={{ position: "relative" }}>

      {/* Overlay — mobile only, shown when sidebar drawer is open */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setCollapsed(true)}
        />
      )}

      <Sidebar
        ref={sidebarRef}
        collapsed={collapsed}
        isMobile={isMobile}
        onClose={() => setCollapsed(true)}
      />

      <div className="flex-grow-1">
        <Topbar toggleSidebar={() => setCollapsed(!collapsed)} />
        <div className="p-4 bg-light" style={{ minHeight: "100vh" }}>
          <Outlet />
        </div>
      </div>

    </div>
  );
}

export default DashboardLayout;