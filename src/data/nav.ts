export type Kind = "studio" | "market";

export interface NavItem {
  label: string;
  to: string;
}

export interface NavConfig {
  label: string;
  tagline: string[];
  items: NavItem[];
}

export const NAV: Record<Kind, NavConfig> = {
  studio: {
    label: "Seller Studio",
    tagline: ["INDEPENDENT BRANDS.", "BIGGER TOMORROWS."],
    items: [
      { label: "Overview", to: "/studio/overview" },
      { label: "Products", to: "/studio/products" },
      { label: "Orders", to: "/studio/orders" },
      { label: "Inventory", to: "/studio/inventory" },
      { label: "Purchases", to: "/studio/purchases" },
      { label: "Analytics", to: "/studio/analytics" },
      { label: "Store settings", to: "/studio/settings" }
    ],
  },
  market: {
    label: "Store owner portal",
    tagline: ["STORE DATA.", "ONE OWNER. MANY BRANDS."],
    items: [
      { label: "Overview", to: "/market/overview" },
      { label: "Brands", to: "/market/brands" },
      { label: "Products", to: "/market/products" },
      { label: "Orders", to: "/market/orders" },
      { label: "Inventory", to: "/market/inventory" },
      { label: "Blog", to: "/market/blog" },
      { label: "Analytics", to: "/market/analytics" },
      { label: "Store settings", to: "/market/settings" }
    ],
  },
};
