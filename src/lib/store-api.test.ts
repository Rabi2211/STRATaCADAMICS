import { beforeEach, describe, expect, it, vi } from "vitest";
import { createProduct, fetchBrands, fetchProducts } from "./store-api";

describe("store-api deployment fallback", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("returns empty data when the API is unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("Network down"))));

    const brands = await fetchBrands();
    const products = await fetchProducts();

    expect(brands).toEqual([]);
    expect(products).toEqual([]);
  });

  it("creates a product locally when the hosted API endpoint is unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("Not found"))));

    const created = await createProduct({
      brandId: "atelier-belle",
      name: "Local fallback product",
      sku: "LOCAL-001",
      category: "Sweaters",
      price: 150,
      available: 12,
      status: "Draft",
      description: "Created without a live API.",
      imageClass: "t1",
      imageUrl: null,
    });

    expect(created.id).toBeTruthy();
    expect(created.name).toBe("Local fallback product");
    expect(created.brandId).toBe("atelier-belle");
  });
});
