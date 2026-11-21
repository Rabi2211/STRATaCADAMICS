import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { getCurrentSession, registerUser } from "../../lib/auth";
import { saveAuthSession } from "../../lib/storage";
import DashboardLayout from "../../components/DashboardLayout";
import { createBrand, fetchBrands, fetchProducts, mapApiProduct, type ApiBrand } from "../../lib/store-api";
import { subscribeToBrands } from "../../lib/brand-store";
import "./Brands.css";

const emptyBrandForm = () => ({
  name: "",
  email: "",
  password: "",
  fullName: "",
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

    const unsubscribe = subscribeToBrands((nextBrands) => {
      if (active) {
        setBrands(nextBrands);
        setSelectedBrandId((current) => current || nextBrands[0]?.id || "");
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const activeBrandCount = brands.length;
  const totalProducts = products.length;
  const selectedBrand = brands.find((brand) => brand.id === selectedBrandId) ?? brands[0] ?? null;

  const getBrandProductCount = (brandId: string) =>
    products.filter((product) => product.brandId === brandId).length;

  const handleBrandSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const name = brandDraft.name.trim();
    const email = brandDraft.email.trim();
    const password = brandDraft.password;
    const ownerName = brandDraft.fullName.trim();

    if (!name) {
      setBrandError("Brand name is required.");
      return;
    }
    if (!ownerName || !email || !password) {
      setBrandError("Owner name, email, and password are required.");
      return;
    }

    const adminSession = getCurrentSession();

    try {
      const ownerSession = await registerUser({
        email,
        password,
        name: ownerName,
        role: "brand-owner",
      });

      const nextBrand = await createBrand({
        name,
        description: brandDraft.description || "New brand created through the brand-owner registration form.",
      });

      if (adminSession) saveAuthSession(adminSession);

      setBrands((current) => [{
        ...nextBrand,
        owner: {
          id: ownerSession.user.id,
          email: ownerSession.user.email,
          name: ownerSession.user.name,
          role: "brand-owner",
        },
      }, ...current]);
      setSelectedBrandId(nextBrand.id);
      setShowBrandForm(false);
      setBrandDraft(emptyBrandForm());
      setBrandError("");
    } catch (error) {
      setBrandError(error instanceof Error ? error.message : "Unable to register brand owner and create brand.");
    }
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
          <h3>Register brand owner and add brand</h3>
          {brandError && <p className="auth-error">{brandError}</p>}
          <div className="grid g2">
            <label className="field">
              <span>Brand name *</span>
              <input value={brandDraft.name} onChange={(event) => setBrandDraft((current) => ({ ...current, name: event.target.value }))} />
            </label>
            <label className="field">
              <span>Owner full name *</span>
              <input value={brandDraft.fullName} onChange={(event) => setBrandDraft((current) => ({ ...current, fullName: event.target.value }))} />
            </label>
            <label className="field">
              <span>Owner email *</span>
              <input type="email" value={brandDraft.email} onChange={(event) => setBrandDraft((current) => ({ ...current, email: event.target.value }))} />
            </label>
            <label className="field">
              <span>Owner password *</span>
              <input type="password" value={brandDraft.password} onChange={(event) => setBrandDraft((current) => ({ ...current, password: event.target.value }))} />
            </label>
          </div>
          <label className="field">
            <span>Description</span>
            <textarea value={brandDraft.description} onChange={(event) => setBrandDraft((current) => ({ ...current, description: event.target.value }))} />
          </label>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn pri" type="submit">Register owner & add brand</button>
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
              <table className="brands-table">
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
