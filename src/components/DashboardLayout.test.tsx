/** @vitest-environment jsdom */

import { describe, expect, it } from "vitest";
import { act } from "react-dom/test-utils";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

describe("DashboardLayout", () => {
  it("hides the toolbar while scrolling down the page", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    act(() => {
      root.render(
        <MemoryRouter>
          <DashboardLayout
            kind="market"
            title="Products"
            actions={
              <>
                <input className="search" placeholder="Search products" />
                <button className="btn pri">View storefront</button>
              </>
            }
          >
            <div>Body</div>
          </DashboardLayout>
        </MemoryRouter>
      );
    });

    const head = container.querySelector(".head");
    expect(head).not.toBeNull();
    expect(head?.classList.contains("head--hidden")).toBe(false);

    Object.defineProperty(window, "scrollY", { value: 220, writable: true, configurable: true });
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(head?.classList.contains("head--hidden")).toBe(true);

    act(() => {
      root.unmount();
    });
    container.remove();
  });
});
