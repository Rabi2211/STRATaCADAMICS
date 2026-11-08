import { beforeEach, describe, expect, it } from "vitest";
import { getStoredAuthSession, saveAuthSession } from "./storage";

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

describe("auth storage", () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, "localStorage", {
      value: createMemoryStorage(),
      configurable: true,
    });
  });

  it("stores and reads the auth session", () => {
    const session = {
      token: "abc123",
      user: {
        id: "user-1",
        email: "demo@example.com",
        name: "Demo User",
        role: "customer",
      },
    };

    saveAuthSession(session);

    expect(getStoredAuthSession()).toEqual(session);
  });
});
