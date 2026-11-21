export function calculatePercentageChange(current: number, previous: number): number {
  if (!Number.isFinite(current) || !Number.isFinite(previous)) return 0;
  if (previous === 0) return current === 0 ? 0 : 100;
  return Math.round(((current - previous) / Math.abs(previous)) * 100);
}

export function calculateSeriesChange(points: number[]): number {
  if (points.length < 2) return 0;
  const previous = points[0];
  const current = points[points.length - 1];
  return calculatePercentageChange(current, previous);
}

export function formatPercentageChange(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return `${rounded >= 0 ? "+" : ""}${rounded}%`;
}
