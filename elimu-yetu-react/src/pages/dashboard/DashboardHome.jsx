import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchMyMaterials } from "../../services/materialsService";
import { fetchAdminStats } from "../../services/authService";

function DashboardHome() {
  const { user, token } = useAuth();
  const isAdmin = user?.role === "admin";

  const [stats,     setStats]     = useState({
    // teacher stats
    total: 0, approved: 0, pending: 0, rejected: 0,
    // admin stats
    totalUsers: 0, totalMaterials: 0,
    approvedMaterials: 0, pendingMaterials: 0, rejectedMaterials: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      try {
        if (isAdmin) {
          const data = await fetchAdminStats(token);
          setStats((prev) => ({ ...prev, ...data }));
        } else {
          const data = await fetchMyMaterials(token);
          const all  = data.materials;
          setStats((prev) => ({
            ...prev,
            total:    all.length,
            approved: all.filter((m) => m.status === "approved").length,
            pending:  all.filter((m) => m.status === "pending").length,
            rejected: all.filter((m) => m.status === "rejected").length,
          }));
        }
      } catch (err) {
        console.error("Failed to load dashboard stats:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [token, isAdmin]);

  // ── Admin stat cards ─────────────────────────────────────────
  const adminCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon:  "bi-people",
      desc:  "Verified accounts",
      color: "#FFA500",
    },
    {
      title: "Total Materials",
      value: stats.totalMaterials,
      icon:  "bi-folder2-open",
      desc:  "All uploads",
      color: "#FFA500",
    },
    {
      title: "Approved",
      value: stats.approvedMaterials,
      icon:  "bi-check-circle",
      desc:  "Live on platform",
      color: "#198754",
    },
    {
      title: "Pending Review",
      value: stats.pendingMaterials,
      icon:  "bi-clock-history",
      desc:  "Awaiting approval",
      color: "#FFCB05",
    },
    {
      title: "Rejected",
      value: stats.rejectedMaterials,
      icon:  "bi-x-circle",
      desc:  "Sent back to teachers",
      color: "#dc3545",
    },
  ];

  // ── Teacher stat cards ────────────────────────────────────────
  const teacherCards = [
    { title: "Total Materials", value: stats.total,    icon: "bi-folder2-open", desc: "Uploaded so far"  },
    { title: "Approved",        value: stats.approved, icon: "bi-check-circle", desc: "Live on platform" },
    { title: "Pending",         value: stats.pending,  icon: "bi-clock-history",desc: "Awaiting review"  },
    { title: "Rejected",        value: stats.rejected, icon: "bi-x-circle",     desc: "Need attention"   },
  ];

  const statCards = isAdmin ? adminCards : teacherCards;

  return (
    <div className="dashboard-home">

      {/* HERO */}
      <div className="dashboard-hero mb-4">
        <span className="dashboard-badge">
          {isAdmin ? "ADMIN WORKSPACE" : "TEACHER WORKSPACE"}
        </span>
        <h1 className="dashboard-title">
          Welcome back, {user?.name || (isAdmin ? "Admin" : "Teacher")} 👋
        </h1>
        <p className="dashboard-subtitle">
          {isAdmin
            ? "Monitor the platform and keep materials quality high."
            : "Manage your learning materials and monitor approvals easily."
          }
        </p>
      </div>

      {/* OVERVIEW */}
      <div className="dashboard-overview">
        <div className="overview-header">
          <div className="overview-left">
            <div className="overview-icon">
              <i className={`bi ${isAdmin ? "bi-shield-check" : "bi-lightning-charge"}`}></i>
            </div>
            <div>
              <h4 className="mb-1">
                {isAdmin ? "Platform Overview" : "Teacher Dashboard Overview"}
              </h4>
              <p className="text-muted mb-0">
                {isAdmin
                  ? "Live counts across all users and materials."
                  : "Track uploaded resources and approval progress."
                }
              </p>
            </div>
          </div>

          {/* Admin shortcut button — only when pending > 0 */}
          {isAdmin && stats.pendingMaterials > 0 && (
            <Link to="/dashboard/approvals" className="btn btn-warning">
              <i className="bi bi-clipboard-check me-2"></i>
              Review {stats.pendingMaterials} Pending
            </Link>
          )}
        </div>

        {/* STAT CARDS */}
        <div className="row mt-4">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className={`mb-4 ${
                isAdmin ? "col-lg-4 col-md-6" : "col-lg-3 col-md-6"
              }`}
            >
              <div className="stat-card">
                <div className="stat-icon">
                  <i
                    className={`bi ${stat.icon}`}
                    style={{ color: stat.color || "#FFA500" }}
                  ></i>
                </div>
                <div className="stat-content">
                  <span className="stat-title">{stat.title}</span>
                  <h2 className="stat-number">
                    {isLoading ? (
                      <span className="spinner-border spinner-border-sm text-warning" />
                    ) : stat.value}
                  </h2>
                  <p className="stat-desc">{stat.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default DashboardHome;