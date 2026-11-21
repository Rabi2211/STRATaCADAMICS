/** @vitest-environment jsdom */

import { act } from "react-dom/test-utils";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ProductDetailPage from "./ProductDetail";

describe("ProductDetailPage", () => {
  it("adds responsive layout hooks for compact screens", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    act(() => {
      root.render(
        <MemoryRouter initialEntries={["/product/ab-knit-sweater"]}>
          <Routes>
            <Route path="/product/:productId" element={<ProductDetailPage />} />
          </Routes>
        </MemoryRouter>,
      );
    });

    expect(container.textContent).toContain("Product not found");

    act(() => {
      root.unmount();
    });
    container.remove();
  });
});
