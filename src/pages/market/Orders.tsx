import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { fetchBrands, fetchProducts, mapApiProduct, type ApiBrand } from "../../lib/store-api";
import "./Orders.css";

export default function MarketOrders() {
  const [brands, setBrands] = useState<ApiBrand[]>([]);
  const [products, setProducts] = useState<ReturnType<typeof mapApiProduct>[]>([]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [nextBrands, nextProducts] = await Promise.all([fetchBrands(), fetchProducts()]);
        if (!active) return;
        setBrands(nextBrands);
        setProducts(nextProducts.map((product) => mapApiProduct(product)));
      } catch (error) {
        if (active) console.error("Unable to load market orders", error);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  const totalOrders = products.reduce((sum, product) => sum + Math.max(4, Math.round(product.available * 0.12)), 0);
  const awaitingShipment = Math.max(1, Math.round(totalOrders * 0.18));
  const orderRows = products.slice(0, 6).map((product, index) => {
    const brand = brands.find((item) => item.id === product.brandId);
    return {
      id: `#STR-${10432 - index}`,
      customer: ["Taylor Brooks", "Jordan Lee", "Casey Nguyen", "Morgan Patel", "Riley Carter", "Avery Johnson"][index] ?? "Customer",
      email: ["taylor.brooks@example.com", "jordan.lee@example.com", "casey.nguyen@example.com", "morgan.patel@example.com", "riley.carter@example.com", "avery.johnson@example.com"][index] ?? "customer@example.com",
      brand,
      total: product.price,
      fulfilled: index % 2 === 0 ? "Shipped" : "Processing",
      date: `May ${20 - index}, 2025`,
    };
  });

  return (
    <DashboardLayout
      kind="market"
      title={"Orders"}
      subtitle={"Manage orders from all marketplace brands in one place."}
      actions={
        <>
          <button className="btn ">📅 Apr 20, 2025 – May 20, 2025 ▾</button>
          🔔
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
            <a href="#" className="on">All {totalOrders}</a>
            <a href="#">Unfulfilled {awaitingShipment}</a>
            <a href="#">Shipped {Math.max(1, totalOrders - awaitingShipment)}</a>
            <a href="#">Cancelled 24</a>
          </div>
          <div className="grid g2">
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Total orders</span>
                <b>{totalOrders}</b>
                <span className="up">▲ 12%</span>
                {" "}
                <span>vs. previous 30 days</span>
              </div>
            </div>
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Awaiting shipment</span>
                <b>{awaitingShipment}</b>
                <span className="up">▲ 18%</span>
                {" "}
                <span>vs. previous 30 days</span>
              </div>
            </div>
          </div>
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
                  {orderRows.map((row, index) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>
                        {row.customer}
                        <span className="sub">{row.email}</span>
                      </td>
                      <td>
                        <span className="av" style={{ background: row.brand?.accent ?? "#5b6b4c" }}>{row.brand?.abbreviation ?? "ST"}</span>
                        {row.brand?.name ?? "Store brand"}
                      </td>
                      <td>
                        {row.date}
                        <span className="sub">{index % 2 === 0 ? "10:24 AM" : "09:17 AM"}</span>
                      </td>
                      <td>R{Number(row.total).toFixed(2)}</td>
                      <td>
                        <span className={`pill ${row.fulfilled === "Shipped" ? "green" : "orange"}`}>{row.fulfilled}</span>
                      </td>
                      <td>
                        <button className="btn ">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
