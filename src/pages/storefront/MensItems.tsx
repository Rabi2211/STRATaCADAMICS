import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import StoreLayout from "../../components/StoreLayout";
import "./MensItems.css";

interface Product {
  id: string;
  price: string;
  name: string;
  sizes: string;
  hoodie?: boolean;
}

const CATEGORY_DATA: Record<string, { title: string; categories: string[]; products: Product[]; trending: Product[] }> = {
  men: {
    title: "MEN’S ITEMS",
    categories: ["JEANS", "T-SHIRTS", "JEANS", "SWEATERS", "PANTS"],
    products: [
      { id: "mug-tee", price: "R700", name: "NEW PUNK COFFEE MUG STAIN TEE", sizes: "XS - XXXL" },
      { id: "speedy-tee", price: "R700", name: "SPEEDY GONZALES NEW PUNK TEE", sizes: "XS - XXXL" },
      { id: "hoodie", price: "R750", name: "NEW PUNK 1 OF A KIND (ONLY 1 AVAIL)", sizes: "1 SMALL", hoodie: true },
    ],
    trending: [
      { id: "mug-tee", price: "R700", name: "NEW PUNK COFFEE MUG STAIN TEE", sizes: "XS - XXXL" },
      { id: "hoodie", price: "R750", name: "NEW PUNK 1 OF A KIND (ONLY 1 AVAIL)", sizes: "1 SMALL", hoodie: true },
    ],
  },
  women: {
    title: "WOMEN’S ITEMS",
    categories: ["DRESSES", "TOPS", "OUTERWEAR", "TRENDS", "SALE"],
    products: [
      { id: "w-1", price: "R650", name: "WOMEN NEW PUNK CUTOUT TOP", sizes: "XS - XXL" },
      { id: "w-2", price: "R780", name: "SILK DRAPE CHIC DRESS", sizes: "XS - XXL" },
      { id: "w-3", price: "R820", name: "LAYERED WOOL COAT", sizes: "S - XL", hoodie: true },
    ],
    trending: [
      { id: "w-1", price: "R650", name: "WOMEN NEW PUNK CUTOUT TOP", sizes: "XS - XXL" },
      { id: "w-3", price: "R820", name: "LAYERED WOOL COAT", sizes: "S - XL", hoodie: true },
    ],
  },
  kids: {
    title: "KIDS’ ITEMS",
    categories: ["PLAY", "OUTERWEAR", "ESSENTIALS", "GRAPHICS", "SALE"],
    products: [
      { id: "k-1", price: "R420", name: "KIDS GRAPHIC TEE", sizes: "4 - 12Y" },
      { id: "k-2", price: "R560", name: "ADVENTURE ZIP HOODY", sizes: "4 - 12Y" },
      { id: "k-3", price: "R480", name: "PLAY READY CHINO", sizes: "4 - 12Y", hoodie: true },
    ],
    trending: [
      { id: "k-2", price: "R560", name: "ADVENTURE ZIP HOODY", sizes: "4 - 12Y" },
      { id: "k-3", price: "R480", name: "PLAY READY CHINO", sizes: "4 - 12Y", hoodie: true },
    ],
  },
};

function ProductCard({ product }: { product: Product }) {
  return (
    <a className="prod" href="#">
      <div className={`img${product.hoodie ? " hood" : ""}`}>
        <span>♡</span>
      </div>
      <b>{product.price}</b>
      <p>{product.name}</p>
      <small>SIZES: {product.sizes}</small>
    </a>
  );
}

export default function MensItems() {
  const location = useLocation();
  const section = useMemo(() => {
    if (location.pathname === "/women") return "women";
    if (location.pathname === "/kids") return "kids";
    return "men";
  }, [location.pathname]);

  const current = CATEGORY_DATA[section];

  return (
    <StoreLayout>
      <section className="mhero">
        <h1 className="display">{current.title}</h1>
        <nav className="chips">
          {current.categories.map((c, i) => (
            <a key={`${section}-${i}`} href="#">{c}</a>
          ))}
        </nav>
        <button className="feedback" type="button">feedback</button>
      </section>

      <section className="pgrid">
        {current.products.map((p) => <ProductCard key={`${section}-${p.id}`} product={p} />)}
      </section>

      <div className="more">
        You have seen 3 out of 100 products
        <a className="btn" href="#">SHOW THE NEXT 6 RESULTS</a>
      </div>

      <h2 className="trend">TRENDING NOW</h2>
      <section className="pgrid">
        {current.trending.map((p) => <ProductCard key={`${section}-${p.id}-trend`} product={p} />)}
      </section>

      <p className="quote">
        “A couturier must be an architect for design, a sculptor for shape, a painter for color, a musician for harmony, and a philosopher for temperance.” – Cristóbal Balenciaga
      </p>
    </StoreLayout>
  );
}
