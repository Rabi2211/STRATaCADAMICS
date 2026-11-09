import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { fetchBrands, fetchProducts, mapApiProduct, type ApiBrand } from "../../lib/store-api";
import "./Purchases.css";

export default function StudioPurchases() {
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
        if (active) console.error("Unable to load studio purchases", error);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  const openPurchaseOrders = Math.max(1, products.length);
  const incomingUnits = products.reduce((sum, product) => sum + Math.max(50, product.available), 0);
  const estimatedCost = products.reduce((sum, product) => sum + Number(product.price) * Math.max(10, Math.round(product.available * 0.2)), 0);

  return (
    <DashboardLayout
      kind="studio"
      title={"Purchases"}
      subtitle={"Create purchase orders and manage supplier replenishment."}
      actions={
        <>
          <button className="btn pri">+ Create purchase order</button>
        </>
      }
    >
      <div className="split">
        <div>
          <div className="grid g3">
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Open purchase orders</span>
                <b>{openPurchaseOrders}</b>
                {" "}
                <span>Awaiting arrival or in transit</span>
              </div>
            </div>
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Units incoming</span>
                <b>{incomingUnits.toLocaleString()}</b>
                {" "}
                <span>Across {openPurchaseOrders} purchase orders</span>
              </div>
            </div>
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Estimated cost</span>
                <b>R{estimatedCost.toLocaleString()}</b>
                {" "}
                <span>Total value of open orders</span>
              </div>
            </div>
          </div>
          <section className="card ">
            <h3>Supplier purchase orders</h3>
            <input className="search" placeholder="Search PO number, supplier, or product…" />
            <div className="wrap">
              <table>
                <tbody>
                  <tr>
                    <th>PO #</th>
                    <th>Supplier</th>
                    <th>Products</th>
                    <th>Quantity</th>
                    <th>Expected arrival</th>
                    <th>Cost</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                  {products.slice(0, 6).map((product, index) => {
                    const brand = brands.find((item) => item.id === product.brandId);
                    return (
                      <tr key={product.id}>
                        <td>
                          <b>PO-{1043 - index}</b>
                        </td>
                        <td>
                          {brand?.name ?? "Supplier"}
                          <span className="sub">{index % 2 === 0 ? "Los Angeles, CA" : "Chicago, IL"}</span>
                        </td>
                        <td>
                          <span className="thumb t1" />
                          {Math.max(1, Math.round(index + 1))} product{Math.max(1, Math.round(index + 1)) > 1 ? "s" : ""}
                          <span className="sub">{product.name}</span>
                        </td>
                        <td>{Math.max(20, product.available)} units</td>
                        <td>{index % 2 === 0 ? "Apr 22, 2025" : "Apr 18, 2025"}</td>
                        <td>R{(Number(product.price) * Math.max(10, Math.round(product.available * 0.2))).toLocaleString()}</td>
                        <td>
                          <span className={`pill ${index % 2 === 0 ? "orange" : "green"}`}>{index % 2 === 0 ? "Draft" : "Ordered"}</span>
                        </td>
                        <td>👁 View ⋯</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
