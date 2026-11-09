import { useEffect, useState, type FormEvent } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  createProduct,
  deleteProduct,
  fetchBrands,
  fetchProducts,
  mapApiProduct,
  updateProduct,
  type ApiBrand,
} from "../../lib/store-api";
import "./Products.css";

type ProductRow = ReturnType<typeof mapApiProduct>;

const emptyForm = () => ({
  name: "",
  sku: "",
  price: "",
  quantity: "",
  category: "",
  description: "",
  status: "ACTIVE" as "ACTIVE" | "DRAFT" | "LOW_STOCK" | "PREORDER",
});

export default function StudioProducts() {
  const [brands, setBrands] = useState<ApiBrand[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
  const brandProducts = products.filter((product) => product.brandId === selectedBrandId);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm());
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

      const payload = {
        brandId: brand.id,
        name,
        sku,
        price,
        available: quantity,
        status: form.status,
        category,
        description: form.description.trim() || "Brand-owned product added to the store.",
        imageClass: `t${(brandProducts.length % 5) + 1}`,
      };

      if (editingId) {
        const updated = await updateProduct(editingId, payload);
        setProducts((current) => current.map((item) => (item.id === editingId ? mapApiProduct(updated) : item)));
      } else {
        const created = await createProduct(payload);
        setProducts((current) => [mapApiProduct(created), ...current]);
      }

      resetForm();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save product.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProduct = (product: ProductRow) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      sku: product.sku,
      price: String(product.price),
      quantity: String(product.available),
      category: product.category,
      description: product.description,
      status: product.status === "Active" ? "ACTIVE" : product.status === "Draft" ? "DRAFT" : product.status === "Low stock" ? "LOW_STOCK" : "PREORDER",
    });
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      setError(null);
      await deleteProduct(productId);
      setProducts((current) => current.filter((item) => item.id !== productId));
      if (editingId === productId) {
        resetForm();
      }
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete product.");
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
          <button className="btn pri" type="button" onClick={resetForm}>+ {editingId ? "New product" : "Add product"}</button>
        </>
      }
    >
      {error && <p className="auth-error">{error}</p>}
      <form onSubmit={handleSubmit} className="card" style={{ marginBottom: 20 }}>
        <h3>{editingId ? "Edit product for" : "Add product for"} {brand?.name}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          <label>
            <span className="sub">Product name</span>
            <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
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
          <label>
            <span className="sub">Status</span>
            <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as typeof form.status }))}>
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
              <option value="LOW_STOCK">Low stock</option>
              <option value="PREORDER">Preorder</option>
            </select>
          </label>
        </div>
        <label style={{ display: "block", marginTop: 12 }}>
          <span className="sub">Description</span>
          <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
        </label>
        <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
          <button className="btn pri" type="submit" disabled={submitting}>{submitting ? "Saving…" : editingId ? "Update product" : "Save product"}</button>
          {editingId && (
            <button className="btn" type="button" onClick={resetForm}>Cancel</button>
          )}
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
                  <td>
                    <button className="btn" type="button" onClick={() => handleEditProduct(product)}>✎ Edit</button>
                    &nbsp;
                    <button className="btn" type="button" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                  </td>
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
