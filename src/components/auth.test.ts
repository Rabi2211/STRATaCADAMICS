import { describe, expect, it } from "vitest";
import { getPostLoginPath, getRoleForAuth } from "../lib/auth";
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
});
