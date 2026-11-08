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

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

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
  const payload = await apiRequest<{ brands: ApiBrand[] }>("/api/brands");
  return payload.brands ?? [];
}

export async function fetchProducts(): Promise<ApiProduct[]> {
  const payload = await apiRequest<{ products: ApiProduct[] }>("/api/products");
  return payload.products ?? [];
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
  const payload = await apiRequest<{ product: ApiProduct }>("/api/products", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return payload.product;
}
