import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import StoreLayout from "../../components/StoreLayout";
import { fetchOrders, type ApiOrder } from "../../lib/store-api";
import { getStoredAuthSession } from "../../lib/storage";

function formatCurrency(value: number | string) {
  return `R${Number(value ?? 0).toFixed(2)}`;
}

export default function MyOrdersPage() {
  const session = getStoredAuthSession();
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }

    let ignore = false;

    const load = async () => {
      try {
        const payload = await fetchOrders();
        if (!ignore) {
          setOrders(payload);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load orders.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void load();
    return () => {
      ignore = true;
    };
  }, [session]);

  if (!session) {
    return <Navigate to="/" replace />;
  }

  return (
    <StoreLayout>
      <main style={{ maxWidth: 960, margin: "32px auto", padding: "0 20px 80px" }}>
        <h1 style={{ marginBottom: 20 }}>My orders</h1>
        {loading ? (
          <p>Loading your orders…</p>
        ) : error ? (
          <p style={{ color: "#7d2f2a" }}>{error}</p>
        ) : orders.length === 0 ? (
          <>
            <p>You have no orders yet.</p>
            <Link to="/men" className="btn" style={{ display: "inline-block" }}>Shop now</Link>
          </>
        ) : (
          <div style={{ display: "grid", gap: 14 }}>
            {orders.map((order) => (
              <article key={order.id} style={{ border: "1px solid #e5e0d9", background: "#fff", borderRadius: 14, padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <strong>Order #{order.id.slice(0, 8).toUpperCase()}</strong>
                    <div style={{ color: "#6d645f", fontSize: 14 }}>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Just now"}</div>
                  </div>
                  <span style={{ padding: "6px 10px", borderRadius: 999, background: "#f0eee8" }}>{order.status}</span>
                </div>
                <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                  {order.items?.map((item) => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                      <span>{item.product?.name ?? "Product"} × {item.quantity}</span>
                      <span>{formatCurrency(item.price)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", borderTop: "1px solid #eee", paddingTop: 12 }}>
                  <span>Total</span>
                  <strong>{formatCurrency(order.total)}</strong>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </StoreLayout>
  );
}
