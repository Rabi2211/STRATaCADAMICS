import { useRef } from "react";
import StoreLayout from "../../components/StoreLayout";
import { PROMOS, SECTIONS } from "../../data/storefront";
import "./Home.css";

function Hero() {
  return (
    <section className="hero">
      <h1 className="display">NEW PUNK</h1>
      <div className="hero__shirt" role="img" aria-label="New Punk graphic tee">
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
      {SECTIONS.map((s) => (
        <div key={s} id={s.toLowerCase()} className="catalog__group">
          <h3 className="catalog__heading">{s.toUpperCase()} <span aria-hidden="true">▾</span></h3>
          <Carousel count={8} label={`${s} product`} />
        </div>
      ))}
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
