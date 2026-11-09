import { useEffect, useRef, useState, type FormEvent } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { createProduct, fetchBrands, fetchProducts, mapApiProduct, type ApiBrand } from "../../lib/store-api";
import "./Products.css";

type ProductRow = ReturnType<typeof mapApiProduct>;

const emptyForm = () => ({
  name: "",
  sku: "",
  price: "",
  quantity: "",
  category: "",
  description: "",
});

export default function StudioProducts() {
  const [brands, setBrands] = useState<ApiBrand[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [form, setForm] = useState(emptyForm());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        const [nextBrands, nextProducts] = await Promise.all([fetchBrands(), fetchProducts()]);

        if (!active) {
          return;
        }

        setBrands(nextBrands);
        setProducts(nextProducts.map((product) => mapApiProduct(product)));
        setSelectedBrandId((current) => current || nextBrands[0]?.id || "");
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load store data.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadData();
    return () => { active = false; };
  }, []);

  const brand = brands.find((item) => item.id === selectedBrandId) ?? brands[0];
  const brandProducts = products.filter((product) => product.brandId === (selectedBrandId || brand?.id || ""));

  const focusProductForm = () => {
    window.setTimeout(() => {
      nameInputRef.current?.focus();
      nameInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 10);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const name = form.name.trim();
    const sku = form.sku.trim();
    const price = Number(form.price);
    const quantity = Number(form.quantity);
    const category = form.category.trim() || "Accessories";

    if (!brand || !name || !sku || Number.isNaN(price) || Number.isNaN(quantity)) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const created = await createProduct({
        brandId: brand.id,
        name,
        sku,
        price,
        available: quantity,
        status: "ACTIVE",
        category,
        description: form.description.trim() || "Brand-owned product added to the store.",
        imageClass: `t${(brandProducts.length % 5) + 1}`,
      });

      setProducts((current) => [mapApiProduct(created), ...current]);
      setForm(emptyForm());
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save product.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout kind="studio" title="Products" subtitle="Loading brand catalog…">
        <div className="card">Loading products…</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      kind="studio"
      title={"Products"}
      subtitle={`Manage ${brand?.name ?? "your brand"} products and push them into the shared store catalog.`}
      actions={
        <>
          <select
            className="search"
            value={selectedBrandId}
            onChange={(event) => setSelectedBrandId(event.target.value)}
          >
            {brands.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
          <button className="btn pri" type="button" onClick={focusProductForm}>+ Add product</button>
        </>
      }
    >
      {error && <p className="auth-error">{error}</p>}
      <form onSubmit={handleSubmit} className="card" style={{ marginBottom: 20 }}>
        <h3>Add product for {brand?.name}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          <label>
            <span className="sub">Product name</span>
            <input ref={nameInputRef} value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          </label>
          <label>
            <span className="sub">SKU</span>
            <input value={form.sku} onChange={(event) => setForm((current) => ({ ...current, sku: event.target.value }))} />
          </label>
          <label>
            <span className="sub">Price</span>
            <input type="number" min="0" value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} />
          </label>
          <label>
            <span className="sub">Quantity</span>
            <input type="number" min="0" value={form.quantity} onChange={(event) => setForm((current) => ({ ...current, quantity: event.target.value }))} />
          </label>
          <label>
            <span className="sub">Category</span>
            <input value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} />
          </label>
        </div>
        <label style={{ display: "block", marginTop: 12 }}>
          <span className="sub">Description</span>
          <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
        </label>
        <div style={{ marginTop: 16 }}>
          <button className="btn pri" type="submit" disabled={submitting}>{submitting ? "Saving…" : "Save product"}</button>
        </div>
      </form>
      <div className="tools">
        <input className="search" placeholder="Search products…" />
        <select className="search">
          <option>All categories</option>
        </select>
        <select className="search">
          <option>All status</option>
        </select>
        <button className="btn ">⚲</button>
      </div>
      <section className="card ">
        <h3 />
        <div className="wrap">
          <table>
            <tbody>
              <tr>
                <th>PRODUCT</th>
                <th>SKU</th>
                <th>PRICE</th>
                <th>AVAILABLE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
              {brandProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <span className={`thumb ${product.imageClass}`} />
                    <b>{product.name}</b>
                    <span className="sub">{product.description}</span>
                  </td>
                  <td>{product.sku}</td>
                  <td>R{product.price.toFixed(2)}</td>
                  <td>{product.available}</td>
                  <td>
                    <span className={`pill ${product.status === "Active" ? "green" : product.status === "Draft" ? "orange" : "blue"}`}>{product.status}</span>
                  </td>
                  <td>✎ Edit &nbsp; ⋯</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pager">
          <span>Showing 1–{brandProducts.length} of {brandProducts.length} products</span>
          <span>
            <span className="on">1</span>
          </span>
        </div>
      </section>
    </DashboardLayout>
  );
}
