import { useState, useRef, useEffect } from "react";

export default function SearchSelect({ label, options, value, onChange, placeholder, disabled }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef();

  useEffect(() => {
    function click(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", click);
    return () => document.removeEventListener("mousedown", click);
  }, []);

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <div ref={ref} style={{ position: "relative", marginBottom: 14 }}>
      <label style={{ display: "block", fontWeight: 600, color: "#18221D", fontSize: 13, marginBottom: 6, letterSpacing: 0.02 }}>
        {label}
      </label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => { if (!disabled) { setOpen(!open); setSearch(""); } }}
        style={{
          width: "100%",
          padding: "10px 12px",
          border: disabled ? "1.5px solid #E3DED2" : "1.5px solid #E3DED2",
          borderRadius: 8,
          background: disabled ? "#F0EFEA" : "#FFFFFF",
          color: value ? "#18221D" : "#8A847A",
          fontSize: 15,
          textAlign: "left",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.7 : 1,
          fontWeight: 500,
          transition: "border-color 0.15s",
          boxShadow: open ? "0 0 0 2px #00875122" : "none",
          borderColor: open ? "#008751" : undefined,
        }}
      >
        {value || placeholder || "Select..."}
      </button>
      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 4px)",
          left: 0, right: 0,
          background: "#FFFFFF",
          border: "1.5px solid #E3DED2",
          borderRadius: 10,
          zIndex: 100,
          maxHeight: 260,
          overflowY: "auto",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        }}>
          <div style={{ padding: 10 }}>
            <input
              autoFocus
              type="text"
              placeholder={`Search ${label.toLowerCase()}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1.5px solid #E3DED2", fontSize: 14, outline: "none", color: "#18221D", fontFamily: "inherit" }}
            />
          </div>
          <div style={{ maxHeight: 200, overflowY: "auto" }}>
            {filtered.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false); setSearch(""); }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 12px",
                  border: "none",
                  background: opt === value ? "#F7F4EA" : "#FFFFFF",
                  color: opt === value ? "#008751" : "#18221D",
                  fontWeight: opt === value ? 600 : 400,
                  fontSize: 14,
                  cursor: "pointer",
                  borderBottom: "1px solid #F3F1EB",
                  transition: "background 0.1s",
                }}
              >
                {opt}
              </button>
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: 10, color: "#8A847A", fontSize: 13 }}>No results</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
