const validateSignup = (formData) => {
let newErrors = {};

  const role = formData?.role || "";
  const name = formData?.name || "";
  const phone = formData?.phone || "";
  const username = formData?.username || "";
  const email = formData?.email || "";
  const password = formData?.password || "";
  const confirmPassword = formData?.confirmPassword || "";
  const terms = formData?.terms || false;

if (!role) {
    newErrors.role = "Please select a role";
}

if (!name.trim()) {
    newErrors.name = "Name is required";
}

if (!phone.trim()) {
    newErrors.phone = "Phone number is required";
} else if (!/^(07|01)\d{8}$/.test(formData.phone)) {
    newErrors.phone = "Enter a valid phone number";
}

// Username — required for teachers only (used for login)
if (role === "teacher") {
    if (!username.trim()) {
        newErrors.username = "Username is required for teachers";
    } else if (username.length < 3) {
        newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        newErrors.username = "Username can only contain letters, numbers, and underscores";
    }
}

if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    newErrors.email = "Enter a valid email";
}

if (!password.trim()) {
    newErrors.password = "Password is required";
} else if (password.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
}

// confirm password
if (!confirmPassword.trim()) {
    newErrors.confirmPassword = "Please confirm your password";
} else if (password !== confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match";
}

if (!terms) {
    newErrors.terms = "You must agree to terms";
}

return newErrors;
};

export default validateSignup;