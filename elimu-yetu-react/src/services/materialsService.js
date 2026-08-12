// const API_URL = "http://localhost:5000/api/materials";
const API_URL = `${import.meta.env.VITE_API_URL}/api/materials`;

// ── Fetch all materials with filters and pagination ───────────
export const fetchMaterials = async (filters = {}, page = 1, limit = 10) => {

  // Build query string — only include filters that have a value
  const params = new URLSearchParams();

  if (filters.level)   params.append("level",   filters.level);
  if (filters.grade)   params.append("grade",   filters.grade);
  if (filters.subject) params.append("subject", filters.subject);
  if (filters.term)    params.append("term",    filters.term);
  if (filters.year)    params.append("year",    filters.year);
  if (filters.type)    params.append("type",    filters.type);
  if (filters.search)  params.append("search",  filters.search);

  params.append("page",  page);
  params.append("limit", limit);

  const response = await fetch(`${API_URL}?${params.toString()}`);
  const data     = await response.json();

  if (!response.ok) throw new Error(data.message || "Failed to fetch materials");

  return data; // { materials, page, totalPages, total }
};

// ── Fetch new materials — uploaded within the last 7 days ─────
export const fetchNewMaterials = async (limit = 10) => {
  const params = new URLSearchParams();
  params.append("sort",  "new");
  params.append("limit", limit);
  params.append("page",  1);

  const response = await fetch(`${API_URL}?${params.toString()}`);
  const data     = await response.json();

  if (!response.ok) throw new Error(data.message || "Failed to fetch new materials");

  return data; // { materials, total, ... }
};

// ── Fetch most downloaded — sorted by download count ─────────
export const fetchMostDownloaded = async (limit = 10) => {
  const params = new URLSearchParams();
  params.append("sort",  "downloads");
  params.append("limit", limit);
  params.append("page",  1);

  const response = await fetch(`${API_URL}?${params.toString()}`);
  const data     = await response.json();

  if (!response.ok) throw new Error(data.message || "Failed to fetch most downloaded");

  return data; // { materials, total, ... }
};

// ── Log a download and get the file URL ──────────────────────
export const logDownload = async (materialId, token = null) => {

  const headers = {};

  // only attach token if the user is logged in
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${API_URL}/${materialId}/download`, {
    method: "POST",
    headers,
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message || "Download failed");

  return data; // { fileUrl, title }
};

// ── Upload a new material (teacher only) ─────────────────────
export const uploadMaterial = async (formData, file, coverImage, token) => {

  // Use FormData — required for multipart/form-data file uploads
  const form = new FormData();

  form.append("title",   formData.title);
  form.append("type",    formData.type);
  form.append("level",   formData.level);
  form.append("grade",   formData.grade);
  form.append("subject", formData.subject);
  form.append("term",    formData.term);
  form.append("year",    formData.year);
  form.append("isFree",  formData.isFree);

  if (!formData.isFree && formData.price) {
    form.append("price", formData.price);
  }

  // Append the actual file objects
  form.append("file", file);

  if (coverImage) {
    form.append("coverImage", coverImage);
  }

  const response = await fetch(API_URL, {
    method:  "POST",
    headers: { "Authorization": `Bearer ${token}` },
    // Do NOT set Content-Type manually — browser sets it automatically
    // with the correct multipart boundary when body is FormData
    body: form,
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message || "Upload failed");

  return data; // { message, material }
};

// ── Get teacher's own materials ───────────────────────────────
export const fetchMyMaterials = async (token) => {

  const response = await fetch(`${API_URL}/my`, {
    headers: { "Authorization": `Bearer ${token}` },
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message || "Failed to fetch your materials");

  return data; // { materials }
};

// ── Update a pending material ─────────────────────────────────
export const updateMaterial = async (materialId, formData, token) => {
  const response = await fetch(`${API_URL}/${materialId}`, {
    method:  "PATCH",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      title:   formData.title,
      type:    formData.type,
      level:   formData.level,
      grade:   formData.grade,
      subject: formData.subject,
      term:    formData.term,
      year:    formData.year,
      isFree:  formData.isFree,
      price:   formData.price,
    }),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message || "Update failed");

  return data;
};

// ── Delete a pending or rejected material ─────────────────────
export const deleteMaterial = async (materialId, token) => {
  const response = await fetch(`${API_URL}/${materialId}`, {
    method:  "DELETE",
    headers: { "Authorization": `Bearer ${token}` },
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message || "Delete failed");

  return data;
};

// ── Get all pending materials (admin only) ────────────────────
export const fetchPendingMaterials = async (token) => {
  const response = await fetch(`${API_URL}/pending`, {
    headers: { "Authorization": `Bearer ${token}` },
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message || "Failed to fetch pending materials");

  return data; // { materials, total }
};

// ── Approve or reject a material (admin only) ──────────────────
export const updateMaterialStatus = async (materialId, status, rejectionReason, token) => {
  const response = await fetch(`${API_URL}/${materialId}/status`, {
    method:  "PATCH",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ status, rejectionReason }),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message || "Failed to update material status");

  return data; // { message, material }
};