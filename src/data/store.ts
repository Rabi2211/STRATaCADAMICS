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
  imageUrl?: string | null;
}

export const STORE = {
  owner: "Store owner account",
  name: "STRATA Market",
  brands: [] as StoreBrand[],
  products: [] as StoreProduct[],
};

export type StoreProductDraft = Omit<StoreProduct, "id" | "imageClass" | "available"> & {
  id?: string;
  imageClass?: string;
  imageUrl?: string | null;
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
    imageUrl: product.imageUrl ?? null,
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

const PRODUCT_REVIEWS: Record<string, Array<{ name: string; rating: number; review: string }>> = {
  "ab-knit-sweater": [
    { name: "Ava", rating: 5, review: "The knit feels luxury-level and the fit is polished without being stiff." },
    { name: "Mila", rating: 5, review: "Bought it for work and it looks elevated enough for evenings too." },
    { name: "Tumi", rating: 4, review: "Very comfortable with a great drape and easy styling." },
  ],
  "rt-wide-trousers": [
    { name: "Keletso", rating: 5, review: "Lightweight, flattering, and an easy win for warm-weather dressing." },
    { name: "Nandi", rating: 4, review: "The fit feels premium and the linen texture is beautiful in person." },
  ],
  "ll-organic-shirt": [
    { name: "Lerato", rating: 5, review: "A classic staple that looks tailored without any fuss." },
  ],
  "ka-canvas-jacket": [
    { name: "Zoe", rating: 5, review: "Great structure and the detailing feels expensive without being loud." },
    { name: "Sam", rating: 4, review: "People keep asking where I got it from. Strong everyday layer." },
  ],
  "mm-tee": [
    { name: "Jade", rating: 5, review: "Simple, reliable, and feels premium for a basic tee." },
  ],
};

export function getProductById(productId: string) {
  const product = STORE.products.find((entry) => entry.id === productId);
  if (!product) {
    return null;
  }

  return {
    product,
    brand: getBrandById(product.brandId),
    reviews: PRODUCT_REVIEWS[productId] ?? [
      { name: "Verified buyer", rating: 5, review: "A dependable staple from the STRATA collection." },
    ],
  };
}

export type ProductSortOption = "featured" | "price-asc" | "price-desc" | "name-asc";

export type ProductFilters = {
  query?: string;
  category?: string;
  sort?: ProductSortOption;
};

export function filterAndSortProducts(products: StoreProduct[], filters: ProductFilters = {}) {
  const query = (filters.query ?? "").trim().toLowerCase();
  const category = (filters.category ?? "").trim();
  const sort = filters.sort ?? "featured";

  let nextProducts = [...products];

  if (query) {
    nextProducts = nextProducts.filter((product) => {
      const searchable = [product.name, product.category, product.brandId, product.description, product.sku]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }

  if (category) {
    nextProducts = nextProducts.filter((product) => product.category === category || product.category.toLowerCase() === category.toLowerCase());
  }

  switch (sort) {
    case "price-asc":
      nextProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      nextProducts.sort((a, b) => b.price - a.price);
      break;
    case "name-asc":
      nextProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "featured":
    default:
      nextProducts.sort((a, b) => (a.available < b.available ? 1 : -1));
      break;
  }

  return nextProducts;
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
