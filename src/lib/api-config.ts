export type LocationLike = {
  hostname?: string;
  origin?: string;
};

export function resolveApiBaseUrl(
  configuredUrl?: string,
  locationOverride?: LocationLike,
): string {
  const trimmedUrl = configuredUrl?.trim();

  if (trimmedUrl) {
    return trimmedUrl.replace(/\/+$/, "");
  }

  const currentLocation =
    locationOverride ??
    (typeof window !== "undefined"
      ? {
          hostname: window.location.hostname,
          origin: window.location.origin,
        }
      : undefined);

  if (
    currentLocation?.hostname &&
    currentLocation.hostname !== "localhost" &&
    currentLocation.hostname !== "127.0.0.1"
  ) {
    return (currentLocation.origin ?? `https://${currentLocation.hostname}`).replace(/\/+$/, "");
  }

  return "http://localhost:4000";
}
