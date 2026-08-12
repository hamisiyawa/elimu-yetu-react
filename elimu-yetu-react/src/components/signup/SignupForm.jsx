import { Link } from "react-router-dom";

function SignupForm({
  step,
  formData,
  errors,
  handleChange,
  handleNext,
  handleBack,
  handleSubmit,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  isLoading, 
}) {
  return (
    <form onSubmit={handleSubmit}>

      {/* ── STEP 1 — Who are you? ───────────────────────────── */}
      {step === 1 && (
        <>
          <h6 className="mb-3 fw-semibold" style={{ color: "#FFA500" }}>
            <i className="bi bi-person-circle me-2"></i>Personal Information
          </h6>

          {/* Role */}
          <div className="mb-3">
            <label className="form-label required">Register as</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`form-select ${errors.role ? "is-invalid" : ""}`}
            >
              <option value="">Select an option</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
              <option value="parent">Parent</option>
            </select>
            {errors.role && <div className="invalid-feedback">{errors.role}</div>}
          </div>

          {/* Name */}
          <div className="mb-3">
            <label className="form-label required">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          {/* Phone */}
          <div className="mb-3">
            <label className="form-label required">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. 0712345678"
              className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            />
            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email <span className="text-muted">(Optional)</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="d-grid">
            <button type="button" className="btn btn-warning btn-lg" onClick={handleNext}>
              Next <i className="bi bi-arrow-right ms-1"></i>
            </button>
          </div>
        </>
      )}

      {/* ── STEP 2 — Secure your account ───────────────────── */}
      {step === 2 && (
        <>
          <h6 className="mb-3 fw-semibold" style={{ color: "#FFA500" }}>
            <i className="bi bi-shield-lock me-2"></i>Secure Your Account
          </h6>

          {/* Username — teachers only */}
          {formData.role === "teacher" && (
            <div className="mb-3">
              <label className="form-label required">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a unique username"
                className={`form-control ${errors.username ? "is-invalid" : ""}`}
              />
              <div className="form-text">Used to log in. Letters, numbers and underscores only.</div>
              {errors.username && <div className="invalid-feedback">{errors.username}</div>}
            </div>
          )}

          {/* Password */}
          <div className="mb-3">
            <label className="form-label required">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
            </div>
            {errors.password && (
              <div className="invalid-feedback d-block">{errors.password}</div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label className="form-label required">Confirm Password</label>
            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="invalid-feedback d-block">{errors.confirmPassword}</div>
            )}
          </div>

          <div className="d-flex gap-2">
            <button type="button" className="btn btn-outline-secondary flex-fill" onClick={handleBack}>
              <i className="bi bi-arrow-left me-1"></i> Back
            </button>
            <button type="button" className="btn btn-warning flex-fill" onClick={handleNext}>
              Next <i className="bi bi-arrow-right ms-1"></i>
            </button>
          </div>
        </>
      )}

      {/* ── STEP 3 — Confirm ────────────────────────────────── */}
      {step === 3 && (
        <>
          <h6 className="mb-3 fw-semibold" style={{ color: "#FFA500" }}>
            <i className="bi bi-check-circle me-2"></i>Confirm Your Details
          </h6>

          {/* Summary */}
          <div
            className="mb-3 p-3 rounded"
            style={{ background: "#f8f9fa", border: "1px solid #dee2e6", fontSize: "0.875rem" }}
          >
            <div className="d-flex justify-content-between py-1 border-bottom">
              <span className="text-muted">Role</span>
              <span className="fw-semibold text-capitalize">{formData.role}</span>
            </div>
            <div className="d-flex justify-content-between py-1 border-bottom">
              <span className="text-muted">Name</span>
              <span className="fw-semibold">{formData.name}</span>
            </div>
            <div className="d-flex justify-content-between py-1 border-bottom">
              <span className="text-muted">Phone</span>
              <span className="fw-semibold">{formData.phone}</span>
            </div>
            {formData.email && (
              <div className="d-flex justify-content-between py-1 border-bottom">
                <span className="text-muted">Email</span>
                <span className="fw-semibold">{formData.email}</span>
              </div>
            )}
            {formData.role === "teacher" && formData.username && (
              <div className="d-flex justify-content-between py-1">
                <span className="text-muted">Username</span>
                <span className="fw-semibold">@{formData.username}</span>
              </div>
            )}
          </div>

          {/* Terms */}
          <div className="form-check mb-3">
            <input
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              className={`form-check-input ${errors.terms ? "is-invalid" : ""}`}
            />
            <label className="form-check-label">
              I agree to the{" "}
              <a href="#" className="text-decoration-underline form-chech-text">
                terms of service
              </a>{" "}
              and the{" "}
              <a href="#" className="text-decoration-underline form-chech-text">
                privacy policy
              </a>
            </label>
            {errors.terms && (
              <div className="invalid-feedback d-block">{errors.terms}</div>
            )}
          </div>

          <div className="d-flex gap-2">
            <button type="button" className="btn btn-outline-secondary flex-fill" onClick={handleBack}>
              <i className="bi bi-arrow-left me-1"></i> Back
            </button>
            <button type="submit" className="btn btn-warning flex-fill btn-lg" disabled={isLoading}>
                {isLoading ? (
                    <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Creating...
                    </>
                ) : (
                    <><i className="bi bi-person-check me-1"></i> Create Account</>
                )}
            </button>
          </div>
        </>
      )}

    </form>
  );
}

export default SignupForm;