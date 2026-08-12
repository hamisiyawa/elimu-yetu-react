import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import validateSignup from "../utils/validateSignup";
import SignupForm from "../components/signup/SignupForm";
import signupBg from "../assets/images/signup img.jpg";
import { registerUser } from "../services/authService";

function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // tracks current step

  const [formData, setFormData] = useState({
    role:            "",
    name:            "",
    phone:           "",
    email:           "",
    username:        "",
    password:        "",
    confirmPassword: "",
    terms:           false,
  });

  const [errors,              setErrors]              = useState({});
  const [showPassword,        setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  // handle any input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    // clear the error for this field as the user types
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  // validate only the fields that belong to the current step
  const validateStep = (currentStep) => {
    const stepErrors = {};

    if (currentStep === 1) {
      if (!formData.role)        stepErrors.role = "Please select a role";
      if (!formData.name.trim()) stepErrors.name = "Name is required";
      if (!formData.phone.trim()) {
        stepErrors.phone = "Phone number is required";
      } else if (!/^(07|01)\d{8}$/.test(formData.phone)) {
        stepErrors.phone = "Enter a valid Kenyan phone number e.g. 0712345678";
      }
      if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
        stepErrors.email = "Enter a valid email address";
      }
    }

    if (currentStep === 2) {
      if (formData.role === "teacher") {
        if (!formData.username.trim()) {
          stepErrors.username = "Username is required for teachers";
        } else if (formData.username.length < 3) {
          stepErrors.username = "Username must be at least 3 characters";
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
          stepErrors.username = "Only letters, numbers and underscores allowed";
        }
      }
      if (!formData.password.trim()) {
        stepErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        stepErrors.password = "Password must be at least 6 characters";
      }
      if (!formData.confirmPassword.trim()) {
        stepErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        stepErrors.confirmPassword = "Passwords do not match";
      }
    }

    if (currentStep === 3) {
      if (!formData.terms) {
        stepErrors.terms = "You must agree to the terms to continue";
      }
    }

    return stepErrors;
  };

  // move to next step
  const handleNext = () => {
    const stepErrors = validateStep(step);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStep(step + 1);
  };

  // move back without losing data
  const handleBack = () => {
    setErrors({});
    setStep(step - 1);
  };

  // final submit on step 3
  const handleSubmit = async (e) => {
    e.preventDefault();

    const stepErrors = validateStep(3);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setIsLoading(true);

    try {
      const submittedData = { ...formData };

      const data = await registerUser(submittedData); // ← await added

      toast.success("Account created! OTP sent to your phone.");

      setFormData({
        role: "", name: "", phone: "", email: "",
        username: "", password: "", confirmPassword: "", terms: false,
      });
      setErrors({});
      setStep(1);

      navigate("/otp", {
        state: {
          userId: data.userId,
          name:   data.name,
          phone:  submittedData.phone,
          role:   data.role,
        },
      });

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
        className="container-fluid py-2 my-2 large-header"
        style={{
          backgroundImage: `url(${signupBg})`,
          backgroundSize: "cover",
          minHeight: "400px",
        }}
      >
        <div className="container my-2">
          <div className="card p-4 shadow-sm border-0 bordered-form bg-light text-dark">
            <h3 className="text-center mb-1">Create your account</h3>
            <p className="text-center text-muted mb-3" style={{ fontSize: "0.85rem" }}>
              Step {step} of 3
            </p>

            {/* Step progress bar */}
            <div className="d-flex gap-2 mb-4">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  style={{
                    flex: 1,
                    height: "5px",
                    borderRadius: "5px",
                    backgroundColor: s <= step ? "#FFA500" : "#dee2e6",
                    transition: "background-color 0.3s ease",
                  }}
                />
              ))}
            </div>

            <SignupForm
              step={step}
              formData={formData}
              errors={errors}
              handleChange={handleChange}
              handleNext={handleNext}
              handleBack={handleBack}
              handleSubmit={handleSubmit}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              showConfirmPassword={showConfirmPassword}
              setShowConfirmPassword={setShowConfirmPassword}
            />

            <div className="mt-3 text-center" style={{ fontSize: "0.85rem" }}>
              Already have an account?{" "}
              <Link to="/login" className="text-decoration-underline form-chech-text">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Signup;