import { useNavigate, useLocation } from "react-router-dom";
import "./Nav.css";

export default function Nav({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const role = user?.role || localStorage.getItem("userRole");

  const goTo = (path) => {
    if (location.pathname !== path) navigate(path);
  };

  return (
    <header className="nav-header">
      <div className="nav-brand" onClick={() => goTo("/home")}>
        <h2>Equipment Portal</h2>
      </div>

      <nav className="nav-right">
        {/* Common to all users */}
        <button onClick={() => goTo("/home")}>Home</button>

        {/* Student-only button */}
        {role === "student" && (
          <>
            <button onClick={() => goTo("/request")}>Request Equipment</button>
            <button onClick={() => goTo("/my-requests")}>My Requests</button>
          </>
        )}

        {/* Staff-only button */}
        {role === "staff" && (
          <button onClick={() => goTo("/review")}>Review Requests</button>
        )}

        {/* Admin-only buttons */}
        {role === "admin" && (
          <>
            <button onClick={() => goTo("/review")}>Review Requests</button>
            <button onClick={() => goTo("/inventory")}>Manage Inventory</button>
          </>
        )}

        {user ? (
          <>
            <span className="nav-role">
              Role: <strong>{role}</strong>
            </span>
            <button className="danger" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <span className="not-logged">Not logged in</span>
        )}
      </nav>
    </header>
  );
}