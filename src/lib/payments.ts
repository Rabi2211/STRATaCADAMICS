export type PaymentProviderId = "ozow" | "peach-payments" | "bop-pay" | "card" | "bank-transfer" | "cod";

export type PaymentProvider = {
  id: PaymentProviderId;
  label: string;
  description: string;
  gatewayUrl: string;
  requiresRedirect: boolean;
};

export type PaymentEnvironment = {
  mode: "sandbox" | "production";
  ozowMerchantId?: string;
  ozowApiKey?: string;
  peachPublicKey?: string;
  peachBaseUrl?: string;
  bopMerchantId?: string;
  bopApiKey?: string;
  bopBaseUrl?: string;
};

function getPaymentEnvironment(): PaymentEnvironment {
  const mode = String(import.meta.env.VITE_PAYMENT_MODE ?? "sandbox").toLowerCase() === "production" ? "production" : "sandbox";

  return {
    mode,
    ozowMerchantId: import.meta.env.VITE_OZOW_MERCHANT_ID,
    ozowApiKey: import.meta.env.VITE_OZOW_API_KEY,
    peachPublicKey: import.meta.env.VITE_PEACH_PUBLIC_KEY,
    peachBaseUrl: import.meta.env.VITE_PEACH_BASE_URL,
    bopMerchantId: import.meta.env.VITE_BOP_MERCHANT_ID,
    bopApiKey: import.meta.env.VITE_BOP_API_KEY,
    bopBaseUrl: import.meta.env.VITE_BOP_BASE_URL,
  };
}

export const PAYMENT_PROVIDERS: PaymentProvider[] = [
  {
    id: "ozow",
    label: "OZOW",
    description: "Instant EFT and wallet-based checkout for South African customers.",
    gatewayUrl: "https://www.ozow.com/",
    requiresRedirect: true,
  },
  {
    id: "peach-payments",
    label: "Peach Payments",
    description: "Card and secure South African payment processing.",
    gatewayUrl: "https://sandbox.peachpayments.com",
    requiresRedirect: true,
  },
  {
    id: "bop-pay",
    label: "Bop Pay",
    description: "Secure instant payment for South African online shoppers.",
    gatewayUrl: "https://sandbox.boppay.co.za",
    requiresRedirect: true,
  },
  {
    id: "card",
    label: "Card",
    description: "Standard checkout using a card payment flow.",
    gatewayUrl: "https://example.com/card-checkout",
    requiresRedirect: true,
  },
  {
    id: "bank-transfer",
    label: "Bank transfer",
    description: "Manual EFT settlement for larger orders.",
    gatewayUrl: "https://example.com/bank-transfer",
    requiresRedirect: false,
  },
  {
    id: "cod",
    label: "Cash on delivery",
    description: "Available for selected regions and order values.",
    gatewayUrl: "https://example.com/cod",
    requiresRedirect: false,
  },
];

export function getPaymentProvider(paymentMethod: string): PaymentProvider {
  return PAYMENT_PROVIDERS.find((provider) => provider.id === paymentMethod) ?? PAYMENT_PROVIDERS[0];
}

export type PaymentStatus = "pending" | "success" | "cancelled" | "failed" | "demo";

export function normalisePaymentStatus(status?: string | null): PaymentStatus {
  const value = String(status ?? "").trim().toLowerCase();

  switch (value) {
    case "paid":
    case "completed":
    case "approved":
    case "successful":
      return "success";
    case "cancelled":
    case "canceled":
      return "cancelled";
    case "failed":
    case "declined":
    case "error":
      return "failed";
    case "demo":
      return "demo";
    default:
      return "pending";
  }
}

export function isValidPaymentCallbackPayload(providerId: string | null, orderId: string | null, status?: string | null): boolean {
  const knownProviders = new Set<string>(PAYMENT_PROVIDERS.map((provider) => provider.id));
  const provider = String(providerId ?? "").trim().toLowerCase();
  const normalizedOrderId = String(orderId ?? "").trim();

  if (!knownProviders.has(provider)) {
    return false;
  }

  if (!normalizedOrderId || normalizedOrderId.toLowerCase() === "unknown") {
    return false;
  }

  return ["pending", "success", "cancelled", "failed", "demo"].includes(normalisePaymentStatus(status));
}

export function buildPaymentCallbackUrl(provider: PaymentProvider, orderId: string, status: "success" | "cancelled" | "demo" = "success") {
  const referenceId = String(orderId || "demo-order");
  const baseOrigin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const url = new URL(`${baseOrigin}/payment/callback`);
  url.search = new URLSearchParams({
    provider: provider.id,
    order_id: referenceId,
    status,
  }).toString();
  return url.toString();
}

export function buildPaymentCheckoutUrl(provider: PaymentProvider, orderId: string, amount: number): string {
  const amountValue = Number(amount ?? 0);
  const referenceId = String(orderId || "demo-order");
  const callbackUrl = buildPaymentCallbackUrl(provider, referenceId, "success");
  const cancelUrl = buildPaymentCallbackUrl(provider, referenceId, "cancelled");
  const baseOrigin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

  if (!provider.requiresRedirect) {
    return `#${provider.id}`;
  }

  const env = getPaymentEnvironment();

  if (provider.id === "ozow") {
    const ozowBase = env.ozowMerchantId ? "https://pay.ozow.com" : provider.gatewayUrl;
    const url = new URL(ozowBase);
    const ozowParams = new URLSearchParams({
      amount: String(Number.isFinite(amountValue) ? amountValue : 0),
      currency: "ZAR",
      orderId: referenceId,
      merchantId: env.ozowMerchantId ?? "demo-merchant",
      callbackUrl,
      cancelUrl,
      source: "strata-storefront",
    });
    url.search = ozowParams.toString();
    return url.toString();
  }

  if (provider.id === "peach-payments") {
    const peachBase = env.peachBaseUrl || provider.gatewayUrl;
    const url = new URL(peachBase);
    const peachParams = new URLSearchParams({
      amount: String(Number.isFinite(amountValue) ? amountValue : 0),
      currency: "ZAR",
      reference: referenceId,
      publicKey: env.peachPublicKey ?? "demo-public-key",
      returnUrl: callbackUrl,
      cancelUrl,
      source: "strata-storefront",
      mode: env.mode,
    });
    url.search = peachParams.toString();
    return url.toString();
  }

  if (provider.id === "bop-pay") {
    const bopBase = env.bopBaseUrl || provider.gatewayUrl;
    const url = new URL(bopBase);
    const bopParams = new URLSearchParams({
      amount: String(Number.isFinite(amountValue) ? amountValue : 0),
      currency: "ZAR",
      merchantId: env.bopMerchantId ?? "demo-bop-merchant",
      apiKey: env.bopApiKey ?? "demo-bop-key",
      reference: referenceId,
      returnUrl: callbackUrl,
      cancelUrl,
      source: "strata-storefront",
      mode: env.mode,
    });
    url.search = bopParams.toString();
    return url.toString();
  }

  const demoUrl = new URL(`${baseOrigin}/payment/callback`);
  demoUrl.search = new URLSearchParams({
    provider: provider.id,
    order_id: referenceId,
    status: "demo",
    amount: String(Number.isFinite(amountValue) ? amountValue : 0),
  }).toString();

  return demoUrl.toString();
}

export function getPaymentStatusMessage(status?: string | null): string {
  const normalizedStatus = normalisePaymentStatus(status);

  switch (normalizedStatus) {
    case "success":
      return "Payment successful. Your order is now being processed.";
    case "cancelled":
      return "Payment was cancelled. Your cart is still saved and you can retry when ready.";
    case "failed":
      return "Payment could not be completed. Please try again or choose another method.";
    case "demo":
      return "This is a demo payment flow. Add your OZOW, Peach, or Bop Pay credentials to enable live processing.";
    default:
      return "Payment status is pending. Please check your email for confirmation.";
  }
}
