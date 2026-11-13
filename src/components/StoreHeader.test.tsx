/** @vitest-environment jsdom */

import { describe, expect, it } from "vitest";
import { act } from "react-dom/test-utils";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import StoreHeader from "./StoreHeader";

describe("StoreHeader", () => {
  it("keeps the storefront header pinned while scrolling through product listings", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    act(() => {
      root.render(
        <MemoryRouter>
          <StoreHeader />
        </MemoryRouter>
      );
    });

    const header = container.querySelector(".header");
    expect(header).not.toBeNull();
    expect(header?.classList.contains("header--sticky")).toBe(true);

    act(() => {
      root.unmount();
    });
    container.remove();
  });
});
