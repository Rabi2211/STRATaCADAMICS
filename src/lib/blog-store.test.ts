import { beforeEach, describe, expect, it } from "vitest";
import { getBlogPosts, getStoredBlogPosts, saveBlogPosts, saveStoredBlogPosts, subscribeToBlogPosts } from "./blog-store";

describe("blog-store", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("persists and reads blog posts across the storefront and owner dashboard", () => {
    const posts = [
      {
        id: "brand-1",
        title: "Brand Story: Crafting Everyday Essentials",
        category: "Brand Story",
        author: "Store owner",
        date: "May 18, 2025",
        content: "<p>Example content</p>",
      },
    ];

    saveStoredBlogPosts(posts);

    expect(getStoredBlogPosts()).toEqual(posts);
  });

  it("supports the shared blog store API for backend-backed persistence with local fallback", async () => {
    const posts = [
      {
        id: "brand-2",
        title: "Style Guide: Minimal Luxury",
        category: "Style Guide",
        author: "Store owner",
        date: "May 20, 2025",
        content: "<p>Fresh article</p>",
      },
    ];

    await saveBlogPosts(posts);
    expect(await getBlogPosts()).toEqual(posts);
  });

  it("notifies listeners when the shared blog data changes", async () => {
    const posts = [
      {
        id: "brand-3",
        title: "Brand Story: Modern Essentials",
        category: "Brand Story",
        author: "Store owner",
        date: "May 22, 2025",
        content: "<p>Fresh update</p>",
      },
    ];

    let latestPosts: typeof posts | null = null;
    const unsubscribe = subscribeToBlogPosts((nextPosts) => {
      latestPosts = nextPosts;
    });

    await saveBlogPosts(posts);

    expect(latestPosts).toEqual(posts);
    unsubscribe();
  });
});
