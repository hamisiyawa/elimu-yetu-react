function PasswordInput({
  formData,
  handleChange,
  errors,
  showPassword,
  setShowPassword,
}) {
  return (
    <div className="mb-3">
      <label className="form-label required">Password</label>

      <div className="input-group">

        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`form-control ${errors.password ? "is-invalid" : ""}`}
          placeholder="Enter your password"
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
          <div className="invalid-feedback d-block">
            {errors.password}
          </div>
        )}
    </div>
  );
}

export default PasswordInput;