import { describe, expect, it } from "vitest";
import { PAYMENT_PROVIDERS, buildPaymentCheckoutUrl, getPaymentProvider, normalisePaymentStatus } from "./payments";

describe("payment providers", () => {
  it("includes South African checkout providers", () => {
    expect(PAYMENT_PROVIDERS.map((provider) => provider.id)).toEqual(expect.arrayContaining(["ozow", "peach-payments", "bop-pay"]));
  });

  it("builds a checkout URL for redirect-based providers", () => {
    const provider = getPaymentProvider("ozow");
    const url = buildPaymentCheckoutUrl(provider, "ord-123", 2500);

    expect(url).toContain("ord-123");
    expect(url).toContain("2500");
  });

  it("normalises provider callback statuses to trusted values", () => {
    expect(normalisePaymentStatus("paid")).toBe("success");
    expect(normalisePaymentStatus("completed")).toBe("success");
    expect(normalisePaymentStatus("cancelled")).toBe("cancelled");
    expect(normalisePaymentStatus("failed")).toBe("failed");
    expect(normalisePaymentStatus("unknown")).toBe("pending");
  });
});
