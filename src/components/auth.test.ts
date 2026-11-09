import { describe, expect, it } from "vitest";
import { ensureAuthSession, formatAuthError, getPostLoginPath, getRoleForAuth } from "../lib/auth";
import { getRegistrationDisplayName, isBrandNameRequired } from "./StoreHeader";

describe("auth registration flow", () => {
  it("requires a brand name only for brand-owner accounts", () => {
    expect(isBrandNameRequired("customer")).toBe(false);
    expect(isBrandNameRequired("brand-owner")).toBe(true);
    expect(isBrandNameRequired("admin")).toBe(false);
  });

  it("uses the full name for customer registrations without a brand", () => {
    expect(getRegistrationDisplayName("Ava Stone", "", "ava@example.com", "customer")).toBe("Ava Stone");
    expect(getRegistrationDisplayName("", "", "ava@example.com", "customer")).toBe("ava@example.com");
  });

  it("routes admin and brand-owner sign-ins to their portals", () => {
    expect(getRoleForAuth("admin")).toBe("admin");
    expect(getRoleForAuth("brand-owner")).toBe("brand-owner");
    expect(getPostLoginPath("admin")).toBe("/market/overview");
    expect(getPostLoginPath("brand-owner")).toBe("/studio/overview");
    expect(getPostLoginPath("customer")).toBe("/");
  });

  it("translates Firebase auth errors into meaningful guidance", () => {
    expect(formatAuthError({ code: "auth/operation-not-allowed" })).toContain("Email/password sign-in is not enabled");
    expect(formatAuthError(new Error("Firebase is not configured."))).toContain("Firebase Auth is not configured");
    expect(formatAuthError({ code: "auth/wrong-password" })).toBe("Incorrect email or password.");
  });

  it("rejects empty auth payloads instead of returning a null session", () => {
    expect(() => ensureAuthSession(null)).toThrow("Authentication response was empty.");
    expect(() => ensureAuthSession({ token: "abc", user: null as any })).toThrow("Authentication response was empty.");
  });
});
