import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [banner, setBanner] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setFieldErrors({});
    setBanner("");
    setPending(true);
    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser?.role === "admin") navigate("/admin");
      else navigate("/shop");
    } catch (err) {
      if (err.errors) {
        const byField = {};
        for (const { field, message } of err.errors) {
          byField[field] = message;
        }
        setFieldErrors(byField);
      } else {
        setBanner(err.message);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="auth-page" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <img src="/assets/velora-logo.png" alt="VELORA" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.12, pointerEvents: "none", zIndex: 0, filter: "grayscale(0.6)" }} />
      <form className="auth-card" onSubmit={handleSubmit} noValidate style={{ position: "relative", zIndex: 1 }}>
        <h1>Log in</h1>
        {banner && <p className="auth-banner">{banner}</p>}
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {fieldErrors.email && (
            <span className="auth-error">{fieldErrors.email}</span>
          )}
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          {fieldErrors.password && (
            <span className="auth-error">{fieldErrors.password}</span>
          )}
        </label>
        <button type="submit" disabled={pending}>
          {pending ? "Logging in…" : "Log in"}
        </button>
        <a href="/api/auth/google" className="btn-secondary" style={{ display: "block", textAlign: "center", marginTop: 8 }}>
          Continue with Google
        </a>
        <p className="auth-switch">
          No account? <Link to="/register">Register</Link>
        </p>
      </form>
    </main>
  );
}
