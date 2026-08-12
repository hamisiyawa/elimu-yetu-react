import { useState } from "react";

export default function usePagination() {
  const [currentPage, setCurrentPage] = useState(1);

  // totalPages is passed in from the API response
  const getPagination = (totalPages) => {
    const pages      = [];
    const maxVisible = 5;

    let start = Math.max(currentPage - 2, 1);
    let end   = Math.min(start + maxVisible - 1, totalPages);

    if (end - start < maxVisible - 1) {
      start = Math.max(end - maxVisible + 1, 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return { currentPage, setCurrentPage, getPagination, handlePageChange };
}