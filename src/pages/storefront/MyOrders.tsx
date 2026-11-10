import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import StoreLayout from "../../components/StoreLayout";
import { fetchOrders, getOrderTrackingSteps, type ApiOrder } from "../../lib/store-api";
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
            {orders.map((order) => {
              const trackingSteps = getOrderTrackingSteps(order.status);
              const activeStep = trackingSteps.findIndex((step) => !step.complete);
              const delivered = order.status === "Delivered";

              return (
                <article key={order.id} style={{ border: "1px solid #e5e0d9", background: "#fff", borderRadius: 14, padding: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <strong>Order #{order.id.slice(0, 8).toUpperCase()}</strong>
                      <div style={{ color: "#6d645f", fontSize: 14 }}>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Just now"}</div>
                    </div>
                    <span style={{ padding: "6px 10px", borderRadius: 999, background: "#f0eee8" }}>{order.status}</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8, marginTop: 18 }}>
                    {trackingSteps.map((step, index) => (
                      <div
                        key={`${order.id}-${step.label}`}
                        style={{
                          border: "1px solid",
                          borderColor: step.complete ? "#7aa57c" : index === activeStep ? "#d0b26c" : "#e5e0d9",
                          background: step.complete ? "#eff7ef" : index === activeStep ? "#fff7eb" : "#faf9f6",
                          borderRadius: 12,
                          padding: "10px 12px",
                          minHeight: 72,
                        }}
                      >
                        <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.8, color: "#665f5a" }}>Step {index + 1}</div>
                        <div style={{ marginTop: 6, fontWeight: 600 }}>{step.label}</div>
                        <div style={{ marginTop: 4, fontSize: 12, color: step.complete ? "#2f5a32" : "#766d67" }}>
                          {step.complete ? "Complete" : "Upcoming"}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 18, display: "grid", gap: 8 }}>
                    {order.items?.map((item) => (
                      <div key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <span>{item.product?.name ?? "Product"} × {item.quantity}</span>
                        <span>{formatCurrency(item.price)}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", borderTop: "1px solid #eee", paddingTop: 12, flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <div style={{ color: "#675f5b", fontSize: 13 }}>Delivery</div>
                      <strong>{order.shippingAddress?.city || "Johannesburg"}</strong>
                    </div>
                    <div>
                      <div style={{ color: "#675f5b", fontSize: 13 }}>Payment</div>
                      <strong>{order.paymentMethod || "Card"}</strong>
                    </div>
                    <div>
                      <div style={{ color: "#675f5b", fontSize: 13 }}>Total</div>
                      <strong>{formatCurrency(order.total)}</strong>
                    </div>
                  </div>

                  {!delivered && order.status !== "Cancelled" && order.status !== "Failed" && (
                    <div style={{ marginTop: 14, color: "#4c5d47" }}>
                      Expected fulfillment: {order.createdAt ? new Date(new Date(order.createdAt).getTime() + 1000 * 60 * 60 * 24 * 3).toLocaleDateString() : "within 3 business days"}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </main>
    </StoreLayout>
  );
}
