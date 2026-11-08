import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { createProduct, fetchBrands, fetchProducts, mapApiProduct, normalizeProductStatus, type ApiBrand } from "../../lib/store-api";
import "./Products.css";

type ProductRow = ReturnType<typeof mapApiProduct>;

type ProductForm = {
  name: string;
  brandId: string;
  description: string;
  category: string;
  price: string;
  sku: string;
  quantity: string;
  status: "Draft" | "Active" | "Low stock" | "Preorder";
};

const initialForm = (brandId: string): ProductForm => ({
  name: "",
  brandId,
  description: "",
  category: "Sweaters",
  price: "120",
  sku: "",
  quantity: "0",
  status: "Draft",
});

export default function MarketProducts() {
  const [brands, setBrands] = useState<ApiBrand[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [form, setForm] = useState<ProductForm>(initialForm(""));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    const loadStoreData = async () => {
      try {
        const [nextBrands, nextProducts] = await Promise.all([fetchBrands(), fetchProducts()]);

        if (!active) {
          return;
        }

        setBrands(nextBrands);
        setProducts(nextProducts.map((product) => mapApiProduct(product)));
        setForm((current) => {
          const fallbackBrandId = current.brandId || nextBrands[0]?.id || "";
          return {
            ...initialForm(fallbackBrandId),
            brandId: fallbackBrandId,
          };
        });
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

    void loadStoreData();
    return () => { active = false; };
  }, []);

  const activeProducts = products.filter((product) => product.status === "Active").length;
  const lowStockProducts = products.filter((product) => product.available < 25).length;

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const brand = brands.find((item) => item.id === form.brandId);

    if (!brand || !form.name.trim() || !form.sku.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const created = await createProduct({
        brandId: brand.id,
        name: form.name.trim(),
        category: form.category || "General",
        sku: form.sku.trim(),
        price: Number(form.price) || 0,
        available: Number(form.quantity) || 0,
        status: normalizeProductStatus(form.status).toUpperCase().replace(/\s+/g, "_"),
        description: form.description.trim() || `Added from the store owner account for ${brand.name}.`,
        imageClass: "t1",
      });

      setProducts((current) => [mapApiProduct(created), ...current]);
      setForm({ ...initialForm(brand.id), brandId: brand.id });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save product.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout kind="market" title="Products" subtitle="Loading store catalog…">
        <div className="card">Loading products…</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      kind="market"
      title={"Products"}
      subtitle={"Manage the store catalog from one owner account and connect every product to the right brand."}
      actions={
        <>
          <input className="search" placeholder="Search products, brands, SKU…" />
          <select className="search">
            <option>All brands</option>
            {brands.map((brand) => (
              <option key={brand.id}>{brand.name}</option>
            ))}
          </select>
          <select className="search">
            <option>All categories</option>
          </select>
          <select className="search">
            <option>All statuses</option>
          </select>
          <Link to="/" className="btn pri">View storefront ↗</Link>
        </>
      }
    >
      <div className="split">
        <div>
          <div className="grid g4">
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Total products</span>
                <b>{products.length}</b>
                <span className="up">▲ 12%</span>
                {" "}
                <span>across the store</span>
              </div>
            </div>
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Active products</span>
                <b>{activeProducts}</b>
                <span className="up">▲ 14%</span>
                {" "}
                <span>live in the storefront</span>
              </div>
            </div>
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Drafts</span>
                <b>{products.filter((product) => product.status === "Draft").length}</b>
                <span className="up">▲ 33%</span>
                {" "}
                <span>pending approval</span>
              </div>
            </div>
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Low stock</span>
                <b>{lowStockProducts}</b>
                <span className="up">▼ 47%</span>
                {" "}
                <span>need restocking</span>
              </div>
            </div>
          </div>
          <section className="card ">
            <h3 />
            {error && <p className="auth-error">{error}</p>}
            <div className="wrap">
              <table>
                <tbody>
                  <tr>
                    <th>☐</th>
                    <th>Product</th>
                    <th>Brand</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Available</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                  {products.map((product) => {
                    const brand = brands.find((item) => item.id === product.brandId);
                    const badgeClass = product.status === "Active" ? "green" : product.status === "Draft" ? "orange" : product.status === "Low stock" ? "orange" : "blue";
                    const brandInitials = brand?.abbreviation ?? (
                      brand?.name
                        ?.split(/\s+/)
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase() || "ST"
                    );

                    return (
                      <tr key={product.id}>
                        <td>☐</td>
                        <td>
                          <span className={`thumb ${product.imageClass}`} />
                          {product.name}
                          <span className="sub">{product.category}</span>
                        </td>
                        <td>
                          <span className="av" style={{ background: brand?.accent ?? "#5c5c5c" }}>{brandInitials}</span>
                          {brand?.name ?? "Store brand"}
                        </td>
                        <td>{product.sku}</td>
                        <td>R{product.price.toFixed(2)}</td>
                        <td>{product.available}</td>
                        <td>
                          <span className={`pill ${badgeClass}`}>{product.status}</span>
                        </td>
                        <td>
                          <button className="btn ">Edit</button>
                          {" "}
                          ⋯
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="pager">
              <span>Showing 1–{products.length} of {products.length} products</span>
              <span>
                <span className="on">1</span>
              </span>
            </div>
          </section>
        </div>
        <aside className="panel">
          <form onSubmit={handleSubmit}>
            <h3>
              Add product
              {" "}
              <span>✕</span>
            </h3>
            <b>Basic information</b>
            <br />
            <br />
            <div className="field">
              <label>Product name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Linen Knit Sweater" />
            </div>
            <div className="field">
              <label>Brand *</label>
              <select name="brandId" value={form.brandId} onChange={handleChange}>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe your product, materials, fit, care, etc." />
            </div>
            <label>
              <b>Images *</b>
            </label>
            <div className="drop">
              ⬆ Click to upload images
              <span className="sub">or drag and drop · JPG, PNG, WebP · Max 10MB each</span>
            </div>
            <b>Pricing & identifiers</b>
            <br />
            <br />
            <div className="grid g2">
              <div className="field">
                <label>Price *</label>
                <input name="price" type="number" min="0" value={form.price} onChange={handleChange} />
              </div>
              <div className="field">
                <label>SKU *</label>
                <input name="sku" value={form.sku} onChange={handleChange} placeholder="e.g. 12345-AB" />
              </div>
            </div>
            <div className="field">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange}>
                <option>Sweaters</option>
                <option>Outerwear</option>
                <option>Shirts</option>
                <option>Pants</option>
                <option>Tops</option>
                <option>Accessories</option>
              </select>
            </div>
            <b>Status</b>
            <br />
            <br />
            <div className="field">
              <label>Availability *</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="Draft">Draft</option>
                <option value="Active">Active</option>
                <option value="Low stock">Low stock</option>
                <option value="Preorder">Preorder</option>
              </select>
            </div>
            <b>Inventory</b>
            <br />
            <br />
            <div className="field">
              <label>Available quantity *</label>
              <input name="quantity" type="number" min="0" value={form.quantity} onChange={handleChange} />
            </div>
            <button className="btn pri full" type="submit" disabled={submitting}>{submitting ? "Creating…" : "Create product"}</button>
            <button className="btn full" type="button" onClick={() => setForm(initialForm(form.brandId || brands[0]?.id || ""))}>Cancel</button>
          </form>
        </aside>
      </div>
    </DashboardLayout>
  );
}
