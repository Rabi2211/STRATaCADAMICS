import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { fetchOrders, updateOrderStatus, type ApiOrder } from "../../lib/store-api";
import "./Orders.css";

export default function MarketOrders() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const nextOrders = await fetchOrders();
        if (!active) return;
        setOrders(nextOrders);
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load market orders.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  const handleStatusUpdate = async (orderId: string, nextStatus: string) => {
    try {
      const updated = await updateOrderStatus(orderId, nextStatus);
      setOrders((current) => current.map((order) => (order.id === orderId ? { ...order, status: updated.status } : order)));
      setError(null);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update order status.");
    }
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((order) => order.status === "PENDING").length;
  const shippedOrders = orders.filter((order) => order.status === "SHIPPED").length;
  const awaitingShipment = Math.max(0, pendingOrders + orders.filter((order) => order.status === "PAID").length);

  const orderRows = orders.map((order) => ({
    id: order.id,
    customer: order.user?.name ?? "Customer",
    email: order.user?.email ?? "customer@example.com",
    total: Number(order.total ?? 0),
    items: order.items?.map((item) => `${item.quantity}× ${item.product?.name ?? "Product"}`).join(", ") || "Order",
    status: order.status,
    date: order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-ZA", { month: "short", day: "numeric", year: "numeric" }) : "No date",
    brandName: order.items?.[0]?.product?.brand?.name ?? "Brand",
  }));

  return (
    <DashboardLayout
      kind="market"
      title={"Orders"}
      subtitle={"Manage orders from all marketplace brands in one place."}
      actions={
        <>
          <button className="btn ">{orders.length ? "Live marketplace orders" : "No orders"}</button>
          <button className="btn pri">View storefront ↗</button>
        </>
      }
    >
      <div className="split">
        <div>
          <input className="search" placeholder="Search by order number, customer, or brand…" />
          <br />
          <br />
          <div className="tabs">
            <button type="button" className="on">All {totalOrders}</button>
            <button type="button">Pending {pendingOrders}</button>
            <button type="button">Shipped {shippedOrders}</button>
            <button type="button">Awaiting shipment {awaitingShipment}</button>
          </div>
          {error && <p className="auth-error" style={{ marginBottom: 12 }}>{error}</p>}
          {loading ? (
            <div className="card">Loading marketplace orders…</div>
          ) : (
            <section className="card ">
              <h3 />
              <div className="wrap">
                <table>
                  <tbody>
                    <tr>
                      <th>Order #</th>
                      <th>Customer</th>
                      <th>Brand(s)</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Fulfillment</th>
                      <th>Action</th>
                    </tr>
                    {orderRows.map((row) => (
                      <tr key={row.id}>
                        <td>{row.id.slice(0, 8).toUpperCase()}</td>
                        <td>
                          {row.customer}
                          <span className="sub">{row.email}</span>
                        </td>
                        <td>{row.brandName}</td>
                        <td>{row.date}</td>
                        <td>R{Number(row.total).toFixed(2)}</td>
                        <td>
                          <span className={`pill ${row.status === "SHIPPED" ? "green" : row.status === "CANCELLED" ? "orange" : "blue"}`}>{row.status}</span>
                        </td>
                        <td>
                          <select
                            value={row.status}
                            onChange={(event) => void handleStatusUpdate(row.id, event.target.value)}
                            aria-label={`Update market order ${row.id} status`}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="PAID">Paid</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
