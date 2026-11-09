import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { fetchBrands, fetchProducts, mapApiProduct, type ApiBrand } from "../../lib/store-api";
import "./Brands.css";

const emptyBrandForm = () => ({
  name: "",
  email: "",
  description: "",
});

export default function MarketBrands() {
  const [brands, setBrands] = useState<ApiBrand[]>([]);
  const [products, setProducts] = useState<ReturnType<typeof mapApiProduct>[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [brandDraft, setBrandDraft] = useState(emptyBrandForm());
  const [brandError, setBrandError] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [nextBrands, nextProducts] = await Promise.all([fetchBrands(), fetchProducts()]);
        if (!active) return;
        setBrands(nextBrands);
        setProducts(nextProducts.map((product) => mapApiProduct(product)));
        setSelectedBrandId((current) => current || nextBrands[0]?.id || "");
      } catch (error) {
        if (active) {
          console.error("Unable to load brands", error);
        }
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  const activeBrandCount = brands.length;
  const totalProducts = products.length;
  const selectedBrand = brands.find((brand) => brand.id === selectedBrandId) ?? brands[0] ?? null;

  const getBrandProductCount = (brandId: string) =>
    products.filter((product) => product.brandId === brandId).length;

  const handleBrandSubmit = (event: FormEvent) => {
    event.preventDefault();

    const name = brandDraft.name.trim();
    if (!name) {
      setBrandError("Brand name is required.");
      return;
    }

    const initials = name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "BR";

    const nextBrand: ApiBrand = {
      id: `brand-${Date.now()}`,
      name,
      description: brandDraft.description || "New brand created from the owner account.",
      accent: "#c4664a",
      abbreviation: initials,
      owner: {
        id: `owner-${Date.now()}`,
        email: brandDraft.email || "owner@strata.app",
        name: "Store owner",
        role: "Brand",
      },
      products: [],
    };

    setBrands((current) => [nextBrand, ...current]);
    setSelectedBrandId(nextBrand.id);
    setShowBrandForm(false);
    setBrandDraft(emptyBrandForm());
    setBrandError("");
  };

  return (
    <DashboardLayout
      kind="market"
      title={"Brands"}
      subtitle={"Manage the brands in your store portfolio and keep every storefront listing connected to the owner account."}
      actions={
        <>
          <input className="search" placeholder="Search brands by name or category…" />
          <span className="seg">
            <span className="on">All ({brands.length})</span>
            <span>Active ({activeBrandCount})</span>
          </span>
          <button className="btn pri" type="button" onClick={() => setShowBrandForm(true)}>+ Add brand</button>
        </>
      }
    >
      {showBrandForm && (
        <form className="card" onSubmit={handleBrandSubmit} style={{ marginBottom: 18 }}>
          <h3>Add brand</h3>
          {brandError && <p className="auth-error">{brandError}</p>}
          <div className="grid g2">
            <label className="field">
              <span>Brand name</span>
              <input value={brandDraft.name} onChange={(event) => setBrandDraft((current) => ({ ...current, name: event.target.value }))} />
            </label>
            <label className="field">
              <span>Brand email</span>
              <input type="email" value={brandDraft.email} onChange={(event) => setBrandDraft((current) => ({ ...current, email: event.target.value }))} />
            </label>
          </div>
          <label className="field">
            <span>Description</span>
            <textarea value={brandDraft.description} onChange={(event) => setBrandDraft((current) => ({ ...current, description: event.target.value }))} />
          </label>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn pri" type="submit">Save brand</button>
            <button className="btn" type="button" onClick={() => { setShowBrandForm(false); setBrandError(""); }}>Cancel</button>
          </div>
        </form>
      )}
      <div className="split">
        <div>
          <div className="grid g3">
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Total brands</span>
                <b>{brands.length}</b>
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
                  {brands.map((brand) => (
                    <tr key={brand.id} onClick={() => setSelectedBrandId(brand.id)} style={{ cursor: "pointer" }}>
                      <td>
                        <span className="av" style={{ background: brand.accent ?? "#5b6b4c" }}>{brand.abbreviation ?? brand.name.slice(0, 2).toUpperCase()}</span>
                        {brand.name}
                        <span className="sub">{brand.owner?.role ?? "Brand"}</span>
                      </td>
                      <td>{brand.owner?.role ?? "Store"}</td>
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
            <span className="av" style={{ background: selectedBrand?.accent ?? "#2f4a35" }}>{selectedBrand?.abbreviation ?? "ST"}</span>
            {selectedBrand?.name ?? "Store brand"}
            <span className="sub">{selectedBrand?.description ?? "Brand catalog"}</span>
            {" "}
            <span>✕</span>
          </h3>
          <button className="btn pri" type="button" onClick={() => setShowBrandForm(true)}>✎ Edit brand</button>
          {" "}
          <Link to="/market/products" className="btn">View products ↗</Link>
          <h3 style={{ marginTop: "18px" }}>Brand contact</h3>
          <div className="row">
            <span className="sub">Contact name</span>
            <span>{selectedBrand?.owner?.name ?? "Store owner"}</span>
          </div>
          <div className="row">
            <span className="sub">Email</span>
            <span>{selectedBrand?.owner?.email ?? "owner@store.com"}</span>
          </div>
          <div className="row">
            <span className="sub">Phone</span>
            <span>+1 (415) 555-0189</span>
          </div>
          <div className="row">
            <span className="sub">Website</span>
            <span>www.stratamarket.com</span>
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
                <b>{selectedBrand ? getBrandProductCount(selectedBrand.id) : 0}</b>
                <span className="up">▲ 12%</span>
                {" "}
                <span />
              </div>
            </div>
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Sales</span>
                <b>R{((selectedBrand ? getBrandProductCount(selectedBrand.id) : 0) * 124).toLocaleString()}</b>
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
