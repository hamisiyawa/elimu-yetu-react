import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { changePassword } from "../../../services/authService";
import { toast } from "react-toastify";

function SecuritySettings() {
  const { token } = useAuth();

  const [isLoading,    setIsLoading]    = useState(false);
  const [showCurrent,  setShowCurrent]  = useState(false);
  const [showNew,      setShowNew]      = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword:  "",
    newPassword:      "",
    confirmPassword:  "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};

    if (!passwordData.currentPassword.trim()) {
      e.currentPassword = "Current password is required";
    }
    if (!passwordData.newPassword.trim()) {
      e.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      e.newPassword = "Password must be at least 6 characters";
    }
    if (!passwordData.confirmPassword.trim()) {
      e.confirmPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      e.confirmPassword = "Passwords do not match";
    }
    if (
      passwordData.currentPassword &&
      passwordData.newPassword &&
      passwordData.currentPassword === passwordData.newPassword
    ) {
      e.newPassword = "New password must be different from current password";
    }

    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      await changePassword(
        token,
        passwordData.currentPassword,
        passwordData.newPassword
      );

      toast.success("Password changed successfully");

      setPasswordData({
        currentPassword: "",
        newPassword:     "",
        confirmPassword: "",
      });
      setErrors({});

    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // reusable password field with show/hide toggle
  const PasswordField = ({ label, name, show, onToggle, error }) => (
    <div className="mb-3">
      <label className="form-label fw-semibold required">{label}</label>
      <div className="input-group">
        <input
          type={show ? "text" : "password"}
          className={`form-control ${error ? "is-invalid" : ""}`}
          name={name}
          value={passwordData[name]}
          onChange={handleChange}
        />
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onToggle}
        >
          <i className={`bi ${show ? "bi-eye-slash" : "bi-eye"}`}></i>
        </button>
      </div>
      {error && (
        <div className="invalid-feedback d-block">{error}</div>
      )}
    </div>
  );

  return (
    <div className="settings-card">

      <h4 className="fw-bold mb-4">
        <i className="bi bi-shield-lock text-warning me-2"></i>
        Security Settings
      </h4>

      <p className="text-muted mb-4" style={{ fontSize: "0.875rem" }}>
        Choose a strong password that is at least 6 characters long
        and different from your previous one.
      </p>

      <form onSubmit={handleSubmit} noValidate>

        <PasswordField
          label="Current Password"
          name="currentPassword"
          show={showCurrent}
          onToggle={() => setShowCurrent(!showCurrent)}
          error={errors.currentPassword}
        />

        <PasswordField
          label="New Password"
          name="newPassword"
          show={showNew}
          onToggle={() => setShowNew(!showNew)}
          error={errors.newPassword}
        />

        <PasswordField
          label="Confirm New Password"
          name="confirmPassword"
          show={showConfirm}
          onToggle={() => setShowConfirm(!showConfirm)}
          error={errors.confirmPassword}
        />

        <button
          type="submit"
          className="btn btn-warning w-100 fw-semibold"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Updating...
            </>
          ) : (
            <><i className="bi bi-lock me-2"></i>Update Password</>
          )}
        </button>

      </form>
    </div>
  );
}

export default SecuritySettings;