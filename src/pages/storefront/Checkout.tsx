import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import StoreLayout from "../../components/StoreLayout";
import { buildOrderItemsFromCart, clearCart, getCartSummary, getCheckoutSummary, readCart } from "../../lib/cart";
import { buildPaymentCheckoutUrl, getPaymentProvider, PAYMENT_PROVIDERS, type PaymentProviderId } from "../../lib/payments";
import { createOrder } from "../../lib/store-api";
import { getStoredAuthSession } from "../../lib/storage";

function formatCurrency(value: number) {
  return `R${value.toFixed(2)}`;
}

export default function CheckoutPage() {
  const session = getStoredAuthSession();
  const navigate = useNavigate();
  const cart = useMemo(() => readCart(), []);
  const summary = useMemo(() => getCartSummary(cart), [cart]);
  const checkoutSummary = useMemo(() => getCheckoutSummary(cart), [cart]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: session?.user?.name ?? "",
    email: session?.user?.email ?? "",
    address: "123 Market Street\nJohannesburg\nSouth Africa",
    city: "Johannesburg",
    country: "South Africa",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentProviderId>("ozow");

  if (!session) {
    return <Navigate to="/" replace />;
  }

  if (!cart.length) {
    return (
      <StoreLayout>
        <main style={{ maxWidth: 720, margin: "32px auto", padding: "0 20px 80px" }}>
          <h1 style={{ marginBottom: 12 }}>Checkout</h1>
          <p>Your cart is empty. Add a few items before checking out.</p>
          <Link to="/men" className="btn" style={{ display: "inline-block" }}>Browse products</Link>
        </main>
      </StoreLayout>
    );
  }

  const handleSubmit = async () => {
    try {
      setError(null);
      setIsSubmitting(true);

      if (!shippingAddress.fullName.trim() || !shippingAddress.address.trim()) {
        throw new Error("Please complete your delivery details before placing the order.");
      }

      const response = await createOrder({
        items: buildOrderItemsFromCart(cart),
        paymentMethod,
        shippingAddress: {
          fullName: shippingAddress.fullName.trim(),
          email: shippingAddress.email.trim(),
          address: shippingAddress.address.trim(),
          city: shippingAddress.city.trim(),
          country: shippingAddress.country.trim(),
        },
      });
      setOrderId(response.id);
      clearCart();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to place order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderId) {
    return (
      <StoreLayout>
        <main style={{ maxWidth: 760, margin: "32px auto", padding: "0 20px 80px" }}>
          <div style={{ border: "1px solid #dfe6d7", background: "#f3f9f1", borderRadius: 16, padding: 24 }}>
            <h1 style={{ marginTop: 0 }}>Order confirmed</h1>
            <p style={{ marginBottom: 16 }}>Your order #{orderId.slice(0, 8).toUpperCase()} has been placed successfully.</p>
            {paymentMethod === "ozow" || paymentMethod === "peach-payments" ? (
              <p style={{ marginBottom: 16, color: "#334d33" }}>
                Secure payment is available through {getPaymentProvider(paymentMethod).label}. You can complete or review your payment flow from the provider checkout reference.
              </p>
            ) : null}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href={buildPaymentCheckoutUrl(getPaymentProvider(paymentMethod), orderId, checkoutSummary.total)}
                target="_blank"
                rel="noreferrer"
                className="btn"
                style={{ display: "inline-block" }}
              >
                Continue to {getPaymentProvider(paymentMethod).label}
              </a>
              <button type="button" className="btn" onClick={() => navigate("/account/orders")}>View order history</button>
              <Link to="/men" className="btn" style={{ display: "inline-block" }}>Continue shopping</Link>
            </div>
          </div>
        </main>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <main style={{ maxWidth: 960, margin: "32px auto", padding: "0 20px 80px" }}>
        <h1 style={{ marginBottom: 20 }}>Checkout</h1>
        <div style={{ display: "grid", gap: 24, gridTemplateColumns: "minmax(0, 2fr) minmax(260px, 1fr)" }}>
          <section style={{ border: "1px solid #e5e0d9", background: "#fff", borderRadius: 14, padding: 20 }}>
            <h2 style={{ marginTop: 0 }}>Delivery</h2>
            <div style={{ display: "grid", gap: 12 }}>
              <label>
                <div style={{ marginBottom: 6 }}>Full name</div>
                <input
                  value={shippingAddress.fullName}
                  onChange={(event) => setShippingAddress((current) => ({ ...current, fullName: event.target.value }))}
                  style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #d9d1c6" }}
                />
              </label>
              <label>
                <div style={{ marginBottom: 6 }}>Email</div>
                <input
                  value={shippingAddress.email}
                  onChange={(event) => setShippingAddress((current) => ({ ...current, email: event.target.value }))}
                  style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #d9d1c6" }}
                />
              </label>
              <label>
                <div style={{ marginBottom: 6 }}>Shipping address</div>
                <textarea
                  rows={4}
                  value={shippingAddress.address}
                  onChange={(event) => setShippingAddress((current) => ({ ...current, address: event.target.value }))}
                  style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #d9d1c6", resize: "vertical" }}
                />
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                <label>
                  <div style={{ marginBottom: 6 }}>City</div>
                  <input value={shippingAddress.city} onChange={(event) => setShippingAddress((current) => ({ ...current, city: event.target.value }))} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #d9d1c6" }} />
                </label>
                <label>
                  <div style={{ marginBottom: 6 }}>Country</div>
                  <input value={shippingAddress.country} onChange={(event) => setShippingAddress((current) => ({ ...current, country: event.target.value }))} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #d9d1c6" }} />
                </label>
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <h2 style={{ marginTop: 0 }}>Payment</h2>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {PAYMENT_PROVIDERS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPaymentMethod(option.id)}
                    style={{
                      border: paymentMethod === option.id ? "1px solid #2c3e2e" : "1px solid #d9d1c6",
                      background: paymentMethod === option.id ? "#eff7ef" : "#fff",
                      borderRadius: 999,
                      padding: "10px 14px",
                      cursor: "pointer",
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <p style={{ marginTop: 12, color: "#4b4a47" }}>
                {getPaymentProvider(paymentMethod).description}
              </p>
            </div>
          </section>

          <aside style={{ border: "1px solid #e5e0d9", background: "#fff", borderRadius: 14, padding: 20, height: "fit-content" }}>
            <h2 style={{ marginTop: 0 }}>Order summary</h2>
            {cart.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                <span>{item.name} × {item.quantity}</span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #eee", marginTop: 12, paddingTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span>Subtotal</span>
                <strong>{formatCurrency(summary.subtotal)}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span>Tax</span>
                <span>{formatCurrency(checkoutSummary.tax)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span>Shipping</span>
                <span>{formatCurrency(checkoutSummary.shipping)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, color: "#4d5e48" }}>
                <span>Delivery</span>
                <span>{checkoutSummary.deliveryWindow}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <strong>Total</strong>
                <strong>{formatCurrency(checkoutSummary.total)}</strong>
              </div>
              <button type="button" className="btn" disabled={isSubmitting} onClick={() => void handleSubmit()} style={{ width: "100%", justifyContent: "center" }}>
                {isSubmitting ? "Placing order…" : `Pay with ${getPaymentProvider(paymentMethod).label}`}
              </button>
              {error && <p style={{ color: "#7d2f2a", marginTop: 12 }}>{error}</p>}
            </div>
          </aside>
        </div>
      </main>
    </StoreLayout>
  );
}
