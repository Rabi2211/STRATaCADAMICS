const { randomUUID, createHash } = require("node:crypto");
const cors = require("cors");
const express = require("express");
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const firestore = admin.firestore();

const app = express();

app.use(cors({ origin: true }));
app.use(express.json({ limit: "1mb" }));

const TRUSTED_PAYMENT_PROVIDERS = new Set([
  "ozow",
  "peach-payments",
  "bop-pay",
  "card",
  "bank-transfer",
  "cod",
]);

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
const productViews = new Map();

for (const brand of brands) {
  brand.products = products.filter((product) => product.brandId === brand.id);
}

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

  const digest = require("node:crypto")
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

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

  if (!["pending", "success", "cancelled", "failed", "demo"].includes(status)) {
    return { ok: false, error: "Unknown payment status." };
  }

  if (!verifyCallbackSignature(provider, input)) {
    return { ok: false, error: "Invalid payment callback signature." };
  }

  return { ok: true, provider, orderId, status };
}

app.options("/api/*", (_req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.status(200).json({ ok: true });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "strata-api" });
});

app.get("/api/brands", (_req, res) => {
  res.json({ brands });
});

app.get("/api/products", (_req, res) => {
  res.json({ products });
});

app.get("/api/orders", (_req, res) => {
  res.json({ orders });
});

app.post("/api/payments/callback", (req, res) => {
  try {
    const validated = validatePaymentCallbackPayload(req.body || {});

    if (!validated.ok) {
      res.status(400).json({ error: validated.error });
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

    res.json({ ok: true, callback });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Invalid payment callback." });
  }
});

app.get("/api/payments/callback", (_req, res) => {
  res.json({ callbacks: paymentCallbacks });
});

app.post("/api/orders", (req, res) => {
  try {
    const input = req.body || {};
    const items = Array.isArray(input.items) ? input.items : [];
    const paymentMethod = String(input.paymentMethod || "card");
    const shippingAddress = input.shippingAddress || {};

    if (!items.length) {
      res.status(400).json({ error: "At least one item is required to place an order." });
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
      res.status(400).json({ error: "No valid products were found in the cart." });
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
    res.status(201).json({ order });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Invalid order payload." });
  }
});

app.patch("/api/orders/:id", (req, res) => {
  try {
    const id = req.params.id;
    const input = req.body || {};
    const order = orders.find((entry) => entry.id === id);

    if (!order) {
      res.status(404).json({ error: "Order not found." });
      return;
    }

    order.status = String(input.status || order.status);
    order.updatedAt = new Date().toISOString();
    res.json({ order });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Invalid status update." });
  }
});

app.post("/api/products", (req, res) => {
  try {
    const input = req.body || {};
    const brandId = String(input.brandId || "").trim();
    const name = String(input.name || "").trim();
    const sku = String(input.sku || "").trim();
    const category = String(input.category || "General").trim();

    if (!brandId || !name || !sku) {
      res.status(400).json({ error: "brandId, name, and sku are required." });
      return;
    }

    const matchedBrand = brands.find((brand) => brand.id === brandId);
    if (!matchedBrand) {
      res.status(404).json({ error: "Brand not found." });
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
      imageUrl: input.imageUrl || null,
    };

    products.unshift(created);
    matchedBrand.products = products.filter((product) => product.brandId === brandId);

    res.status(201).json({ product: created });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Invalid product payload." });
  }
});

app.post("/api/products/:productId/view", (req, res) => {
  const product = products.find((entry) => entry.id === req.params.productId);
  if (!product) {
    res.status(404).json({ error: "Product not found." });
    return;
  }
  const nextViews = (productViews.get(product.id) || 0) + 1;
  productViews.set(product.id, nextViews);
  res.json({ ok: true, views: nextViews });
});

app.get("/api/analytics/views", (_req, res) => {
  res.json({ views: Object.fromEntries(productViews) });
});

app.get("/api/analytics/overview", (req, res) => {
  const brandId = String(req.query.brandId || "");
  const range = String(req.query.range || "30D");
  const startValue = req.query.from ? new Date(`${req.query.from}T00:00:00`) : null;
  const endValue = req.query.to ? new Date(`${req.query.to}T23:59:59`) : null;
  const filteredProducts = brandId ? products.filter((product) => product.brandId === brandId) : products;
  const filteredOrders = orders.filter((order) => {
    const created = new Date(order.createdAt);
    if (startValue && !Number.isNaN(startValue.getTime()) && created < startValue) return false;
    if (endValue && !Number.isNaN(endValue.getTime()) && created > endValue) return false;
    if (brandId) return order.items?.some((item) => item.product?.brandId === brandId);
    return true;
  });

  const grossSales = filteredOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const totalOrders = filteredOrders.length;
  const productViewsTotal = filteredProducts.reduce((sum, product) => sum + (productViews.get(product.id) || 0), 0);
  const bucketCount = range === "7D" ? 7 : range === "30D" ? 30 : range === "3M" ? 3 : 12;
  const chartBuckets = Array.from({ length: bucketCount }, () => 0);
  const now = endValue && !Number.isNaN(endValue.getTime()) ? endValue : new Date();

  for (const order of filteredOrders) {
    const created = new Date(order.createdAt);
    const ageDays = Math.max(0, Math.floor((now.getTime() - created.getTime()) / 86400000));
    const index = bucketCount === 30
      ? Math.min(29, 29 - ageDays)
      : bucketCount === 7
        ? Math.min(6, 6 - Math.floor(ageDays))
        : bucketCount === 3
          ? Math.max(0, 2 - Math.floor(ageDays / 30))
          : Math.max(0, 11 - Math.floor(ageDays / 30));
    chartBuckets[index] += Number(order.total || 0);
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
        views: brandProducts.reduce((sum, product) => sum + (productViews.get(product.id) || 0), 0),
      };
    });

  const productPerformance = filteredProducts.map((product) => {
    let unitsSold = 0;
    let revenue = 0;
    for (const order of filteredOrders) {
      for (const item of order.items || []) {
        if (item.productId === product.id || item.product?.id === product.id) {
          const quantity = Number(item.quantity || 0);
          unitsSold += quantity;
          revenue += Number(item.price || item.product?.price || 0) * quantity;
        }
      }
    }
    return { productId: product.id, views: productViews.get(product.id) || 0, unitsSold, revenue };
  });

  const periodDays = bucketCount === 7 ? 7 : bucketCount === 30 ? 30 : bucketCount === 3 ? 90 : 365;
  const currentStart = startValue || new Date(now.getTime() - periodDays * 86400000);
  const previousStart = new Date(currentStart.getTime() - periodDays * 86400000);
  const previousOrders = orders.filter((order) => {
    const created = new Date(order.createdAt);
    return created >= previousStart && created < currentStart && (!brandId || order.items?.some((item) => item.product?.brandId === brandId));
  });
  const previousSales = previousOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const percentage = (current, previous) => previous === 0 ? (current === 0 ? 0 : 100) : Math.round(((current - previous) / Math.abs(previous)) * 100);

  res.json({
    grossSales,
    totalOrders,
    productViews: productViewsTotal,
    chart: [{ label: range, points: chartBuckets }],
    labels,
    brandPerformance,
    productPerformance,
    growth: {
      grossSales: percentage(grossSales, previousSales),
      totalOrders: percentage(totalOrders, previousOrders.length),
      productViews: productViewsTotal,
      products: filteredProducts.length,
    },
  });
});

async function requireAdmin(req, res) {
  const authorization = String(req.headers.authorization || "");
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";

  if (!token) {
    res.status(401).json({ error: "Authentication is required." });
    return null;
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    if (decoded.email_verified !== true) {
      res.status(403).json({ error: "Verify your email before sending updates." });
      return null;
    }

    const profile = await firestore.collection("userProfiles").doc(decoded.uid).get();
    if (!profile.exists || profile.data()?.role !== "admin") {
      res.status(403).json({ error: "Only store owners can send newsletter updates." });
      return null;
    }

    return decoded;
  } catch {
    res.status(401).json({ error: "Invalid or expired authentication token." });
    return null;
  }
}

function normalizeNewsletterEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isValidNewsletterEmail(email) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

app.post("/api/newsletter/subscribe", async (req, res) => {
  try {
    const email = normalizeNewsletterEmail(req.body?.email);
    if (!isValidNewsletterEmail(email)) {
      res.status(400).json({ error: "Enter a valid email address." });
      return;
    }

    const subscriberId = createHash("sha256").update(email).digest("hex");
    const subscriberRef = firestore.collection("newsletterSubscribers").doc(subscriberId);
    let alreadySubscribed = false;

    await firestore.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(subscriberRef);
      if (snapshot.exists) {
        alreadySubscribed = true;
        if (snapshot.data()?.active === false) {
          transaction.update(subscriberRef, { active: true, unsubscribedAt: null, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
        }
        return;
      }

      transaction.create(subscriberRef, {
        email,
        active: true,
        subscribedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        unsubscribedAt: null,
      });
    });

    res.status(alreadySubscribed ? 200 : 201).json({ ok: true, alreadySubscribed });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Unable to subscribe." });
  }
});

app.post("/api/newsletter/send", async (req, res) => {
  const adminUser = await requireAdmin(req, res);
  if (!adminUser) return;

  const subject = String(req.body?.subject || "").trim();
  const content = String(req.body?.content || "").trim();
  if (!subject || subject.length > 150) {
    res.status(400).json({ error: "Newsletter subject is required and must be 150 characters or fewer." });
    return;
  }
  if (!content || content.length > 10000) {
    res.status(400).json({ error: "Newsletter content is required and must be 10,000 characters or fewer." });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NEWSLETTER_FROM || "STRATaCADAMICS <updates@stratacadamics.com>";
  if (!apiKey) {
    res.status(503).json({ error: "Email sending is not configured. Set RESEND_API_KEY and redeploy." });
    return;
  }

  try {
    const snapshot = await firestore.collection("newsletterSubscribers").where("active", "==", true).get();
    const subscribers = snapshot.docs.map((doc) => String(doc.data().email || "").trim().toLowerCase()).filter(Boolean);

    let sent = 0;
    let failed = 0;
    for (const email of subscribers) {
      try {
        const providerResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from,
            to: [email],
            subject,
            html: content.replace(/\n/g, "<br>"),
          }),
        });

        if (providerResponse.ok) sent += 1;
        else failed += 1;
      } catch {
        failed += 1;
      }
    }

    await firestore.collection("newsletterCampaigns").add({
      subject,
      content,
      sent,
      failed,
      recipientCount: subscribers.length,
      createdBy: adminUser.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ ok: true, sent, failed });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Unable to send newsletter." });
  }
});

app.get("/api/newsletter/campaigns", async (req, res) => {
  const adminUser = await requireAdmin(req, res);
  if (!adminUser) return;

  try {
    const snapshot = await firestore.collection("newsletterCampaigns").orderBy("createdAt", "desc").limit(50).get();
    const campaigns = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        subject: String(data.subject || ""),
        content: String(data.content || ""),
        sent: Number(data.sent || 0),
        failed: Number(data.failed || 0),
        recipientCount: Number(data.recipientCount || 0),
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null,
      };
    });
    res.json({ campaigns });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Unable to load campaigns." });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found." });
});

exports.api = functions.https.onRequest(app);
