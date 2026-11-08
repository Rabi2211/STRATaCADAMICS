import DashboardLayout from "../../components/DashboardLayout";
import { STORE, getBrandProductCount } from "../../data/store";
import "./Brands.css";

export default function MarketBrands() {
  const activeBrandCount = STORE.brands.length;
  const totalProducts = STORE.products.length;

  return (
    <DashboardLayout
      kind="market"
      title={"Brands"}
      subtitle={"Manage the brands in your store portfolio and keep every storefront listing connected to the owner account."}
      actions={
        <>
          <input className="search" placeholder="Search brands by name or category…" />
          <span className="seg">
            <span className="on">All ({STORE.brands.length})</span>
            <span>Active ({activeBrandCount})</span>
          </span>
          <button className="btn pri">+ Add brand</button>
        </>
      }
    >
      <div className="split">
        <div>
          <div className="grid g3">
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Total brands</span>
                <b>{STORE.brands.length}</b>
                {" "}
                <span>across your store</span>
              </div>
            </div>
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Active brands</span>
                <b>{activeBrandCount}</b>
                {" "}
                <span>100% of total</span>
              </div>
            </div>
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Products in catalog</span>
                <b>{totalProducts}</b>
                {" "}
                <span>storewide</span>
              </div>
            </div>
          </div>
          <section className="card ">
            <h3 />
            <div className="wrap">
              <table>
                <tbody>
                  <tr>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Products</th>
                    <th>Sales</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                  {STORE.brands.map((brand) => (
                    <tr key={brand.id}>
                      <td>
                        <span className="av" style={{ background: brand.accent }}>{brand.abbreviation}</span>
                        {brand.name}
                        <span className="sub">{brand.category}</span>
                      </td>
                      <td>{brand.category}</td>
                      <td>{getBrandProductCount(brand.id)}</td>
                      <td>R{(getBrandProductCount(brand.id) * 124).toLocaleString()}</td>
                      <td>
                        <span className="pill green">● Active</span>
                      </td>
                      <td>⋯</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
        <aside className="panel">
          <h3>
            <span className="av" style={{ background: "#2f4a35" }}>MM</span>
            Moss & Maple
            <span className="sub">Timeless essentials</span>
            {" "}
            <span>✕</span>
          </h3>
          <button className="btn pri">✎ Edit brand</button>
          {" "}
          <button className="btn ">View products ↗</button>
          <h3 style={{ marginTop: "18px" }}>Brand contact</h3>
          <div className="row">
            <span className="sub">Contact name</span>
            <span>Taylor Brooks</span>
          </div>
          <div className="row">
            <span className="sub">Email</span>
            <span>taylor@example.com</span>
          </div>
          <div className="row">
            <span className="sub">Phone</span>
            <span>+1 (415) 555-0189</span>
          </div>
          <div className="row">
            <span className="sub">Website</span>
            <span>www.mossandmaple.com</span>
          </div>
          <h3 style={{ marginTop: "18px" }}>
            Brand status
            {" "}
            <span className="pill green">Active</span>
          </h3>
          <span className="sub">This brand is approved and can sell on your store.</span>
          <h3 style={{ marginTop: "18px" }}>
            Store performance
            {" "}
            <span className="sub">Last 30 days ▾</span>
          </h3>
          <div className="grid g2">
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Products</span>
                <b>{getBrandProductCount("moss-maple")}</b>
                <span className="up">▲ 12%</span>
                {" "}
                <span />
              </div>
            </div>
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Sales</span>
                <b>R12,480</b>
                <span className="up">▲ 14%</span>
                {" "}
                <span />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}
