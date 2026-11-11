import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { fetchBrands, fetchProducts, mapApiProduct, type ApiBrand } from "../../lib/store-api";
import "./Inventory.css";

type InventoryRow = Omit<ReturnType<typeof mapApiProduct>, "status"> & {
  brand?: ApiBrand;
  committed: number;
  status: string;
};

export default function MarketInventory() {
  const [brands, setBrands] = useState<ApiBrand[]>([]);
  const [products, setProducts] = useState<ReturnType<typeof mapApiProduct>[]>([]);
  const [showAdjuster, setShowAdjuster] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [nextBrands, nextProducts] = await Promise.all([fetchBrands(), fetchProducts()]);
        if (!active) return;
        setBrands(nextBrands);
        setProducts(nextProducts.map((product) => mapApiProduct(product)));
      } catch (error) {
        if (active) {
          console.error("Unable to load inventory", error);
        }
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  const inventoryRows: InventoryRow[] = products.map((product) => {
    const brand = brands.find((item) => item.id === product.brandId);
    return {
      ...product,
      brand,
      committed: Math.max(2, Math.round(product.available * 0.08)),
      status: product.available <= 25 ? "Low stock" : "In stock",
    };
  });

  const lowStock = inventoryRows.filter((product) => product.available <= 25);
  const totalUnits = inventoryRows.reduce((sum, product) => sum + product.available, 0);
  const lowStockCount = lowStock.length;

  const handleAdjustStock = (productId: string, delta: number) => {
    setProducts((current) => current.map((product) =>
      product.id === productId
        ? { ...product, available: Math.max(0, product.available + delta) }
        : product,
    ));
    setNotice("Inventory updated.");
  };

  const handleExportCsv = () => {
    const header = ["Product", "Brand", "SKU", "Available", "Status"];
    const rows = inventoryRows.map((product) => [
      product.name,
      product.brand?.name ?? "Store brand",
      product.sku,
      String(product.available),
      product.status,
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "inventory.csv";
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Inventory exported as CSV.");
  };

  return (
    <DashboardLayout
      kind="market"
      title={"Inventory"}
      subtitle={"Manage stock levels for all products across your store brands."}
      actions={
        <>
          <input className="search" placeholder="Search products, brands or SKU…" />
          <select className="search">
            <option>All brands</option>
            {brands.map((brand) => (
              <option key={brand.id}>{brand.name}</option>
            ))}
          </select>
          <select className="search">
            <option>All stock status</option>
          </select>
          <button type="button" className="btn pri" onClick={handleExportCsv}>Export ⬆</button>
        </>
      }
    >
      <div className="grid g3">
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Total units in stock</span>
            <b>{totalUnits}</b>
            <span className="up">▲ 12%</span>
            {" "}
            <span>Across {brands.length} brands</span>
          </div>
        </div>
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Low stock (≤ 25 units)</span>
            <b>{lowStockCount}</b>
            <span className="up">▼ -28%</span>
            {" "}
            <span>Across {brands.length} brands</span>
          </div>
        </div>
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Out of stock</span>
            <b>{inventoryRows.filter((product) => product.available === 0).length}</b>
            <span className="up">▼ -46%</span>
            {" "}
            <span>Across {brands.length} brands</span>
          </div>
        </div>
      </div>
      <div className="grid g21">
        <section className="card ">
          <h3 />
          <div className="wrap">
            <table>
              <tbody>
                <tr>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>SKU</th>
                  <th>Available</th>
                  <th>Committed</th>
                  <th>Status</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
                {inventoryRows.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <span className={`thumb ${product.imageClass}`} />
                      {product.name}
                      <span className="sub">{product.category}</span>
                    </td>
                    <td>
                      <span className="av" style={{ background: product.brand?.accent ?? "#5b6b4c" }}>{product.brand?.abbreviation ?? "ST"}</span>
                      {product.brand?.name ?? "Store brand"}
                    </td>
                    <td>{product.sku}</td>
                    <td>{product.available}</td>
                    <td>{product.committed}</td>
                    <td>
                      <span className={`pill ${product.status === "Low stock" ? "orange" : "green"}`}>{product.status}</span>
                    </td>
                    <td>
                      <span className="qty">
                        <button type="button" className="btn btn--small" onClick={() => handleAdjustStock(product.id, -1)} aria-label={`Decrease stock for ${product.name}`}>−</button>
                        <span style={{ padding: "0 8px" }}>{product.available}</span>
                        <button type="button" className="btn btn--small" onClick={() => handleAdjustStock(product.id, 1)} aria-label={`Increase stock for ${product.name}`}>+</button>
                      </span>
                    </td>
                    <td>⋮</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="sub">Showing 1–{inventoryRows.length} of {inventoryRows.length} products</p>
        </section>
        <div className="stack">
          <section className="card ">
            <h3>
              Stock alerts
              <a href="/market/overview">View all →</a>
            </h3>
            {lowStock.map((product) => (
              <div className="row" key={product.id}>
                <b>{product.brand?.name ?? "Store"}</b>
                <span className="sub">{product.name}</span>
                <span style={{ color: "var(--acc)" }}>{product.available} left</span>
              </div>
            ))}
          </section>
          <button type="button" className="btn full" onClick={() => setShowAdjuster((current) => !current)}>{showAdjuster ? "Hide stock controls" : "Adjust stock"}</button>
          {showAdjuster && (
            <div className="card" style={{ padding: "12px" }}>
              {inventoryRows.map((product) => (
                <div key={product.id} className="row" style={{ alignItems: "center" }}>
                  <span>
                    <b>{product.name}</b>
                    <span className="sub">{product.available} units</span>
                  </span>
                  <div>
                    <button type="button" className="btn btn--small" onClick={() => handleAdjustStock(product.id, -1)}>−1</button>
                    <button type="button" className="btn btn--small" onClick={() => handleAdjustStock(product.id, 1)}>+1</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button type="button" className="btn pri full" onClick={() => setNotice("Changes saved.")}>✓ Save changes</button>
          {notice && <p className="sub">{notice}</p>}
        </div>
      </div>
    </DashboardLayout>
  );
}
