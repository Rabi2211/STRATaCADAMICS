import http from "node:http";
import { createHmac, randomUUID } from "node:crypto";

const PORT = Number(process.env.PORT || 4000);
const TRUSTED_PAYMENT_PROVIDERS = new Set(["ozow", "peach-payments", "bop-pay", "card", "bank-transfer", "cod"]);

function normalisePaymentStatus(status) {
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

function getProviderCallbackSecret(provider) {
  const key = String(provider || "").trim().toLowerCase();
  return (
    process.env.PAYMENT_CALLBACK_SECRET ||
    process.env.OZOW_API_KEY ||
    process.env.VITE_OZOW_API_KEY ||
    process.env.PEACH_SECRET ||
    process.env.PEACH_PUBLIC_KEY ||
    process.env.VITE_PEACH_PUBLIC_KEY ||
    process.env.VITE_BOP_API_KEY ||
    (key === "ozow" ? process.env.VITE_OZOW_API_KEY : undefined) ||
    (key === "bop-pay" ? process.env.VITE_BOP_API_KEY : undefined)
  );
}

function verifyCallbackSignature(provider, input) {
  const secret = getProviderCallbackSecret(provider);
  const signature = String(input.signature || input.hash || input.sign || "").trim();

  if (!signature) {
    return secret ? false : true;
  }

  if (!secret) {
    return false;
  }

  const normalized = {
    provider,
    orderId: String(input.orderId || input.order_id || input.reference || ""),
    status: normalisePaymentStatus(input.status),
    amount: String(input.amount ?? ""),
    timestamp: String(input.timestamp || input.capturedAt || ""),
  };

  const payload = Object.entries(normalized)
    .filter(([, value]) => value !== "")
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}:${value}`)
    .join("|");

  const digest = createHmac("sha256", secret).update(payload).digest("hex");
  return digest === signature;
}

function validatePaymentCallbackPayload(input) {
  const provider = String(input.provider || input.providerId || "").trim().toLowerCase();
  const orderId = String(input.orderId || input.order_id || input.reference || "").trim();
  const status = normalisePaymentStatus(input.status);

  if (!TRUSTED_PAYMENT_PROVIDERS.has(provider)) {
    return { ok: false, error: "Unsupported payment provider." };
  }

  if (!orderId || orderId.toLowerCase() === "unknown") {
    return { ok: false, error: "Order reference is required." };
  }

  if (!(["pending", "success", "cancelled", "failed", "demo"]).includes(status)) {
    return { ok: false, error: "Unknown payment status." };
  }

  if (!verifyCallbackSignature(provider, input)) {
    return { ok: false, error: "Invalid payment callback signature." };
  }

  return { ok: true, provider, orderId, status };
}

const brands = [
  {
    id: "brand-atelier",
    name: "Strata Atelier",
    description: "Signature essentials and elevated layers.",
    accent: "#c4664a",
    abbreviation: "SA",
    owner: { id: "owner-1", email: "owner@strata.app", name: "Store Owner", role: "admin" },
    products: [],
  },
  {
    id: "brand-vesa",
    name: "Vesa Studio",
    description: "Sculptural silhouettes and refined basics.",
    accent: "#4f6f52",
    abbreviation: "VS",
    owner: { id: "owner-2", email: "studio@strata.app", name: "Studio Lead", role: "manager" },
    products: [],
  },
  {
    id: "brand-joel",
    name: "Joel Mercer",
    description: "Luxury everyday staples and clean tailoring.",
    accent: "#5f7db7",
    abbreviation: "JM",
    owner: { id: "owner-3", email: "mercer@strata.app", name: "Brand Lead", role: "editor" },
    products: [],
  },
];

const products = [
  {
    id: "prod-001",
    brandId: "brand-atelier",
    name: "Linen Knit Sweater",
    sku: "LKS-2041",
    category: "Sweaters",
    price: 120,
    available: 32,
    status: "ACTIVE",
    description: "A relaxed knit with premium linen texture and soft drape.",
    imageClass: "t1",
  },
  {
    id: "prod-002",
    brandId: "brand-vesa",
    name: "Structured Trench",
    sku: "ST-1198",
    category: "Outerwear",
    price: 260,
    available: 14,
    status: "ACTIVE",
    description: "Tailored outer layer with a clean shoulder and matte finish.",
    imageClass: "t2",
  },
  {
    id: "prod-003",
    brandId: "brand-joel",
    name: "Essential Oxford Shirt",
    sku: "EO-8842",
    category: "Shirts",
    price: 145,
    available: 9,
    status: "LOW_STOCK",
    description: "A crisp button-down in a soft cotton weave built for everyday use.",
    imageClass: "t3",
  },
  {
    id: "prod-004",
    brandId: "brand-atelier",
    name: "Wool Blend Zip",
    sku: "WBZ-3007",
    category: "Tops",
    price: 170,
    available: 0,
    status: "DRAFT",
    description: "A cozy mid-layer with subtle texture and warm structure.",
    imageClass: "t4",
  },
];

const orders = [];
const paymentCallbacks = [];

for (const brand of brands) {
  brand.products = products.filter((product) => product.brandId === brand.id);
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  });
  res.end(JSON.stringify(payload));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body too large."));
        req.destroy();
      }
    });

    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON body."));
      }
    });

    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  if (method === "OPTIONS") {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (url === "/health") {
    sendJson(res, 200, { ok: true, service: "strata-api" });
    return;
  }

  if (url === "/api/brands" && method === "GET") {
    sendJson(res, 200, { brands });
    return;
  }

  if (url === "/api/products" && method === "GET") {
    sendJson(res, 200, { products });
    return;
  }

  if (url === "/api/orders" && method === "GET") {
    sendJson(res, 200, { orders });
    return;
  }

  if (url === "/api/payments/callback" && method === "POST") {
    try {
      const input = await parseBody(req);
      const validated = validatePaymentCallbackPayload(input);

      if (!validated.ok) {
        sendJson(res, 400, { error: validated.error });
        return;
      }

      const callback = {
        id: `pay-${randomUUID().slice(0, 8)}`,
        provider: validated.provider,
        orderId: validated.orderId,
        status: validated.status,
        capturedAt: new Date().toISOString(),
      };

      paymentCallbacks.unshift(callback);
      const matchedOrder = orders.find((entry) => entry.id === validated.orderId);
      if (matchedOrder) {
        matchedOrder.status = validated.status === "success" ? "Paid" : validated.status === "cancelled" ? "Cancelled" : validated.status === "failed" ? "Failed" : matchedOrder.status;
        matchedOrder.updatedAt = new Date().toISOString();
      }

      sendJson(res, 200, { ok: true, callback });
    } catch (error) {
      sendJson(res, 400, { error: error instanceof Error ? error.message : "Invalid payment callback." });
    }
    return;
  }

  if (url === "/api/payments/callback" && method === "GET") {
    sendJson(res, 200, { callbacks: paymentCallbacks });
    return;
  }

  if (url === "/api/orders" && method === "POST") {
    try {
      const input = await parseBody(req);
      const items = Array.isArray(input.items) ? input.items : [];
      const paymentMethod = String(input.paymentMethod || "card");
      const shippingAddress = input.shippingAddress || {};

      if (!items.length) {
        sendJson(res, 400, { error: "At least one item is required to place an order." });
        return;
      }

      const orderItems = items
        .map((item) => {
          const product = products.find((entry) => entry.id === item.productId);
          if (!product) {
            return null;
          }

          const qty = Number(item.quantity ?? 1);
          return {
            id: `line-${randomUUID().slice(0, 8)}`,
            orderId: null,
            productId: product.id,
            quantity: Number.isFinite(qty) && qty > 0 ? qty : 1,
            price: Number(product.price ?? 0),
            product,
          };
        })
        .filter(Boolean);

      if (!orderItems.length) {
        sendJson(res, 400, { error: "No valid products were found in the cart." });
        return;
      }

      const total = orderItems.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
      const now = new Date().toISOString();
      const order = {
        id: `ord-${randomUUID().slice(0, 8)}`,
        userId: "customer-demo",
        status: "Pending",
        total,
        createdAt: now,
        updatedAt: now,
        paymentMethod,
        shippingAddress: {
          fullName: String(shippingAddress.fullName || "Customer"),
          email: String(shippingAddress.email || "customer@example.com"),
          address: String(shippingAddress.address || "123 Market Street"),
          city: String(shippingAddress.city || "Johannesburg"),
          country: String(shippingAddress.country || "South Africa"),
        },
        items: orderItems,
      };

      orders.unshift(order);
      sendJson(res, 201, { order });
    } catch (error) {
      sendJson(res, 400, { error: error instanceof Error ? error.message : "Invalid order payload." });
    }
    return;
  }

  if (url.startsWith("/api/orders/") && method === "PATCH") {
    try {
      const [, , id] = url.split("/");
      const input = await parseBody(req);
      const order = orders.find((entry) => entry.id === id);

      if (!order) {
        sendJson(res, 404, { error: "Order not found." });
        return;
      }

      order.status = String(input.status || order.status);
      order.updatedAt = new Date().toISOString();
      sendJson(res, 200, { order });
    } catch (error) {
      sendJson(res, 400, { error: error instanceof Error ? error.message : "Invalid status update." });
    }
    return;
  }

  if (url === "/api/products" && method === "POST") {
    try {
      const input = await parseBody(req);
      const brandId = String(input.brandId || "");
      const name = String(input.name || "").trim();
      const sku = String(input.sku || "").trim();
      const category = String(input.category || "General").trim();

      if (!brandId || !name || !sku) {
        sendJson(res, 400, { error: "brandId, name, and sku are required." });
        return;
      }

      const matchedBrand = brands.find((brand) => brand.id === brandId);
      if (!matchedBrand) {
        sendJson(res, 404, { error: "Brand not found." });
        return;
      }

      const created = {
        id: `prod-${randomUUID().slice(0, 8)}`,
        brandId,
        name,
        sku,
        category,
        price: Number(input.price ?? 0),
        available: Number(input.available ?? 0),
        status: String(input.status || "DRAFT").toUpperCase(),
        description: String(input.description || "").trim() || "Added from the owner account.",
        imageClass: input.imageClass || "t1",
      };

      products.unshift(created);
      matchedBrand.products = products.filter((product) => product.brandId === brandId);

      sendJson(res, 201, { product: created });
    } catch (error) {
      sendJson(res, 400, { error: error instanceof Error ? error.message : "Invalid product payload." });
    }
    return;
  }

  sendJson(res, 404, { error: "Not found." });
});

server.listen(PORT, () => {
  console.log(`STRATA API running on http://localhost:${PORT}`);
});
