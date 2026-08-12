function Pagination({
  currentPage,
  totalPages,
  getPagination,
  handlePageChange,
}) {
  return (
    <div className="row py-4">
      <div className="col d-flex justify-content-center">

        <div className="pagination-container">

          {/* Previous */}
          <button
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            «
          </button>

          {/* Page Numbers */}
          {getPagination().map((page, index) =>
            page === "..." ? (
              <span key={index} className="dots">...</span>
            ) : (
              <button
                key={index}
                className={`page-btn ${currentPage === page ? "active" : ""}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            )
          )}

          {/* Next */}
          <button
            className="page-btn"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            »
          </button>

        </div>

      </div>
    </div>
  );
}

export default Pagination;