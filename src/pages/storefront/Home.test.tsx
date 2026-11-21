import { act } from "react-dom/test-utils";
import { createRoot } from "react-dom/client";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import MensItems from "./MensItems";
import { FeedbackModal, Hero } from "./Home";

describe("storefront feedback", () => {
  it("renders the feedback trigger and open dialog content", () => {
    const heroHtml = renderToStaticMarkup(<Hero />);
    const modalHtml = renderToStaticMarkup(<FeedbackModal isOpen={true} onClose={() => undefined} />);

    expect(heroHtml).toContain("Give feedback");
    expect(heroHtml).toContain("feedback");
    expect(modalHtml).toContain("Share your feedback");
  });

  it("keeps the popup scrollable without letting the page behind scroll", () => {
    const modalHtml = renderToStaticMarkup(<FeedbackModal isOpen={true} onClose={() => undefined} />);

    expect(modalHtml).toContain("max-height:80vh");
    expect(modalHtml).toContain("overflow-y:auto");
  });
});

describe("storefront mobile product categories", () => {
  it("keeps All separate and lists all mobile clothing categories without Other", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    act(() => {
      root.render(
        <MemoryRouter initialEntries={["/men"]}>
          <MensItems />
        </MemoryRouter>,
      );
    });

    const categoriesButton = Array.from(container.querySelectorAll("button")).find((button) => button.textContent === "Categories");
    expect(categoriesButton).not.toBeNull();

    act(() => {
      categoriesButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(container.textContent).toContain("All");
    expect(container.textContent).toContain("Pants");
    expect(container.textContent).toContain("Shirts");
    expect(container.textContent).toContain("Sweaters");
    expect(container.textContent).toContain("Outerwear");
    expect(container.textContent).toContain("Tops");
    expect(container.textContent).not.toContain("Other");
    expect(container.innerHTML).not.toContain('role="menuitem">All');

    act(() => {
      root.unmount();
    });
    container.remove();
  });
});
