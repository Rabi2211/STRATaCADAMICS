import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StoreLayout from "../../components/StoreLayout";
import { addToCart } from "../../lib/cart";
import { getProductById } from "../../data/store";

function formatCurrency(value: number) {
  return `R${value.toFixed(2)}`;
}

export default function ProductDetailPage() {
  const { productId } = useParams();
  const [quantity, setQuantity] = useState(1);

  const productData = useMemo(() => {
    if (!productId) {
      return null;
    }

    return getProductById(productId);
  }, [productId]);

  if (!productData) {
    return (
      <StoreLayout>
        <main style={{ maxWidth: 720, margin: "32px auto", padding: "0 20px 80px" }}>
          <h1>Product not found</h1>
          <p>This item is no longer available in the collection.</p>
          <Link to="/men" className="btn" style={{ display: "inline-block" }}>Back to shop</Link>
        </main>
      </StoreLayout>
    );
  }

  const { product, brand, reviews } = productData;
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        brandId: product.brandId,
        imageClass: product.imageClass,
      },
      quantity,
    );
  };

  return (
    <StoreLayout>
      <main style={{ maxWidth: 1180, margin: "32px auto", padding: "0 20px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
          <Link to="/men" style={{ color: "#1d1a17", textDecoration: "none" }}>← Back to shop</Link>
          {brand && <span style={{ color: "#5f6b5b", fontWeight: 600 }}>{brand.name}</span>}
        </div>

        <div style={{ display: "grid", gap: 24, gridTemplateColumns: "minmax(0, 1.2fr) minmax(320px, .8fr)" }}>
          <section style={{ border: "1px solid #e9e1d7", background: "#fff", borderRadius: 18, padding: 20 }}>
            <div style={{ minHeight: 500, borderRadius: 18, background: "linear-gradient(135deg, #efe4d5 0%, #d9d0c7 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64 }}>
              {product.name.slice(0, 1).toUpperCase()}
            </div>
          </section>

          <aside style={{ border: "1px solid #e9e1d7", background: "#fff", borderRadius: 18, padding: 20, height: "fit-content" }}>
            <div style={{ color: "#756d66", textTransform: "uppercase", letterSpacing: 1.2, fontSize: 12, fontWeight: 700 }}>{product.category}</div>
            <h1 style={{ marginTop: 8, marginBottom: 8, fontSize: "clamp(2rem, 4vw, 2.8rem)" }}>{product.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <strong>{averageRating.toFixed(1)}</strong>
              <span style={{ color: "#d29f36" }}>★★★★★</span>
              <span style={{ color: "#665f5a" }}>({reviews.length} reviews)</span>
            </div>

            <div style={{ fontSize: 30, fontWeight: 700, marginBottom: 18 }}>{formatCurrency(product.price)}</div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <span style={{ color: "#4d5d4b" }}>Qty</span>
              <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))} className="btn btn--small" style={{ minWidth: 36 }}>−</button>
              <strong>{quantity}</strong>
              <button type="button" onClick={() => setQuantity((current) => Math.min(product.available, current + 1))} className="btn btn--small" style={{ minWidth: 36 }}>+</button>
            </div>

            <button type="button" className="btn" onClick={handleAddToCart} style={{ width: "100%", justifyContent: "center", marginBottom: 12 }}>
              Add {quantity} to cart
            </button>

            <div style={{ color: "#4c5d47", fontSize: 14, marginBottom: 20 }}>
              {product.available > 0 ? `In stock · ${product.available} units left` : "Currently unavailable"}
            </div>

            <div style={{ display: "grid", gap: 8, marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 8 }}><span>✓</span><span>Free delivery on orders over R1,000</span></div>
              <div style={{ display: "flex", gap: 8 }}><span>✓</span><span>30-day easy returns</span></div>
              <div style={{ display: "flex", gap: 8 }}><span>✓</span><span>Verified premium craftsmanship</span></div>
            </div>

            <div style={{ borderTop: "1px solid #eee", paddingTop: 16 }}>
              <small style={{ color: "#6d645f" }}>SKU: {product.sku}</small>
            </div>
          </aside>
        </div>

        <section style={{ marginTop: 28, border: "1px solid #e9e1d7", background: "#fff", borderRadius: 18, padding: 20 }}>
          <h2 style={{ marginTop: 0 }}>Product details</h2>
          <p style={{ color: "#4a463f", lineHeight: 1.8 }}>{product.description}</p>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
            <div style={{ background: "#f8f5f1", borderRadius: 12, padding: 12 }}><strong>Material</strong><div>Premium cotton blend</div></div>
            <div style={{ background: "#f8f5f1", borderRadius: 12, padding: 12 }}><strong>Fit</strong><div>Relaxed, modern silhouette</div></div>
            <div style={{ background: "#f8f5f1", borderRadius: 12, padding: 12 }}><strong>Care</strong><div>Gentle cold wash</div></div>
          </div>
        </section>

        <section style={{ marginTop: 28, border: "1px solid #e9e1d7", background: "#fff", borderRadius: 18, padding: 20 }}>
          <h2 style={{ marginTop: 0 }}>Customer reviews</h2>
          <div style={{ display: "grid", gap: 14 }}>
            {reviews.map((review) => (
              <div key={`${product.id}-${review.name}`} style={{ border: "1px solid #eee", borderRadius: 12, padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <strong>{review.name}</strong>
                  <span style={{ color: "#d29f36" }}>{"★".repeat(review.rating)}{review.rating < 5 ? "☆".repeat(5 - review.rating) : ""}</span>
                </div>
                <p style={{ color: "#4a463f", marginBottom: 0 }}>{review.review}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </StoreLayout>
  );
}
