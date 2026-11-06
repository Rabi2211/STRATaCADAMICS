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
  { id: "tee", image: "/images/promo-tee.jpg", cta: "Shop For Men", variant: "half" },
  { id: "hoodie", image: "/images/promo-hoodie.jpg", cta: "Shop For Men", variant: "half" },
];

export const FOOTER_COLUMNS: FooterColumn[] = [
  { title: "Customer Service", links: ["Track my order", "Request a return", "FAQ", "Refund Policy"] },
  { title: "Legal", links: ["Terms & Conditions", "Privacy Policy", "Cookie Statement", "Contact Details"] },
  { title: "Company", links: ["About", "Ambition", "Founders", "Brand Protection"] },
  { title: "Credits", links: ["Models", "Photographer", "Brand Owner"] },
];
