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
  user?: {
    id: string;
    email: string;
    name: string;
    role?: string;
  };
  items?: ApiOrderItem[];
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
  };
}

export async function fetchBrands(): Promise<ApiBrand[]> {
  const payload = await apiRequest<{ brands?: ApiBrand[] }>("/api/brands");
  return Array.isArray(payload.brands) ? payload.brands : [];
}
export async function createBrand(input: {
  name: string;
  description?: string | null;
}): Promise<ApiBrand> {
  const payload = await apiRequest<{ brand?: ApiBrand }>('/api/brands', {
    method: 'POST',
    body: JSON.stringify(input),
  });

  if (!payload.brand) {
    throw new Error('Brand was not created.');
  }

  return payload.brand;
}
export async function fetchProducts(): Promise<ApiProduct[]> {
  const payload = await apiRequest<{ products?: ApiProduct[] }>("/api/products");
  return Array.isArray(payload.products) ? payload.products : [];
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
}): Promise<ApiProduct> {
  const payload = await apiRequest<{ product?: ApiProduct }>("/api/products", {
    method: "POST",
    body: JSON.stringify(input),
  });

  if (!payload.product) {
    throw new Error("Product was not created.");
  }

  return payload.product;
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
}): Promise<ApiProduct> {
  const payload = await apiRequest<{ product?: ApiProduct }>(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });

  if (!payload.product) {
    throw new Error("Product was not updated.");
  }

  return payload.product;
}

export async function deleteProduct(id: string): Promise<ApiProduct> {
  const payload = await apiRequest<{ deleted?: ApiProduct }>(`/api/products/${id}`, {
    method: "DELETE",
  });

  if (!payload.deleted) {
    throw new Error("Product was not deleted.");
  }

  return payload.deleted;
}

export async function createOrder(input: {
  items: Array<{ productId: string; quantity: number }>;
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
