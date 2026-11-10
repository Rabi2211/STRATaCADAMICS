import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StoreLayout from "../../components/StoreLayout";
import { HELP_CENTER_ARTICLES, HELP_CENTER_CATEGORIES, searchHelpCenterArticles } from "./help-center";

export default function HelpCenter() {
  const [activeId, setActiveId] = useState<(typeof HELP_CENTER_CATEGORIES)[number]["id"]>("orders");
  const [searchTerm, setSearchTerm] = useState("");

  const activeCategory = useMemo(
    () => HELP_CENTER_CATEGORIES.find((category) => category.id === activeId) ?? HELP_CENTER_CATEGORIES[0],
    [activeId],
  );

  const filteredArticles = useMemo(() => {
    if (searchTerm.trim()) {
      return searchHelpCenterArticles(searchTerm);
    }

    return HELP_CENTER_ARTICLES.filter((article) => article.categoryId === activeId);
  }, [activeId, searchTerm]);

  return (
    <StoreLayout>
      <main style={{ maxWidth: 1180, margin: "32px auto 80px", padding: "0 20px" }}>
        <div style={{ background: "linear-gradient(135deg, #f6efe8 0%, #fff 100%)", border: "1px solid #e8dfd4", borderRadius: 24, padding: 28 }}>
          <p style={{ margin: 0, textTransform: "uppercase", letterSpacing: 1.4, color: "#7d6d5d", fontWeight: 700, fontSize: 12 }}>
            Help centre
          </p>
          <h1 style={{ margin: "12px 0 8px", fontSize: "clamp(2.2rem, 4vw, 3.25rem)" }}>We’re here to help</h1>
          <p style={{ margin: 0, maxWidth: 700, color: "#4b4541", lineHeight: 1.7 }}>
            Find quick answers for orders, shipping, payments, and returns. Need personal support? Our team is available to help with product questions and post-purchase updates.
          </p>

          <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 12, maxWidth: 560, background: "#fff", border: "1px solid #eadfd5", borderRadius: 14, padding: "12px 14px" }}>
            <span aria-hidden="true" style={{ fontSize: 18 }}>⌕</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search order, tracking, delivery, returns..."
              aria-label="Search help centre"
              style={{ border: 0, outline: "none", width: "100%", background: "transparent", fontSize: 15, color: "#1d1917" }}
            />
          </div>

          <div style={{ marginTop: 26, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {HELP_CENTER_CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  setActiveId(category.id);
                  setSearchTerm("");
                }}
                style={{
                  border: activeCategory.id === category.id ? "1px solid #221d1a" : "1px solid #e5ddd5",
                  background: activeCategory.id === category.id ? "#1f1a17" : "#fff",
                  color: activeCategory.id === category.id ? "#fff" : "#1f1a17",
                  borderRadius: 999,
                  padding: "10px 16px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 22 }}>
          <section style={{ background: "#fff", border: "1px solid #e8dfd4", borderRadius: 22, padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
              <div>
                <p style={{ margin: 0, textTransform: "uppercase", letterSpacing: 1.3, color: "#7d6d5d", fontWeight: 700, fontSize: 12 }}>
                  {searchTerm.trim() ? "Search results" : activeCategory.label}
                </p>
                <h2 style={{ margin: "10px 0 0", fontSize: 30 }}>{searchTerm.trim() ? `Results for “${searchTerm}”` : activeCategory.description}</h2>
              </div>
              <span style={{ color: "#6d625d", fontSize: 13, fontWeight: 600 }}>{filteredArticles.length} guides</span>
            </div>

            {filteredArticles.length === 0 ? (
              <div style={{ background: "#f8f3ef", border: "1px dashed #dfcdbc", borderRadius: 16, padding: 18, color: "#4b4541" }}>
                No guides matched that search yet. Try searching for “tracking”, “returns”, “shipping”, or “payment”.
              </div>
            ) : (
              <div style={{ display: "grid", gap: 14 }}>
                {filteredArticles.map((article) => (
                  <article key={article.id} style={{ background: "#f8f3ef", border: "1px solid #e9dfd7", borderRadius: 16, padding: 18 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                      <span style={{ display: "inline-block", background: "#efe3d6", color: "#432f26", borderRadius: 999, padding: "5px 10px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.12 }}>
                        {HELP_CENTER_CATEGORIES.find((category) => category.id === article.categoryId)?.label ?? article.categoryId}
                      </span>
                    </div>
                    <h3 style={{ margin: "0 0 8px", fontSize: 20 }}>{article.title}</h3>
                    <p style={{ margin: 0, color: "#3d3834", lineHeight: 1.7 }}>{article.summary}</p>
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside style={{ background: "#1f1a17", color: "#f7f3ef", borderRadius: 22, padding: 24 }}>
            <p style={{ margin: 0, textTransform: "uppercase", letterSpacing: 1.3, opacity: 0.8, fontWeight: 700, fontSize: 12 }}>
              Need more help?
            </p>
            <h3 style={{ margin: "14px 0 10px", fontSize: 28 }}>Talk to the support team</h3>
            <p style={{ margin: 0, color: "rgba(247,243,239,0.85)", lineHeight: 1.7 }}>
              Contact our team for order issues, product guidance, or help updating your delivery details before dispatch.
            </p>

            <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
              <div>
                <strong style={{ display: "block", marginBottom: 4 }}>Email</strong>
                <span style={{ opacity: 0.8 }}>hello@stratacadamics.com</span>
              </div>
              <div>
                <strong style={{ display: "block", marginBottom: 4 }}>Phone</strong>
                <span style={{ opacity: 0.8 }}>+27 (0) 11 555 0198</span>
              </div>
              <div>
                <strong style={{ display: "block", marginBottom: 4 }}>Hours</strong>
                <span style={{ opacity: 0.8 }}>Mon–Fri, 08:00–17:00 SAST</span>
              </div>
            </div>

            <div style={{ marginTop: 24, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link to="/contact" className="btn" style={{ display: "inline-block" }}>Contact us</Link>
              <Link to="/men" className="btn btn--secondary" style={{ display: "inline-block" }}>Shop now</Link>
            </div>
          </aside>
        </div>
      </main>
    </StoreLayout>
  );
}
