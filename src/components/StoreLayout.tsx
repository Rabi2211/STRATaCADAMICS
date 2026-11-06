import type { ReactNode } from "react";
import StoreHeader from "./StoreHeader";
import StoreFooter from "./StoreFooter";
import "../styles/storefront.css";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="sf">
      <div className="page" id="top">
        <StoreHeader />
        <main>{children}</main>
        <StoreFooter />
      </div>
    </div>
  );
}
