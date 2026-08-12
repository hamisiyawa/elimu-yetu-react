import { useState } from "react";

export default function useFilters(data) {
  const [filters, setFilters] = useState({
    type: "",
    level: "",
    grade: "",
    subject: "",
    year: "",
    term: "",
    search: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFilters({
      type: "",
      level: "",
      grade: "",
      subject: "",
      year: "",
      term: "",
      search: "",
    });
  };

  return { filters, handleChange, handleReset};
}