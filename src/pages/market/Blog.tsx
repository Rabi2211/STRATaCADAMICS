import { useEffect, useState, type FormEvent } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { fetchBrands, fetchProducts, mapApiProduct } from "../../lib/store-api";
import "./Blog.css";

type PostTab = "All posts" | "Published" | "Drafts";

export default function MarketBlog() {
  const [products, setProducts] = useState<ReturnType<typeof mapApiProduct>[]>([]);
  const [activeTab, setActiveTab] = useState<PostTab>("All posts");
  const [showComposer, setShowComposer] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftCategory, setDraftCategory] = useState("Style Guide");
  const [posts, setPosts] = useState<Array<{
    id: string;
    title: string;
    category: string;
    status: "Published" | "Drafts";
    author: string;
    date: string;
  }>>([]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [nextBrands, nextProducts] = await Promise.all([fetchBrands(), fetchProducts()]);
        if (!active) return;
        setProducts(nextProducts.map((product) => mapApiProduct(product)));
        setPosts(
          nextBrands.map((brand, index) => ({
            id: `${brand.id}-${index}`,
            title: `${brand.name} Story: Crafting Everyday Essentials`,
            category: index % 2 === 0 ? "Style Guide" : "Brand Story",
            status: "Published" as const,
            author: brand.owner?.name ?? "Store owner",
            date: `May ${18 - index}, 2025`,
          })),
        );
      } catch (error) {
        if (active) console.error("Unable to load blog data", error);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  const totalViews = products.reduce((sum, product) => sum + Math.max(1200, product.available * 42), 0);
  const uniqueReaders = Math.max(100, Math.round(totalViews * 0.038));
  const totalComments = Math.max(20, Math.round(products.length * 8));

  const visiblePosts = posts.filter((post) => {
    if (activeTab === "Published") return post.status === "Published";
    if (activeTab === "Drafts") return post.status === "Drafts";
    return true;
  });

  const handlePublish = (event: FormEvent) => {
    event.preventDefault();
    if (!draftTitle.trim()) {
      return;
    }

    const newPost = {
      id: `draft-${Date.now()}`,
      title: draftTitle.trim(),
      category: draftCategory,
      status: "Published" as const,
      author: "Store owner",
      date: "Today",
    };

    setPosts((current) => [newPost, ...current]);
    setDraftTitle("");
    setDraftCategory("Style Guide");
    setShowComposer(false);
    setActiveTab("All posts");
  };

  return (
    <DashboardLayout
      kind="market"
      title={"Blog"}
      subtitle={"Share your story, showcase new collections, and grow your brand."}
      actions={
        <>
          <button className="btn pri" type="button" onClick={() => setShowComposer(true)}>✎ Write a post</button>
        </>
      }
    >
      {showComposer && (
        <form className="card" onSubmit={handlePublish} style={{ marginBottom: 18 }}>
          <h3>Write a new post</h3>
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
            <button className="btn pri" type="submit">Publish post</button>
            <button className="btn" type="button" onClick={() => setShowComposer(false)}>Cancel</button>
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
            <input className="search" placeholder="Search posts by title or author…" />
            <select className="search">
              <option>All categories</option>
            </select>
            <select className="search">
              <option>All status</option>
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
                    {visiblePosts.map((post) => (
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
                          <button className="btn " type="button">Edit</button>
                          {" "}
                          <button className="btn " type="button">Preview</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <div className="stack">
              <section className="card ">
                <h3>Blog performance</h3>
                <div className="row">
                  <span>
                    <b style={{fontSize: "20px"}}>{totalViews.toLocaleString()}</b>
                    <span className="sub">Total views</span>
                  </span>
                  <span className="up">▲ 18%</span>
                </div>
                <div className="row">
                  <span>
                    <b style={{fontSize: "20px"}}>{uniqueReaders.toLocaleString()}</b>
                    <span className="sub">Unique readers</span>
                  </span>
                  <span className="up">▲ 22%</span>
                </div>
                <div className="row">
                  <span>
                    <b style={{fontSize: "20px"}}>{totalComments}</b>
                    <span className="sub">Total comments</span>
                  </span>
                  <span className="up">▲ 12%</span>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
