import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
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
