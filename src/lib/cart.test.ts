import { beforeEach, describe, expect, it } from "vitest";
import { addToCart, clearCart, getCartSummary, readCart } from "./cart";

const createMemoryStorage = () => {
  const values = new Map<string, string>();

  return {
    getItem(key: string) {
      return values.has(key) ? values.get(key)! : null;
    },
    setItem(key: string, value: string) {
      values.set(key, value);
    },
    removeItem(key: string) {
      values.delete(key);
    },
    clear() {
      values.clear();
    },
  };
};

describe("cart helpers", () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, "localStorage", {
      value: createMemoryStorage(),
      configurable: true,
    });
    clearCart();
  });

  it("adds products and calculates totals", () => {
    addToCart({
      id: "p-1",
      name: "Graphic Tee",
      price: 700,
      brandId: "brand-1",
      imageClass: "t1",
    });

    addToCart({
      id: "p-1",
      name: "Graphic Tee",
      price: 700,
      brandId: "brand-1",
      imageClass: "t1",
    });

    expect(readCart()).toHaveLength(1);
    expect(getCartSummary().totalItems).toBe(2);
    expect(getCartSummary().subtotal).toBe(1400);
  });
});
