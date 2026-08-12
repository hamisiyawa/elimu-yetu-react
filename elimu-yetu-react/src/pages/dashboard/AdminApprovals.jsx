import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import {
  fetchPendingMaterials,
  updateMaterialStatus,
} from "../../services/materialsService";
import PendingMaterialCard from "../../components/dashboard/PendingMaterialCard";
import RejectReasonModal from "../../components/dashboard/RejectReasonModal";

function AdminApprovals() {
  const { token } = useAuth();

  const [materials,   setMaterials]   = useState([]);
  const [isLoading,   setIsLoading]   = useState(true);
  const [error,       setError]       = useState(null);

  // tracks which material id is currently being approved/rejected
  // disables only that card's buttons, not the whole page
  const [processingId, setProcessingId] = useState(null);

  // controls the reject modal
  const [rejectingMaterial, setRejectingMaterial] = useState(null);

  const loadPending = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPendingMaterials(token);
      setMaterials(data.materials);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadPending();
  }, [token]);

  // ── Approve ─────────────────────────────────────────────────
  const handleApprove = async (material) => {
    setProcessingId(material._id);
    try {
      await updateMaterialStatus(material._id, "approved", null, token);
      toast.success(`"${material.title}" approved and is now live`);

      // remove it from the pending list immediately — no need to refetch everything
      setMaterials((prev) => prev.filter((m) => m._id !== material._id));

    } catch (err) {
      toast.error(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  // ── Reject — opens the modal first ─────────────────────────
  const handleRejectClick = (material) => {
    setRejectingMaterial(material);
  };

  const handleRejectConfirm = async (reason) => {
    setProcessingId(rejectingMaterial._id);
    try {
      await updateMaterialStatus(rejectingMaterial._id, "rejected", reason, token);
      toast.success(`"${rejectingMaterial.title}" was rejected`);

      setMaterials((prev) => prev.filter((m) => m._id !== rejectingMaterial._id));
      setRejectingMaterial(null);

    } catch (err) {
      toast.error(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div>

      {/* HEADER */}
      <div className="manage-materials-header mb-4">
        <div>
          <h3 className="fw-bold mb-1">Material Approvals</h3>
          <p className="text-muted mb-0">
            Review and approve materials submitted by teachers
          </p>
        </div>
        {!isLoading && materials.length > 0 && (
          <span
            className="badge"
            style={{ background: "#FFA500", color: "#141523", fontSize: "0.85rem" }}
          >
            {materials.length} pending
          </span>
        )}
      </div>

      {/* LOADING */}
      {isLoading && (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-2">Loading pending materials...</p>
        </div>
      )}

      {/* ERROR */}
      {error && !isLoading && (
        <div className="alert alert-danger">
          {error}
          <button className="btn btn-sm btn-outline-danger ms-2" onClick={loadPending}>
            Retry
          </button>
        </div>
      )}

      {/* EMPTY STATE */}
      {!isLoading && !error && materials.length === 0 && (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-check2-circle" style={{ fontSize: "3rem", color: "#198754" }}></i>
          <p className="mt-3 mb-0">All caught up! No materials waiting for approval.</p>
        </div>
      )}

      {/* PENDING LIST */}
      {!isLoading && !error && materials.length > 0 && (
        <div>
          {materials.map((material) => (
            <PendingMaterialCard
              key={material._id}
              material={material}
              onApprove={handleApprove}
              onReject={handleRejectClick}
              isProcessing={processingId === material._id}
            />
          ))}
        </div>
      )}

      {/* REJECT MODAL */}
      <RejectReasonModal
        show={!!rejectingMaterial}
        material={rejectingMaterial}
        onClose={() => setRejectingMaterial(null)}
        onConfirm={handleRejectConfirm}
        isSubmitting={processingId === rejectingMaterial?._id}
      />

    </div>
  );
}

export default AdminApprovals;