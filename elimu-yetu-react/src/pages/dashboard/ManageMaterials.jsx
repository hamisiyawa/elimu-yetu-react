import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import UploadMaterialModal from "../../components/dashboard/UploadMaterialModal";
import MaterialsTable from "../../components/dashboard/MaterialsTable";
import { fetchMyMaterials } from "../../services/materialsService";
import { toast } from "react-toastify";

function ManageMaterials() {
  const { token } = useAuth();
  const [showModal,  setShowModal]  = useState(false);
  const [materials,  setMaterials]  = useState([]);
  const [isLoading,  setIsLoading]  = useState(true);
  const [error,      setError]      = useState(null);

  const loadMaterials = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchMyMaterials(token);
      setMaterials(data.materials);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadMaterials();
  }, [token]);

  // called after a successful upload to refresh the list
  const handleUploadSuccess = () => {
    setShowModal(false);
    loadMaterials();
    toast.success("Material uploaded successfully!");
  };

  return (
    <div>

      {/* HEADER */}
      <div className="manage-materials-header mb-4">
        <div>
          <h3 className="fw-bold mb-1">Manage Materials</h3>
          <p className="text-muted mb-0">Manage your uploaded learning resources</p>
        </div>
        <button className="btn btn-warning" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-circle me-2"></i>Upload New Material
        </button>
      </div>

      {/* LOADING */}
      {isLoading && (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-2">Loading your materials...</p>
        </div>
      )}

      {/* ERROR */}
      {error && !isLoading && (
        <div className="alert alert-danger">
          {error} —
          <button className="btn btn-sm btn-outline-danger ms-2" onClick={loadMaterials}>
            Retry
          </button>
        </div>
      )}

      {/* TABLE */}
      {!isLoading && !error && (
        materials.length > 0
          ? <MaterialsTable materials={materials} onRefresh={loadMaterials} />
          : (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-folder2-open fs-1 d-block mb-3"></i>
              <p>You have not uploaded any materials yet.</p>
              <button className="btn btn-warning" onClick={() => setShowModal(true)}>
                Upload your first material
              </button>
            </div>
          )
      )}

      {/* MODAL */}
      <UploadMaterialModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onSuccess={handleUploadSuccess}
      />

    </div>
  );
}

export default ManageMaterials;