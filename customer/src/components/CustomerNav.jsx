import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function CustomerNav() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    setOpen(false);
    await logout();
    navigate("/login");
  }

  return (
    <header className="customer-nav">
      <button
        className="customer-nav-toggle"
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>
      <Link to="/shop" className="customer-nav-brand">
        <img src="/logo-new.png" alt="VELORA" style={{ height: 26, width: "auto", verticalAlign: "middle", marginRight: 8 }} />
        VELORA
      </Link>
      <nav className={`customer-nav-links ${open ? "open" : ""}`}>
        <Link to="/shop" onClick={() => setOpen(false)}>Shop</Link>
        <Link to="/cart" onClick={() => setOpen(false)}>Cart</Link>
        <Link to="/orders" onClick={() => setOpen(false)}>Orders</Link>
        <Link to="/profile" onClick={() => setOpen(false)}>Profile</Link>
        <button type="button" onClick={handleLogout}>Logout</button>
      </nav>
    </header>
  );
}