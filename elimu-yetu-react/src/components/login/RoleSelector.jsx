import { useSearchParams } from "react-router-dom";

function RoleSelector({ role, handleRoleChange }) {
  const [searchParams] = useSearchParams();
  const showAdmin = searchParams.get("admin") === "true";

  const roles = showAdmin
    ? ["student", "teacher", "parent", "admin"]
    : ["student", "teacher", "parent"];

  return (
    <div className="mb-3">
      <div className="d-flex justify-content-around flex-wrap gap-2">

        {roles.map((r) => (
          <button
            key={r}
            type="button"
            className={`btn btn-sm ${role === r ? "btn-warning" : "btn-outline-secondary"} me-2`}
            onClick={() => handleRoleChange(r)}
          >
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}

      </div>
    </div>
  );
}

export default RoleSelector;