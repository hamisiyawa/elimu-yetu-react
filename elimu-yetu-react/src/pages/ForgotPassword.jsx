import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { forgotPassword } from "../services/authService";

function ForgotPassword() {
  const navigate = useNavigate();

  const [phone,     setPhone]     = useState("");
  const [role,      setRole]      = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState("");

  const validate = () => {
    if (!phone.trim()) return "Phone number is required";
    if (!/^(07|01)\d{8}$/.test(phone)) return "Enter a valid Kenyan phone number e.g. 0712345678";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await forgotPassword(phone, role);
      toast.success("OTP sent to your phone!");

      // navigate to OTP page with reset mode flag
      navigate("/otp", {
        state: {
          userId: data.userId,
          phone:  data.phone,
          mode:   "reset",    // ← tells Otp.jsx to go to /reset-password after verification
        },
      });

    } catch (err) {
      setError(err.message);
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
              <i className="bi bi-shield-lock"></i>
            </div>
            <h4 className="fw-bold mt-2">Forgot Password?</h4>
            <p className="text-muted" style={{ fontSize: "0.875rem" }}>
              Enter your phone number and we will send you an OTP to verify your identity
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>

            {/* Role selector */}
            <div className="mb-3">
              <label className="form-label fw-semibold">I am a</label>
              <div className="d-flex gap-2">
                {["student", "parent", "teacher", "admin"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`btn btn-sm flex-fill ${role === r ? "btn-warning" : "btn-outline-secondary"}`}
                    onClick={() => setRole(r)}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Phone input */}
            <div className="mb-3">
              <label className="form-label fw-semibold required">Phone Number</label>
              <input
                type="tel"
                className={`form-control ${error ? "is-invalid" : ""}`}
                placeholder="e.g. 0712345678"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setError("");
                }}
              />
              {error && <div className="invalid-feedback d-block">{error}</div>}
            </div>

            <button
              type="submit"
              className="btn btn-warning w-100 fw-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <><span className="spinner-border spinner-border-sm me-2"></span>Sending OTP...</>
              ) : (
                <><i className="bi bi-send me-2"></i>Send OTP</>
              )}
            </button>

          </form>

          <div className="text-center mt-3" style={{ fontSize: "0.875rem" }}>
            Remember your password?{" "}
            <Link to="/login" className="text-decoration-underline form-chech-text">
              Back to Login
            </Link>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}

export default ForgotPassword;