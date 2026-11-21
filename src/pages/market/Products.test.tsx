import { act } from "react-dom/test-utils";
import { createRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import MarketProducts from "./Products";

vi.mock("../../lib/store-api", async () => {
  const actual = await vi.importActual<typeof import("../../lib/store-api")>("../../lib/store-api");

  return {
    ...actual,
    fetchBrands: vi.fn().mockResolvedValue([
      { id: "atelier-belle", name: "Atelier Belle", description: "Luxury essentials", accent: "#5b6b4c", abbreviation: "AB" },
    ]),
    fetchProducts: vi.fn().mockResolvedValue([]),
    createProduct: vi.fn().mockResolvedValue({
      id: "new-product-one",
      brandId: "atelier-belle",
      name: "Linen Knit Sweater",
      sku: "AB-KN-101",
      category: "Sweaters",
      price: 120,
      available: 18,
      status: "ACTIVE",
      description: "New product added.",
      imageClass: "t1",
    }),
  };
});

describe("market product image upload", () => {
  it("includes a real file picker for product images", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(
        <MemoryRouter>
          <MarketProducts />
        </MemoryRouter>,
      );
      await Promise.resolve();
      await Promise.resolve();
    });

    const imageInput = container.querySelector('input[type="file"][accept="image/*"]');

    expect(imageInput).not.toBeNull();
    expect(imageInput?.getAttribute("hidden")).toBeNull();
    expect(container.textContent).toContain("Click to upload images");

    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it("opens the file input when the upload area is clicked", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(
        <MemoryRouter>
          <MarketProducts />
        </MemoryRouter>,
      );
      await Promise.resolve();
      await Promise.resolve();
    });

    const imageInput = container.querySelector('input[type="file"][accept="image/*"]') as HTMLInputElement;
    const uploadLabel = container.querySelector("label[role='button']") as HTMLLabelElement;
    const clickSpy = vi.spyOn(imageInput, "click");

    uploadLabel.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));

    expect(clickSpy).toHaveBeenCalledTimes(1);

    act(() => {
      root.unmount();
    });
    container.remove();
  });
});
