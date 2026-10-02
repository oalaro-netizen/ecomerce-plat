import { useEffect, useState } from "react";
export default function AdminPage() {
  const [view, setView] = useState("dashboard");
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalCustomers: 0, totalRevenue: 0, lowStockCount: 0 });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "Shoes", stock: "", images: [] });
  const [uploading, setUploading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch("/api/admin/stats", { credentials: "include" }).then(r => r.json()).then(d => setStats(d)).catch(() => {});
    fetch("/api/products", { credentials: "include" }).then(r => r.json()).then(d => setProducts(d.products || [])).catch(() => {});
    fetch("/api/admin/orders", { credentials: "include" }).then(r => r.json()).then(d => setOrders(d.orders || [])).catch(() => {});
    fetch("/api/admin/customers", { credentials: "include" }).then(r => r.json()).then(d => setCustomers(d.users || [])).catch(() => {});
  }, []);

  const navLinks = [
    { key: "dashboard", label: "Dashboard" },
    { key: "products", label: "Products" },
    { key: "orders", label: "Orders" },
    { key: "customers", label: "Customers" },
    { key: "inventory", label: "Inventory" },
    { key: "payments", label: "Payments" },
    { key: "profile", label: "Profile" },
    { key: "logout", label: "Logout" },
  ];
  const editProduct = (p) => {
    setForm({ name: p.name || "", description: p.description || "", price: p.price || "", category: p.category || "Shoes", stock: p.stock || "", images: Array.isArray(p.images) ? p.images : (p.image ? [p.image] : []) });
    setEditingId(p._id);
    setView("products");
  };
  const handleLogout = () => { window.location.href = "/login"; };

  return (
    <div style={{ minHeight: "100vh", background: "#F7F4EA", fontFamily: "system-ui, sans-serif" }}>
      {/* Top navigation */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", background: "#18221D", color: "#fff" }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>Admin Dashboard</h2>
        <nav style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {navLinks.map((item) => (
            item.key === "logout" ? (
              <button key={item.key} onClick={handleLogout} style={{ background: "transparent", border: "1px solid #777", color: "#fff", padding: "6px 12px", borderRadius: 4, cursor: "pointer", fontWeight: 500 }}>{item.label}</button>
            ) : (
              <button key={item.key} onClick={() => setView(item.key)} style={{ background: view === item.key ? "#008751" : "#18221D", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 4, cursor: "pointer", fontWeight: 500 }}>{item.label}</button>
            )
          ))}
        </nav>
      </header>
      <main style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>{view === "dashboard" ? "Dashboard" : view.charAt(0).toUpperCase()+view.slice(1)}</h1>
        {view === "dashboard" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
              {[{label:"Total Products", value: stats.totalProducts}, {label:"Total Orders", value: stats.totalOrders}, {label:"Customers", value: stats.totalCustomers}, {label:"Revenue", value: "$"+stats.totalRevenue}, {label:"Low Stock", value: stats.lowStockCount}].map(s => (
                <div key={s.label} style={{ background: "#fff", padding: 20, borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
                  <div style={{ fontSize: 12, color: "#6B726D" }}>{s.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>{s.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 24, marginBottom: 24 }}>
              <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
                <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Order Summary — ${stats.totalRevenue}</h3>
                <svg viewBox="0 0 400 120" preserveAspectRatio="none" style={{ width: "100%", height: 140 }}><polygon points="0,100 50,80 100,60 150,70 200,40 250,55 300,30 350,45 400,20" fill="rgba(99,102,241,.15)" stroke="#008751" strokeWidth="2" /></svg>
              </div>
              <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
                <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Recent Customers / Reviews</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {customers.slice(0,5).map(c => (<li key={c._id||c.email} style={{ display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #F7F4EA", paddingBottom: 8 }}><span style={{ width: 32, height: 32, borderRadius: "50%", background: "#E3DED2", display: "inline-block" }} /><div><div style={{ fontWeight: 600 }}>{c.name||c.email}</div><div style={{ fontSize: 12, color: "#9ca3af" }}>{c.review||"Customer"}</div></div></li>))}
                </ul>
              </div>
            </div>
            <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
              <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Products ({products.length})</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead><tr style={{ textAlign: "left", color: "#6B726D" }}><th>Product</th><th>Price</th><th>Stock</th><th>Orders</th><th>Status</th></tr></thead>
                <tbody>{products.map(p => (<tr key={p._id||p.name} style={{ borderBottom: "1px solid #F7F4EA" }}><td style={{ padding: 10 }}>{p.name}</td><td style={{ padding: 10 }}>${p.price}</td><td style={{ padding: 10 }}>{p.stock}</td><td style={{ padding: 10 }}>{p.orders||0}</td><td style={{ padding: 10 }}><span style={{ padding: "2px 8px", borderRadius: 999, background: p.stock > 5 ? "#dcfce7" : "#fee2e2", color: p.stock > 5 ? "#008751" : "#991b1b", fontWeight: 600, fontSize: 12 }}>{p.stock > 5 ? "In Stock" : "Low"}</span></td></tr>))}</tbody>
              </table>
            </div>
          </>)}
        {view === "products" && (
          <>
            <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,.06)", marginBottom: 24 }}>
            <h3 style={{ fontWeight: 600, marginBottom: 12 }}>{editingId ? "Edit Product" : "Upload Product"}</h3>
              <form onSubmit={async e => {
                e.preventDefault();
                const body = { ...form, price: Number(form.price), stock: Number(form.stock), images: Array.isArray(form.images) ? form.images : (form.images ? [form.images] : []) };
                const url = editingId ? `/api/products/${editingId}` : "/api/products";
                const method = editingId ? "PUT" : "POST";
                await fetch(url, { method, headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(body) });
                setForm({ name: "", description: "", price: "", category: "Shoes", stock: "", images: [] });
                setEditingId(null);
                fetch("/api/products", { credentials: "include" }).then(r => r.json()).then(d => setProducts(d.products || []));
              }} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ padding: 10, borderRadius: 8, border: "1px solid #E3DED2" }} required />
                <input placeholder="Price" value={form.price} onChange={e => setForm({...form, price: e.target.value})} style={{ padding: 10, borderRadius: 8, border: "1px solid #E3DED2" }} required />
                <input placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={{ padding: 10, borderRadius: 8, border: "1px solid #E3DED2" }} />
                <input placeholder="Stock" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} style={{ padding: 10, borderRadius: 8, border: "1px solid #E3DED2" }} required />
                <div style={{ gridColumn: "span 2" }}>
                  <label style={{ fontWeight: 600, display: "block", marginBottom: 4 }}>Description</label>
                  <textarea rows={3} placeholder="Product description..." value={form.description || ""} onChange={e => setForm({...form, description: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #E3DED2", fontFamily: "inherit" }} />
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <label style={{ fontWeight: 600, display: "block", marginBottom: 4 }}>Product Image Upload</label>
                  <input type="file" accept="image/*" onChange={async e => {
                    const file = e.target.files[0]; if (!file) return;
                    setUploading(true);
                    const fd = new FormData(); fd.append("file", file);
                    const res = await fetch("/api/upload", { method: "POST", body: fd, credentials: "include" });
                    const data = await res.json();
                    const url = data.url || data.user?.avatar || "";
                    setForm({...form, images: url ? [url] : []});
                    setUploading(false);
                  }} style={{ padding: 6 }} />
                  {uploading && <span style={{ fontSize: 12, color: "#6B726D" }}>Uploading...</span>}
                  {form.images?.[0] && <div style={{ marginTop: 6 }}><img src={form.images[0]} alt="preview" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 6 }} /></div>}
                </div>
                <button type="submit" style={{ padding: 10, borderRadius: 8, border: "none", background: editingId ? "#008751" : "#008751", color: "#fff", fontWeight: 600, cursor: "pointer" }}>{editingId ? "Update Product" : "Add Product"}</button>
              </form>
            </div>
            <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
            <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Products ({products.length})</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead><tr style={{ textAlign: "left", color: "#6B726D" }}><th>Product</th><th>Price</th><th>Stock</th><th>Orders</th><th>Status</th><th></th></tr></thead>
              <tbody>{products.map(p => (<tr key={p._id||p.name} style={{ borderBottom: "1px solid #F7F4EA" }}><td style={{ padding: 10 }}>{p.name}</td><td style={{ padding: 10 }}>${p.price}</td><td style={{ padding: 10 }}>{p.stock}</td><td style={{ padding: 10 }}>{p.orders||0}</td><td style={{ padding: 10 }}><span style={{ padding: "2px 8px", borderRadius: 999, background: p.stock > 5 ? "#dcfce7" : "#fee2e2", color: p.stock > 5 ? "#008751" : "#991b1b", fontWeight: 600, fontSize: 12 }}>{p.stock > 5 ? "In Stock" : "Low"}</span></td><td style={{ padding: 10 }}><button onClick={() => editProduct(p)} style={{ padding: "4px 8px", borderRadius: 4, border: "none", background: "#008751", color: "#fff", cursor: "pointer", fontSize: 12 }}>Edit</button></td></tr>))}</tbody>
            </table>
          </div>
          </>
        )}
        {view === "orders" && (
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
            <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Orders ({orders.length})</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead><tr style={{ textAlign: "left", color: "#6B726D" }}><th>Customer</th><th>Total</th><th>Date</th></tr></thead>
              <tbody>{orders.map(o => (<tr key={o._id} style={{ borderBottom: "1px solid #F7F4EA" }}><td style={{ padding: 10 }}>{o.customer?.name || o.customer?.email || "Guest"}</td><td style={{ padding: 10 }}>${o.total}</td><td style={{ padding: 10 }}>{new Date(o.createdAt).toLocaleDateString()}</td></tr>))}</tbody>
            </table>
          </div>
        )}
        {view === "customers" && (
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
            <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Customers ({customers.length})</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead><tr style={{ textAlign: "left", color: "#6B726D" }}><th>Name</th><th>Email</th><th>Review / Note</th></tr></thead>
              <tbody>{customers.map(c => (<tr key={c._id||c.email} style={{ borderBottom: "1px solid #F7F4EA" }}><td style={{ padding: 10 }}>{c.name}</td><td style={{ padding: 10 }}>{c.email}</td><td style={{ padding: 10 }}>{c.review || "—"}</td></tr>))}</tbody>
            </table>
          </div>
        )}
        {view === "inventory" && (
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
            <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Inventory / Low Stock</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead><tr style={{ textAlign: "left", color: "#6B726D" }}><th>Product</th><th>Stock</th><th>Status</th></tr></thead>
              <tbody>{products.map(p => (<tr key={p._id||p.name} style={{ borderBottom: "1px solid #F7F4EA" }}><td style={{ padding: 10 }}>{p.name}</td><td style={{ padding: 10 }}>{p.stock}</td><td style={{ padding: 10 }}><span style={{ padding: "2px 8px", borderRadius: 999, background: p.stock > 5 ? "#dcfce7" : p.stock > 0 ? "#fee2e2" : "#C41E3A", color: p.stock > 5 ? "#008751" : p.stock > 0 ? "#991b1b" : "#7f1d1d", fontWeight: 600, fontSize: 12 }}>{p.stock > 5 ? "In Stock" : p.stock > 0 ? "Low Stock" : "Out"}</span></td></tr>))}</tbody>
            </table>
          </div>
        )}
        {view === "payments" && (
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
            <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Payments (from Orders)</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead><tr style={{ textAlign: "left", color: "#6B726D" }}><th>Customer</th><th>Amount</th></tr></thead>
              <tbody>{orders.map(o => (<tr key={o._id} style={{ borderBottom: "1px solid #F7F4EA" }}><td style={{ padding: 10 }}>{o.customer?.name || o.customer?.email || "Guest"}</td><td style={{ padding: 10 }}>${o.total}</td></tr>))}</tbody>
            </table>
          </div>
        )}
        {view === "profile" && (
          <>
            <div style={{ background: "#18221D", color: "#fff", borderRadius: 16, padding: "1.75rem 2rem", marginBottom: "1.5rem", boxShadow: "0 16px 40px rgba(24,34,29,0.10)" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", margin: 0 }}>Admin Profile</h2>
              <span style={{ fontSize: "0.85rem", opacity: 0.85, display: "block", marginTop: "0.3rem" }}>Administrator</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
              <div style={{ background: "#fff", border: "1.5px solid #E3DED2", borderRadius: 14, padding: "1.25rem", boxShadow: "0 2px 10px rgba(24,34,29,0.03)" }}>
                <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.7px", fontWeight: 600, color: "#6B726D", display: "block", marginBottom: "0.35rem" }}>Role</span>
                <span style={{ fontSize: "1rem", fontWeight: 700, color: "#18221D" }}>Administrator</span>
              </div>
              <div style={{ background: "#fff", border: "1.5px solid #E3DED2", borderRadius: 14, padding: "1.25rem", boxShadow: "0 2px 10px rgba(24,34,29,0.03)" }}>
                <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.7px", fontWeight: 600, color: "#6B726D", display: "block", marginBottom: "0.35rem" }}>Access Level</span>
                <span style={{ fontSize: "1rem", fontWeight: 700, color: "#18221D" }}>Full Dashboard</span>
              </div>
            </div>
          </>
        )}
        {view === "settings" && (
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
            <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Settings</h3>
            <p style={{ color: "#6B726D" }}>Admin settings (roles, notifications, etc.)</p>
          </div>
        )}
      </main>
    </div>
  );
}
