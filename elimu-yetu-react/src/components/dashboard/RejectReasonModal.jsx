import { useState } from "react";

function RejectReasonModal({ show, material, onClose, onConfirm, isSubmitting }) {

  const [reason, setReason] = useState("");
  const [error,  setError]  = useState("");

  if (!show || !material) return null;

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError("Please provide a reason for rejection");
      return;
    }
    onConfirm(reason.trim());
  };

  const handleClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal" style={{ maxWidth: "440px" }}>

        <div className="modal-header-custom">
          <h5 className="modal-title-custom">
            <i className="bi bi-x-circle me-2" style={{ color: "#dc3545" }}></i>
            Reject Material
          </h5>
          <button className="modal-close-btn" onClick={handleClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="modal-body">
          <p className="mb-3" style={{ fontSize: "0.875rem" }}>
            You are rejecting <strong>"{material.title}"</strong>.
            The teacher will see this reason and can re-upload a corrected version.
          </p>

          <div className="mb-3">
            <label className="form-label required">Reason for rejection</label>
            <textarea
              className={`form-control ${error ? "is-invalid" : ""}`}
              rows="4"
              placeholder="e.g. The document is blurry / Wrong subject tagged / Missing pages"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError("");
              }}
            />
            {error && <div className="invalid-feedback">{error}</div>}
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
                  Rejecting...
                </>
              ) : (
                <><i className="bi bi-x-circle me-1"></i>Confirm Rejection</>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default RejectReasonModal;