import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { logDownload } from "../services/materialsService";
import { toast } from "react-toastify";
import defaultCover from "../assets/images/fallback_image.png";
import PaymentModal from "./PaymentModal";

function MaterialCard({ _id, title, grade, term, coverImage, isFree, price }) {
  const { token } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleDownload = async () => {

    if (!isFree && !token) {
      toast.info("Please log in to purchase this material.");
      return;
    }

    setIsDownloading(true);

    try {
      const { blob, filename } = await logDownload(_id, token);

      // Trigger a real browser download from the blob — this works
      // for both free and paid materials, since access was already
      // verified server-side before any bytes were sent
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    }  catch (error) {
      if (error.status === 402) {
        setShowPaymentModal(true);
      } else if (error.status === 401) {
        toast.info("Please log in to purchase this material.");
      } else {
        toast.error(error.message || "Download failed. Please try again.");
      }
    
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="material-card shadow-sm">

      <div className="card-image">
        <img
          src={
            coverImage || defaultCover
          }
          alt={title}
        />
      </div>

      <div className="card-content">
        <h6 className="card-title">{title}</h6>

        <p className="card-text">
          {grade} &nbsp;·&nbsp; {term}
        </p>

        {/* Show price badge for paid materials */}
        {!isFree && (
          <span
            className="badge mb-1"
            style={{ background: "#FFA500", color: "#141523", fontSize: "0.75rem" }}
          >
            KES {price}
          </span>
        )}

        <button
          className="btn download-btn"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <span className="spinner-border spinner-border-sm me-1" role="status"></span>
              Downloading...
            </>
          ) : isFree ? (
            <><i className="bi bi-download me-1"></i>Download</>
          ) : (
            <><i className="bi bi-lock me-1"></i>Buy KES {price}</>
          )}
        </button>
      </div>

      <PaymentModal
        show={showPaymentModal}
        material={{ _id, title, price }}
        token={token}
        onClose={() => setShowPaymentModal(false)}
      />

    </div>
  );
}

export default MaterialCard;