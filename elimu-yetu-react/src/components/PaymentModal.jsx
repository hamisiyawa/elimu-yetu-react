import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { initiatePayment, checkPaymentStatus } from "../services/paymentService";
import { logDownload } from "../services/materialsService";
import { createPortal } from "react-dom";

// How long to keep polling before giving up and telling the user
// to check back later, rather than polling forever
const POLL_TIMEOUT_MS = 60000;
const POLL_INTERVAL_MS = 2500;

function PaymentModal({ show, material, token, onClose }) {

  const [phone, setPhone]     = useState("");
  const [stage, setStage]     = useState("form"); // form | waiting | timeout
  const pollRef = useRef(null);
  const timeoutRef = useRef(null);
  const [portalNode] = useState(() => document.createElement("div"));

  useEffect(() => {
    // Clean up any in-flight polling if the modal closes early
    return () => {
      clearInterval(pollRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    document.body.appendChild(portalNode);
    return () => {
      document.body.removeChild(portalNode);
    };
  }, [portalNode]);

  if (!show || !material) return null;

  const handleClose = () => {
    clearInterval(pollRef.current);
    clearTimeout(timeoutRef.current);
    setStage("form");
    setPhone("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!/^(07|01)\d{8}$/.test(phone)) {
      toast.error("Enter a valid phone number");
      return;
    }

    try {
      const { purchaseId } = await initiatePayment(material._id, phone, token);
      setStage("waiting");
      startPolling(purchaseId);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const startPolling = (purchaseId) => {
    pollRef.current = setInterval(async () => {
      try {
        const { status } = await checkPaymentStatus(purchaseId, token);

        if (status === "completed") {
          clearInterval(pollRef.current);
          clearTimeout(timeoutRef.current);
          toast.success("Payment successful! Starting your download...");

          // Purchase is now completed — this download call will
          // pass the access check and stream the real file
          const { blob, filename } = await logDownload(material._id, token);
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);

          handleClose();
        }

        if (status === "failed") {
          clearInterval(pollRef.current);
          clearTimeout(timeoutRef.current);
          toast.error("Payment failed. Please try again.");
          setStage("form");
        }
        // status === "pending" — keep polling silently
      } catch (error) {
        clearInterval(pollRef.current);
        toast.error(error.message);
        setStage("form");
      }
    }, POLL_INTERVAL_MS);

    timeoutRef.current = setTimeout(() => {
      clearInterval(pollRef.current);
      setStage("timeout");
    }, POLL_TIMEOUT_MS);
  };

  return createPortal(
    <div className="custom-modal-overlay">
      <div className="custom-modal" style={{ maxWidth: "420px" }}>

        <div className="modal-header-custom">
          <h5 className="modal-title-custom">
            <i className="bi bi-phone me-2" style={{ color: "#FFA500" }}></i>
            Pay with M-Pesa
          </h5>
          <button className="modal-close-btn" onClick={handleClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="modal-body">

          {stage === "form" && (
            <>
              <p className="mb-3">
                <strong>{material.title}</strong><br />
                <span className="text-muted">KES {material.price}</span>
              </p>

              <div className="mb-3">
                <label className="form-label">M-Pesa phone number</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="07XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <button className="btn btn-warning w-100 fw-semibold" onClick={handleSubmit}>
                Pay KES {material.price}
              </button>
            </>
          )}

          {stage === "waiting" && (
            <div className="text-center py-3">
              <div className="spinner-border text-warning mb-3" role="status"></div>
              <p className="fw-semibold mb-1">Check your phone</p>
              <p className="text-muted" style={{ fontSize: "0.875rem" }}>
                Enter your M-Pesa PIN on the prompt sent to {phone}
              </p>
            </div>
          )}

          {stage === "timeout" && (
            <div className="text-center py-3">
              <i className="bi bi-clock-history mb-2" style={{ fontSize: "1.5rem" }}></i>
              <p className="fw-semibold mb-1">This is taking a while</p>
              <p className="text-muted mb-3" style={{ fontSize: "0.875rem" }}>
                Your payment may still complete — check your Downloads later, or try again.
              </p>
              <button className="btn btn-outline-secondary w-100" onClick={() => setStage("form")}>
                Try Again
              </button>
            </div>
          )}

        </div>

      </div>
    </div>,
    portalNode
  );
}

export default PaymentModal;