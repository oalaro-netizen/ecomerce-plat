import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CustomerNav from "../components/CustomerNav.jsx";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((d) => setProduct(d.product))
      .catch(() => setProduct(null));
  }, [id]);

  if (!product) return <p>Loading...</p>;

  const images = product.images && product.images.length > 0
    ? product.images
    : [product.image || "/product-placeholder.png"];

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((c) => c.id === product._id);
    if (existing) existing.qty += qty;
    else cart.push({ id: product._id, name: product.name, price: product.price, qty, image: images[0] });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart!");
  };

  const handlePurchase = () => {
    // Add to cart then go to cart (do not skip checkout / Paystack)
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((c) => c.id === product._id);
    if (existing) existing.qty += qty;
    else cart.push({ id: product._id, name: product.name, price: product.price, qty, image: images[0] });
    localStorage.setItem("cart", JSON.stringify(cart));
    navigate("/cart");
  };

  return (
    <>
      <CustomerNav />
      <main className="product-detail-page">
        <div className="product-gallery">
          <div className="main-image">
            <img src={images[selectedImage]} alt={product.name} />
          </div>
          {images.length > 1 && (
            <div className="thumbnails">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  className={idx === selectedImage ? "active" : ""}
                  onClick={() => setSelectedImage(idx)}
                >
                  <img src={img} alt={`${product.name} - ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="product-info">
          <h1>{product.name}</h1>
          <span className="category">{product.category}</span>
          <p className="description">{product.description}</p>
          <p className="price">${product.price}</p>
          <p className="stock">{product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}</p>
          <label>Quantity:</label>
          <input
            type="number"
            min={1}
            max={product.stock}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
            disabled={product.stock === 0}
          />
          <div className="product-actions">
            <button className="btn-add-to-cart" onClick={addToCart} disabled={product.stock === 0}>
              Add to Cart
            </button>
            <button className="btn-primary" onClick={handlePurchase} disabled={product.stock === 0 || qty > product.stock}>
              Purchase
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
