import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { saveProducts, subscribeToProducts } from "../../lib/product-store";
import { createProduct, deleteProduct, fetchBrands, fetchProducts, mapApiProduct, normalizeProductStatus, updateProduct, type ApiBrand } from "../../lib/store-api";
import { subscribeToBrands } from "../../lib/brand-store";
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
  imageUrl: string;
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
  imageUrl: "",
});

export default function MarketProducts() {
  const [brands, setBrands] = useState<ApiBrand[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [form, setForm] = useState<ProductForm>(initialForm(""));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    let active = true;

    const loadStoreData = async () => {
      try {
        const [nextBrands, nextProducts] = await Promise.all([fetchBrands(), fetchProducts()]);

        if (!active) {
          return;
        }

        saveProducts(nextProducts);
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

    const unsubscribe = subscribeToProducts((nextProducts) => {
      setProducts(nextProducts.map((product) => mapApiProduct(product)));
    });

    const brandUnsubscribe = subscribeToBrands((nextBrands) => {
      setBrands(nextBrands);
      setForm((current) => ({
        ...current,
        brandId: current.brandId || nextBrands[0]?.id || "",
      }));
    });

    return () => {
      active = false;
      unsubscribe();
      brandUnsubscribe();
    };
  }, []);

  const activeProducts = products.filter((product) => product.status === "Active").length;
  const lowStockProducts = products.filter((product) => product.available < 25).length;
  const draftProducts = products.filter((product) => product.status === "Draft").length;
  const totalShare = (count: number) => products.length > 0 ? Math.round((count / products.length) * 100) : 0;

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleImageSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose a JPG, PNG, or WebP image for the product.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("The product image must be 10MB or smaller.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const nextImageUrl = typeof reader.result === "string" ? reader.result : "";
      setError(null);
      setForm((current) => ({ ...current, imageUrl: nextImageUrl }));
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const brand = brands.find((item) => item.id === form.brandId);

    if (!brand) {
      setError("Choose a brand before creating the product.");
      return;
    }

    if (!form.name.trim() || !form.sku.trim()) {
      setError("Enter a product name and SKU before creating the product.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        brandId: brand.id,
        name: form.name.trim(),
        category: form.category || "General",
        sku: form.sku.trim(),
        price: Number(form.price) || 0,
        available: Number(form.quantity) || 0,
        status: normalizeProductStatus(form.status).toUpperCase().replace(/\s+/g, "_"),
        description: form.description.trim() || `Added from the store owner account for ${brand.name}.`,
        imageClass: "t1",
        imageUrl: form.imageUrl || null,
      };

      if (editingId) {
        const updated = await updateProduct(editingId, payload);
        const nextProducts = products.map((product) => product.id === editingId ? mapApiProduct(updated) : product);
        setProducts(nextProducts);
        saveProducts(nextProducts);
      } else {
        const created = await createProduct(payload);
        const nextProducts = [created, ...products];
        setProducts(nextProducts.map((product) => mapApiProduct(product)));
        saveProducts(nextProducts);
      }

      setEditingId(null);
      setForm({ ...initialForm(brand.id), brandId: brand.id });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save product.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProduct = (product: ProductRow) => {
    setEditingId(product.id);
    setError(null);
    setForm({
      name: product.name,
      brandId: product.brandId,
      description: product.description,
      category: product.category,
      price: String(product.price),
      sku: product.sku,
      quantity: String(product.available),
      status: product.status,
      imageUrl: product.imageUrl ?? "",
    });
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      setSubmitting(true);
      setError(null);
      await deleteProduct(productId);
      const nextProducts = products.filter((product) => product.id !== productId);
      setProducts(nextProducts);
      saveProducts(nextProducts);
      if (editingId === productId) {
        setEditingId(null);
        setForm(initialForm(form.brandId));
      }
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete product.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds((current) => current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId]);
  };

  const toggleAllVisible = () => {
    const visibleIds = paginatedProducts.map((product) => product.id);
    const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedProductIds.includes(id));
    setSelectedProductIds((current) => allVisibleSelected
      ? current.filter((id) => !visibleIds.includes(id))
      : Array.from(new Set([...current, ...visibleIds])));
  };

  const handleBulkDelete = async () => {
    if (selectedProductIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedProductIds.length} selected product${selectedProductIds.length === 1 ? "" : "s"}?`)) return;

    try {
      setSubmitting(true);
      setError(null);
      for (const productId of selectedProductIds) {
        await deleteProduct(productId);
      }
      const nextProducts = products.filter((product) => !selectedProductIds.includes(product.id));
      setProducts(nextProducts);
      saveProducts(nextProducts);
      setSelectedProductIds([]);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete selected products.");
    } finally {
      setSubmitting(false);
    }
  };

  const categories = Array.from(new Set(products.map((product) => product.category).filter(Boolean))).sort();
  const statuses = Array.from(new Set(products.map((product) => product.status).filter(Boolean))).sort();

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    const brand = brands.find((item) => item.id === product.brandId);
    const matchesSearch = !normalizedSearchQuery || [
      product.name,
      product.sku,
      product.category,
      brand?.name ?? "",
    ].some((value) => value.toLowerCase().includes(normalizedSearchQuery));
    const matchesBrand = !selectedBrandId || product.brandId === selectedBrandId;
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesStatus = !selectedStatus || product.status === selectedStatus;

    return matchesSearch && matchesBrand && matchesCategory && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedProducts = filteredProducts.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedBrandId, selectedCategory, selectedStatus]);

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
          <input
            className="search"
            placeholder="Search products, brands, SKU…"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <select
            className="search"
            value={selectedBrandId}
            onChange={(event) => setSelectedBrandId(event.target.value)}
          >
            <option value="">All brands</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
          <select className="search" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select className="search" value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
            <option value="">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
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
                <span className="up">▲ {totalShare(products.length)}%</span>
                {" "}
                <span>across the store</span>
              </div>
            </div>
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Active products</span>
                <b>{activeProducts}</b>
                <span className="up">▲ {totalShare(activeProducts)}%</span>
                {" "}
                <span>live in the storefront</span>
              </div>
            </div>
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Drafts</span>
                <b>{draftProducts}</b>
                <span className="up">▲ {totalShare(draftProducts)}%</span>
                {" "}
                <span>pending approval</span>
              </div>
            </div>
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Low stock</span>
                <b>{lowStockProducts}</b>
                <span className="up">▼ {totalShare(lowStockProducts)}%</span>
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
                    <th>
                      <input
                        type="checkbox"
                        aria-label="Select all visible products"
                        checked={paginatedProducts.length > 0 && paginatedProducts.every((product) => selectedProductIds.includes(product.id))}
                        onChange={toggleAllVisible}
                      />
                    </th>
                    <th>Product</th>
                    <th>Brand</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Available</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                  {paginatedProducts.map((product) => {
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

                    const productThumbStyle = product.imageUrl
                      ? {
                          backgroundImage: `url("${product.imageUrl}")`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                        }
                      : undefined;

                    return (
                      <tr key={product.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedProductIds.includes(product.id)}
                            onChange={() => toggleProductSelection(product.id)}
                          />
                        </td>
                        <td>
                          <span className={`thumb ${product.imageClass}`} style={productThumbStyle} />
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
                          <button className="btn" type="button" onClick={() => handleEditProduct(product)}>Edit</button>
                          {" "}
                          <button className="btn" type="button" disabled={submitting} onClick={() => void handleDeleteProduct(product.id)}>⋯</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="pager">
              <span>Showing {((currentPage - 1) * pageSize) + 1}–{Math.min(currentPage * pageSize, filteredProducts.length)} of {filteredProducts.length} products</span>
              <span>
                <span className="on">{currentPage}</span>
              </span>
              <span>
                {filteredProducts.length > 0 ? (
                  <>
                    <button
                      type="button"
                      className="btn"
                      disabled={safeCurrentPage === 1}
                      onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    >
                      Previous
                    </button>
                    {" "}
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        className={page === safeCurrentPage ? "on" : "btn"}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                    {" "}
                    <button
                      type="button"
                      className="btn"
                      disabled={safeCurrentPage === totalPages}
                      onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    >
                      Next
                    </button>
                  </>
                ) : null}
              </span>
            </div>
            <button className="btn pri" onClick={handleBulkDelete} disabled={submitting || selectedProductIds.length === 0}>
              {submitting ? "Deleting…" : `Delete ${selectedProductIds.length} selected product${selectedProductIds.length === 1 ? "" : "s"}`}
            </button>
          </section>
        </div>
        <aside className="panel">
          <form onSubmit={handleSubmit}>
            <h3>
              {editingId ? "Edit product" : "Add product"}
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
              <select name="brandId" value={form.brandId} onChange={handleChange} disabled={brands.length === 0}>
                {brands.length === 0 ? (
                  <option value="">No brands available</option>
                ) : (
                  <>
                    {!form.brandId && <option value="">Choose a brand</option>}
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </>
                )}
              </select>
            </div>
            <div className="field">
              <label>Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe your product, materials, fit, care, etc." />
            </div>
            <label>
              <b>Images *</b>
            </label>
            <input
              id="product-image-upload"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="product-image-input"
              onChange={handleImageSelection}
              aria-label="Upload product image"
            />
            <label
              className="drop"
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
            >
              {form.imageUrl ? (
                <>
                  <img src={form.imageUrl} alt="Product preview" className="drop-preview" />
                  <span className="sub">Image selected and ready to save</span>
                </>
              ) : (
                <>
                  ⬆ Click to upload images
                  <span className="sub">or drag and drop · JPG, PNG, WebP · Max 10MB each</span>
                </>
              )}
            </label>
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
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
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
            <button className="btn pri full" type="submit" disabled={submitting}>{submitting ? (editingId ? "Updating…" : "Creating…") : (editingId ? "Update product" : "Create product")}</button>
            <button className="btn full" type="button" onClick={() => {
              setEditingId(null);
              setForm(initialForm(form.brandId || brands[0]?.id || ""));
            }}>Cancel</button>
          </form>
        </aside>
      </div>
    </DashboardLayout>
  );
}
