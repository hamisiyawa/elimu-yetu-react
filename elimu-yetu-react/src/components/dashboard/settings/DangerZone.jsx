import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";

function DangerZone() {

  const { user, logout } = useAuth();

  const [confirmName, setConfirmName] = useState("");

  const isMatch = confirmName.trim() === user?.name;

  const handleDelete = () => {

    if (!isMatch) {
      return toast.error("Profile name does not match");
    }

    toast.success("Account deleted successfully");

    // future backend delete logic here
    logout();
  };

  return (
    <div className="settings-card">

      {/* HEADER */}
      <div className="mb-4">

        <h4 className="fw-bold text-danger mb-1">

          <i className="fa fa-exclamation-triangle me-2"></i>

          Danger Zone

        </h4>

        <p className="text-muted mb-0">
          Actions performed here are irreversible.
        </p>

      </div>

      {/* WARNING BOX */}
      <div className="alert alert-danger rounded-4 border-0">

        <h6 className="fw-bold mb-2">
          Delete Account
        </h6>

        <p className="mb-3">
          This will permanently remove your account,
          uploaded materials, and profile information.
        </p>

        <div className="mb-3">

          <label className="form-label fw-semibold">

            Type your profile name to confirm deletion

          </label>

          <input
            type="text"
            className="form-control"
            placeholder={`Type "${user?.name}"`}
            value={confirmName}
            onChange={(e) =>
              setConfirmName(e.target.value)
            }
          />

          <small className="text-muted">
            This action cannot be undone.
          </small>

        </div>

        <button
          className="btn btn-danger w-100 fw-semibold"
          disabled={!isMatch}
          onClick={handleDelete}
        >

          <i className="fa fa-trash me-2"></i>

          Permanently Delete Account

        </button>

      </div>

    </div>
  );
}

export default DangerZone;