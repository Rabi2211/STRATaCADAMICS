import { useRef } from "react";
import StoreLayout from "../../components/StoreLayout";
import { STORE } from "../../data/store";
import { PROMOS } from "../../data/storefront";
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

function Catalog() {
  return (
    <section className="catalog">
      <h2 className="catalog__title">Browse Catalog</h2>
      {STORE.brands.map((brand) => {
        const products = STORE.products.filter((product) => product.brandId === brand.id).slice(0, 4);

        return (
          <div key={brand.id} className="catalog__group">
            <h3 className="catalog__heading">{brand.name.toUpperCase()} <span aria-hidden="true">▾</span></h3>
            <div className="carousel">
              {products.map((product) => (
                <a key={product.id} href="#" className="card" aria-label={`${product.name} by ${brand.name}`}>
                  <span style={{ display: "block", marginTop: "auto", fontSize: 12, color: "#241f1d", fontWeight: 700 }}>
                    {product.name}
                  </span>
                </a>
              ))}
            </div>
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
      <Catalog />
      <Stories />
    </StoreLayout>
  );
}
