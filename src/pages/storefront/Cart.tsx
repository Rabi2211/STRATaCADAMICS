import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StoreLayout from "../../components/StoreLayout";
import { addToCart, getCartSummary, readCart, removeFromCart, updateCartQuantity, type CartEntry } from "../../lib/cart";
import { getStoredAuthSession } from "../../lib/storage";

function formatCurrency(value: number) {
  return `R${value.toFixed(2)}`;
}

export default function CartPage() {
  const [items, setItems] = useState<CartEntry[]>(() => readCart());
  const session = getStoredAuthSession();
  const navigate = useNavigate();

  const summary = useMemo(() => getCartSummary(items), [items]);

  const handleQuantityChange = (productId: string, nextQuantity: number) => {
    if (nextQuantity <= 0) {
      setItems(removeFromCart(productId));
      return;
    }

    setItems(updateCartQuantity(productId, nextQuantity));
  };

  const handleAddOne = (item: CartEntry) => {
    setItems(addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      brandId: item.brandId,
      imageClass: item.imageClass,
    }, 1));
  };

  if (!items.length) {
    return (
      <StoreLayout>
        <main style={{ maxWidth: 960, margin: "32px auto", padding: "0 20px 80px" }}>
          <h1 style={{ fontSize: 32, marginBottom: 12 }}>Your cart</h1>
          <p style={{ marginBottom: 20 }}>There are no items in your cart yet.</p>
          <Link to="/men" className="btn" style={{ display: "inline-block" }}>Continue shopping</Link>
        </main>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <main style={{ maxWidth: 960, margin: "32px auto", padding: "0 20px 80px" }}>
        <h1 style={{ fontSize: 32, marginBottom: 20 }}>Your cart</h1>

        <div style={{ display: "grid", gap: 24, gridTemplateColumns: "minmax(0, 2fr) minmax(260px, 1fr)" }}>
          <div style={{ display: "grid", gap: 12 }}>
            {items.map((item) => (
              <div key={item.id} style={{ border: "1px solid #e5e0d9", borderRadius: 14, padding: 16, background: "#fff", display: "grid", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center" }}>
                  <div>
                    <strong>{item.name}</strong>
                    <div style={{ color: "#6d645f", fontSize: 14 }}>{item.brandId ? "Brand item" : "Strata pick"}</div>
                  </div>
                  <button type="button" onClick={() => { setItems(removeFromCart(item.id)); }} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#7d2f2a" }}>
                    Remove
                  </button>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button type="button" onClick={() => handleQuantityChange(item.id, item.quantity - 1)} aria-label={`Decrease quantity for ${item.name}`} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #d2c9bf", background: "#f7f3ee", cursor: "pointer" }}>-</button>
                    <span style={{ minWidth: 20, textAlign: "center" }}>{item.quantity}</span>
                    <button type="button" onClick={() => handleAddOne(item)} aria-label={`Increase quantity for ${item.name}`} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #d2c9bf", background: "#f7f3ee", cursor: "pointer" }}>+</button>
                  </div>
                  <strong>{formatCurrency(item.price * item.quantity)}</strong>
                </div>
              </div>
            ))}
          </div>

          <aside style={{ border: "1px solid #e5e0d9", background: "#fff", borderRadius: 14, padding: 20, height: "fit-content" }}>
            <h2 style={{ marginTop: 0 }}>Summary</h2>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span>Items</span>
              <span>{summary.totalItems}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span>Subtotal</span>
              <strong>{formatCurrency(summary.subtotal)}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <span>Shipping</span>
              <span>R0.00</span>
            </div>
            <button
              type="button"
              className="btn"
              onClick={() => {
                if (!session) {
                  navigate("/");
                  return;
                }
                navigate("/checkout");
              }}
              style={{ width: "100%", justifyContent: "center" }}
            >
              {session ? "Proceed to checkout" : "Sign in to checkout"}
            </button>
            <div style={{ marginTop: 12, textAlign: "center" }}>
              <Link to="/men" style={{ color: "#413933" }}>Continue shopping</Link>
            </div>
          </aside>
        </div>
      </main>
    </StoreLayout>
  );
}
