export type Section = "Men" | "Women" | "Kids";

export interface Promo {
  id: string;
  image: string; // swap for your real image URLs
  cta: string;
  variant: "wide" | "half";
}

export interface FooterColumn {
  title: string;
  links: string[];
}

/* ---------- Data ---------- */
export const SECTIONS: Section[] = ["Men", "Women", "Kids"];

export const PROMOS: Promo[] = [
  { id: "tee", image: "/images/round-pattern-woven-basket-21232550-1.png", cta: "Shop For Men", variant: "half" },
  { id: "hoodie", image: "/images/top-view-plant-in-pot-on-wood-table-free-photo-1.png", cta: "Shop For Men", variant: "half" },
];

export const FEATURED_COLLECTIONS = [
  {
    id: "quiet-luxury",
    title: "Quiet luxury",
    subtitle: "Tailored calm",
    description: "Refined essentials with elevated texture and effortless layering for the everyday uniform.",
    cta: "Shop the edit",
    productIds: ["ab-knit-sweater", "rt-wide-trousers", "mm-tee"],
  },
  {
    id: "city-layers",
    title: "City layers",
    subtitle: "Weather-ready",
    description: "Structured outerwear, crisp shirting, and smart foundations that carry from work to evening.",
    cta: "Build your layer",
    productIds: ["ka-canvas-jacket", "ll-organic-shirt", "ab-knit-sweater"],
  },
  {
    id: "weekend-edit",
    title: "Weekend edit",
    subtitle: "Loose and light",
    description: "Relaxed silhouettes and soft-touch fabrics made for slower mornings and warm afternoons.",
    cta: "See the staples",
    productIds: ["rt-wide-trousers", "mm-tee", "ll-organic-shirt"],
  },
] as const;

export const FOOTER_COLUMNS: FooterColumn[] = [
  { title: "Customer Service", links: ["Track my order", "Request a return", "FAQ", "Refund Policy"] },
  { title: "Legal", links: ["Terms & Conditions", "Privacy Policy", "Cookie Statement", "Contact Details"] },
  { title: "Company", links: ["About", "Ambition", "Founders", "Brand Protection"] },
  { title: "Credits", links: ["Models", "Photographer", "Brand Owner"] },
];
