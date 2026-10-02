import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import CustomerNav from "../components/CustomerNav.jsx";

export default function CartPage() {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cartData = localStorage.getItem("cart");
    if (cartData) setCart(JSON.parse(cartData));
    const selData = localStorage.getItem("cart-selected");
    if (selData) setSelected(JSON.parse(selData));
    setLoading(false);
  }, []);

  const toggleSelect = (id) => {
    const next = selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id];
    setSelected(next);
    localStorage.setItem("cart-selected", JSON.stringify(next));
  };

  const validCart = cart.filter(i => (i.qty || 0) > 0);
  const total = validCart.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 0), 0);
  const selectedItems = validCart.filter(i => selected.includes(i.id));
  const selectedSubtotal = selectedItems.reduce((sum, i) => sum + (i.price || 0) * (i.qty || 0), 0);

  return (
    <>
      <CustomerNav />
      <main className="cart-page">
      <h1>Shopping Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
              <button onClick={() => { const all = validCart.map(i=>i.id); setSelected(all); localStorage.setItem("cart-selected", JSON.stringify(all)); }} style={{ padding: "4px 8px", fontSize: 12, cursor: "pointer" }}>Select All</button>
              <button onClick={() => { setSelected([]); localStorage.setItem("cart-selected", JSON.stringify([])); }} style={{ padding: "4px 8px", fontSize: 12, cursor: "pointer" }}>Deselect All</button>
              <span style={{ fontSize: 14, marginLeft: 8 }}>Selected: {selectedItems.length} | Subtotal: ${selectedSubtotal.toFixed(2)}</span>
            </div>
          <div className="cart-items">
            {validCart.map((item) => (
              <div key={item.id} className="cart-item">
                <input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggleSelect(item.id)} style={{ marginRight: 10, transform: "scale(1.2)" }} />
                <img src={item.image || "/product-placeholder.png"} alt={item.name} />
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p className="cart-item-price">${item.price}</p>
                  <p className="cart-item-qty">
                    Qty: {item.qty} &times; ${item.price} = ${item.price * item.qty}
                  </p>
                </div>
                <button onClick={() => {
                  const newCart = cart.filter(c => c.id !== item.id);
                  setCart(newCart);
                  localStorage.setItem("cart", JSON.stringify(newCart));
                  const nextSel = selected.filter(s => s !== item.id);
                  setSelected(nextSel);
                  localStorage.setItem("cart-selected", JSON.stringify(nextSel));
                }} className="btn-remove">
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <h3>Total: ${total.toFixed(2)}</h3>
            <Link to="/cart" className="btn-secondary">Continue Shopping</Link>
            <Link to="/checkout" className="btn-primary">
              Checkout
            </Link>
          </div>
        </div>
      )}
      </main>
    </>
  );
}