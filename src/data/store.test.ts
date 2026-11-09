import { describe, expect, it, vi } from "vitest";
import { fetchBrands } from "../lib/store-api";
import { addProductToStore, getBrandProducts, replaceStoreProducts, STORE } from "./store";

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
});
