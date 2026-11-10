import { beforeEach, describe, expect, it } from "vitest";
import { addToCart, clearCart, getCartSummary, getCheckoutSummary, readCart } from "./cart";

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

  it("adds shipping, tax, and delivery estimates to checkout totals", () => {
    const summary = getCheckoutSummary([
      { id: "p-1", name: "Graphic Tee", price: 700, quantity: 1 },
      { id: "p-2", name: "Canvas Jacket", price: 1420, quantity: 1 },
    ]);

    expect(summary.subtotal).toBe(2120);
    expect(summary.shipping).toBe(0);
    expect(summary.tax).toBe(318);
    expect(summary.total).toBe(2438);
    expect(summary.deliveryWindow).toContain("3-5");
  });
});
