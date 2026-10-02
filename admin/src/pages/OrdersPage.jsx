import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("orders");
    if (stored) setOrders(JSON.parse(stored));
    setLoading(false);
  }, []);

  return (
    <main className="orders-page">
      <h1>My Orders</h1>
      {loading ? <p>Loading...</p> : orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <span>Order #{order.id.slice(-8)}</span>
                <span className={`order-status ${order.status}`}>{order.status}</span>
              </div>
              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item.id} className="order-item">
                    <span>{item.name} x{item.qty}</span>
                    <span>${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="order-total">
                Total: ${order.total.toFixed(2)}
              </div>
              <div className="order-date">
                {new Date(order.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}