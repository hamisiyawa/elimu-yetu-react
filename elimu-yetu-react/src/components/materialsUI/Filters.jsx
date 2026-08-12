// Grade options mapped to each education level
const GRADE_OPTIONS = {
  "Pre-Primary": ["PP1", "PP2"],
  "Primary":     ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"],
  "Junior School": ["Grade 7", "Grade 8", "Grade 9"],
};

function Filters({ filters, handleChange }) {

  // get grades for the currently selected level
  // if no level selected show all grades flattened
  const gradeOptions = filters.level
    ? GRADE_OPTIONS[filters.level] || []
    : Object.values(GRADE_OPTIONS).flat();

  // when level changes we also need to clear the grade
  // because the previously selected grade may not exist in the new level
  const handleLevelChange = (e) => {
    // fire the normal handleChange for level
    handleChange(e);

    // then fire a synthetic event to clear grade
    handleChange({
      target: { name: "grade", value: "" },
    });
  };

  return (
    <div className="row input-row mb-3 py-4 g-3">

      {/* Material Type */}
      <div className="col-12 col-md-6 col-lg-2">
        <select
          name="type"
          value={filters.type}
          className="form-select"
          onChange={handleChange}
        >
          <option value="">Material type</option>
          <option value="Revision Materials">Revision Materials</option>
          <option value="Exam Paper">Exam Paper</option>
          <option value="Schemes of work">Schemes of work</option>
          <option value="Lesson Plans">Lesson Plans</option>
        </select>
      </div>

      {/* Education Level */}
      <div className="col-12 col-md-6 col-lg-2">
        <select
          name="level"
          value={filters.level}
          className="form-select"
          onChange={handleLevelChange}
        >
          <option value="">Education level</option>
          <option value="Pre-Primary">Pre-Primary</option>
          <option value="Primary">Primary</option>
          <option value="Junior School">Junior School</option>
        </select>
      </div>

      {/* Grade — options depend on selected level */}
      <div className="col-12 col-md-6 col-lg-2">
        <select
          name="grade"
          value={filters.grade}
          className="form-select"
          onChange={handleChange}
          disabled={!filters.level}
        >
          <option value="">
            {filters.level ? "Class level" : "Select level first"}
          </option>
          {gradeOptions.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Subject */}
      <div className="col-12 col-md-6 col-lg-2">
        <select
          name="subject"
          value={filters.subject}
          className="form-select"
          onChange={handleChange}
        >
          <option value="">Subject</option>
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
      </div>

      {/* Year */}
      <div className="col-12 col-md-6 col-lg-2">
        <select
          name="year"
          value={filters.year}
          className="form-select"
          onChange={handleChange}
        >
          <option value="">Year</option>
          {Array.from(
            { length: new Date().getFullYear() - 2019 },
            (_, i) => new Date().getFullYear() - i
          ).map((y) => (
            <option key={y} value={String(y)}>{y}</option>
          ))}
        </select>
      </div>

      {/* Term */}
      <div className="col-12 col-md-6 col-lg-2">
        <select
          name="term"
          value={filters.term}
          className="form-select"
          onChange={handleChange}
        >
          <option value="">Term</option>
          <option value="Term 1">Term 1</option>
          <option value="Term 2">Term 2</option>
          <option value="Term 3">Term 3</option>
        </select>
      </div>

    </div>
  );
}

export default Filters;