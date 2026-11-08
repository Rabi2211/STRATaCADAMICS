export type StoreProductStatus = "Active" | "Draft" | "Low stock" | "Preorder";

export interface StoreBrand {
  id: string;
  name: string;
  abbreviation: string;
  accent: string;
  category: string;
}

export interface StoreProduct {
  id: string;
  brandId: string;
  name: string;
  category: string;
  sku: string;
  price: number;
  available: number;
  status: StoreProductStatus;
  description: string;
  imageClass: string;
}

export const STORE = {
  owner: "Store owner account",
  name: "STRATA Market",
  brands: [
    { id: "atelier-belle", name: "Atelier Belle", abbreviation: "AB", accent: "#5b6b4c", category: "Women" },
    { id: "rivet-thread", name: "Rivet & Thread", abbreviation: "RT", accent: "#a89480", category: "Mens" },
    { id: "lines-loom", name: "Lines & Loom", abbreviation: "LL", accent: "#6e6e6a", category: "Women" },
    { id: "kinfolk-atelier", name: "Kinfolk Atelier", abbreviation: "KA", accent: "#1a1a1a", category: "Mens" },
    { id: "moss-maple", name: "Moss & Maple", abbreviation: "MM", accent: "#2f4a35", category: "Unisex" },
  ] as StoreBrand[],
  products: [
    { id: "ab-knit-sweater", brandId: "atelier-belle", name: "Atelier Belle Knit Sweater", category: "Sweaters", sku: "AB-KN-001", price: 128, available: 38, status: "Active", description: "Soft-touch knit in a tailored silhouette perfect for everyday layering.", imageClass: "t1" },
    { id: "rt-wide-trousers", brandId: "rivet-thread", name: "Linen Wide Leg Trousers", category: "Pants", sku: "RT-TR-002", price: 98, available: 42, status: "Active", description: "Breathable linen blend with a relaxed wide leg and soft drape.", imageClass: "t2" },
    { id: "ll-organic-shirt", brandId: "lines-loom", name: "Organic Cotton Shirt", category: "Shirts", sku: "LL-SH-004", price: 86, available: 56, status: "Active", description: "Refined everyday shape with crisp cotton and a modern relaxed fit.", imageClass: "t3" },
    { id: "ka-canvas-jacket", brandId: "kinfolk-atelier", name: "Canvas Jacket", category: "Outerwear", sku: "KA-JK-003", price: 142, available: 21, status: "Active", description: "Structured canvas layering piece designed for all-day wear.", imageClass: "t4" },
    { id: "mm-tee", brandId: "moss-maple", name: "Moss & Maple Tee", category: "Tops", sku: "MM-TS-001", price: 54, available: 87, status: "Active", description: "Clean basics with a premium feel and durable cotton construction.", imageClass: "t5" },
  ] as StoreProduct[],
};

export type StoreProductDraft = Omit<StoreProduct, "id" | "imageClass" | "available"> & {
  id?: string;
  imageClass?: string;
  available?: number;
  quantity?: number;
};

export function addProductToStore(
  currentProducts: StoreProduct[],
  product: StoreProductDraft
): StoreProduct[] {
  const nextProduct: StoreProduct = {
    id: product.id ?? `${product.brandId}-${Date.now()}`,
    imageClass: product.imageClass ?? "t1",
    ...product,
    available: product.available ?? product.quantity ?? 0,
  };

  return [...currentProducts, nextProduct];
}

export function replaceStoreProducts(nextProducts: StoreProduct[]) {
  STORE.products.length = 0;
  STORE.products.push(...nextProducts);
  return STORE.products;
}

export function getBrandById(brandId: string) {
  return STORE.brands.find((brand) => brand.id === brandId);
}

export const STORE_SUMMARY = {
  totalProducts: STORE.products.length,
  activeProducts: STORE.products.filter((product) => product.status === "Active").length,
  lowStockProducts: STORE.products.filter((product) => product.available <= 25).length,
  totalUnits: STORE.products.reduce((sum, product) => sum + product.available, 0),
  totalRevenue: STORE.products.reduce((sum, product) => sum + product.price * product.available, 0),
};

export function getBrandProductCount(brandId: string) {
  return STORE.products.filter((product) => product.brandId === brandId).length;
}

export function getBrandProducts(brandId: string) {
  return STORE.products.filter((product) => product.brandId === brandId);
}

export function getInventoryRows() {
  return STORE.products.map((product) => {
    const brand = getBrandById(product.brandId);
    return {
      ...product,
      brand,
      committed: Math.max(2, Math.round(product.available * 0.08)),
      status: product.available <= 25 ? "Low stock" : "In stock",
    };
  });
}
