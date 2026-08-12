import RoleSelector from "./RoleSelector";
import LoginInput from "./LoginInput";
import PasswordInput from "./PasswordInput";
import { Link } from "react-router-dom";

function LoginForm({
  role,
  handleRoleChange,
  formData,
  handleChange,
  errors,
  showPassword,
  setShowPassword,
  handleSubmit,
}) {
  return (
    <form onSubmit={handleSubmit}>

      <RoleSelector role={role} handleRoleChange={handleRoleChange} />

      <LoginInput
        role={role}
        formData={formData}
        handleChange={handleChange}
        errors={errors}
      />

      <PasswordInput
        formData={formData}
        handleChange={handleChange}
        errors={errors}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />

      <div className="mb-3">
        <Link to="/forgot-password" className="text-decoration-underline form-chech-text">
          Forgot password?
        </Link>
      </div>

      <div className="d-grid">
        <button type="submit" className="btn btn-warning btn-lg W-100">
          Login
        </button>
      </div>

      <div className="mt-3 text-center">
        Don’t have account yet?{" "}
        <Link to="/signup" className="text-decoration-underline form-chech-text">
          SignUp
        </Link>
      </div>

    </form>
  );
}

export default LoginForm;