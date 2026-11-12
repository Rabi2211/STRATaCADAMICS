import { beforeEach, describe, expect, it } from "vitest";
import { readWishlist, toggleWishlist } from "./wishlist";

function createMemoryStorage() {
  const values = new Map<string, string>();

  return {
    getItem(key: string) {
      return values.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      values.set(key, value);
    },
  };
}

describe("wishlist helpers", () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, "localStorage", {
      value: createMemoryStorage(),
      configurable: true,
    });
  });

  it("adds and removes products from persistent wishlist storage", () => {
    expect(toggleWishlist("p-1")).toEqual(["p-1"]);
    expect(readWishlist()).toEqual(["p-1"]);
    expect(toggleWishlist("p-1")).toEqual([]);
    expect(readWishlist()).toEqual([]);
  });

  it("preserves other products when toggling one product", () => {
    toggleWishlist("p-1");
    toggleWishlist("p-2");

    expect(toggleWishlist("p-1")).toEqual(["p-2"]);
  });
});