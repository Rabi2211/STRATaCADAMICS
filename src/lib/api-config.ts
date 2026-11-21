export type LocationLike = {
  hostname?: string;
  origin?: string;
};

export function resolveApiBaseUrl(
  configuredUrl?: string,
  locationOverride?: LocationLike,
): string {
  const trimmedUrl = configuredUrl?.trim();

  const currentLocation =
    locationOverride ??
    (typeof window !== "undefined"
      ? {
          hostname: window.location.hostname,
          origin: window.location.origin,
        }
      : undefined);

  const isLocalHostname = (hostname?: string): boolean => {
    if (!hostname) {
      return false;
    }

    return hostname === "localhost" || hostname === "127.0.0.1" || hostname.endsWith(".localhost");
  };

  if (trimmedUrl) {
    let configuredHostname: string | undefined;

    try {
      configuredHostname = new URL(trimmedUrl).hostname;
    } catch {
      configuredHostname = undefined;
    }

    if (!(isLocalHostname(configuredHostname) && currentLocation && !isLocalHostname(currentLocation.hostname))) {
      return trimmedUrl.replace(/\/+$/, "");
    }
  }

  if (currentLocation?.hostname && !isLocalHostname(currentLocation.hostname)) {
    return (currentLocation.origin ?? `https://${currentLocation.hostname}`).replace(/\/+$/, "");
  }

  return "http://localhost:4000";
}
