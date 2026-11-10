import { describe, expect, it, vi } from "vitest";
import { createBrand, fetchBrands, getOrderTrackingSteps } from "../lib/store-api";
import { addProductToStore, filterAndSortProducts, getBrandProducts, getProductById, replaceStoreProducts, STORE } from "./store";
import { FEATURED_COLLECTIONS } from "./storefront";

describe("store owner data model", () => {
  it("adds a product to a selected brand and updates the store inventory", () => {
    const result = addProductToStore(STORE.products, {
      name: "New Strata Hoodie",
      brandId: "moss-and-maple",
      sku: "MM-HD-099",
      price: 140,
      quantity: 24,
      status: "Active",
      category: "Outerwear",
      description: "Store-owned product added from the owner portal.",
    });

    expect(result.length).toBe(STORE.products.length + 1);
    expect(result[result.length - 1].brandId).toBe("moss-and-maple");
    expect(result[result.length - 1].sku).toBe("MM-HD-099");
  });

  it("keeps storefront data connected to the store owner account", () => {
    expect(STORE.owner).toBe("Store owner account");
    expect(STORE.brands.length).toBeGreaterThan(0);
    expect(STORE.products.some((product) => product.brandId === "atelier-belle")).toBe(true);
  });

  it("returns the products for a specific brand from the shared store", () => {
    const brandProducts = getBrandProducts("atelier-belle");

    expect(brandProducts.length).toBeGreaterThan(0);
    expect(brandProducts.every((product) => product.brandId === "atelier-belle")).toBe(true);
  });

  it("replaces the shared store product list when owner changes are submitted", () => {
    const snapshot = [...STORE.products];
    const nextProducts = addProductToStore(snapshot, {
      name: "Owner Sync Test Jacket",
      brandId: "rivet-thread",
      sku: "RT-JK-777",
      price: 160,
      quantity: 18,
      status: "Active",
      category: "Outerwear",
      description: "Regression check for shared store updates.",
    });

    replaceStoreProducts(nextProducts);

    expect(STORE.products.length).toBe(snapshot.length + 1);
    expect(STORE.products[STORE.products.length - 1].sku).toBe("RT-JK-777");
  });

  it("filters and sorts the storefront catalog for credible browsing", () => {
    const results = filterAndSortProducts(STORE.products, {
      query: "linen",
      category: "Pants",
      sort: "price-desc",
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].category).toBe("Pants");
    expect(results[0].name.toLowerCase()).toContain("linen");
  });

  it("creates a brand from the API response payload", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ brand: { id: "brand-42", name: "Northline Co.", description: "New brand", ownerId: "owner-1" } }),
      }),
    );

    await expect(createBrand({ name: "Northline Co.", description: "New brand" })).resolves.toMatchObject({
      id: "brand-42",
      name: "Northline Co.",
      ownerId: "owner-1",
    });

    vi.unstubAllGlobals();
  });

  it("returns an empty list when the brand API responds with no payload", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => null,
      }),
    );

    await expect(fetchBrands()).resolves.toEqual([]);

    vi.unstubAllGlobals();
  });

  it("maps order statuses to a meaningful fulfillment timeline", () => {
    const tracking = getOrderTrackingSteps("Paid");

    expect(tracking).toEqual(expect.arrayContaining([
      expect.objectContaining({ label: "Order placed", complete: true }),
      expect.objectContaining({ label: "Payment confirmed", complete: true }),
      expect.objectContaining({ label: "Packed", complete: false }),
    ]));
  });

  it("loads a product detail payload with its brand metadata", () => {
    const result = getProductById("ab-knit-sweater");

    expect(result).toBeTruthy();
    expect(result?.product.name).toBe("Atelier Belle Knit Sweater");
    expect(result?.brand?.name).toBe("Atelier Belle");
    expect(result?.reviews.length).toBeGreaterThan(0);
  });

  it("exposes curated featured collections for the storefront landing page", () => {
    expect(FEATURED_COLLECTIONS).toHaveLength(3);
    expect(FEATURED_COLLECTIONS.map((collection) => collection.id)).toEqual(expect.arrayContaining(["quiet-luxury", "city-layers", "weekend-edit"]));
    expect(FEATURED_COLLECTIONS[0].productIds).toEqual(expect.arrayContaining(["ab-knit-sweater", "rt-wide-trousers"]));
  });
});
