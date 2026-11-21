import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import type { ApiProduct } from "./store-api";
import { db } from "./firebase";
import { readJson, writeJson } from "./storage";

const PRODUCT_STORAGE_KEY = "strata-products";
const PRODUCTS_UPDATED_EVENT = "strata-products-updated";
const PRODUCT_COLLECTION = "products";

function normalizeProduct(product: Partial<ApiProduct> | null | undefined): ApiProduct {
  const normalized: ApiProduct = {
    id: product?.id ?? "",
    brandId: product?.brandId ?? "",
    name: product?.name ?? "Untitled product",
    sku: product?.sku ?? "",
    category: product?.category ?? "General",
    price: Number(product?.price ?? 0),
    available: Number(product?.available ?? 0),
    status: product?.status ?? "DRAFT",
    description: product?.description ?? null,
    imageClass: product?.imageClass ?? "t1",
  };

  if (product?.brand !== undefined) normalized.brand = product.brand;
  if (product?.imageUrl !== undefined) normalized.imageUrl = product.imageUrl;

  return normalized;
}

function toFirestoreProduct(product: ApiProduct) {
  const session = readJson<{ user?: { id?: string } }>("strata-auth-session");
  return {
    id: product.id,
    brandId: product.brandId,
    name: product.name,
    sku: product.sku,
    category: product.category,
    price: product.price,
    available: product.available,
    status: product.status,
    description: product.description ?? null,
    imageClass: product.imageClass ?? "t1",
    imageUrl: product.imageUrl ?? null,
    ownerUid: session?.user?.id ?? "",
  };
}

export async function getFirestoreProducts(): Promise<ApiProduct[]> {
  if (!db) return [];

  try {
    const snapshot = await getDocs(collection(db, PRODUCT_COLLECTION));
    const publicStatuses = new Set(["ACTIVE", "Active", "LOW_STOCK", "Low stock", "PREORDER", "Preorder"]);
    return snapshot.docs
      .map((document) => normalizeProduct(document.data() as Partial<ApiProduct>))
      .filter((product) => publicStatuses.has(product.status));
  } catch (error) {
    console.warn("Unable to load products from Firestore, falling back to local storage.", error);
    return [];
  }
}

export async function createFirestoreProduct(product: ApiProduct): Promise<ApiProduct> {
  if (!db) throw new Error("Firestore is unavailable.");

  const normalized = normalizeProduct(product);
  await setDoc(doc(db, PRODUCT_COLLECTION, normalized.id), toFirestoreProduct(normalized));
  return normalized;
}

export async function updateFirestoreProduct(id: string, product: ApiProduct): Promise<ApiProduct> {
  if (!db) throw new Error("Firestore is unavailable.");

  const normalized = normalizeProduct({ ...product, id });
  await setDoc(doc(db, PRODUCT_COLLECTION, id), toFirestoreProduct(normalized), { merge: true });
  return normalized;
}

export async function deleteFirestoreProduct(id: string): Promise<ApiProduct> {
  if (!db) throw new Error("Firestore is unavailable.");

  const existing = (await getFirestoreProducts()).find((product) => product.id === id);
  await deleteDoc(doc(db, PRODUCT_COLLECTION, id));

  if (!existing) {
    throw new Error("Product was not found in Firestore.");
  }

  return existing;
}

export function getStoredProducts(): ApiProduct[] {
  const value = readJson<Array<Partial<ApiProduct>>>(PRODUCT_STORAGE_KEY);
  if (!Array.isArray(value)) return [];
  return value.map((product) => normalizeProduct(product));
}

export function saveProducts(products: Array<Partial<ApiProduct>>): ApiProduct[] {
  const normalizedProducts = products.map((product) => normalizeProduct(product));
  const savedProducts = writeJson(PRODUCT_STORAGE_KEY, normalizedProducts);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(PRODUCTS_UPDATED_EVENT, { detail: savedProducts }));
  }

  return savedProducts;
}

export function subscribeToProducts(listener: (products: ApiProduct[]) => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  const handleStorage = (event: StorageEvent) => {
    if (event.key === PRODUCT_STORAGE_KEY) listener(getStoredProducts());
  };

  const handleProductUpdate = (event: Event) => {
    const detail = (event as CustomEvent<ApiProduct[] | undefined>).detail;
    listener(detail ?? getStoredProducts());
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(PRODUCTS_UPDATED_EVENT, handleProductUpdate as EventListener);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(PRODUCTS_UPDATED_EVENT, handleProductUpdate as EventListener);
  };
}
