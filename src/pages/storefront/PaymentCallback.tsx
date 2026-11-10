import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import StoreLayout from "../../components/StoreLayout";
import { resolveApiBaseUrl } from "../../lib/api-config";
import { getPaymentProvider, getPaymentStatusMessage, isValidPaymentCallbackPayload, normalisePaymentStatus } from "../../lib/payments";

export default function PaymentCallbackPage() {
  const [searchParams] = useSearchParams();
  const providerId = searchParams.get("provider") ?? "ozow";
  const provider = getPaymentProvider(providerId);
  const rawStatus = searchParams.get("status") ?? "pending";
  const status = normalisePaymentStatus(rawStatus);
  const orderId = searchParams.get("order_id") ?? "unknown";

  const success = status === "success";
  const isValid = isValidPaymentCallbackPayload(providerId, orderId, rawStatus);

  useEffect(() => {
    if (!isValid) {
      return;
    }

    const callback = {
      provider: provider.id,
      orderId,
      status,
      capturedAt: new Date().toISOString(),
    };

    void fetch(`${resolveApiBaseUrl()}/api/payments/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(callback),
    }).catch(() => undefined);
  }, [isValid, orderId, provider.id, status]);

  return (
    <StoreLayout>
      <main style={{ maxWidth: 760, margin: "32px auto", padding: "0 20px 80px" }}>
        <div
          style={{
            border: success ? "1px solid #dfe6d7" : "1px solid #ead7d2",
            background: success ? "#f3f9f1" : "#fff7f5",
            borderRadius: 18,
            padding: 28,
          }}
        >
          <p style={{ textTransform: "uppercase", letterSpacing: 1.4, color: "#736a63", marginBottom: 10 }}>
            Payment update
          </p>
          <h1 style={{ marginTop: 0, marginBottom: 8 }}>{success ? "Payment received" : "Payment review"}</h1>
          <p style={{ marginBottom: 16, color: "#3d3a39" }}>{getPaymentStatusMessage(status)}</p>

          <div style={{ display: "grid", gap: 8, marginBottom: 24 }}>
            <div><strong>Provider:</strong> {provider.label}</div>
            <div><strong>Order:</strong> {orderId}</div>
            <div><strong>Status:</strong> {status}</div>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link to="/account/orders" className="btn" style={{ display: "inline-block" }}>View orders</Link>
            <Link to="/men" className="btn" style={{ display: "inline-block" }}>Continue shopping</Link>
          </div>
        </div>
      </main>
    </StoreLayout>
  );
}
