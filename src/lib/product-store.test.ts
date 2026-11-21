import { beforeEach, describe, expect, it } from "vitest";
import { getStoredProducts, saveProducts, subscribeToProducts } from "./product-store";
import type { ApiProduct } from "./store-api";

describe("product-store", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("persists products in shared storage", () => {
    const products: ApiProduct[] = [
      {
        id: "prod-1",
        brandId: "brand-1",
        name: "Classic Tee",
        sku: "SKU-1",
        category: "Sweaters",
        price: 120,
        available: 10,
        status: "ACTIVE",
        description: "Example product",
        imageClass: "t1",
      },
    ];

    saveProducts(products);

    expect(getStoredProducts()).toEqual(products);
  });

  it("notifies listeners when products change", () => {
    const products: ApiProduct[] = [
      {
        id: "prod-2",
        brandId: "brand-2",
        name: "Modern Shirt",
        sku: "SKU-2",
        category: "Sweaters",
        price: 140,
        available: 8,
        status: "ACTIVE",
        description: "Fresh update",
        imageClass: "t2",
      },
    ];

    let latestProducts: ApiProduct[] | null = null;
    const unsubscribe = subscribeToProducts((nextProducts) => {
      latestProducts = nextProducts;
    });

    saveProducts(products);

    expect(latestProducts).toEqual(products);
    unsubscribe();
  });
});
