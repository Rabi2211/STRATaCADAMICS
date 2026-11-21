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

const brands = [];

const products = [];

const orders = [];
const paymentCallbacks = [];
const productViews = new Map();
const authUsers = new Map();

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

  if (url === "/api/brands" && method === "POST") {
    try {
      const input = await parseBody(req);
      const name = String(input.name || "").trim();
      if (!name) {
        sendJson(res, 400, { error: "Brand name is required." });
        return;
      }

      const brand = {
        id: `brand-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name,
        description: input.description ? String(input.description) : null,
        accent: "#4f6f52",
        abbreviation: name.slice(0, 2).toUpperCase(),
        owner: { id: "owner-1", email: "owner@strata.app", name: "Store Owner", role: "admin" },
        products: [],
      };
      brands.push(brand);
      sendJson(res, 201, { brand });
    } catch (error) {
      sendJson(res, 400, { error: error instanceof Error ? error.message : "Unable to create brand." });
    }
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

  if (url.startsWith("/api/products/") && url.endsWith("/view") && method === "POST") {
    const productId = decodeURIComponent(url.split("/")[3]);
    if (!products.some((product) => product.id === productId)) {
      sendJson(res, 404, { error: "Product not found." });
      return;
    }
    productViews.set(productId, (productViews.get(productId) || 0) + 1);
    sendJson(res, 200, { ok: true, views: productViews.get(productId) });
    return;
  }

  if (url === "/api/analytics/views" && method === "GET") {
    sendJson(res, 200, { views: Object.fromEntries(productViews) });
    return;
  }

  if (url.startsWith("/api/analytics/overview") && method === "GET") {
    const [, queryString = ""] = url.split("?");
    const params = new URLSearchParams(queryString);
    const brandId = params.get("brandId") || "";
    const range = params.get("range") || "30D";
    const fromValue = params.get("from");
    const toValue = params.get("to");
    const filteredProducts = brandId
      ? products.filter((product) => product.brandId === brandId)
      : products;

    const start = fromValue ? new Date(`${fromValue}T00:00:00`) : null;
    const end = toValue ? new Date(`${toValue}T23:59:59`) : null;
    const filteredOrders = orders.filter((order) => {
      if (!start || !end) return true;
      const created = new Date(order.createdAt);
      return created >= start && created <= end;
    }).filter((order) => !brandId || order.items?.some((item) => item.product?.brandId === brandId));

    const grossSales = filteredOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const totalOrders = filteredOrders.length;
    const productViewsTotal = filteredProducts.reduce((sum, product) => sum + (productViews.get(product.id) || 0), 0);

    const bucketCount = range === "7D" ? 7 : range === "30D" ? 30 : range === "3M" ? 3 : 12;
    const chartBuckets = Array.from({ length: bucketCount }, () => 0);
    const now = end && !Number.isNaN(end.getTime()) ? end : new Date();
    for (const order of filteredOrders) {
      const created = new Date(order.createdAt);
      const ageDays = Math.max(0, Math.floor((now.getTime() - created.getTime()) / 86400000));
      const index = Math.min(bucketCount - 1, bucketCount - 1 - Math.floor(ageDays / Math.max(1, Math.ceil(bucketCount === 30 ? 1 : (30 * bucketCount / bucketCount)) )));
      chartBuckets[Math.max(0, index)] += Number(order.total || 0);
    }

    const labels = range === "7D"
      ? Array.from({ length: 7 }, (_, index) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(now.getTime() - (6 - index) * 86400000)))
      : range === "30D"
        ? Array.from({ length: 30 }, (_, index) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(now.getTime() - (29 - index) * 86400000)))
        : range === "3M"
          ? ["Month 1", "Month 2", "Month 3"]
          : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const brandPerformance = brands
      .filter((brand) => !brandId || brand.id === brandId)
      .map((brand) => {
        const brandProducts = filteredProducts.filter((product) => product.brandId === brand.id);
        const brandOrders = filteredOrders.filter((order) => order.items?.some((item) => item.product?.brandId === brand.id));
        return {
          brandId: brand.id,
          sales: brandOrders.reduce((sum, order) => sum + Number(order.total || 0), 0),
          orders: brandOrders.length,
          productCount: brandProducts.length,
        };
      });

    const previousStart = start ? new Date(start) : new Date(now.getTime() - 60 * 86400000);
    const previousEnd = start ? new Date(start) : new Date(now.getTime() - 30 * 86400000);
    const previousOrders = orders.filter((order) => {
      const created = new Date(order.createdAt);
      return created >= previousStart && created < previousEnd;
    });
    const previousSales = previousOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const percentage = (current, previous) => previous === 0 ? (current === 0 ? 0 : 100) : Math.round(((current - previous) / Math.abs(previous)) * 100);

    sendJson(res, 200, {
      grossSales,
      totalOrders,
      productViews: productViewsTotal,
      chart: [{ label: range, points: chartBuckets }],
      labels,
      brandPerformance,
      growth: {
        grossSales: percentage(grossSales, previousSales),
        totalOrders: percentage(totalOrders, previousOrders.length),
        productViews: productViewsTotal,
        products: filteredProducts.length,
      },
    });
    return;
  }

  if (url === "/api/auth/register" && method === "POST") {
    try {
      const input = await parseBody(req);
      const email = String(input.email || "").trim().toLowerCase();
      const password = String(input.password || "");
      const role = String(input.role || "CUSTOMER").trim().toUpperCase();
      if (!email || password.length < 6) {
        sendJson(res, 400, { error: "A valid email and password of at least 6 characters are required." });
        return;
      }
      if (authUsers.has(email)) {
        const existing = authUsers.get(email);
        if (existing.password !== password) {
          sendJson(res, 409, { error: "An account with this email already exists." });
          return;
        }
        const normalizedRole = role === "BRAND_OWNER" ? "brand-owner" : role === "ADMIN" ? "admin" : "customer";
        existing.user.role = normalizedRole;
        existing.user.name = String(input.name || existing.user.name).trim();
        if (normalizedRole === "brand-owner" && !brands.some((brand) => brand.owner?.email === email)) {
          brands.push({
            id: `brand-${randomUUID().slice(0, 8)}`,
            name: String(input.name || "Eden Studio").trim(),
            description: "Independent brand created through the Studio registration flow.",
            accent: "#4f6f52",
            abbreviation: "ES",
            owner: { id: existing.user.id, email, name: existing.user.name, role: "brand-owner" },
            products: [],
          });
        }
        sendJson(res, 200, { token: `local-token-${existing.user.id}`, user: existing.user });
        return;
      }

      const normalizedRole = role === "BRAND_OWNER" ? "brand-owner" : role === "ADMIN" ? "admin" : "customer";
      const user = {
        id: `user-${randomUUID().slice(0, 8)}`,
        email,
        name: String(input.name || email.split("@")[0]).trim(),
        role: normalizedRole,
      };
      authUsers.set(email, { password, user });

      if (normalizedRole === "brand-owner") {
        const brandName = String(input.name || "Eden Studio").trim();
        if (!brands.some((brand) => brand.owner?.email === email)) {
          brands.push({
            id: `brand-${randomUUID().slice(0, 8)}`,
            name: brandName,
            description: "Independent brand created through the Studio registration flow.",
            accent: "#4f6f52",
            abbreviation: brandName.slice(0, 2).toUpperCase(),
            owner: { id: user.id, email, name: user.name, role: "brand-owner" },
            products: [],
          });
        }
      }

      sendJson(res, 201, { token: `local-token-${user.id}`, user });
    } catch (error) {
      sendJson(res, 400, { error: error instanceof Error ? error.message : "Unable to register." });
    }
    return;
  }

  if (url === "/api/auth/login" && method === "POST") {
    try {
      const input = await parseBody(req);
      const email = String(input.email || "").trim().toLowerCase();
      const password = String(input.password || "");
      const requestedRole = String(input.role || "CUSTOMER").trim().toUpperCase();
      const record = authUsers.get(email);
      if (!record || record.password !== password) {
        sendJson(res, 401, { error: "Incorrect email or password." });
        return;
      }
      if (requestedRole === "ADMIN") record.user.role = "admin";
      if (requestedRole === "BRAND_OWNER") record.user.role = "brand-owner";
      if (requestedRole === "CUSTOMER") record.user.role = "customer";

      sendJson(res, 200, { token: `local-token-${record.user.id}`, user: record.user });
    } catch (error) {
      sendJson(res, 400, { error: error instanceof Error ? error.message : "Unable to sign in." });
    }
    return;
  }

  sendJson(res, 404, { error: "Not found." });
});

server.listen(PORT, () => {
  console.log(`STRATA API running on http://localhost:${PORT}`);
});
