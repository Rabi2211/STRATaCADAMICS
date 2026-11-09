import { describe, expect, it } from "vitest";
import { resolveApiBaseUrl } from "./api-config";

describe("api configuration", () => {
  it("prefers a configured backend URL", () => {
    expect(resolveApiBaseUrl("https://api.example.com/")).toBe("https://api.example.com");
  });

  it("uses the current origin on deployed sites instead of localhost", () => {
    expect(
      resolveApiBaseUrl(undefined, {
        hostname: "stratacadamics.web.app",
        origin: "https://stratacadamics.web.app",
      })
    ).toBe("https://stratacadamics.web.app");
  });

  it("keeps localhost for local development", () => {
    expect(
      resolveApiBaseUrl(undefined, {
        hostname: "localhost",
        origin: "http://localhost:5173",
      })
    ).toBe("http://localhost:4000");
  });
});
