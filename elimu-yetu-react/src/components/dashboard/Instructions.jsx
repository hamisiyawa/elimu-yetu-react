function Instructions() {
  return (
    <div className="instructions-card">

      {/* Header */}
      <div className="instructions-header">
        <i className="fa fa-info-circle"></i>

        <h5>
          Upload Instructions
        </h5>
      </div>

      {/* Instructions List */}
      <ol className="instructions-list">

        <li>
          Only PDF or Word documents are allowed
          <span>(Maximum size: 1MB)</span>
        </li>

        <li>
          Cover image must be JPG, JPEG, or PNG
          <span>(Maximum size: 1MB)</span>
        </li>

        <li>
          Ensure the cover image matches the uploaded content
        </li>

        <li>
          All materials are reviewed before publishing
        </li>

        <li>
          Complete all required fields before submission
        </li>

      </ol>

    </div>
  );
}

export default Instructions;