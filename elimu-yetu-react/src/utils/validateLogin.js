// validation function
const validateLogin = (role, formData) => {
  let newErrors = {};

  // Safe defaults
  const phone = formData?.phone || "";
  const username = formData?.username || "";
  const password = formData?.password || "";

  // Student & Parent → validate phone
  if (role === "student" || role === "parent") {
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^(07|01)\d{8}$/.test(phone)) {
      newErrors.phone = "Enter a valid Kenyan phone number e.g. 07xxxxxxxx";
    }
  }

  // Teacher → validate username
  if (role === "teacher" || role === "admin") {
    if (!username.trim()) {
      newErrors.username = "Username is required";
    }
  }

  // password validation (for all roles)
  if (!password.trim()) {
    newErrors.password = "Password is required";
  } else if (password.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
  }

  return newErrors;
};

export default validateLogin;