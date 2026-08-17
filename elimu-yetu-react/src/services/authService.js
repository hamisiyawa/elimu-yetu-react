// The base URL of the backend API
// In development this points to localhost
// When you deploy, change this to your live server URL
// const API_URL = "http://localhost:5000/api/auth";
const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

// ── Register ──────────────────────────────────────────────────
export const registerUser = async (formData) => {
  const response = await fetch(`${API_URL}/register`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({
      name:     formData.name,
      phone:    formData.phone,
      username: formData.username || undefined,
      email:    formData.email    || undefined,
      password: formData.password,
      role:     formData.role,
    }),
  });

  const data = await response.json();

  // if the server returned an error status, throw so the caller can catch it
  if (!response.ok) throw new Error(data.message || "Registration failed");

  return data; // { message, userId, name, role, phone }
};

// ── Verify OTP ────────────────────────────────────────────────
export const verifyOtp = async (userId, otp) => {
  const response = await fetch(`${API_URL}/verify-otp`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ userId, otp }),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message || "OTP verification failed");

  return data; // { message, token, user }
};

// ── Resend OTP ────────────────────────────────────────────────
export const resendOtp = async (userId) => {
  const response = await fetch(`${API_URL}/resend-otp`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ userId }),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message || "Failed to resend OTP");

  return data;
};

// ── Login ─────────────────────────────────────────────────────
export const loginUser = async (role, formData) => {
  const response = await fetch(`${API_URL}/login`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({
      role,
      phone:    formData.phone    || undefined,
      username: formData.username || undefined,
      password: formData.password,
    }),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message || "Login failed");

  return data; // { token, user }
};

// ── Get current user ──────────────────────────────────────────
export const getMe = async (token) => {
  const response = await fetch(`${API_URL}/me`, {
    method:  "GET",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message || "Session expired");

  return data; // { user }
};

// ── Update profile ────────────────────────────────────────────
export const updateProfile = async (token, updates) => {
  const response = await fetch(`${API_URL}/me`, {
    method:  "PATCH",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message || "Profile update failed");

  return data; // { message, user }
};

// ── Update notification preferences ──────────────────────────
export const updatePreferences = async (token, preferences) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
    method:  "PATCH",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ preferences }),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message || "Failed to save preferences");

  return data; // { message, user }
};

// ── Change password ────────────────────────────────────────────
export const changePassword = async (token, currentPassword, newPassword) => {
  const response = await fetch(`${API_URL}/change-password`, {
    method:  "PATCH",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message || "Password change failed");

  return data; // { message }
};

// ── Fetch platform-wide stats (admin only) ────────────────────
export const fetchAdminStats = async (token) => {
  const response = await fetch(`${API_URL}/admin-stats`, {
    headers: { "Authorization": `Bearer ${token}` },
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message || "Failed to fetch stats");

  return data;
  // { totalUsers, totalMaterials, approvedMaterials, pendingMaterials, rejectedMaterials }
};

// ── Forgot password — send OTP to phone ──────────────────────
export const forgotPassword = async (phone, role) => {
  const response = await fetch(`${API_URL}/forgot-password`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ phone, role }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to send OTP");
  return data; // { message, userId, phone }
};

// ── Verify reset OTP — returns resetToken ────────────────────
export const verifyResetOtp = async (userId, otp) => {
  const response = await fetch(`${API_URL}/verify-reset-otp`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ userId, otp }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "OTP verification failed");
  return data; // { message, resetToken, userId }
};

// ── Reset password ────────────────────────────────────────────
export const resetPassword = async (userId, resetToken, newPassword, confirmPassword) => {
  const response = await fetch(`${API_URL}/reset-password`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ userId, resetToken, newPassword, confirmPassword }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Password reset failed");
  return data; // { message }
};

// ── Delete account ────────────────────────────────────────────
export const deleteAccount = async (token, password) => {
  const response = await fetch(`${API_URL}/me`, {
    method:  "DELETE",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ password }),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message || "Account deletion failed");

  return data;
};