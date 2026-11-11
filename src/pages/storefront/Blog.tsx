import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StoreLayout from "../../components/StoreLayout";
import { fetchBrands } from "../../lib/store-api";
import "./Blog.css";

type BlogPost = {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  content: string;
};

export default function StorefrontBlog() {
  const { postId } = useParams<{ postId?: string }>();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadPosts = async () => {
      try {
        setLoading(true);
        const brands = await fetchBrands();
        
        // Generate blog posts from brands
        const generatedPosts: BlogPost[] = brands.map((brand, index) => ({
          id: `${brand.id}-${index}`,
          title: `${brand.name} Story: Crafting Everyday Essentials`,
          category: index % 2 === 0 ? "Style Guide" : "Brand Story",
          author: brand.owner?.name ?? "Store owner",
          date: `May ${18 - index}, 2025`,
          content: `
            <h2>${brand.name}: Our Journey</h2>
            <p>Welcome to the story of ${brand.name}. ${brand.description || "At our brand, we're passionate about creating high-quality products that make a difference in people's lives."}</p>
            <p>Our commitment to excellence is reflected in every piece we create. From the finest materials to the most meticulous craftsmanship, we ensure that our customers receive nothing but the best.</p>
            <h3>What Makes Us Different</h3>
            <p>We believe in quality over quantity. Every product is carefully designed and tested to meet our high standards. Our team works tirelessly to ensure that each item you purchase is worth the investment.</p>
            <h3>Our Values</h3>
            <ul>
              <li>Quality craftsmanship</li>
              <li>Sustainable practices</li>
              <li>Customer satisfaction</li>
              <li>Innovation and creativity</li>
            </ul>
            <p>Join us on this journey and discover why thousands of customers trust ${brand.name} for their everyday essentials.</p>
          `,
        }));

        if (active) {
          setPosts(generatedPosts);
          
          // If a specific post is requested, load it
          if (postId) {
            const post = generatedPosts.find(p => p.id === postId);
            setSelectedPost(post ?? null);
          }
        }
      } catch (error) {
        console.error("Failed to load blog posts", error);
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadPosts();
    return () => {
      active = false;
    };
  }, [postId]);

  if (loading) {
    return (
      <StoreLayout>
        <main style={{ maxWidth: 1180, margin: "32px auto 80px", padding: "0 20px", textAlign: "center" }}>
          <p>Loading blog posts...</p>
        </main>
      </StoreLayout>
    );
  }

  if (selectedPost) {
    return (
      <StoreLayout>
        <main style={{ maxWidth: 900, margin: "32px auto 80px", padding: "0 20px" }}>
          <button
            onClick={() => setSelectedPost(null)}
            style={{
              background: "none",
              border: "none",
              color: "#9b8b7a",
              cursor: "pointer",
              fontSize: 14,
              marginBottom: 24,
              textDecoration: "underline",
            }}
          >
            ← Back to all posts
          </button>

          <article style={{ background: "#fff", borderRadius: 12, padding: "40px" }}>
            <div style={{ marginBottom: 32 }}>
              <span
                style={{
                  display: "inline-block",
                  background: "#f0e8dd",
                  color: "#7d6d5d",
                  padding: "6px 12px",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 12,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                }}
              >
                {selectedPost.category}
              </span>
              <h1 style={{ margin: "12px 0 8px", fontSize: "clamp(1.8rem, 4vw, 2.5rem)" }}>
                {selectedPost.title}
              </h1>
              <p style={{ color: "#9b8b7a", fontSize: 14, margin: "8px 0 0" }}>
                By {selectedPost.author} • {selectedPost.date}
              </p>
            </div>

            <div
              style={{
                color: "#4b4541",
                lineHeight: 1.8,
                fontSize: 16,
              }}
              dangerouslySetInnerHTML={{ __html: selectedPost.content }}
            />
          </article>

          <div style={{ marginTop: 60, paddingTop: 40, borderTop: "1px solid #e8dfd4" }}>
            <h3 style={{ margin: "0 0 20px", color: "#1d1917" }}>More from our blog</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 20,
              }}
            >
              {posts
                .filter(p => p.id !== selectedPost.id)
                .slice(0, 3)
                .map(post => (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    style={{
                      background: "#f9f7f5",
                      border: "1px solid #e8dfd4",
                      borderRadius: 12,
                      padding: 20,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f0e8dd";
                      e.currentTarget.style.borderColor = "#d9ccbf";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#f9f7f5";
                      e.currentTarget.style.borderColor = "#e8dfd4";
                    }}
                  >
                    <span style={{ fontSize: 12, color: "#9b8b7a", textTransform: "uppercase" }}>
                      {post.category}
                    </span>
                    <h4 style={{ margin: "8px 0", color: "#1d1917", fontSize: 18, fontWeight: 600 }}>
                      {post.title}
                    </h4>
                    <p style={{ margin: "8px 0 0", fontSize: 13, color: "#7d6d5d" }}>
                      {post.date} • By {post.author}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </main>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <main style={{ maxWidth: 1180, margin: "32px auto 80px", padding: "0 20px" }}>
        <div style={{ background: "linear-gradient(135deg, #f6efe8 0%, #fff 100%)", border: "1px solid #e8dfd4", borderRadius: 24, padding: 28 }}>
          <p style={{ margin: 0, textTransform: "uppercase", letterSpacing: 1.4, color: "#7d6d5d", fontWeight: 700, fontSize: 12 }}>
            Blog
          </p>
          <h1 style={{ margin: "12px 0 8px", fontSize: "clamp(2.2rem, 4vw, 3.25rem)" }}>Stories & insights</h1>
          <p style={{ margin: 0, maxWidth: 700, color: "#4b4541", lineHeight: 1.7 }}>
            Discover the stories behind our brands, styling tips, and insights from our community. Explore our collection of articles and guides.
          </p>
        </div>

        <div style={{ marginTop: 40 }}>
          {posts.length === 0 ? (
            <p style={{ textAlign: "center", color: "#9b8b7a", padding: "40px 20px" }}>
              No blog posts available yet.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                gap: 24,
              }}
            >
              {posts.map(post => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  style={{
                    background: "#f9f7f5",
                    border: "1px solid #e8dfd4",
                    borderRadius: 12,
                    padding: 24,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f0e8dd";
                    e.currentTarget.style.borderColor = "#d9ccbf";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#f9f7f5";
                    e.currentTarget.style.borderColor = "#e8dfd4";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      background: "#e8dfd4",
                      color: "#7d6d5d",
                      padding: "4px 10px",
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      marginBottom: 12,
                      letterSpacing: 0.6,
                    }}
                  >
                    {post.category}
                  </span>
                  <h3 style={{ margin: "12px 0 8px", color: "#1d1917", fontSize: 20, fontWeight: 600, lineHeight: 1.4 }}>
                    {post.title}
                  </h3>
                  <p style={{ margin: "8px 0 0", fontSize: 13, color: "#7d6d5d" }}>
                    {post.date} • By {post.author}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </StoreLayout>
  );
}
