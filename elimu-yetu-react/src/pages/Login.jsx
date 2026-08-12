import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoginForm from "../components/login/LoginForm";
import { loginUser } from "../services/authService";
import validateLogin from "../utils/validateLogin";
import { toast } from "react-toastify";
import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import signupBg from "../assets/images/signup img.jpg";

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const { user,login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";
  
  const [role, setRole] = useState("student");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    phone: "",
    username: "",
    password: "",
  });

  if (user) return <Navigate to="/" replace />;

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setFormData({ phone: "", username: "", password: "" });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const validationErrors = validateLogin(role, formData);
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    toast.error("Please fix the errors below.");
    return;
  }

  setIsLoading(true);

  try {
    const data = await loginUser(role, formData);

    // data = { token, user }
    login(data.user, data.token);

    toast.success(`Welcome back, ${data.user.name}!`);

    setTimeout(() => navigate(from, { replace: true }), 1000);

  } catch (error) {
    toast.error(error.message);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <>
      <Navbar />

      <div
        className="large-header d-flex align-items-center"
        style={{
          backgroundImage: `url(${signupBg})`,
          backgroundSize: "cover",
          minHeight: "80vh",
        }}
      >
        <div className="container py-4">

          <div
            className="card p-4 border-0 bordered-form bg-light text-dark mx-auto"
            style={{ maxWidth: "400px" }}
          >
            <h3 className="text-center fs-4">Login to your account</h3>

            <LoginForm
              role={role}
              handleRoleChange={handleRoleChange}
              formData={formData}
              handleChange={handleChange}
              errors={errors}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              handleSubmit={handleSubmit}
            />

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default Login;