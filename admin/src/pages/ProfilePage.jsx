import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ProfileImageUpload from "../components/ProfileImageUpload.jsx";

function formatRole(role) {
  return role === "admin" ? "Administrator" : "Customer";
}

function formatDate(value) {
  if (!value) return "Not set";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "Not set";
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function InfoCard({ label, value }) {
  return (
    <div className="profile-info-card">
      <span className="profile-info-label">{label}</span>
      <span className="profile-info-value">{value}</span>
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [dob, setDob] = useState(user?.dob ? new Date(user.dob).toISOString().split("T")[0] : "");
  const [fieldErrors, setFieldErrors] = useState({});
  const [banner, setBanner] = useState("");
  const [pending, setPending] = useState(false);
  const [editing, setEditing] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFieldErrors({});
    setBanner("");
    setPending(true);
    try {
      await updateProfile(name, email, phone, dob);
      setEditing(false);
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
    <main className="profile-page">
      {/* ─── Profile Header ─────────────────────────────────────────────── */}
      <section className="profile-header-section">
        <div className="profile-header-card">
          <div className="profile-avatar">
            <ProfileImageUpload user={user} onUpdate={() => window.location.reload()} />
          </div>
          <div className="profile-header-info">
            <h1 className="profile-header-name">{user?.name}</h1>
            <span className="profile-header-role">{formatRole(user?.role)}</span>
          </div>
          <div className="profile-header-actions">
            {!editing && (
              <>
                <button
                  type="button"
                  className="profile-btn profile-btn-primary"
                  onClick={() => setEditing(true)}
                  disabled={pending}
                >
                  Edit Profile
                </button>
                <button
                  type="button"
                  className="profile-btn profile-btn-ghost"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ─── Edit Form ──────────────────────────────────────────────────── */}
      {editing && (
        <section className="profile-edit-section">
          <form className="profile-edit-form" onSubmit={handleSubmit} noValidate>
            <h2 className="profile-edit-title">Edit Profile</h2>
            {banner && <p className="profile-banner">{banner}</p>}

            <label className="profile-edit-field">
              <span>Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                disabled={pending}
              />
              {fieldErrors.name && <span className="auth-error">{fieldErrors.name}</span>}
            </label>

            <label className="profile-edit-field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={pending}
              />
              {fieldErrors.email && <span className="auth-error">{fieldErrors.email}</span>}
            </label>

            <label className="profile-edit-field">
              <span>Phone</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={pending}
              />
              {fieldErrors.phone && <span className="auth-error">{fieldErrors.phone}</span>}
            </label>

            <label className="profile-edit-field">
              <span>Date of Birth</span>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                disabled={pending}
              />
              {fieldErrors.dob && <span className="auth-error">{fieldErrors.dob}</span>}
            </label>

            <div className="profile-edit-actions">
              <button type="submit" disabled={pending}>
                {pending ? "Saving…" : "Save changes"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                disabled={pending}
                className="btn-ghost"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* ─── Info Cards Grid ────────────────────────────────────────────── */}
      {!editing && (
        <section className="profile-grid">
          <InfoCard label="Full Name" value={user?.name ?? "—"} />
          <InfoCard label="Email Address" value={user?.email ?? "—"} />
          <InfoCard label="Phone Number" value={user?.phone || "Not set"} />
          <InfoCard label="Date of Birth" value={formatDate(user?.dob)} />
          <InfoCard label="Role" value={formatRole(user?.role)} />
          {user?.address && <InfoCard label="Address" value={user.address} />}
          {user?.gender && <InfoCard label="Gender" value={user.gender} />}
          {user?.status && <InfoCard label="Account Status" value={user.status} />}
          {user?.createdAt && (
            <InfoCard label="Joined" value={formatDate(user.createdAt)} />
          )}
        </section>
      )}
    </main>
  );
}
