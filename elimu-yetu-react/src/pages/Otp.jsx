import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Navigate} from "react-router-dom";
import { verifyOtp as verifyOtpApi, resendOtp as resendOtpApi, verifyResetOtp as verifyResetOtpApi } from "../services/authService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";// to access auth context for login function


function Otp() {
  
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30); // 30 seconds countdown
  const [canResend, setCanResend] = useState(false);// to manage resend button state

  const navigate = useNavigate();// for redirection after OTP verification
  const inputRefs = useRef([]);// refs for input fields to manage focus

  const location = useLocation();// to get contact number from previous page state
  const state     = location.state;
  const mode = state?.mode || "signup";
  const userData = state?.user || {};// get user data from state

  // redirect to signup if accessed directly without user data
  if (!state?.userId) return <Navigate to="/signup" replace />;

  const { login } = useAuth();// get login function from auth context
  const { userId, phone, name } = state;
  const contact = phone || "your phone";

  const [isVerifying, setIsVerifying] = useState(false);

  //disable verify otp button if otp is not fully entered
  const isOtpComplete = otp.every((digit) => digit !== "");

  // countdown timer logic
  useEffect(() => {
  if (timer > 0) {
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // handle resend OTP
const handleResend = async () => {
  try {
    await resendOtpApi(userId);
    toast.success("OTP resent successfully!");
    setTimer(30);
    setCanResend(false);
    setOtp(["", "", "", ""]);
    inputRefs.current[0]?.focus();
  } catch (error) {
    toast.error(error.message);
  }
};

  // mask contact for display (e.g. XXXX XXX X844)
  const maskContact = (value) => {
    if (!value) return "";

    const visibleDigits = value.slice(-3); // last 3 characters
    const maskedPart = value.slice(0, -3).replace(/./g, "x");

    return maskedPart + visibleDigits;
  };


  // handle input change
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // move focus to next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // handle backspace to move focus back
  const handleKeyDown = (e, index) => {
  if (e.key === "Backspace") {
      // If current box has a value → clear it
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } 
      // If empty → move to previous input
      else if (index > 0) {
        inputRefs.current[index - 1]?.focus();

        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  // submit OTP
const handleSubmit = async (e) => {
  e.preventDefault();

  const enteredOtp = otp.join("");

  if (enteredOtp.length < 4) {
    toast.error("Please enter the full 4-digit OTP");
    return;
  }

  setIsVerifying(true);

  if (mode === "reset") {
    // password reset flow — call verify-reset-otp endpoint
    try {
      const data = await verifyResetOtpApi(userId, enteredOtp);
      toast.success("Identity verified! Set your new password.");
      setTimeout(() => navigate("/reset-password", {
        state: {
          userId:     data.userId,
          resetToken: data.resetToken,
        },
      }), 1500);
    } catch (error) {
      toast.error(error.message);
      setOtp(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    }

  } else {
    // signup flow — existing logic unchanged
    const data = await verifyOtpApi(userId, enteredOtp);
    login(data.user, data.token);
    toast.success("OTP Verified Successfully, redirecting to Home...");
    setTimeout(() => navigate("/"), 2000);
  }
};


  return (
    <>
      <Navbar />

      <div className="container my-5 text-center">
        <div className="card p-4 mx-auto" style={{ maxWidth: "400px" }}>
          <h4>Verify OTP</h4>

          <p className="text-muted">
            Enter the 4-digit code sent to <strong>{maskContact(contact)}</strong>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="d-flex justify-content-between mb-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="form-control text-center mx-1"
                  style={{ width: "50px", fontSize: "20px" }}
                />
              ))}
            </div>

          <button
              type="submit"
              className={`btn w-100 ${isOtpComplete ? "btn-warning" : "btn-secondary"}`}
              disabled={!isOtpComplete || isVerifying}
            >
              {isVerifying ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Verifying...
                </>
              ) : "Verify"}
          </button>

            <div className="mt-3 text-center">

              {timer > 0 ? (
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  disabled
                >
                  ⏳ Resend Otp in {timer}s
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-warning btn-sm px-3"
                  onClick={handleResend}
                >
                  🔄 Resend OTP
                </button>
              )}

            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Otp;