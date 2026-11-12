import { readJson, writeJson } from "./storage";

const WISHLIST_STORAGE_KEY = "strata-wishlist";

export function readWishlist(): string[] {
  const stored = readJson<unknown>(WISHLIST_STORAGE_KEY);
  return Array.isArray(stored)
    ? stored.filter((productId): productId is string => typeof productId === "string")
    : [];
}

export function toggleWishlist(productId: string): string[] {
  const wishlist = readWishlist();
  const nextWishlist = wishlist.includes(productId)
    ? wishlist.filter((id) => id !== productId)
    : [...wishlist, productId];

  return writeJson(WISHLIST_STORAGE_KEY, nextWishlist);
}