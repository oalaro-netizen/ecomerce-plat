import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

import SearchSelect from "../components/SearchSelect.jsx";
import { countries, nigerianLGAs } from "../data/locations.js";

export default function CheckoutPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const cartData = localStorage.getItem("cart");
    const cart = cartData ? JSON.parse(cartData) : [];
    const valid = cart.filter(i => (i.qty || 0) > 0);
    if (valid.length === 0) navigate("/cart");
  }, [user, navigate]);

  const [delivery, setDelivery] = useState({ country: "", state: "", localGovernment: "", address: "", phone: "", notes: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    setLoading(false);
  }, [user]);

  const cartData = localStorage.getItem("cart") || "[]";
  const cart = JSON.parse(cartData);
  const validCart = cart.filter(i => (i.qty || 0) > 0);
  const total = validCart.reduce((sum, i) => sum + (i.price || 0) * (i.qty || 0), 0);

  const handlePayNow = async () => {
    if (!delivery.country) { setError("Country is required"); return; }
    if (!delivery.state) { setError("State is required"); return; }
    if (delivery.country === "Nigeria" && !delivery.localGovernment) { setError("Local Government is required"); return; }
    if (!delivery.address || delivery.address.trim().length < 3) { setError("House/Street Address is required"); return; }
    if (validCart.length === 0) { setError("Cart is empty"); return; }
    setError("");
    try {
      const payload = validCart.map(i => ({ id: i.id, qty: i.qty }));
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ cart: payload, delivery }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Checkout failed");
      localStorage.removeItem("cart");
      localStorage.removeItem("cart-selected");
      window.dispatchEvent(new Event("storage"));
      window.location.href = data.authorizationUrl;
    } catch (err) { setError(err.message); }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <main className="checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-container">
        <div className="checkout-cart">
          <h2>Cart Items</h2>
          {validCart.length === 0 ? (
            <p>Cart is empty. <a href="/cart">Go to cart</a></p>
          ) : (
            <ul className="checkout-items">
              {validCart.map((item) => (
                <li key={item.id} className="checkout-item">
                  <img src={item.image || "/product-placeholder.png"} alt={item.name} />
                  <div>
                    <h4>{item.name}</h4>
                    <p>Qty: {item.qty}</p>
                    <p>${item.price}</p>
                    <p>Subtotal: ${(item.price * item.qty).toFixed(2)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p className="checkout-total">Total: ${total.toFixed(2)}</p>
        </div>
        <div className="checkout-form">
          <h2>Delivery Information</h2>
          {error && <p className="error">{error}</p>}
          <SearchSelect label="Country" options={countries.map(c=>c.label)} value={delivery.country} onChange={val => setDelivery({ ...delivery, country: val, state: "", localGovernment: "" })} placeholder="Select country" />
          <SearchSelect label="State / Region" options={delivery.country ? (delivery.country === "Nigeria" ? ["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara","Federal Capital Territory (FCT)"] : ["England","Scotland","Wales","Northern Ireland","California","Texas","New York","Ontario","Quebec","Bavaria","North Rhine-Westphalia"]) : []} value={delivery.state} onChange={val => setDelivery({ ...delivery, state: val, localGovernment: "" })} placeholder={delivery.country ? "Select state/region" : "Select country first"} disabled={!delivery.country} />
          <SearchSelect label={delivery.country === "Nigeria" ? "Local Government Area" : "Local Government / District"} options={(delivery.country === "Nigeria" && delivery.state && nigerianLGAs[delivery.state]) ? nigerianLGAs[delivery.state] : (delivery.country ? ["District 1","District 2","Area A","Area B"] : [])} value={delivery.localGovernment} onChange={val => setDelivery({ ...delivery, localGovernment: val })} placeholder={delivery.state ? "Select LGA / District" : "Select state first"} disabled={!(delivery.country === "Nigeria" && delivery.state)} />
          <label>
            House / Street Address
            <textarea value={delivery.address} onChange={e => setDelivery({ ...delivery, address: e.target.value })} required placeholder="e.g. 12 GRA Road, Ilorin" style={{ width: "100%", padding: 10, borderRadius: 8, border: "1.5px solid #E3DED2", fontFamily: "inherit", fontSize: 15, minHeight: 80, resize: "vertical" }} />
          </label>
          <label>
            Phone
            <input type="tel" value={delivery.phone} onChange={e => setDelivery({ ...delivery, phone: e.target.value })} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1.5px solid #E3DED2", fontFamily: "inherit", fontSize: 15 }} />
          </label>
          <label>
            Notes (optional)
            <textarea value={delivery.notes} onChange={e => setDelivery({ ...delivery, notes: e.target.value })} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1.5px solid #E3DED2", fontFamily: "inherit", fontSize: 15, minHeight: 60, resize: "vertical" }} />
          </label>
          <button onClick={handlePayNow} disabled={validCart.length === 0}>Pay Now</button>
        </div>
      </div>
    </main>
  );
}
