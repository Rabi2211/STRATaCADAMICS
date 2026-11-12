import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import StoreLayout from "../../components/StoreLayout";
import { STORE } from "../../data/store";
import { FEATURED_COLLECTIONS, PROMOS } from "../../data/storefront";
import "./Home.css";

function Hero() {
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
      <button className="feedback" aria-label="Give feedback">feedback</button>
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
