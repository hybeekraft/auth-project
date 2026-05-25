import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const joined = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="dashboard-page">
      <header className="dash-header">
        <span className="dash-logo">AuthApp</span>
        <button className="btn-ghost" onClick={handleLogout}>
          Sign out
        </button>
      </header>

      <main className="dash-main">
        <div className="dash-hero">
          <div className="avatar">{initials}</div>
          <div>
            <p className="dash-greeting">Good to see you,</p>
            <h1 className="dash-name">{user?.name}</h1>
          </div>
        </div>

        <div className="dash-cards">
          <div className="dash-card">
            <span className="card-label">Email</span>
            <span className="card-value">{user?.email}</span>
          </div>
          <div className="dash-card">
            <span className="card-label">Member since</span>
            <span className="card-value">{joined}</span>
          </div>
          <div className="dash-card">
            <span className="card-label">Account status</span>
            <span className="card-value status-active">● Active</span>
          </div>
        </div>

        <div className="dash-protected-note">
          <div className="lock-icon">🔒</div>
          <p>
            This is a <strong>protected route</strong>. Only authenticated users
            can see this page. Try opening it in a new tab after signing out —
            you'll be redirected to login.
          </p>
        </div>
      </main>
    </div>
  );
}
