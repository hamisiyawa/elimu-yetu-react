import { useState, useEffect } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { toast } from "react-toastify";

function PreferenceSettings() {
  const { theme, updateTheme, fontSize, updateFontSize, language, updateLanguage } = useTheme();

  const handleSave = () => {
    // values already applied and saved to localStorage by ThemeContext
    // this button just gives the user confirmation feedback
    toast.success("Preferences saved successfully");
  };

  return (
    <div className="settings-card">

      <h4 className="fw-bold mb-2">
        <i className="bi bi-sliders text-warning me-2"></i>
        Preferences
      </h4>

      <p className="text-muted mb-4" style={{ fontSize: "0.875rem" }}>
        Customise how Elimu Yetu looks and feels for you.
        Changes apply instantly and are saved to this device.
      </p>

      {/* Language */}
      <div className="mb-4">
        <label className="form-label fw-semibold">
          <i className="bi bi-translate me-2 text-warning"></i>
          Language
        </label>
        <select
          className="form-select"
          value={language}
          onChange={(e) => updateLanguage(e.target.value)}
        >
          <option value="en">English</option>
        </select>
        <div className="form-text">
          Sets your preferred language for the interface
        </div>
      </div>

      {/* Theme */}
      <div className="mb-4">
        <label className="form-label fw-semibold">
          <i className="bi bi-circle-half me-2 text-warning"></i>
          Theme
        </label>
        <div className="d-flex gap-3">

          {/* Light option */}
          <div
            onClick={() => updateTheme("light")}
            style={{
              flex: 1, border: `2px solid ${theme === "light" ? "#FFA500" : "#dee2e6"}`,
              borderRadius: "10px", padding: "12px", cursor: "pointer",
              background: "#ffffff", transition: "border-color 0.2s",
            }}
          >
            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="bi bi-sun" style={{ color: "#FFA500", fontSize: "1.1rem" }}></i>
              <span className="fw-semibold" style={{ color: "#333", fontSize: "0.875rem" }}>Light</span>
              {theme === "light" && (
                <i className="bi bi-check-circle-fill ms-auto" style={{ color: "#FFA500" }}></i>
              )}
            </div>
            <div style={{ background: "#f5f5f5", borderRadius: "6px", height: "32px", border: "1px solid #eee" }}></div>
          </div>

          {/* Dark option */}
          <div
            onClick={() => updateTheme("dark")}
            style={{
              flex: 1, border: `2px solid ${theme === "dark" ? "#FFA500" : "#dee2e6"}`,
              borderRadius: "10px", padding: "12px", cursor: "pointer",
              background: "#141523", transition: "border-color 0.2s",
            }}
          >
            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="bi bi-moon-stars" style={{ color: "#FFA500", fontSize: "1.1rem" }}></i>
              <span className="fw-semibold" style={{ color: "#e0e0e0", fontSize: "0.875rem" }}>Dark</span>
              {theme === "dark" && (
                <i className="bi bi-check-circle-fill ms-auto" style={{ color: "#FFA500" }}></i>
              )}
            </div>
            <div style={{ background: "#222339", borderRadius: "6px", height: "32px", border: "1px solid #344154" }}></div>
          </div>

        </div>
        <div className="form-text">
          Changes apply instantly to the entire app
        </div>
      </div>

      {/* Font Size */}
      <div className="mb-4">
        <label className="form-label fw-semibold">
          <i className="bi bi-fonts me-2 text-warning"></i>
          Font Size
        </label>
        <div className="d-flex gap-2">
          {[
            { value: "small",  label: "A",  size: "0.85rem" },
            { value: "medium", label: "A",  size: "1rem"    },
            { value: "large",  label: "A",  size: "1.2rem"  },
          ].map(({ value, label, size }) => (
            <button
              key={value}
              type="button"
              onClick={() => updateFontSize(value)}
              className={`btn flex-fill ${fontSize === value ? "btn-warning" : "btn-outline-secondary"}`}
              style={{ fontSize: size, fontWeight: fontSize === value ? 700 : 400 }}
            >
              {label}
              <div style={{ fontSize: "0.65rem", fontWeight: 400, marginTop: "2px" }}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </div>
            </button>
          ))}
        </div>
        <div className="form-text">
          Adjusts the text size across the whole platform
        </div>
      </div>

      <button
        type="button"
        className="btn btn-warning w-100 fw-semibold"
        onClick={handleSave}
      >
        <i className="bi bi-check-lg me-2"></i>
        Save Preferences
      </button>

    </div>
  );
}

export default PreferenceSettings;