import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { updatePreferences } from "../../../services/authService";
import { toast } from "react-toastify";

// Each toggle — what it controls
const NOTIFICATION_OPTIONS = [
  {
    key:     "emailNotifications",
    label:   "Email Notifications",
    desc:    "Receive updates via email when your materials are reviewed",
    icon:    "bi-envelope",
  },
  {
    key:     "smsNotifications",
    label:   "SMS Notifications",
    desc:    "Receive SMS alerts for important account activity",
    icon:    "bi-phone",
  },
  {
    key:     "materialApproved",
    label:   "Material Approved",
    desc:    "Notify me when my uploaded material is approved and goes live",
    icon:    "bi-check-circle",
  },
  {
    key:     "materialRejected",
    label:   "Material Rejected",
    desc:    "Notify me when my material is rejected with a reason",
    icon:    "bi-x-circle",
  },
  {
    key:     "newMaterials",
    label:   "New Materials Alert",
    desc:    "Notify me when new materials are added in my subject area",
    icon:    "bi-bell",
  },
];

function NotificationSettings() {
  const { user, token, updateUser } = useAuth();

  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    smsNotifications:   false,
    materialApproved:   true,
    materialRejected:   true,
    newMaterials:       false,
  });

  const [isLoading,  setIsLoading]  = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  // pre-populate from user preferences stored in context
  useEffect(() => {
    if (user?.preferences) {
      setPrefs((prev) => ({ ...prev, ...user.preferences }));
    }
  }, [user]);

  const handleToggle = (key) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    setHasChanged(true);
  };

  const handleSave = async () => {
    const authToken = token || localStorage.getItem("token");
    setIsLoading(true);

    try {
      const data = await updatePreferences(authToken, prefs);

      // update context so preferences persist in the app session
      updateUser(data.user);

      setHasChanged(false);
      toast.success("Notification preferences saved");

    } catch (error) {
      toast.error(error.message || "Failed to save preferences");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settings-card">

      <h4 className="fw-bold mb-2">
        <i className="bi bi-bell text-warning me-2"></i>
        Notification Settings
      </h4>

      <p className="text-muted mb-4" style={{ fontSize: "0.875rem" }}>
        Choose what you want to be notified about.
        These preferences are saved to your account and apply across all devices.
      </p>

      <div className="d-flex flex-column gap-3">
        {NOTIFICATION_OPTIONS.map(({ key, label, desc, icon }) => (
          <div
            key={key}
            className="d-flex align-items-center justify-content-between p-3 rounded"
            style={{ background: "#fafafa", border: "1px solid #eee" }}
          >
            <div className="d-flex align-items-center gap-3">
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(255,165,0,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <i className={`bi ${icon}`} style={{ color: "#FFA500" }}></i>
              </div>
              <div>
                <div className="fw-semibold" style={{ fontSize: "0.875rem" }}>{label}</div>
                <div className="text-muted" style={{ fontSize: "0.78rem" }}>{desc}</div>
              </div>
            </div>

            <div className="form-check form-switch mb-0 ms-3">
              <input
                type="checkbox"
                className="form-check-input"
                role="switch"
                checked={prefs[key] ?? false}
                onChange={() => handleToggle(key)}
                style={{ cursor: "pointer", width: "2.5em", height: "1.3em" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Save button — only shows when something changed */}
      <button
        className="btn btn-warning w-100 fw-semibold mt-4"
        onClick={handleSave}
        disabled={isLoading || !hasChanged}
      >
        {isLoading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
            Saving...
          </>
        ) : (
          <><i className="bi bi-check-lg me-2"></i>Save Preferences</>
        )}
      </button>

      {!hasChanged && !isLoading && (
        <p className="text-center text-muted mt-2 mb-0" style={{ fontSize: "0.78rem" }}>
          No unsaved changes
        </p>
      )}

    </div>
  );
}

export default NotificationSettings;