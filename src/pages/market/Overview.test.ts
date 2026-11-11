import { describe, expect, it } from "vitest";
import { getSalesSeriesForRange } from "./Overview";

describe("market overview sales range helpers", () => {
  it("returns distinct series for each timeframe", () => {
    const shortSeries = getSalesSeriesForRange("7D");
    const monthSeries = getSalesSeriesForRange("30D");
    const quarterSeries = getSalesSeriesForRange("3M");
    const annualSeries = getSalesSeriesForRange("12M");

    expect(shortSeries.points).toHaveLength(7);
    expect(monthSeries.points).toHaveLength(30);
    expect(quarterSeries.points).toHaveLength(3);
    expect(annualSeries.points).toHaveLength(12);
    expect(shortSeries.points).not.toEqual(monthSeries.points);
    expect(quarterSeries.points).not.toEqual(annualSeries.points);
  });
});
