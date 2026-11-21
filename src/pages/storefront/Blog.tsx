import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StoreLayout from "../../components/StoreLayout";
import {
  getBlogPosts,
  subscribeToBlogPosts,
  type BlogPost,
} from "../../lib/blog-store";
import "./Blog.css";

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
        const availablePosts = await getBlogPosts();

        if (active) {
          setPosts(availablePosts);
        }
      } catch (error) {
        console.error("Failed to load blog posts", error);
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadPosts();

    const unsubscribe = subscribeToBlogPosts((nextPosts) => {
      setPosts(nextPosts);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [postId]);

  useEffect(() => {
    if (postId) {
      setSelectedPost(posts.find((entry) => entry.id === postId) ?? null);
    } else {
      setSelectedPost(null);
    }
  }, [posts, postId]);

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
        <main style={{ margin: "32px auto 80px", padding: "0 20px" }}>
          <button
            onClick={() => setSelectedPost(null)}
            className="blog-back-button"
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

          <article className="blog-article">
            <div className="blog-article-header">
              <span className="blog-article-category">
                {selectedPost.category}
              </span>
              <h1>{selectedPost.title}</h1>
              <p className="blog-article-meta">
                By {selectedPost.author} • {selectedPost.date}
              </p>
            </div>

            <div
              className="blog-article-content"
              dangerouslySetInnerHTML={{ __html: selectedPost.content ?? "<p>Blog post content coming soon.</p>" }}
            />
          </article>

          <div className="blog-related-section">
            <h3>More from our blog</h3>
            <div className="blog-related-grid">
              {posts
                .filter(p => p.id !== selectedPost.id)
                .slice(0, 3)
                .map(post => (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="blog-related-card"
                  >
                    <span className="blog-related-card-category">
                      {post.category}
                    </span>
                    <h4>{post.title}</h4>
                    <p className="blog-related-card-meta">
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
      <main className="blog-container">
        <div className="blog-header">
          <p className="blog-header-label">Blog</p>
          <h1>Stories & insights</h1>
          <p>
            Discover the stories behind our brands, styling tips, and insights from our community. Explore our collection of articles and guides.
          </p>
        </div>

        <div>
          {posts.length === 0 ? (
            <p style={{ textAlign: "center", color: "#9b8b7a", padding: "40px 20px" }}>
              No blog posts available yet.
            </p>
          ) : (
            <div className="blog-grid">
              {posts.map(post => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="blog-card"
                >
                  <span className="blog-card-category">{post.category}</span>
                  <h3>{post.title}</h3>
                  <p className="blog-card-meta">{post.date} • By {post.author}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </StoreLayout>
  );
}
