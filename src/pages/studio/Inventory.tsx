import DashboardLayout from "../../components/DashboardLayout";
import { STORE, STORE_SUMMARY, getInventoryRows } from "../../data/store";
import "./Inventory.css";

export default function StudioInventory() {
  const rows = getInventoryRows();
  const brand = STORE.brands[0];
  const brandRows = rows.filter((product) => product.brandId === brand?.id);

  return (
    <DashboardLayout
      kind="studio"
      title={"Inventory"}
      subtitle={`Track stock levels for ${brand?.name ?? "your brand"} across the shared store catalog.`}
      actions={
        <>
          <button className="btn ">⬇ Export</button>
          <button className="btn pri">Adjust stock</button>
        </>
      }
    >
      <div className="tools">
        <input className="search" placeholder="Search products, SKU, or name…" />
        <select className="search">
          <option>All categories</option>
        </select>
        <select className="search">
          <option>All status</option>
        </select>
        <button className="btn ">⚲</button>
      </div>
      <div className="grid g4">
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Total units</span>
            <b>{STORE_SUMMARY.totalUnits}</b>
            {" "}
            <span>Across all products</span>
          </div>
        </div>
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Low stock</span>
            <b>{STORE_SUMMARY.lowStockProducts}</b>
            {" "}
            <span>≤ 25 units remaining</span>
          </div>
        </div>
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Out of stock</span>
            <b>{rows.filter((product) => product.available === 0).length}</b>
            {" "}
            <span>No units available</span>
          </div>
        </div>
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Brand units</span>
            <b>{brandRows.reduce((sum, product) => sum + product.available, 0)}</b>
            {" "}
            <span>For {brand?.name}</span>
          </div>
        </div>
      </div>
      <section className="card ">
        <h3 />
        <div className="wrap">
          <table>
            <tbody>
              <tr>
                <th>☐</th>
                <th>Product / SKU</th>
                <th>Available</th>
                <th>Committed</th>
                <th>Preorder qty</th>
                <th>Status</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
              {brandRows.map((product) => (
                <tr key={product.id}>
                  <td>☐</td>
                  <td>
                    <span className={`thumb ${product.imageClass}`} />
                    {product.name}
                    <span className="sub">{product.sku}</span>
                  </td>
                  <td>{product.available}</td>
                  <td>{product.committed}</td>
                  <td>{Math.max(0, Math.round(product.available * 0.1))}</td>
                  <td>
                    <span className={`pill ${product.status === "Low stock" ? "orange" : "green"}`}>{product.status === "Low stock" ? "Low stock" : "In stock"}</span>
                  </td>
                  <td>
                    <span className="qty">− {product.available} +</span>
                  </td>
                  <td>⋯</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pager">
          <span>Showing 1–{brandRows.length} of {brandRows.length} products</span>
          <button className="btn pri">Save changes</button>
        </div>
      </section>
    </DashboardLayout>
  );
}
