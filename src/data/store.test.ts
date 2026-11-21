import { describe, expect, it, vi } from "vitest";
import { createBrand, fetchBrands, getOrderTrackingSteps } from "../lib/store-api";
import { addProductToStore, filterAndSortProducts, getBrandProducts, getProductById, STORE } from "./store";
import { FEATURED_COLLECTIONS } from "./storefront";
import { saveBrands } from "../lib/brand-store";

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

  it("keeps the storefront catalog initially empty", () => {
    expect(STORE.owner).toBe("Store owner account");
    expect(STORE.brands).toEqual([]);
    expect(STORE.products).toEqual([]);
  });

  it("returns no products for a brand from the empty shared store", () => {
    expect(getBrandProducts("atelier-belle")).toEqual([]);
  });

  it("filters an empty storefront catalog safely", () => {
    const results = filterAndSortProducts(STORE.products, {
      query: "linen",
      category: "Pants",
      sort: "price-desc",
    });
    expect(results).toEqual([]);
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
    saveBrands([]);
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

  it("returns no seeded product detail payload", () => {
    expect(getProductById("ab-knit-sweater")).toBeNull();
  });

  it("exposes curated featured collections for the storefront landing page", () => {
    expect(FEATURED_COLLECTIONS).toHaveLength(3);
    expect(FEATURED_COLLECTIONS.map((collection) => collection.id)).toEqual(expect.arrayContaining(["quiet-luxury", "city-layers", "weekend-edit"]));
    expect(FEATURED_COLLECTIONS[0].productIds).toEqual(expect.arrayContaining(["ab-knit-sweater", "rt-wide-trousers"]));
  });
});
