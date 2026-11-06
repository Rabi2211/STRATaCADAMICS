import StoreLayout from "../../components/StoreLayout";
import "./MensItems.css";

interface Product {
  id: string;
  price: string;
  name: string;
  sizes: string;
  hoodie?: boolean;
}

const CATEGORIES = ["JEANS", "T-SHIRTS", "JEANS", "SWEATERS", "PANTS"];

const PRODUCTS: Product[] = [
  { id: "mug-tee", price: "R700", name: "NEW PUNK COFFEE MUG STAIN TEE", sizes: "XS - XXXL" },
  { id: "speedy-tee", price: "R700", name: "SPEEDY GONZALES NEW PUNK TEE", sizes: "XS - XXXL" },
  { id: "hoodie", price: "R750", name: "NEW PUNK 1 OF A KIND (ONLY 1 AVAIL)", sizes: "1 SMALL", hoodie: true },
];

const TRENDING = [PRODUCTS[0], PRODUCTS[2]];

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
  return (
    <StoreLayout>
      <section className="mhero">
        <h1 className="display">MEN’S ITEMS</h1>
        <nav className="chips">
          {CATEGORIES.map((c, i) => (
            <a key={i} href="#">{c}</a>
          ))}
        </nav>
        <button className="feedback" type="button">feedback</button>
      </section>

      <section className="pgrid">
        {PRODUCTS.map((p) => <ProductCard key={p.id} product={p} />)}
      </section>

      <div className="more">
        You have seen 3 out of 100 products
        <a className="btn" href="#">SHOW THE NEXT 6 RESULTS</a>
      </div>

      <h2 className="trend">TRENDING NOW</h2>
      <section className="pgrid">
        {TRENDING.map((p) => <ProductCard key={p.id} product={p} />)}
      </section>

      <p className="quote">
        “A couturier must be an architect for design, a sculptor for shape, a painter for color, a musician for harmony, and a philosopher for temperance.” – Cristóbal Balenciaga
      </p>
    </StoreLayout>
  );
}
