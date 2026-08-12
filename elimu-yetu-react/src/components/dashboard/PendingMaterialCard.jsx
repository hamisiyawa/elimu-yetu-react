import defaultImage from "../../assets/images/targeter.jpg";

function PendingMaterialCard({ material, onApprove, onReject, isProcessing }) {

  const getImageSrc = (coverImage) =>
    coverImage ? `${import.meta.env.VITE_API_URL}${coverImage}` : defaultImage;

  return (
    <div className="pending-card">

      {/* Image */}
      <div className="pending-card-image">
        <img src={getImageSrc(material.coverImage)} alt={material.title} />
      </div>

      {/* Details */}
      <div className="pending-card-body">

        <div className="d-flex justify-content-between align-items-start mb-1">
          <h6 className="pending-card-title mb-0">{material.title}</h6>
          <span className="pending-card-pricing">
            {material.isFree ? "Free" : `KES ${material.price}`}
          </span>
        </div>

        <div className="pending-card-meta">
          <span><i className="bi bi-tag me-1"></i>{material.type}</span>
          <span><i className="bi bi-mortarboard me-1"></i>{material.grade}</span>
          <span><i className="bi bi-book me-1"></i>{material.subject}</span>
          <span><i className="bi bi-calendar3 me-1"></i>{material.term} · {material.year}</span>
        </div>

        <div className="pending-card-uploader">
          <i className="bi bi-person-circle me-1"></i>
          Uploaded by <strong>{material.uploadedBy?.name || "Unknown"}</strong>
          {material.uploadedBy?.username && (
            <span className="text-muted"> (@{material.uploadedBy.username})</span>
          )}
        </div>

        <div className="pending-card-actions">
          <a
            href={`${import.meta.env.VITE_API_URL}${material.fileUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline-secondary"
          >
            <i className="bi bi-eye me-1"></i>Preview
          </a>

          <button
            className="btn btn-sm btn-success"
            onClick={() => onApprove(material)}
            disabled={isProcessing}
          >
            <i className="bi bi-check-lg me-1"></i>Approve
          </button>

          <button
            className="btn btn-sm btn-danger"
            onClick={() => onReject(material)}
            disabled={isProcessing}
          >
            <i className="bi bi-x-lg me-1"></i>Reject
          </button>
        </div>

      </div>
    </div>
  );
}

export default PendingMaterialCard;