import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { fetchBrands, fetchProducts, mapApiProduct, type ApiBrand } from "../../lib/store-api";
import "./Orders.css";

export default function StudioOrders() {
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
        if (active) console.error("Unable to load studio orders", error);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  const brand = brands[0];
  const orderCount = products.reduce((sum, product) => sum + Math.max(4, Math.round(product.available * 0.18)), 0);
  const orderRows = products.slice(0, 6).map((product, index) => ({
    id: `#${1043 - index}`,
    customer: ["Jordan Mitchell", "Taylor Kim", "Riley Patel", "Jamie Chen", "Morgan Lee", "Casey Rivera"][index] ?? "Customer",
    email: ["jordan.mitchell@example.com", "taylor.kim@example.com", "riley.patel@example.com", "jamie.chen@example.com", "morgan.lee@example.com", "casey.rivera@example.com"][index] ?? "customer@example.com",
    total: product.price,
    items: `${Math.max(1, Math.round(product.available / 20))} item${Math.max(1, Math.round(product.available / 20)) > 1 ? "s" : ""}`,
    status: index % 2 === 0 ? "Unfulfilled" : "Shipped",
    date: `Apr ${22 - index}, 2025`,
    brandName: brand?.name ?? "Brand",
  }));

  return (
    <DashboardLayout
      kind="studio"
      title={"Orders"}
      subtitle={"Track orders, fulfill shipments, and keep your customers informed."}
      actions={
        <>
          <input className="search" placeholder="Search by order #, customer, or product…" />
          <button className="btn ">📅 Apr 1, 2025 – Apr 27, 2025 ▾</button>
        </>
      }
    >
      <div className="split">
        <div>
          <div className="tabs">
            <a href="#" className="on">All {orderCount}</a>
            <a href="#">Unfulfilled {Math.max(1, Math.round(orderCount * 0.28))}</a>
            <a href="#">Shipped {Math.max(1, Math.round(orderCount * 0.72))}</a>
            <a href="#">Preorders 6</a>
          </div>
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
                </tr>
                {orderRows.map((row, index) => (
                  <tr key={row.id}>
                    <td>
                      <b>{row.id}</b>
                    </td>
                    <td>
                      {row.customer}
                      <span className="sub">{row.email}</span>
                    </td>
                    <td>
                      {row.date}
                      <span className="sub">{index % 2 === 0 ? "10:24 AM" : "4:17 PM"}</span>
                    </td>
                    <td>
                      <span className="thumb t1" />
                      {row.items}
                    </td>
                    <td>R{Number(row.total).toFixed(2)}</td>
                    <td>
                      <span className={`pill ${row.status === "Unfulfilled" ? "orange" : "green"}`}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
