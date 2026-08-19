import { useState } from "react";

function SuspendUserModal({ show, user, onClose, onConfirm, isSubmitting }) {

  const [reason, setReason] = useState("");

  if (!show || !user) return null;

  const handleConfirm = () => {
    onConfirm(reason.trim());
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal" style={{ maxWidth: "440px" }}>

        <div className="modal-header-custom">
          <h5 className="modal-title-custom">
            <i className="bi bi-slash-circle me-2" style={{ color: "#dc3545" }}></i>
            Suspend Account
          </h5>
          <button className="modal-close-btn" onClick={handleClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="modal-body">
          <p className="mb-3" style={{ fontSize: "0.875rem" }}>
            You are suspending <strong>{user.name}</strong>'s account.
            They will be blocked from logging in until reinstated.
          </p>

          <div className="mb-3">
            <label className="form-label">Reason (optional)</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="e.g. Reported for uploading copyrighted material"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary flex-fill"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger flex-fill"
              onClick={handleConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Suspending...
                </>
              ) : (
                <><i className="bi bi-slash-circle me-1"></i>Confirm Suspension</>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default SuspendUserModal;