import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { fetchOrders, updateOrderStatus, type ApiOrder } from "../../lib/store-api";
import "./Orders.css";

export default function StudioOrders() {
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
          setError(loadError instanceof Error ? loadError.message : "Unable to load studio orders.");
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
  const orderRows = orders.map((order) => ({
    id: order.id,
    customer: order.user?.name ?? "Customer",
    email: order.user?.email ?? "customer@example.com",
    total: Number(order.total ?? 0),
    items: order.items?.map((item) => `${item.quantity}× ${item.product?.name ?? "Product"}`).join(", ") || "Order",
    status: order.status,
    date: order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-ZA", { month: "short", day: "numeric", year: "numeric" }) : "No date",
  }));

  return (
    <DashboardLayout
      kind="studio"
      title={"Orders"}
      subtitle={"Track orders, fulfill shipments, and keep your customers informed."}
      actions={
        <>
          <input className="search" placeholder="Search by order #, customer, or product…" />
          <button className="btn ">📅 {orders.length ? "Live orders" : "No orders"}</button>
        </>
      }
    >
      <div className="split">
        <div>
          <div className="tabs">
            <a href="#" className="on">All {totalOrders}</a>
            <a href="#">Pending {pendingOrders}</a>
            <a href="#">Shipped {shippedOrders}</a>
          </div>
          {error && <p className="auth-error" style={{ marginBottom: 12 }}>{error}</p>}
          {loading ? (
            <div className="card">Loading orders…</div>
          ) : (
            <div className="wrap">
              <table>
                <tbody>
                  <tr>
                    <th>ORDER #</th>
                    <th>CUSTOMER</th>
                    <th>DATE</th>
                    <th>ITEMS</th>
                    <th>TOTAL</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                  {orderRows.map((row) => (
                    <tr key={row.id}>
                      <td><b>{row.id.slice(0, 8).toUpperCase()}</b></td>
                      <td>
                        {row.customer}
                        <span className="sub">{row.email}</span>
                      </td>
                      <td>{row.date}</td>
                      <td>{row.items}</td>
                      <td>R{Number(row.total).toFixed(2)}</td>
                      <td>
                        <span className={`pill ${row.status === "SHIPPED" ? "green" : row.status === "CANCELLED" ? "orange" : "blue"}`}>{row.status}</span>
                      </td>
                      <td>
                        <select
                          value={row.status}
                          onChange={(event) => void handleStatusUpdate(row.id, event.target.value)}
                          aria-label={`Update order ${row.id} status`}
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
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
