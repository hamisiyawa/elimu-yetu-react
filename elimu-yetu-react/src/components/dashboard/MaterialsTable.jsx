import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { deleteMaterial } from "../../services/materialsService";
import UploadMaterialModal from "./UploadMaterialModal";
import defaultImage from "../../assets/images/targeter.jpg";

// ── Status badge helper ───────────────────────────────────────
function StatusBadge({ status }) {
  const config = {
    pending:  { bg: "#FFA500", color: "#141523", label: "Pending"  },
    approved: { bg: "#198754", color: "#fff",    label: "Approved" },
    rejected: { bg: "#dc3545", color: "#fff",    label: "Rejected" },
  };

  const { bg, color, label } = config[status] || config.pending;

  return (
    <span style={{
      background:   bg,
      color:        color,
      fontSize:     "0.72rem",
      fontWeight:   600,
      padding:      "3px 10px",
      borderRadius: "20px",
      whiteSpace:   "nowrap",
    }}>
      {label}
    </span>
  );
}

function MaterialsTable({ materials, onRefresh }) {
  const { token } = useAuth();

  const [editingMaterial, setEditingMaterial] = useState(null);
  const [showEditModal,   setShowEditModal]   = useState(false);
  const [isDeleting,      setIsDeleting]      = useState(null);

  const canEdit   = (m) => m.status === "pending";
  const canDelete = (m) => m.status !== "approved";

  const getImageSrc = (coverImage) =>
    coverImage ? `${import.meta.env.VITE_API_URL}${coverImage}` : defaultImage;

  const handleEdit = (material) => {
    setEditingMaterial(material);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setEditingMaterial(null);
    onRefresh();
  };

  const handleDelete = async (material) => {
    if (!window.confirm(
      `Are you sure you want to delete "${material.title}"?\nThis action cannot be undone.`
    )) return;

    setIsDeleting(material._id);
    try {
      await deleteMaterial(material._id, token);
      toast.success("Material deleted successfully");
      onRefresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <>

      {/* ── DESKTOP TABLE ─────────────────────────────────────── */}
      <div className="table-responsive dashboard-table d-none d-md-block">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>SN</th>
              <th>Image</th>
              <th>Title</th>
              <th>Type</th>
              <th>Subject</th>
              <th>Level</th>
              <th>Status</th>
              <th className="text-center" colSpan="2">Action</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((material, index) => (
              <tr key={material._id}>

                <td>{index + 1}</td>

                <td>
                  <img
                    src={getImageSrc(material.coverImage)}
                    alt={material.title}
                    className="table-image"
                  />
                </td>

                <td style={{ maxWidth: "160px" }}>
                  <span style={{ fontSize: "0.85rem" }}>{material.title}</span>
                </td>

                <td>{material.type}</td>
                <td>{material.subject}</td>
                <td>{material.level}</td>

                <td>
                  <StatusBadge status={material.status} />
                </td>

                {/* Update button — disabled unless pending */}
                <td>
                  <span
                    title={
                      !canEdit(material)
                        ? `Cannot edit — material is ${material.status}`
                        : "Edit material"
                    }
                  >
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleEdit(material)}
                      disabled={!canEdit(material)}
                      style={{ pointerEvents: !canEdit(material) ? "none" : "auto" }}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </span>
                </td>

                {/* Delete button — disabled when approved */}
                <td>
                  <span
                    title={
                      !canDelete(material)
                        ? "Cannot delete an approved material"
                        : "Delete material"
                    }
                  >
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(material)}
                      disabled={!canDelete(material)}
                      style={{ pointerEvents: !canDelete(material) ? "none" : "auto" }}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </span>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── MOBILE CARDS ──────────────────────────────────────── */}
      <div className="d-md-none mobile-materials-list">
        {materials.map((material, index) => (
          <div key={material._id} className="mobile-material-card">

            {/* Left — image + serial number */}
            <div className="mobile-card-image-wrap">
              <img
                src={getImageSrc(material.coverImage)}
                alt={material.title}
                className="mobile-card-image"
              />
              <span className="mobile-card-sn">#{index + 1}</span>
            </div>

            {/* Middle — details */}
            <div className="mobile-card-details">
              <StatusBadge status={material.status} />
              <p className="mobile-card-subject mt-1">{material.subject}</p>
              <p className="mobile-card-level">
                <i className="bi bi-mortarboard me-1"></i>
                {material.level}
              </p>
              <p className="mobile-card-level" style={{ fontSize: "0.75rem" }}>
                {material.title}
              </p>
            </div>

            {/* Right — actions */}
            <div className="mobile-card-actions">
              <button
                className="btn btn-sm btn-outline-primary mb-2"
                onClick={() => handleEdit(material)}
                disabled={!canEdit(material)}
                title={!canEdit(material) ? `Cannot edit — material is ${material.status}` : "Edit"}
              >
                <i className="bi bi-pencil-square"></i>
              </button>

              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleDelete(material)}
                disabled={!canDelete(material)}
                title={!canDelete(material) ? "Cannot delete an approved material" : "Delete"}
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* ── EDIT MODAL ──────────────────────────────────────── */}
      <UploadMaterialModal
        show={showEditModal}
        handleClose={() => {
          setShowEditModal(false);
          setEditingMaterial(null);
        }}
        onSuccess={handleEditSuccess}
        materialToEdit={editingMaterial}
      />

    </>
  );
}

export default MaterialsTable;