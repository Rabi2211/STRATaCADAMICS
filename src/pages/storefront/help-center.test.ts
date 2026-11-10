import { describe, expect, it } from "vitest";
import { HELP_CENTER_ARTICLES, HELP_CENTER_CATEGORIES, searchHelpCenterArticles } from "./help-center";

describe("help center data", () => {
  it("includes the primary shopping categories customers commonly need", () => {
    expect(HELP_CENTER_CATEGORIES).toHaveLength(4);
    expect(HELP_CENTER_CATEGORIES.map((category) => category.id)).toEqual(
      expect.arrayContaining(["orders", "shipping", "returns", "payments"]),
    );
  });

  it("supports searchable article cards for the landing-page help experience", () => {
    expect(HELP_CENTER_ARTICLES.length).toBeGreaterThan(0);
    expect(searchHelpCenterArticles("tracking")).toEqual(
      expect.arrayContaining([expect.objectContaining({ title: expect.stringMatching(/tracking|status/i) })]),
    );
  });
});
