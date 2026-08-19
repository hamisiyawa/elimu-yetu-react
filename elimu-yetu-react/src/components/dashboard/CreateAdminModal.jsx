import { useState } from "react";

function CreateAdminModal({ show, onClose, onConfirm, isSubmitting }) {

  const [formData, setFormData] = useState({ name: "", username: "", phone: "", password: "" });
  const [errors,   setErrors]   = useState({});

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim())     e.name     = "Name is required";
    if (!formData.username.trim()) e.username = "Username is required";
    if (!/^(07|01)\d{8}$/.test(formData.phone)) e.phone = "Enter a valid phone number";
    if (formData.password.length < 6) e.password = "Password must be at least 6 characters";
    return e;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onConfirm(formData);
  };

  const handleClose = () => {
    setFormData({ name: "", username: "", phone: "", password: "" });
    setErrors({});
    onClose();
  };

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal" style={{ maxWidth: "440px" }}>

        <div className="modal-header-custom">
          <h5 className="modal-title-custom">
            <i className="bi bi-person-badge me-2" style={{ color: "#FFA500" }}></i>
            Add Admin Account
          </h5>
          <button className="modal-close-btn" onClick={handleClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="modal-body">

          <div className="mb-3">
            <label className="form-label required">Full name</label>
            <input
              type="text"
              name="name"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label required">Username</label>
            <input
              type="text"
              name="username"
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <div className="invalid-feedback">{errors.username}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label required">Phone number</label>
            <input
              type="text"
              name="phone"
              placeholder="07XXXXXXXX"
              className={`form-control ${errors.phone ? "is-invalid" : ""}`}
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label required">Password</label>
            <input
              type="password"
              name="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary flex-fill"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-warning flex-fill fw-semibold"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Creating...
                </>
              ) : (
                <><i className="bi bi-check2 me-1"></i>Create Admin</>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default CreateAdminModal;