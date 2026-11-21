import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import type { ApiBrand } from "./store-api";
import { db } from "./firebase";
import { getStoredAuthSession, readJson, writeJson } from "./storage";

const BRAND_STORAGE_KEY = "strata-brands";
const BRANDS_UPDATED_EVENT = "strata-brands-updated";
const BRAND_COLLECTION = "brands";

function normalizeBrand(brand: Partial<ApiBrand> | null | undefined): ApiBrand {
  const name = String(brand?.name || "Untitled brand").trim();
  return {
    id: brand?.id ?? "",
    name,
    description: brand?.description ?? null,
    ownerId: brand?.ownerId,
    accent: brand?.accent,
    abbreviation: brand?.abbreviation ?? name.slice(0, 2).toUpperCase(),
    owner: brand?.owner,
    products: brand?.products,
  };
}

export async function getFirestoreBrands(): Promise<ApiBrand[]> {
  if (!db) return [];

  try {
    const snapshot = await getDocs(collection(db, BRAND_COLLECTION));
    return snapshot.docs.map((document) => normalizeBrand(document.data() as Partial<ApiBrand>));
  } catch (error) {
    console.warn("Unable to load brands from Firestore, falling back to local storage.", error);
    return [];
  }
}

export async function createFirestoreBrand(brand: ApiBrand): Promise<ApiBrand> {
  if (!db) throw new Error("Firestore is unavailable.");

  const normalized = normalizeBrand(brand);
  const session = getStoredAuthSession();
  await setDoc(doc(db, BRAND_COLLECTION, normalized.id), {
    id: normalized.id,
    name: normalized.name,
    description: normalized.description ?? "",
    accent: normalized.accent ?? "#4f6f52",
    abbreviation: normalized.abbreviation ?? normalized.name.slice(0, 2).toUpperCase(),
    ownerUid: session?.user?.id ?? "",
  });
  return normalized;
}

export function getStoredBrands(): ApiBrand[] {
  const value = readJson<Array<Partial<ApiBrand>>>(BRAND_STORAGE_KEY);
  if (!Array.isArray(value)) return [];
  return value.map(normalizeBrand).filter((brand) => Boolean(brand.id));
}

export function saveBrands(brands: Array<Partial<ApiBrand>>): ApiBrand[] {
  const normalizedBrands = brands.map(normalizeBrand).filter((brand) => Boolean(brand.id));
  const savedBrands = writeJson(BRAND_STORAGE_KEY, normalizedBrands);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(BRANDS_UPDATED_EVENT, { detail: savedBrands }));
  }

  return savedBrands;
}

export function subscribeToBrands(listener: (brands: ApiBrand[]) => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  const handleStorage = (event: StorageEvent) => {
    if (event.key === BRAND_STORAGE_KEY) listener(getStoredBrands());
  };
  const handleBrandUpdate = (event: Event) => {
    const detail = (event as CustomEvent<ApiBrand[] | undefined>).detail;
    listener(detail ?? getStoredBrands());
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(BRANDS_UPDATED_EVENT, handleBrandUpdate as EventListener);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(BRANDS_UPDATED_EVENT, handleBrandUpdate as EventListener);
  };
}
