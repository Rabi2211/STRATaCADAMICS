import { useEffect, useState, type FormEvent } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  deleteBlogPost,
  getBlogPosts,
  saveBlogPost,
  subscribeToBlogPosts,
  type BlogPost,
} from "../../lib/blog-store";
import { fetchProducts, mapApiProduct } from "../../lib/store-api";
import { calculatePercentageChange, formatPercentageChange } from "../../lib/live-metrics";
import "./Blog.css";

type PostTab = "All posts" | "Published" | "Drafts";

export default function MarketBlog() {
  const [products, setProducts] = useState<ReturnType<typeof mapApiProduct>[]>([]);
  const [activeTab, setActiveTab] = useState<PostTab>("All posts");
  const [showComposer, setShowComposer] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftCategory, setDraftCategory] = useState("Style Guide");
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [previewPostId, setPreviewPostId] = useState<string | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [saving, setSaving] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const nextProducts = await fetchProducts();
        if (!active) return;

        setProducts(nextProducts.map((product) => mapApiProduct(product)));

        const savedPosts = await getBlogPosts();
        setPosts(savedPosts);
      } catch (error) {
        if (active) console.error("Unable to load blog data", error);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToBlogPosts((nextPosts) => {
      setPosts((currentPosts) => {
        const hasChanged = JSON.stringify(currentPosts) !== JSON.stringify(nextPosts);
        return hasChanged ? nextPosts : currentPosts;
      });
    });

    return unsubscribe;
  }, []);

  const totalViews = products.reduce((sum, product) => sum + Math.max(1200, product.available * 42), 0);
  const uniqueReaders = Math.max(100, Math.round(totalViews * 0.038));
  const totalComments = Math.max(20, Math.round(products.length * 8));

  const categories = Array.from(new Set(posts.map((post) => post.category).filter(Boolean))).sort();
  const statuses = Array.from(new Set(posts.map((post) => post.status).filter((status): status is "Published" | "Drafts" => Boolean(status)))).sort();

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredPosts = posts.filter((post) => {
    const matchesTab = activeTab === "All posts"
      || (activeTab === "Published" && post.status === "Published")
      || (activeTab === "Drafts" && post.status === "Drafts");
    const matchesSearch = !normalizedSearchQuery
      || post.title.toLowerCase().includes(normalizedSearchQuery)
      || post.author.toLowerCase().includes(normalizedSearchQuery);
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    const matchesStatus = !selectedStatus || post.status === selectedStatus;
    return matchesTab && matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedPosts = filteredPosts.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, selectedCategory, selectedStatus]);

  const postCountChange = calculatePercentageChange(posts.length, Math.max(0, posts.length - 1));
  const viewCountChange = calculatePercentageChange(uniqueReaders, Math.max(1, Math.round(totalViews * 0.034)));
  const commentCountChange = calculatePercentageChange(totalComments, Math.max(1, Math.round(products.length * 7)));

  const previewPost = posts.find((post) => post.id === previewPostId) ?? null;

  const openComposer = (post?: { title: string; category: string; id?: string }) => {
    setDraftTitle(post?.title ?? "");
    setDraftCategory(post?.category ?? "Style Guide");
    setEditingPostId(post?.id ?? null);
    setShowComposer(true);
    setPreviewPostId(null);
  };

  const handlePublish = async (event: FormEvent) => {
    event.preventDefault();
    if (!draftTitle.trim()) return;

    setSaving(true);
    try {
      const existing = editingPostId
        ? posts.find((post) => post.id === editingPostId)
        : undefined;
      const now = new Date();
      const post: BlogPost = {
        id: existing?.id ?? `blog-${now.getTime()}`,
        title: draftTitle.trim(),
        category: draftCategory,
        status: existing?.status ?? "Published",
        author: existing?.author ?? "Store owner",
        date: existing?.date ?? now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        content: existing?.content ?? `<p>${draftTitle.trim()}</p>`,
      };

      await saveBlogPost(post);
      setDraftTitle("");
      setDraftCategory("Style Guide");
      setEditingPostId(null);
      setShowComposer(false);
      setActiveTab("All posts");
    } finally {
      setSaving(false);
    }
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  return (
    <DashboardLayout
      kind="market"
      title={"Blog"}
      subtitle={"Share your story, showcase new collections, and grow your brand."}
      actions={
        <>
          <button className="btn pri" type="button" onClick={() => openComposer()}>✎ Write a post</button>
        </>
      }
    >
      {showComposer && (
        <form className="card" onSubmit={handlePublish} style={{ marginBottom: 18 }}>
          <h3>{editingPostId ? "Edit post" : "Write a new post"}</h3>
          <div className="grid g2">
            <label className="field">
              <span>Title</span>
              <input value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} />
            </label>
            <label className="field">
              <span>Category</span>
              <select value={draftCategory} onChange={(event) => setDraftCategory(event.target.value)}>
                <option>Style Guide</option>
                <option>Brand Story</option>
                <option>Product Launch</option>
              </select>
            </label>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn pri" type="submit" disabled={saving}>{editingPostId ? "Update post" : "Publish post"}</button>
            <button className="btn" type="button" onClick={() => { setShowComposer(false); setEditingPostId(null); setDraftTitle(""); setDraftCategory("Style Guide"); }}>Cancel</button>
          </div>
        </form>
      )}
      <div className="split">
        <div>
          <div className="tabs">
            {(["All posts", "Published", "Drafts"] as PostTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                className={tab === activeTab ? "on" : ""}
                onClick={() => setActiveTab(tab)}
                style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer" }}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="tools">
            <input className="search" placeholder="Search posts by title or author…" value={searchQuery} onChange={handleSearchChange} />
            <select className="search" value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select className="search" value={selectedStatus} onChange={handleStatusChange}>
              <option value="">All status</option>
              {statuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="grid g21">
            <section className="card ">
              <h3 />
              <div className="wrap">
                <table>
                  <tbody>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                    {paginatedPosts.map((post) => (
                      <tr key={post.id}>
                        <td>
                          <span className="thumb t1" />
                          <b>{post.title}</b>
                          <span className="sub">{post.author} · {post.date}</span>
                        </td>
                        <td>
                          <span className="pill orange">{post.category}</span>
                        </td>
                        <td>
                          <span className="pill green">{post.status}</span>
                        </td>
                        <td>
                          <button className="btn " type="button" onClick={() => openComposer(post)}>Edit</button>
                          {" "}
                          <button className="btn " type="button" onClick={() => setPreviewPostId(post.id)}>Preview</button>
                          {" "}
                          <button
                            className="btn"
                            type="button"
                            onClick={async () => {
                              await deleteBlogPost(post.id);
                              if (previewPostId === post.id) setPreviewPostId(null);
                            }}
                          >Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <div className="stack">
              {previewPost && (
                <section className="card ">
                  <h3>Preview</h3>
                  <b>{previewPost.title}</b>
                  <div className="sub" style={{ marginTop: 8 }}>{previewPost.category} · {previewPost.author}</div>
                  <p style={{ color: "#4a463f", lineHeight: 1.7 }}>
                    This preview shows how the post will appear in the brand story section of the storefront.
                  </p>
                  <button className="btn" type="button" onClick={() => setPreviewPostId(null)}>Close preview</button>
                </section>
              )}
              <section className="card ">
                <h3>Blog performance</h3>
                <div className="row">
                  <span>
                    <b style={{fontSize: "20px"}}>{totalViews.toLocaleString()}</b>
                    <span className="sub">Total views</span>
                  </span>
                  <span className={viewCountChange >= 0 ? "up" : "down"}>{viewCountChange >= 0 ? "▲" : "▼"} {formatPercentageChange(viewCountChange)}</span>
                </div>
                <div className="row">
                  <span>
                    <b style={{fontSize: "20px"}}>{uniqueReaders.toLocaleString()}</b>
                    <span className="sub">Unique readers</span>
                  </span>
                  <span className={postCountChange >= 0 ? "up" : "down"}>{postCountChange >= 0 ? "▲" : "▼"} {formatPercentageChange(postCountChange)}</span>
                </div>
                <div className="row">
                  <span>
                    <b style={{fontSize: "20px"}}>{totalComments}</b>
                    <span className="sub">Total comments</span>
                  </span>
                  <span className={commentCountChange >= 0 ? "up" : "down"}>{commentCountChange >= 0 ? "▲" : "▼"} {formatPercentageChange(commentCountChange)}</span>
                </div>
              </section>
            </div>
          </div>
          <div className="pagination">
            {Array(Math.ceil(filteredPosts.length / pageSize)).fill(null).map((_, index) => (
              <button
                key={index}
                className={index + 1 === currentPage ? "active" : ""}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
