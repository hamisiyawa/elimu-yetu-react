import { useState } from "react";
import validateUpload from "../../utils/validateUpload";
import { uploadMaterial, updateMaterial } from "../../services/materialsService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 2019 }, (_, i) => currentYear - i);

const STEPS = [
  { number: 1, label: "Details", icon: "bi-journal-text" },
  { number: 2, label: "Info", icon: "bi-sliders" },
  { number: 3, label: "Files", icon: "bi-cloud-upload" },
  { number: 4, label: "Review", icon: "bi-check2-circle" },
];

function UploadForm({ onSuccess, materialToEdit }) {
  const { token } = useAuth();
  const isEditMode = !!materialToEdit;
  // TODO: For edit mode, we might want to skip the file upload step and just allow editing the details/info. In that case, we would adjust the STEPS array and the step navigation logic accordingly. For now, we'll keep it simple and require re-uploading files when editing.
  const STEPS = isEditMode
    ? [
      { number: 1, label: "Details", icon: "bi-journal-text" },
      { number: 2, label: "Info", icon: "bi-sliders" },
      { number: 3, label: "Review", icon: "bi-check2-circle" },
    ]
    : [
      { number: 1, label: "Details", icon: "bi-journal-text" },
      { number: 2, label: "Info", icon: "bi-sliders" },
      { number: 3, label: "Files", icon: "bi-cloud-upload" },
      { number: 4, label: "Review", icon: "bi-check2-circle" },
    ];

  // we can also define the grade options based on the selected level to make it more dynamic
  const GRADE_OPTIONS = {
    "Pre-Primary": ["PP1", "PP2"],
    "Primary": ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"],
    "Junior School": ["Grade 7", "Grade 8", "Grade 9"],
  };


  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: materialToEdit?.title || "",
    type: materialToEdit?.type || "",
    level: materialToEdit?.level || "",
    grade: materialToEdit?.grade || "",
    subject: materialToEdit?.subject || "",
    term: materialToEdit?.term || "",
    year: materialToEdit?.year || "",
    isFree: materialToEdit?.isFree ?? true,
    price: materialToEdit?.price || "",
    agreement: false,
  });

  const [file, setFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "isFree" && checked ? { price: "" } : {}),
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    if (errors.file) setErrors((prev) => ({ ...prev, file: "" }));
  };

  const handleImageChange = (e) => {
    setCoverImage(e.target.files[0]);
    if (errors.coverImage) setErrors((prev) => ({ ...prev, coverImage: "" }));
  };

  const handleLevelChange = (e) => {
    // update the level
    handleChange(e);

    // clear grade — selected grade may not exist in the new level
    handleChange({ target: { name: "grade", value: "" } });
  };

  const handleNext = () => {
    const stepErrors = validateUpload(step, formData, file, coverImage);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const authToken = token || localStorage.getItem("token");
    const lastStep = isEditMode ? 3 : 4;
    const stepErrors = validateUpload(lastStep, formData, file, coverImage, isEditMode);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setIsLoading(true);

    try {
      if (isEditMode) {
        await updateMaterial(materialToEdit._id, formData, authToken);
        toast.success("Material updated successfully");
      } else {
        await uploadMaterial(formData, file, coverImage, authToken);
        // toast.success("Material uploaded! It will be reviewed before publishing.");
      }

      // reset the form
      setFormData({
        title: "", type: "", level: "", grade: "",
        subject: "", term: "", year: "",
        isFree: true, price: "", agreement: false,
      });
      setFile(null);
      setCoverImage(null);
      setStep(1);

      onSuccess?.();

    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="upload-card shadow-sm">

      {/* ── Step indicator ──────────────────────────────────── */}
      <div className="upload-steps-header">
        {STEPS.map((s, idx) => (
          <div key={s.number} className="upload-step-item">
            <div className={`upload-step-circle ${step > s.number ? "step-done" :
              step === s.number ? "step-active" : "step-idle"
              }`}>
              {step > s.number
                ? <i className="bi bi-check-lg"></i>
                : <i className={`bi ${s.icon}`}></i>
              }
            </div>
            <span className={`upload-step-label ${step === s.number ? "label-active" : ""}`}>
              {s.label}
            </span>
            {idx < STEPS.length - 1 && (
              <div className={`upload-step-line ${step > s.number ? "line-done" : ""}`} />
            )}
          </div>
        ))}
      </div>

      {/* ── Progress bar ────────────────────────────────────── */}
      <div className="upload-progress-bar mb-4">
        <div
          className="upload-progress-fill"
          style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
        />
      </div>

      <form onSubmit={handleSubmit} noValidate>

        {/* ════════════════════════════════════════════════════
            STEP 1 — Material Details
        ════════════════════════════════════════════════════ */}
        {step === 1 && (
          <>
            <h6 className="upload-step-title">
              <i className="bi bi-journal-text me-2 text-warning"></i>
              Material Details
            </h6>
            <p className="upload-step-sub">Tell us what this material is about</p>

            <div className="mb-3">
              <label className="form-label required">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Grade 4 Mathematics Term 1 Revision"
                className={`form-control ${errors.title ? "is-invalid" : ""}`}
              />
              {errors.title && <div className="invalid-feedback">{errors.title}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label required">Material Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`form-select ${errors.type ? "is-invalid" : ""}`}
              >
                <option value="">Select type</option>
                <option value="Revision Materials">Revision Materials</option>
                <option value="Exam Paper">Exam Paper</option>
                <option value="Schemes of work">Schemes of work</option>
                <option value="Lesson Plans">Lesson Plans</option>
              </select>
              {errors.type && <div className="invalid-feedback">{errors.type}</div>}
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label required">Education Level</label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleLevelChange}
                  className={`form-select ${errors.level ? "is-invalid" : ""}`}
                >
                  <option value="">Select level</option>
                  <option value="Pre-Primary">Pre-Primary</option>
                  <option value="Primary">Primary</option>
                  <option value="Junior School">Junior School</option>
                </select>
                {errors.level && <div className="invalid-feedback">{errors.level}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label required">Grade</label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  disabled={!formData.level}
                  className={`form-select ${errors.grade ? "is-invalid" : ""}`}
                >
                  <option value="">
                    {formData.level ? "Select grade" : "Select level first"}
                  </option>
                  {(GRADE_OPTIONS[formData.level] || []).map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                {errors.grade && <div className="invalid-feedback">{errors.grade}</div>}
              </div>
            </div>
          </>
        )}

        {/* ════════════════════════════════════════════════════
            STEP 2 — More Info
        ════════════════════════════════════════════════════ */}
        {step === 2 && (
          <>
            <h6 className="upload-step-title">
              <i className="bi bi-sliders me-2 text-warning"></i>
              Additional Information
            </h6>
            <p className="upload-step-sub">Subject, term, year and pricing</p>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label required">Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`form-select ${errors.subject ? "is-invalid" : ""}`}
                >
                  <option value="">Select subject</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="English">English</option>
                  <option value="Kiswahili">Kiswahili</option>
                  <option value="Science">Science</option>
                  <option value="SST">SST</option>
                  <option value="CRE">CRE</option>
                  <option value="IRE">IRE</option>
                  <option value="Creative Arts">Creative Arts</option>
                  <option value="Physical Education">Physical Education</option>
                </select>
                {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label required">Term</label>
                <select
                  name="term"
                  value={formData.term}
                  onChange={handleChange}
                  className={`form-select ${errors.term ? "is-invalid" : ""}`}
                >
                  <option value="">Select term</option>
                  <option value="Term 1">Term 1</option>
                  <option value="Term 2">Term 2</option>
                  <option value="Term 3">Term 3</option>
                </select>
                {errors.term && <div className="invalid-feedback">{errors.term}</div>}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label required">Year</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className={`form-select ${errors.year ? "is-invalid" : ""}`}
              >
                <option value="">Select year</option>
                {years.map((y) => (
                  <option key={y} value={String(y)}>{y}</option>
                ))}
              </select>
              {errors.year && <div className="invalid-feedback">{errors.year}</div>}
            </div>

            {/* Pricing */}
            <div className="upload-pricing-box mb-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="fw-semibold">Pricing</span>
                <div className="form-check form-switch mb-0">
                  <input
                    type="checkbox"
                    name="isFree"
                    id="isFreeSwitch"
                    checked={formData.isFree}
                    onChange={handleChange}
                    className="form-check-input"
                    role="switch"
                  />
                  <label htmlFor="isFreeSwitch" className="form-check-label fw-semibold">
                    {formData.isFree
                      ? <span className="text-success">Free</span>
                      : <span className="text-warning">Paid</span>
                    }
                  </label>
                </div>
              </div>

              {formData.isFree ? (
                <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>
                  <i className="bi bi-info-circle me-1"></i>
                  This material will be available for free download
                </p>
              ) : (
                <div>
                  <div className="input-group">
                    <span className="input-group-text">KES</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="e.g. 50"
                      min="10"
                      className={`form-control ${errors.price ? "is-invalid" : ""}`}
                    />
                  </div>
                  {errors.price && (
                    <div className="invalid-feedback d-block">{errors.price}</div>
                  )}
                  <small className="text-muted">Minimum KES 10. Users pay before downloading.</small>
                </div>
              )}
            </div>
          </>
        )}

        {/* ════════════════════════════════════════════════════
            STEP 3 — Upload Files
        ════════════════════════════════════════════════════ */}
        {step === 3 && !isEditMode && (
          <>
            <h6 className="upload-step-title">
              <i className="bi bi-cloud-upload me-2 text-warning"></i>
              Upload Files
            </h6>
            <p className="upload-step-sub">Upload the document and an optional cover image</p>

            {/* Document */}
            <div className="mb-3">
              <label className="form-label required">Document</label>
              <div className={`upload-box ${errors.file ? "upload-box-error" : file ? "upload-box-success" : ""}`}>
                <i className={`bi ${file ? "bi-file-earmark-check" : "bi-file-earmark-text"} upload-icon`}
                  style={{ color: file ? "#198754" : "#ffc107" }}
                ></i>
                <p className="mb-1">{file ? file.name : "Click or drag your document here"}</p>
                <small className="text-muted">
                  {file ? formatSize(file.size) : "PDF or Word — max 10MB"}
                </small>
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
              </div>
              {errors.file && (
                <div className="text-danger mt-1" style={{ fontSize: "0.85rem" }}>
                  <i className="bi bi-exclamation-circle me-1"></i>{errors.file}
                </div>
              )}
            </div>

            {/* Cover image */}
            <div className="mb-3">
              <label className="form-label">
                Cover Image <span className="text-muted">(Optional)</span>
              </label>
              <div className={`upload-box ${errors.coverImage ? "upload-box-error" : coverImage ? "upload-box-success" : ""}`}>
                <i className={`bi ${coverImage ? "bi-image-fill" : "bi-image"} upload-icon`}
                  style={{ color: coverImage ? "#198754" : "#ffc107" }}
                ></i>
                <p className="mb-1">{coverImage ? coverImage.name : "Click or drag your cover image here"}</p>
                <small className="text-muted">
                  {coverImage ? formatSize(coverImage.size) : "JPG, JPEG or PNG — max 2MB"}
                </small>
                <input type="file" accept=".jpg,.jpeg,.png" onChange={handleImageChange} />
              </div>
              {errors.coverImage && (
                <div className="text-danger mt-1" style={{ fontSize: "0.85rem" }}>
                  <i className="bi bi-exclamation-circle me-1"></i>{errors.coverImage}
                </div>
              )}
            </div>
          </>
        )}

        {/* ════════════════════════════════════════════════════
            STEP 4 — Review & Submit
        ════════════════════════════════════════════════════ */}
        {((isEditMode && step === 3) || (!isEditMode && step === 4)) && (
          <>
            <h6 className="upload-step-title">
              <i className="bi bi-check2-circle me-2 text-warning"></i>
              {isEditMode ? "Review Changes" : "Review & Submit"}
            </h6>
            <p className="upload-step-sub">
              {isEditMode
                ? "Confirm your changes before saving"
                : "Confirm everything looks correct before submitting"
              }
            </p>

            <div className="upload-summary">
              {[
                { label: "Title", value: formData.title },
                { label: "Type", value: formData.type },
                { label: "Level", value: formData.level },
                { label: "Grade", value: formData.grade },
                { label: "Subject", value: formData.subject },
                { label: "Term", value: formData.term },
                { label: "Year", value: formData.year },
                {
                  label: "Pricing",
                  value: formData.isFree ? "Free" : `KES ${formData.price}`,
                },
                ...(!isEditMode ? [
                  { label: "Document", value: file ? `${file.name} (${formatSize(file.size)})` : "—" },
                  { label: "Cover Image", value: coverImage ? `${coverImage.name} (${formatSize(coverImage.size)})` : "Not provided" },
                ] : []),
              ].map(({ label, value }) => (
                <div key={label} className="upload-summary-row">
                  <span className="upload-summary-label">{label}</span>
                  <span className="upload-summary-value">{value}</span>
                </div>
              ))}
            </div>

            {!isEditMode && (
              <div className={`form-check mt-3 mb-2 ${errors.agreement ? "text-danger" : ""}`}>
                <input
                  type="checkbox"
                  name="agreement"
                  id="agreementCheck"
                  checked={formData.agreement}
                  onChange={handleChange}
                  className={`form-check-input ${errors.agreement ? "is-invalid" : ""}`}
                />
                <label className="form-check-label" htmlFor="agreementCheck">
                  I confirm this is my own work and agree to the upload guidelines
                </label>
                {errors.agreement && (
                  <div className="invalid-feedback d-block">{errors.agreement}</div>
                )}
              </div>
            )}
          </>
        )}

        {/* ── Navigation buttons ───────────────────────────── */}
        <div className="d-flex gap-2 mt-4">
          {step > 1 && (
            <button
              type="button"
              className="btn btn-outline-secondary flex-fill"
              onClick={handleBack}
              disabled={isLoading}
            >
              <i className="bi bi-arrow-left me-1"></i> Back
            </button>
          )}

          {step < (isEditMode ? 3 : 4) && (
            <button type="button" className="btn btn-warning flex-fill" onClick={handleNext}>
              Next <i className="bi bi-arrow-right ms-1"></i>
            </button>
          )}

          {step === (isEditMode ? 3 : 4) && (
            <button type="submit" className="btn upload-materials flex-fill" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  {isEditMode ? "Saving..." : "Uploading..."}
                </>
              ) : isEditMode ? (
                <><i className="bi bi-check-lg me-2"></i>Save Changes</>
              ) : (
                <><i className="bi bi-cloud-upload me-2"></i>Submit Material</>
              )}
            </button>
          )}
        </div>

      </form>
    </div>
  );
}

export default UploadForm;