import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { resetPassword } from "../services/authService";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const { userId, resetToken } = location.state || {};

  // guard — if arrived without required state, send back to forgot password
  if (!userId || !resetToken) return <Navigate to="/forgot-password" replace />;

  const [formData,    setFormData]    = useState({ newPassword: "", confirmPassword: "" });
  const [errors,      setErrors]      = useState({});
  const [isLoading,   setIsLoading]   = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!formData.newPassword.trim()) {
      e.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      e.newPassword = "Password must be at least 6 characters";
    }
    if (!formData.confirmPassword.trim()) {
      e.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      e.confirmPassword = "Passwords do not match";
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
      await resetPassword(
        userId,
        resetToken,
        formData.newPassword,
        formData.confirmPassword
      );

      toast.success("Password reset successfully! Please log in with your new password.");
      navigate("/login");

    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <div className="card p-4 mx-auto shadow-sm bordered-form" style={{ maxWidth: "420px" }}>

          <div className="text-center mb-4">
            <div style={{ fontSize: "2.5rem", color: "#FFA500" }}>
              <i className="bi bi-key"></i>
            </div>
            <h4 className="fw-bold mt-2">Set New Password</h4>
            <p className="text-muted" style={{ fontSize: "0.875rem" }}>
              Choose a strong password that you have not used before
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>

            {/* New password */}
            <div className="mb-3">
              <label className="form-label fw-semibold required">New Password</label>
              <div className="input-group">
                <input
                  type={showNew ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className={`form-control ${errors.newPassword ? "is-invalid" : ""}`}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowNew(!showNew)}
                >
                  <i className={`bi ${showNew ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
              </div>
              {errors.newPassword && (
                <div className="invalid-feedback d-block">{errors.newPassword}</div>
              )}
            </div>

            {/* Confirm password */}
            <div className="mb-4">
              <label className="form-label fw-semibold required">Confirm Password</label>
              <div className="input-group">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your new password"
                  className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  <i className={`bi ${showConfirm ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="invalid-feedback d-block">{errors.confirmPassword}</div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-warning w-100 fw-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <><span className="spinner-border spinner-border-sm me-2"></span>Resetting...</>
              ) : (
                <><i className="bi bi-check-lg me-2"></i>Reset Password</>
              )}
            </button>

          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ResetPassword;