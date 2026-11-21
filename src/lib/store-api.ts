import {
  createFirestoreProduct,
  deleteFirestoreProduct,
  getFirestoreProducts,
  getStoredProducts,
  saveProducts,
  updateFirestoreProduct,
} from "./product-store";
import {
  createFirestoreBrand,
  getFirestoreBrands,
  getStoredBrands,
  saveBrands,
} from "./brand-store";
import { resolveApiBaseUrl } from "./api-config";
import { getStoredAuthSession } from "./storage";

export type ApiBrand = {
  id: string;
  name: string;
  description?: string | null;
  ownerId?: string;
  accent?: string;
  abbreviation?: string;
  owner?: {
    id: string;
    email: string;
    name: string;
    role?: string;
  };
  products?: unknown[];
};

export type ApiProduct = {
  id: string;
  brandId: string;
  name: string;
  sku: string;
  category: string;
  price: number | string;
  available: number;
  status: string;
  description?: string | null;
  imageClass?: string | null;
  imageUrl?: string | null;
  brand?: ApiBrand;
};

export type StoreStatus = "Active" | "Draft" | "Low stock" | "Preorder";

export type ApiOrderItem = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number | string;
  product?: ApiProduct | null;
};

export type ApiOrder = {
  id: string;
  userId: string;
  status: string;
  total: number | string;
  createdAt?: string;
  updatedAt?: string;
  paymentMethod?: string;
  shippingAddress?: {
    fullName?: string;
    email?: string;
    address?: string;
    city?: string;
    country?: string;
  };
  user?: {
    id: string;
    email: string;
    name: string;
    role?: string;
  };
  items?: ApiOrderItem[];
};

export type ApiOverviewAnalytics = {
  grossSales: number;
  totalOrders: number;
  productViews: number;
  chart: Array<{ label: string; points: number[] }>;
  brandPerformance: Array<{ brandId: string; sales: number; orders: number; productCount: number; views?: number }>;
  productPerformance?: Array<{ productId: string; views: number; unitsSold: number; revenue: number }>;
  growth: { grossSales: number; totalOrders: number; productViews: number; products: number };
  labels?: string[];
};

export const API_BASE_URL = resolveApiBaseUrl(import.meta.env.VITE_API_URL);

function getAuthHeaders(): Record<string, string> {
  const session = getStoredAuthSession();

  if (!session?.token) {
    return {};
  }

  return {
    Authorization: `Bearer ${session.token}`,
  };
}

async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...(init.headers ?? {}),
    },
  });

  let payload: any = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload?.error ?? "Request failed.");
  }

  if (payload === null || payload === undefined) {
    return {} as T;
  }

  return payload as T;
}

export function normalizeProductStatus(status?: string): StoreStatus {
  switch ((status ?? "DRAFT").toUpperCase()) {
    case "ACTIVE":
      return "Active";
    case "LOW_STOCK":
      return "Low stock";
    case "PREORDER":
      return "Preorder";
    case "DRAFT":
    default:
      return "Draft";
  }
}

export function mapApiProduct(product: ApiProduct) {
  return {
    id: product.id,
    brandId: product.brandId,
    name: product.name,
    category: product.category,
    sku: product.sku,
    price: Number(product.price ?? 0),
    available: Number(product.available ?? 0),
    status: normalizeProductStatus(product.status),
    description: product.description ?? "",
    imageClass: product.imageClass ?? "t1",
    imageUrl: product.imageUrl ?? null,
  };
}

export async function fetchBrands(): Promise<ApiBrand[]> {
  const firestoreBrands = await getFirestoreBrands();
  if (firestoreBrands.length > 0) {
    saveBrands(firestoreBrands);
    return firestoreBrands;
  }

  try {
    const payload = await apiRequest<{ brands?: ApiBrand[] }>('/api/brands');
    if (Array.isArray(payload.brands) && payload.brands.length > 0) {
      saveBrands(payload.brands);
      return payload.brands;
    }
  } catch {
    // Fall back to the persisted browser catalog.
  }

  return getStoredBrands();
}

export async function createBrand(input: {
  name: string;
  description?: string | null;
}): Promise<ApiBrand> {
  const name = input.name.trim();
  if (!name) throw new Error('Brand name is required.');

  const brand: ApiBrand = {
    id: `brand-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    description: input.description ?? null,
    accent: '#4f6f52',
    abbreviation: name.slice(0, 2).toUpperCase(),
  };

  try {
    const saved = await createFirestoreBrand(brand);
    saveBrands([saved, ...getStoredBrands()]);
    return saved;
  } catch {
    try {
      const payload = await apiRequest<{ brand?: ApiBrand }>('/api/brands', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      if (payload.brand) {
        saveBrands([payload.brand, ...getStoredBrands()]);
        return payload.brand;
      }
    } catch {
      // Browser persistence still provides a shared market/studio/storefront catalog.
    }

    saveBrands([brand, ...getStoredBrands()]);
    return brand;
  }
}

export async function fetchProducts(): Promise<ApiProduct[]> {
  const firestoreProducts = await getFirestoreProducts();
  if (firestoreProducts.length > 0) {
    saveProducts(firestoreProducts);
    return firestoreProducts;
  }

  try {
    const payload = await apiRequest<{ products?: ApiProduct[] }>("/api/products");
    if (Array.isArray(payload.products) && payload.products.length > 0) {
      const publicStatuses = new Set(["ACTIVE", "Active", "LOW_STOCK", "Low stock", "PREORDER", "Preorder"]);
      const publicProducts = payload.products.filter((product) => publicStatuses.has(String(product.status || "")));
      saveProducts(publicProducts);
      return publicProducts;
    }
  } catch {
    // No API response is available.
  }

  return getStoredProducts();
}

export async function createProduct(input: {
  brandId: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  available: number;
  status: string;
  description?: string;
  imageClass?: string;
  imageUrl?: string | null;
}): Promise<ApiProduct> {
  const created: ApiProduct = {
    id: `prod-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    brandId: input.brandId,
    name: input.name,
    sku: input.sku,
    category: input.category,
    price: Number(input.price ?? 0),
    available: Number(input.available ?? 0),
    status: String(input.status || "DRAFT").toUpperCase(),
    description: input.description || "Added from the owner account.",
    imageClass: input.imageClass || "t1",
    imageUrl: input.imageUrl ?? null,
  };

  try {
    const saved = await createFirestoreProduct(created);
    const nextProducts = [saved, ...getStoredProducts()];
    saveProducts(nextProducts);
    return saved;
  } catch {
    const nextProducts = [created, ...getStoredProducts()];
    saveProducts(nextProducts);
    return created;
  }
}

export async function updateProduct(id: string, input: {
  brandId: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  available: number;
  status: string;
  description?: string;
  imageClass?: string;
  imageUrl?: string | null;
}): Promise<ApiProduct> {
  const updated: ApiProduct = {
    id,
    brandId: input.brandId,
    name: input.name,
    sku: input.sku,
    category: input.category,
    price: Number(input.price ?? 0),
    available: Number(input.available ?? 0),
    status: String(input.status || "DRAFT").toUpperCase(),
    description: input.description || null,
    imageClass: input.imageClass || "t1",
    imageUrl: input.imageUrl ?? null,
  };

  try {
    const saved = await updateFirestoreProduct(id, updated);
    const nextProducts = getStoredProducts().map((product) => product.id === id ? saved : product);
    saveProducts(nextProducts);
    return saved;
  } catch {
    const existing = getStoredProducts().find((product) => product.id === id);
    const saved = existing ? { ...existing, ...updated } : updated;
    const nextProducts = getStoredProducts().map((product) => product.id === id ? saved : product);
    saveProducts(nextProducts.length ? nextProducts : [saved]);
    return saved;
  }
}

export async function deleteProduct(id: string): Promise<ApiProduct> {
  try {
    const deleted = await deleteFirestoreProduct(id);
    saveProducts(getStoredProducts().filter((product) => product.id !== id));
    return deleted;
  } catch {
    const existing = getStoredProducts().find((product) => product.id === id);
    if (!existing) throw new Error("Product was not found.");
    saveProducts(getStoredProducts().filter((product) => product.id !== id));
    return existing;
  }
}

export async function createOrder(input: {
  items: Array<{ productId: string; quantity: number }>;
  paymentMethod?: string;
  shippingAddress?: {
    fullName?: string;
    email?: string;
    address?: string;
    city?: string;
    country?: string;
  };
}): Promise<ApiOrder> {
  const payload = await apiRequest<{ order?: ApiOrder }>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(input),
  });

  if (!payload.order) {
    throw new Error('Order was not created.');
  }

  return payload.order;
}

export function getOrderTrackingSteps(status?: string) {
  const normalizedStatus = String(status ?? "Pending").trim();
  const steps = [
    { label: "Order placed", complete: true },
    { label: "Payment confirmed", complete: ["Paid", "Processing", "Shipped", "Delivered"].includes(normalizedStatus) },
    { label: "Packed", complete: ["Processing", "Shipped", "Delivered"].includes(normalizedStatus) },
    { label: "Shipped", complete: ["Shipped", "Delivered"].includes(normalizedStatus) },
    { label: "Delivered", complete: normalizedStatus === "Delivered" },
  ];

  if (["Cancelled", "Failed"].includes(normalizedStatus)) {
    return [
      { label: "Order placed", complete: true },
      { label: "Payment confirmed", complete: false },
      { label: "Packed", complete: false },
      { label: "Shipped", complete: false },
      { label: "Delivered", complete: false },
    ];
  }

  return steps;
}

export async function fetchOrders(): Promise<ApiOrder[]> {
  const payload = await apiRequest<{ orders?: ApiOrder[] }>("/api/orders");
  return Array.isArray(payload.orders) ? payload.orders : [];
}

export async function updateOrderStatus(id: string, status: string): Promise<ApiOrder> {
  const payload = await apiRequest<{ order?: ApiOrder }>(`/api/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

  if (!payload.order) {
    throw new Error("Order status was not updated.");
  }

  return payload.order;
}

export async function fetchOverviewAnalytics(input: {
  brandId?: string;
  dateFrom?: string;
  dateTo?: string;
  range?: "7D" | "30D" | "3M" | "12M";
} = {}): Promise<ApiOverviewAnalytics> {
  const params = new URLSearchParams();
  if (input.brandId) params.set("brandId", input.brandId);
  if (input.dateFrom) params.set("from", input.dateFrom);
  if (input.dateTo) params.set("to", input.dateTo);
  if (input.range) params.set("range", input.range);
  const query = params.toString();
  return apiRequest<ApiOverviewAnalytics>(`/api/analytics/overview${query ? `?${query}` : ""}`);
}

export async function trackProductView(productId: string): Promise<void> {
  await apiRequest<{ ok?: boolean }>(`/api/products/${encodeURIComponent(productId)}/view`, {
    method: "POST",
  });
}

export async function fetchProductViews(): Promise<Record<string, number>> {
  const payload = await apiRequest<{ views?: Record<string, number> }>("/api/analytics/views");
  return payload.views ?? {};
}
