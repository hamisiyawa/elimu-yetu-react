import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { updateProfile } from "../../../services/authService";
import { toast } from "react-toastify";
import defaultUser from "../../../assets/images/default-user.png";

function ProfileSettings() {
  const { user, token, updateUser } = useAuth();

  const [isLoading,  setIsLoading]  = useState(false);
  const [imageFile,  setImageFile]  = useState(null);
  const [errors,     setErrors]     = useState({});

  const [previewImage, setPreviewImage] = useState(
    user?.profileImage
      ? `${import.meta.env.VITE_API_URL}${user.profileImage}`
      : defaultUser
  );

  const [formData, setFormData] = useState({
    name:  user?.name  || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please select an image file");
    if (file.size > 2 * 1024 * 1024) return toast.error("Image must be smaller than 2MB");
    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleDeleteAvatar = () => {
    setImageFile(null);
    setPreviewImage(defaultUser);
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = "Name is required";
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      e.email = "Enter a valid email address";
    }
    if (formData.phone && !/^(07|01)\d{8}$/.test(formData.phone)) {
      e.phone = "Enter a valid Kenyan phone number";
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

    const authToken = token || localStorage.getItem("token");
    setIsLoading(true);

    try {
      const updates = {};
      if (formData.name  !== user?.name)  updates.name  = formData.name;
      if (formData.email !== user?.email) updates.email = formData.email;
      if (formData.phone !== user?.phone) updates.phone = formData.phone;

      // upload image first if a new one was selected
      if (imageFile) {
        const form = new FormData();
        form.append("profileImage", imageFile);

        const uploadRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/upload-avatar`,
          {
            method:  "POST",
            headers: { "Authorization": `Bearer ${authToken}` },
            body:    form,
          }
        );

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.message || "Image upload failed");
        updates.profileImage = uploadData.profileImageUrl;
      }

      if (Object.keys(updates).length === 0) {
        toast.info("No changes to save");
        return;
      }

      const data = await updateProfile(authToken, updates);
      updateUser(data.user);
      setImageFile(null);
      toast.success("Profile updated successfully");

    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settings-card">

      <h4 className="fw-bold mb-4">
        <i className="bi bi-person-circle text-warning me-2"></i>
        Profile Settings
      </h4>

      {/* Role badge */}
      <div className="mb-4">
        <span style={{ background: "#FFA500", color: "#141523", fontSize: "0.75rem",
          fontWeight: 600, padding: "3px 12px", borderRadius: "20px" }}>
          {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
        </span>
        <small className="text-muted ms-2">Role cannot be changed</small>
      </div>

      {/* Profile image */}
      <div className="d-flex align-items-center gap-4 mb-4 flex-wrap">
        <img
          src={previewImage}
          alt="Profile"
          className="settings-profile-image"
          onError={(e) => { e.target.src = defaultUser; }}
        />
        <div>
          <label className="btn btn-warning me-2">
            Upload New
            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
          </label>
          <button type="button" className="btn btn-light border" onClick={handleDeleteAvatar}>
            Remove
          </button>
          <p className="text-muted mt-1 mb-0" style={{ fontSize: "0.78rem" }}>
            JPG, PNG — max 2MB
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>

        <div className="mb-3">
          <label className="form-label fw-semibold required">Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange}
            className={`form-control ${errors.name ? "is-invalid" : ""}`} />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">
            Email Address <span className="text-muted">(Optional)</span>
          </label>
          <input type="email" name="email" value={formData.email} onChange={handleChange}
            className={`form-control ${errors.email ? "is-invalid" : ""}`} />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Phone Number</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
            className={`form-control ${errors.phone ? "is-invalid" : ""}`} />
          {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
          <div className="form-text">Used for OTP verification</div>
        </div>

        <button type="submit" className="btn btn-warning w-100 fw-semibold" disabled={isLoading}>
          {isLoading ? (
            <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Saving...</>
          ) : "Save Changes"}
        </button>

      </form>
    </div>
  );
}

export default ProfileSettings;