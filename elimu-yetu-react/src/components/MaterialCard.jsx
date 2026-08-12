import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { logDownload } from "../services/materialsService";
import { toast } from "react-toastify";
import defaultCover from "../assets/images/targeter.jpg";

function MaterialCard({ _id, title, grade, term, coverImage, isFree, price }) {
  const { token } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    // block paid downloads — payment integration coming in V2
    if (!isFree) {
      toast.info(`This material costs KES ${price}. Payment coming soon.`);
      return;
    }

    setIsDownloading(true);

    try {
      const data = await logDownload(_id, token);

      // open the file in a new tab — browser handles the download
      window.open(`${import.meta.env.VITE_API_URL}${data.fileUrl}`, "_blank");

    } catch (error) {
      toast.error(error.message || "Download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="material-card shadow-sm">

      <div className="card-image">
        <img
          src={
            coverImage
              ? `${import.meta.env.VITE_API_URL}${coverImage}`
              : defaultCover
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

    </div>
  );
}

export default MaterialCard;