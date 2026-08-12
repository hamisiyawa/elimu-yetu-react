import ProfileSettings from "../../components/dashboard/settings/ProfileSettings";
import SecuritySettings from "../../components/dashboard/settings/SecuritySettings";
import NotificationSettings from "../../components/dashboard/settings/NotificationSettings";
import PreferenceSettings from "../../components/dashboard/settings/PreferenceSettings";
import DangerZone from "../../components/dashboard/settings/DangerZone";
import { useState } from "react";

function Settings() {

  const [activeTab, setActiveTab] = useState("profile");

  // render active component
  const renderContent = () => {

    switch (activeTab) {

      case "profile":
        return <ProfileSettings />;

      case "password":
        return <SecuritySettings />;

      case "notifications":
        return <NotificationSettings />;

      case "preferences":
        return <PreferenceSettings />;

      case "danger":
        return <DangerZone />;

      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="container-fluid settings-layout px-0">

        {/* PAGE HEADER */}
        <div className="mb-4">
          <h2 className="fw-bold settings-page-title mb-1">
            Account Settings
          </h2>

          <p className="settings-page-subtitle mb-0">
            Manage your account preferences and profile settings
          </p>
        </div>

        {/* SETTINGS BODY */}
        <div className="d-flex flex-column flex-lg-row settings-wrapper">

          {/* LEFT SETTINGS MENU */}
          <div className="settings-sidebar">

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">

              <button
                className={`settings-tab ${activeTab === "profile" ? "active" : ""}`}
                onClick={() => setActiveTab("profile")}
              >
                <i className="fa fa-user me-2"></i>
                Profile Settings
              </button>

              <button
                className={`settings-tab ${activeTab === "password" ? "active" : ""}`}
                onClick={() => setActiveTab("password")}
              >
                <i className="fa fa-lock me-2"></i>
                Password
              </button>

              <button
                className={`settings-tab ${activeTab === "notifications" ? "active" : ""}`}
                onClick={() => setActiveTab("notifications")}
              >
                <i className="fa fa-bell me-2"></i>
                Notifications
              </button>

              <button
                className={`settings-tab ${activeTab === "preferences" ? "active" : ""}`}
                onClick={() => setActiveTab("preferences")}
              >
                <i className="fa fa-sliders me-2"></i>
                Preferences
              </button>

              <button
                className={`settings-tab text-danger ${
                  activeTab === "danger" ? "active-danger" : ""
                }`}
                onClick={() => setActiveTab("danger")}
              >
                <i className="fa fa-trash me-2"></i>
                Danger Zone
              </button>

            </div>

          </div>

          {/* RIGHT CONTENT PANEL */}
          <div className="settings-content flex-grow-1">

            {renderContent()}

          </div>

        </div>
    </div>
  );
}

export default Settings;