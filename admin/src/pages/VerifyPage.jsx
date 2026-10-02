import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
export default function VerifyPage() {
  const [code, setCode] = useState("");
  const [time, setTime] = useState(30);
  const [err, setErr] = useState("");
  const { verifyCode, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (time <= 0) return;
    const t = setInterval(() => setTime(t => t - 1), 1000);
    return () => clearInterval(t);
  }, [time]);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      await verifyCode(code);
      navigate("/shop");
    } catch (e) {
      setErr(e.message || "Verification failed");
    }
  }

  return (
    <main className="auth-page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <div className="auth-card" style={{ width: 360 }}>
        <h1>Enter verification code</h1>
        <p>Code expires in: {String(Math.floor(time/60)).padStart(2,"0")}:{String(time%60).padStart(2,"0")}</p>
        {err && <p className="auth-banner" style={{ color: "#c00" }}>{err}</p>}
        <form onSubmit={submit}>
          <input value={code} onChange={e => setCode(e.target.value)} maxLength={6} placeholder="_ _ _ _ _ _" />
          <button type="submit">Verify</button>
        </form>
        <p><button type="button" onClick={() => window.location.href="/api/auth/resend-code"}>Resend code</button></p>
      </div>
    </main>
  );
}
