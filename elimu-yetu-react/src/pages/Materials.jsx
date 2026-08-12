import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useFilters from "../hooks/useFilters";
import usePagination from "../hooks/usePagination";
import Filters from "../components/materialsUI/Filters";
import SearchBar from "../components/materialsUI/SearchBar";
import MaterialsGrid from "../components/materialsUI/MaterialsGrid";
import Pagination from "../components/materialsUI/Pagination";
import EmptyState from "../components/materialsUI/EmptyState";
import { fetchMaterials } from "../services/materialsService";

function Materials() {
  const [materials,  setMaterials]  = useState([]);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading,  setIsLoading]  = useState(true);
  const [error,      setError]      = useState(null);

  const { filters, handleChange, handleReset } = useFilters();

  const {
    currentPage,
    setCurrentPage,
    getPagination,
    handlePageChange,
  } = usePagination();

  // fetch whenever filters or page changes
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchMaterials(filters, currentPage, 10);
        setMaterials(data.materials);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [filters, currentPage]);

  // when a filter changes reset to page 1
  // so the user does not land on a page that no longer exists
  const handleFilterChange = (e) => {
    handleChange(e);
    setCurrentPage(1);
  };

  const handleFilterReset = () => {
    handleReset();
    setCurrentPage(1);
  };

  return (
    <>
      <Navbar />

      <div className="container-fluid materials-section">

        <Filters
          filters={filters}
          handleChange={handleFilterChange}
        />

        <SearchBar
          filters={filters}
          handleChange={handleFilterChange}
          handleReset={handleFilterReset}
        />

        {/* Breadcrumb + result count */}
        <div className="row">
          <div className="col-12">
            <p style={{ fontSize: "0.9rem", color: "#6c757d" }}>
              {filters.type    || "All"} / {filters.level   || "All"} /
              {filters.grade   || "All"} / {filters.subject || "All"} /
              {filters.year    || "All"} / {filters.term    || "All"}
              {total > 0 && (
                <span className="ms-2 text-warning">({total} results)</span>
              )}
            </p>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted mt-2" style={{ fontSize: "0.875rem" }}>
              Loading materials...
            </p>
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="text-center py-4">
            <p className="text-danger mb-2">{error}</p>
            <button
              className="btn btn-sm btn-outline-warning"
              onClick={handleFilterReset}
            >
              Try again
            </button>
          </div>
        )}

        {/* Results */}
        {!isLoading && !error && (
          materials.length > 0
            ? <MaterialsGrid items={materials} />
            : <EmptyState onReset={handleFilterReset} />
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            getPagination={() => getPagination(totalPages)}
            handlePageChange={handlePageChange}
          />
        )}

      </div>

      <Footer />
    </>
  );
}

export default Materials;