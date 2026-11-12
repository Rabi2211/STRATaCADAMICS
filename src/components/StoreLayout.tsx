import type { ReactNode } from "react";
import StoreHeader from "./StoreHeader";
import StoreFooter from "./StoreFooter";
import "../styles/storefront.css";

export default function StoreLayout({ children, fullWidth = false }: { children: ReactNode; fullWidth?: boolean }) {
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
