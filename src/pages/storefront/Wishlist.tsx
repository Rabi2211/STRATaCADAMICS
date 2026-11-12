import { useState } from "react";
import { Link } from "react-router-dom";
import StoreLayout from "../../components/StoreLayout";
import { STORE } from "../../data/store";
import { readWishlist, toggleWishlist } from "../../lib/wishlist";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<string[]>(readWishlist);

  const items = STORE.products.filter((product) => wishlist.includes(product.id));

  const handleRemove = (productId: string) => {
    setWishlist(toggleWishlist(productId));
  };

  return (
    <StoreLayout fullWidth>
      <main style={{ width: "100%", maxWidth: "none", margin: 0, padding: "32px 32px 80px" }}>
        <h1 style={{ marginBottom: 12 }}>Wishlist</h1>
        {items.length === 0 ? (
          <>
            <p>No saved items yet. Add a few favorites to keep track of styles you love.</p>
            <Link to="/men" className="btn" style={{ display: "inline-block" }}>Browse products</Link>
          </>
        ) : (
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {items.map((product) => (
              <article key={product.id} style={{ border: "1px solid #e5e0d9", background: "#fff", borderRadius: 14, padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <strong>{product.name}</strong>
                  <button type="button" onClick={() => handleRemove(product.id)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#7d2f2a" }}>Remove</button>
                </div>
                <p style={{ margin: "8px 0 0" }}>{product.category}</p>
                <p style={{ margin: "8px 0 16px", fontWeight: 700 }}>R{product.price.toFixed(2)}</p>
                <Link to="/men" className="btn" style={{ display: "inline-block" }}>View product</Link>
              </article>
            ))}
          </div>
        )}
      </main>
    </StoreLayout>
  );
}
