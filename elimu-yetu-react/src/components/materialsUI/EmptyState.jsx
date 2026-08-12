function EmptyState({ onReset }) {
  return (
    <div className="empty-state text-center w-100 py-5">
      <i className="bi bi-search display-4 mb-3"></i>
      <h5>No materials found</h5>
      <p>Try adjusting your filters</p>

      <button className="btn btn-warning mt-2" onClick={onReset}>
        Reset Filters
      </button>
    </div>
  );
}

export default EmptyState;