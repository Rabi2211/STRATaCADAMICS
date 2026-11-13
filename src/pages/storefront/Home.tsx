import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import StoreLayout from "../../components/StoreLayout";
import { STORE } from "../../data/store";
import { FEATURED_COLLECTIONS, PROMOS } from "../../data/storefront";
import "./Home.css";

const initialFeedback = {
  name: "",
  email: "",
  type: "general",
  message: "",
};

export function FeedbackModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [form, setForm] = useState(initialFeedback);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
    setForm(initialFeedback);
  };

  if (!isOpen) return null;

  return (
    <div className="sf feedback-modal__overlay" onClick={onClose}>
      <div
        className="feedback-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
        onClick={(event) => event.stopPropagation()}
        style={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        <button type="button" className="feedback-modal__close" onClick={onClose} aria-label="Close feedback form">
          ×
        </button>

        {isSubmitted ? (
          <div className="feedback-modal__success">
            <h3>Thanks for your feedback</h3>
            <p>We’ve received your message and will review it soon.</p>
            <button type="button" className="feedback-modal__primary" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <h3 id="feedback-title">Share your feedback</h3>
            <p className="feedback-modal__subtitle">Let us know how we can improve your shopping experience.</p>

            <form className="feedback-modal__form" onSubmit={handleSubmit}>
              <label className="feedback-modal__field">
                <span>Name</span>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your name" />
              </label>

              <label className="feedback-modal__field">
                <span>Email</span>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
              </label>

              <label className="feedback-modal__field">
                <span>Type</span>
                <select name="type" value={form.type} onChange={handleChange}>
                  <option value="general">General feedback</option>
                  <option value="product">Product feedback</option>
                  <option value="service">Customer service</option>
                  <option value="bug">Bug report</option>
                </select>
              </label>

              <label className="feedback-modal__field">
                <span>Message</span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell us what you’d like to improve..."
                  required
                />
              </label>

              <div className="feedback-modal__actions">
                <button type="button" className="feedback-modal__secondary" onClick={onClose}>Cancel</button>
                <button type="submit" className="feedback-modal__primary">Send feedback</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export function Hero() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <section
      className="hero"
      style={{
        backgroundImage: "url('/images/wooden-floor-with-sunlight-shining-through-it-photo-1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="display">NEW PUNK</h1>
      <div
        className="hero__shirt"
        role="img"
        aria-label="New Punk graphic tee"
        style={{ backgroundImage: "url('/images/1793015777859-1.png')", backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" }}
      >
        <span>WANTS<br />VS<br />NEEDS</span>
        <strong>NEW PUNK</strong>
      </div>
      <a className="btn hero__btn" href="/men">Shop For Men</a>
      <button type="button" className="feedback" aria-label="Give feedback" onClick={() => setIsFeedbackOpen(true)}>
        feedback
      </button>
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </section>
  );
}

function PromoRow() {
  return (
    <section className="promos">
      {PROMOS.map((p) => (
        <article
          key={p.id}
          className={`promo promo--${p.id}`}
          style={{ backgroundImage: `url(${p.image})` }}
        >
          {p.id === "tee" && (
            <div
              className="promo__shirt"
              aria-label="Featured shirt"
              style={{ backgroundImage: "url('/images/1793019003778-1.png')" }}
            />
          )}
          {p.id === "hoodie" && (
            <div
              className="promo__shirt"
              aria-label="Featured shirt"
              style={{ backgroundImage: "url('/images/1793097839835-1.png')" }}
            />
          )}
          <h2 className="display">NEW PUNK</h2>
          <a className="btn btn--small" href="/men">{p.cta}</a>
        </article>
      ))}
    </section>
  );
}

function Carousel({ count, tall = false, label }: { count: number; tall?: boolean; label: string }) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="carousel">
      <button className="carousel__arrow" aria-label={`Previous ${label}`} onClick={() => scroll(-1)}>◀</button>
      <div className={`carousel__track${tall ? " carousel__track--tall" : ""}`} ref={track}>
        {Array.from({ length: count }, (_, i) => (
          <a key={i} href="#" className="card" aria-label={`${label} ${i + 1}`} />
        ))}
      </div>
      <button className="carousel__arrow" aria-label={`Next ${label}`} onClick={() => scroll(1)}>▶</button>
    </div>
  );
}

function FeaturedCollections() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % FEATURED_COLLECTIONS.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, []);

  const visibleCollections = Array.from({ length: 3 }, (_, offset) => {
    const index = (activeIndex + offset - 1 + FEATURED_COLLECTIONS.length) % FEATURED_COLLECTIONS.length;
    return FEATURED_COLLECTIONS[index];
  });

  return (
    <section className="featured">
      <div className="featured__header">
        <div>
          <p className="eyebrow">The seasonal edits for STRATa</p>
          <h2>STRATa edits for the season</h2>
        </div>
        <Link to="/men" className="btn btn--small">Shop all</Link>
      </div>

      <div className="featured__slider">
        {visibleCollections.map((collection, offset) => {
          const items = collection.productIds
            .map((productId) => STORE.products.find((product) => product.id === productId))
            .filter(Boolean) as typeof STORE.products;

          const isCenter = offset === 1;

          return (
            <article
              key={`${collection.id}-${offset}`}
              className={`feature-card feature-card--${isCenter ? "center" : "side"}`}
            >
              <div className="feature-card__meta">
                <span>{collection.subtitle}</span>
                <span>{String((FEATURED_COLLECTIONS.indexOf(collection) + 1) || 1).padStart(2, "0")}</span>
              </div>

              <div className="feature-card__copy">
                <p className="eyebrow">Seasonal pick</p>
                <h3>{collection.title}</h3>
                <p>{collection.description}</p>
                <Link to="/men" className="btn btn--small">{collection.cta}</Link>
              </div>

              <div className="feature-card__items">
                {items.map((product) => (
                  <Link key={product.id} to={`/product/${product.id}`} className="feature-card__item">
                    <div className="feature-card__visual">
                      <div className="feature-card__swatch" aria-hidden="true" />
                    </div>
                    <div className="feature-card__text">
                      <strong>{product.name}</strong>
                      <span>R{product.price.toFixed(2)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Catalog() {
  const [openBrands, setOpenBrands] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(STORE.brands.map((brand) => [brand.id, true])),
  );

  const toggleBrand = (brandId: string) => {
    setOpenBrands((current) => ({
      ...current,
      [brandId]: !current[brandId],
    }));
  };

  return (
    <section className="catalog">
      <h2 className="catalog__title">Browse Catalog</h2>
      {STORE.brands.map((brand) => {
        const products = STORE.products.filter((product) => product.brandId === brand.id).slice(0, 4);
        const isOpen = openBrands[brand.id] ?? true;

        return (
          <div key={brand.id} className="catalog__group">
            <h3
              className="catalog__heading"
              onClick={() => toggleBrand(brand.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  toggleBrand(brand.id);
                }
              }}
              tabIndex={0}
              role="button"
              aria-expanded={isOpen}
            >
              <span>{brand.name.toUpperCase()}</span>
              <span className={`catalog__chevron${isOpen ? " is-open" : ""}`} aria-hidden="true">▾</span>
            </h3>
            {isOpen && (
              <div className="carousel">
                {products.map((product) => (
                  <Link key={product.id} to={`/product/${product.id}`} className="card" aria-label={`${product.name} by ${brand.name}`}>
                    <span style={{ display: "block", marginTop: "auto", fontSize: 12, color: "#241f1d", fontWeight: 700 }}>
                      {product.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}

function Stories() {
  return (
    <section className="stories">
      <h2>Stories:</h2>
      <p>Read more about our brands!</p>
      <Carousel count={6} tall label="story" />
    </section>
  );
}

export default function Home() {
  return (
    <StoreLayout>
      <Hero />
      <PromoRow />
      <FeaturedCollections />
      <Catalog />
      <Stories />
    </StoreLayout>
  );
}
