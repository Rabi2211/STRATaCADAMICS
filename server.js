import http from "node:http";
import { randomUUID } from "node:crypto";

const PORT = Number(process.env.PORT || 4000);

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

for (const brand of brands) {
  brand.products = products.filter((product) => product.brandId === brand.id);
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
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
