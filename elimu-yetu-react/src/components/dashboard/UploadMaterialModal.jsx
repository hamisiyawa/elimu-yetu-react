import UploadForm from "./UploadForm";
import Instructions from "./Instructions";

function UploadMaterialModal({ show, handleClose, onSuccess, materialToEdit }) {

  if (!show) return null;

  return (

    <div className="custom-modal-overlay">

      <div className="custom-modal">

        {/* HEADER */}
        <div className="modal-header-custom">

        <h5 className="modal-title-custom">
          <i className={`bi ${materialToEdit ? "bi-pencil-square" : "bi-cloud-upload"} me-2`}></i>
          {materialToEdit ? "Edit Material" : "Upload New Material"}
        </h5>

          <button
            className="modal-close-btn"
            onClick={handleClose}
          ><i className="bi bi-x-lg"></i></button>

        </div>
        <div className="modal-body">
            {/* Instructions */}
            {!materialToEdit && (
              <div className="mb-4">
                <Instructions />
              </div>
            )}

              {/* show info banner when editing */}
            {materialToEdit && (
              <div className="alert alert-info py-2 mb-3" style={{ fontSize: "0.85rem" }}>
                <i className="bi bi-info-circle me-1"></i>
                You are editing a pending material. Files cannot be changed after upload.
              </div>
            )}
            {/* FORM */}
            <UploadForm onSuccess={onSuccess} materialToEdit={materialToEdit} />
        </div>

      </div>

    </div>
  );
}

export default UploadMaterialModal;