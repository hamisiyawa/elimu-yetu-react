import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import {
  fetchAllUsers,
  verifyUserManually,
  toggleUserSuspend,
  createAdminAccount,
} from "../../services/authService";
import SuspendUserModal from "../../components/dashboard/SuspendUserModal";
import CreateAdminModal from "../../components/dashboard/CreateAdminModal";

function ManageUsers() {
  const { token } = useAuth();

  const [users,       setUsers]       = useState([]);
  const [isLoading,   setIsLoading]   = useState(true);
  const [error,       setError]       = useState(null);
  const [page,        setPage]        = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);

  const [search, setSearch] = useState("");
  const [role,   setRole]   = useState("");
  const [status, setStatus] = useState("");

  const [processingId, setProcessingId] = useState(null);
  const [suspendingUser, setSuspendingUser] = useState(null);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAllUsers(token, { page, search, role, status });
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, page, role, status]);

  // Debounce search — avoid firing a request on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      if (token) loadUsers();
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleVerify = async (user) => {
    setProcessingId(user._id);
    try {
      await verifyUserManually(token, user._id);
      toast.success(`${user.name}'s account verified`);
      setUsers((prev) => prev.map((u) => u._id === user._id ? { ...u, isVerified: true } : u));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleSuspendClick = (user) => {
    if (user.isSuspended) {
      handleUnsuspend(user);
    } else {
      setSuspendingUser(user);
    }
  };

  const handleUnsuspend = async (user) => {
    setProcessingId(user._id);
    try {
      const data = await toggleUserSuspend(token, user._id);
      toast.success(data.message);
      setUsers((prev) => prev.map((u) => u._id === user._id ? { ...u, isSuspended: false } : u));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleSuspendConfirm = async (reason) => {
    setProcessingId(suspendingUser._id);
    try {
      const data = await toggleUserSuspend(token, suspendingUser._id, reason);
      toast.success(data.message);
      setUsers((prev) => prev.map((u) =>
        u._id === suspendingUser._id ? { ...u, isSuspended: true, suspendReason: reason } : u
      ));
      setSuspendingUser(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCreateAdmin = async (formData) => {
    setIsCreatingAdmin(true);
    try {
      await createAdminAccount(token, formData);
      toast.success("Admin account created");
      setShowCreateAdmin(false);
      loadUsers();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  return (
    <div>

      {/* HEADER */}
      <div className="manage-materials-header mb-4">
        <div>
          <h3 className="fw-bold mb-1">Manage Users</h3>
          <p className="text-muted mb-0">
            View, verify, and moderate every account on the platform
          </p>
        </div>
        <button className="btn btn-warning fw-semibold" onClick={() => setShowCreateAdmin(true)}>
          <i className="bi bi-person-plus me-2"></i>
          Add Admin
        </button>
      </div>

      {/* FILTERS */}
      <div className="row g-2 mb-4">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, phone, username, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }}>
            <option value="">All roles</option>
            <option value="student">Student</option>
            <option value="parent">Parent</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="col-md-4">
          <select className="form-select" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="unverified">Unverified</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* LOADING */}
      {isLoading && (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* ERROR */}
      {error && !isLoading && (
        <div className="alert alert-danger">
          {error}
          <button className="btn btn-sm btn-outline-danger ms-2" onClick={loadUsers}>Retry</button>
        </div>
      )}

           {/* TABLE — desktop only */}
      {!isLoading && !error && (
        <div className="table-responsive dashboard-table d-none d-md-block">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No users match these filters
                  </td>
                </tr>
              ) : users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>
                    {u.phone}
                    {u.username && <div className="text-muted" style={{ fontSize: "0.8rem" }}>@{u.username}</div>}
                  </td>
                  <td>
                    <span className="dashboard-badge" style={{ textTransform: "capitalize" }}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    {u.isSuspended ? (
                      <span className="badge bg-danger">Suspended</span>
                    ) : u.isVerified ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-secondary">Unverified</span>
                    )}
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="text-end">
                    <div className="d-flex gap-2 justify-content-end">
                      {!u.isVerified && (
                        <button
                          className="btn btn-sm btn-outline-success"
                          disabled={processingId === u._id}
                          onClick={() => handleVerify(u)}
                          title="Manually verify — for users who never received their OTP"
                        >
                          <i className="bi bi-patch-check"></i>
                        </button>
                      )}
                      <button
                        className={`btn btn-sm ${u.isSuspended ? "btn-outline-success" : "btn-outline-danger"}`}
                        disabled={processingId === u._id}
                        onClick={() => handleSuspendClick(u)}
                        title={u.isSuspended ? "Reinstate account" : "Suspend account"}
                      >
                        <i className={`bi ${u.isSuspended ? "bi-arrow-counterclockwise" : "bi-slash-circle"}`}></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MOBILE CARDS */}
      {!isLoading && !error && (
        <div className="d-md-none mobile-users-list">
          {users.length === 0 ? (
            <p className="text-center text-muted py-4">No users match these filters</p>
          ) : users.map((u) => (
            <div key={u._id} className="mobile-user-card">

              <div className="mobile-user-card-top">
                <div style={{ minWidth: 0 }}>
                  <p className="mobile-card-subject mb-1">{u.name}</p>
                  <p className="mobile-card-level mb-0">{u.phone}</p>
                  {u.username && <p className="mobile-card-level mb-0">@{u.username}</p>}
                </div>
                <span className="dashboard-badge" style={{ textTransform: "capitalize", flexShrink: 0 }}>
                  {u.role}
                </span>
              </div>

              <div className="mobile-user-card-bottom">
                <div>
                  {u.isSuspended ? (
                    <span className="badge bg-danger">Suspended</span>
                  ) : u.isVerified ? (
                    <span className="badge bg-success">Active</span>
                  ) : (
                    <span className="badge bg-secondary">Unverified</span>
                  )}
                  <div className="text-muted mt-1" style={{ fontSize: "0.75rem" }}>
                    Joined {new Date(u.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="d-flex gap-2">
                  {!u.isVerified && (
                    <button
                      className="btn btn-sm btn-outline-success"
                      disabled={processingId === u._id}
                      onClick={() => handleVerify(u)}
                      title="Manually verify"
                    >
                      <i className="bi bi-patch-check"></i>
                    </button>
                  )}
                  <button
                    className={`btn btn-sm ${u.isSuspended ? "btn-outline-success" : "btn-outline-danger"}`}
                    disabled={processingId === u._id}
                    onClick={() => handleSuspendClick(u)}
                    title={u.isSuspended ? "Reinstate account" : "Suspend account"}
                  >
                    <i className={`bi ${u.isSuspended ? "bi-arrow-counterclockwise" : "bi-slash-circle"}`}></i>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {!isLoading && totalPages > 1 && (
        <div className="d-flex justify-content-center gap-2 mt-4">
          <button className="page-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Prev
          </button>
          <span className="align-self-center text-muted">Page {page} of {totalPages}</span>
          <button className="page-btn" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      )}

      <SuspendUserModal
        show={!!suspendingUser}
        user={suspendingUser}
        onClose={() => setSuspendingUser(null)}
        onConfirm={handleSuspendConfirm}
        isSubmitting={processingId === suspendingUser?._id}
      />

      <CreateAdminModal
        show={showCreateAdmin}
        onClose={() => setShowCreateAdmin(false)}
        onConfirm={handleCreateAdmin}
        isSubmitting={isCreatingAdmin}
      />

    </div>
  );
}

export default ManageUsers;