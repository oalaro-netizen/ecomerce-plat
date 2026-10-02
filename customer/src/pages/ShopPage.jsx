import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CustomerNav from "../components/CustomerNav.jsx";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <CustomerNav />
      <main className="shop-page">
        <h1>Fashion Shop</h1>
        <div className="product-grid">
          {loading ? <p>Loading...</p> : products.map((p) => {
            const mainImage = (p.images && p.images[0]) || p.image || "/product-placeholder.png";
            return (
              <div className="product-card" key={p._id}>
                <img src={mainImage} alt={p.name} />
                <h3>{p.name}</h3>
                <span className="category">{p.category}</span>
                <p className="price">${p.price}</p>
                <p className="stock">{p.stock > 0 ? `${p.stock} in stock` : "Out of Stock"}</p>
                <Link to={`/product/${p._id}`} className="btn-view">View Product</Link>
                <button
                  className="btn-add-to-cart"
                  onClick={() => {
                    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
                    const existing = cart.find((c) => c.id === p._id);
                    if (existing) {
                      existing.qty += 1;
                    } else {
                      cart.push({ id: p._id, name: p.name, price: p.price, qty: 1, image: mainImage });
                    }
                    localStorage.setItem("cart", JSON.stringify(cart));
                    alert("Added to cart!");
                  }}
                >
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
