import { useEffect, useState, type ReactNode } from "react";
import { fetchBrands, fetchProducts, mapApiProduct } from "../lib/store-api";
import { subscribeToBrands } from "../lib/brand-store";
import { subscribeToProducts } from "../lib/product-store";
import { STORE, replaceStoreProducts } from "../data/store";
import StoreHeader from "./StoreHeader";
import StoreFooter from "./StoreFooter";
import "../styles/storefront.css";

export default function StoreLayout({ children, fullWidth = false }: { children: ReactNode; fullWidth?: boolean }) {
  const [, setCatalogRevision] = useState(0);

  useEffect(() => {
    let active = true;

    const loadCatalog = async () => {
      try {
        const [brands, products] = await Promise.all([fetchBrands(), fetchProducts()]);
        if (!active) return;

        STORE.brands.length = 0;
        STORE.brands.push(...brands.map((brand) => ({
          id: brand.id,
          name: brand.name,
          abbreviation: brand.abbreviation ?? brand.name.slice(0, 2).toUpperCase(),
          accent: brand.accent ?? "#4f6f52",
          category: "Fashion",
        })));

        const publicStatuses = new Set(["Active", "Low stock", "Preorder"]);
        const publicProducts = products
          .map((product) => mapApiProduct(product))
          .filter((product) => publicStatuses.has(product.status));
        replaceStoreProducts(publicProducts);
        setCatalogRevision((revision) => revision + 1);
      } catch {
        // Preserve the existing in-memory catalog if live loading fails.
      }
    };

    void loadCatalog();

    const unsubscribeBrands = subscribeToBrands((brands) => {
      if (!active) return;
      STORE.brands.length = 0;
      STORE.brands.push(...brands.map((brand) => ({
        id: brand.id,
        name: brand.name,
        abbreviation: brand.abbreviation ?? brand.name.slice(0, 2).toUpperCase(),
        accent: brand.accent ?? "#4f6f52",
        category: "Fashion",
      })));
      setCatalogRevision((revision) => revision + 1);
    });

    const unsubscribeProducts = subscribeToProducts((products) => {
      if (!active) return;
      const publicStatuses = new Set(["Active", "Low stock", "Preorder"]);
      replaceStoreProducts(products
        .map((product) => mapApiProduct(product))
        .filter((product) => publicStatuses.has(product.status)));
      setCatalogRevision((revision) => revision + 1);
    });

    return () => {
      active = false;
      unsubscribeBrands();
      unsubscribeProducts();
    };
  }, []);

  return (
    <div className="sf">
      <div className={`page${fullWidth ? " page--full" : ""}`} id="top">
        <StoreHeader />
        <main>{children}</main>
        <StoreFooter />
      </div>
    </div>
  );
}
