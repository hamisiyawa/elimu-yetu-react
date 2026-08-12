function LoginInput({ role, formData, handleChange, errors }) {
  const isPhone = role === "student" || role === "parent";

  return (
    <div className="mb-3">

      {isPhone ? (
        <>
          <label className="form-label required">Phone number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            placeholder="e.g. 07xxxxxxxx"
          />
          {errors.phone && (
            <div className="invalid-feedback">{errors.phone}</div>
          )}
        </>
      ) : (
        <>
          <label className="form-label required">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`form-control ${errors.username ? "is-invalid" : ""}`}
            placeholder="Enter your username"
          />
          {errors.username && (
            <div className="invalid-feedback">{errors.username}</div>
          )}
        </>
      )}

    </div>
  );
}

export default LoginInput;