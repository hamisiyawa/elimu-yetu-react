function SearchBar({ filters, handleChange, handleReset }) {
  return (
    <div className="row">
      <div className="col-lg-4">

        <div className="input-group search-group shadow-sm mb-2">

          <input
            type="search"
            name="search"
            value={filters.search}
            className="form-control search-input"
            placeholder="Search Materials..."
            onChange={handleChange}
          />

          <button
            className="btn search-btn d-flex align-items-center gap-2"
            onClick={handleReset}
            disabled={Object.values(filters).every(val => val === "")}
          >
            <i className="bi bi-arrow-clockwise"></i>
            <span className="d-none d-md-inline">Reset</span>
          </button>

        </div>

      </div>
    </div>
  );
}

export default SearchBar;