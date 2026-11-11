import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import StoreLayout from "../../components/StoreLayout";
import { STORE, filterAndSortProducts, type StoreProduct } from "../../data/store";
import { addToCart } from "../../lib/cart";
import "./MensItems.css";

const SECTION_DATA: Record<string, { title: string; categories: string[] }> = {
  men: { title: "MEN’S ITEMS", categories: ["All", "Pants", "Shirts", "Sweaters", "Outerwear", "Tops"] },
  women: { title: "WOMEN’S ITEMS", categories: ["All", "Sweaters", "Pants", "Outerwear", "Shirts", "Tops"] },
  kids: { title: "KIDS’ ITEMS", categories: ["All", "Tops", "Outerwear", "Shirts", "Pants"] },
};

function ProductCard({ product }: { product: StoreProduct }) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      brandId: product.brandId,
      imageClass: product.imageClass,
    }, 1);
    setIsAdded(true);
  };

  return (
    <div className="prod" aria-label={`${product.name} from ${product.category}`}>
      <div className="img" style={{ background: "linear-gradient(135deg, #efe4d5 0%, #d9d0c7 100%)" }}>
        <span>♡</span>
      </div>
      <b>R{product.price.toFixed(2)}</b>
      <p>{product.name}</p>
      <small>SKU: {product.sku}</small>
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        <Link to={`/product/${product.id}`} className="btn btn--small" style={{ display: "inline-block", textDecoration: "none" }}>View details</Link>
        <button type="button" className="btn btn--small" onClick={handleAddToCart}>{isAdded ? "Added to cart" : "Add to cart"}</button>
      </div>
    </div>
  );
}

export default function MensItems() {
  const location = useLocation();
  const section = useMemo(() => {
    if (location.pathname === "/women") return "women";
    if (location.pathname === "/kids") return "kids";
    return "men";
  }, [location.pathname]);

  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc" | "name-asc">("featured");

  const sectionProducts = useMemo(() => {
    const products = STORE.products.filter((product) => {
      if (section === "men") return ["Pants", "Shirts", "Sweaters", "Outerwear", "Tops"].includes(product.category);
      if (section === "women") return ["Sweaters", "Pants", "Outerwear", "Shirts", "Tops"].includes(product.category);
      return ["Tops", "Outerwear", "Shirts", "Pants"].includes(product.category);
    });

    return filterAndSortProducts(products, {
      query,
      category: selectedCategory === "All" ? undefined : selectedCategory,
      sort,
    });
  }, [query, section, selectedCategory, sort]);

  const current = SECTION_DATA[section];

  return (
    <StoreLayout>
      <section className="mhero">
        <h1 className="display">{current.title}</h1>
        <nav className="chips" aria-label="Product categories">
          {current.categories.map((category) => (
            <button
              key={`${section}-${category}`}
              type="button"
              aria-pressed={selectedCategory === category}
              className={selectedCategory === category ? "is-active" : ""}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </nav>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginTop: 12 }}>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products"
            aria-label="Search products"
            style={{ minWidth: 220, padding: "10px 12px", borderRadius: 10, border: "1px solid #d8d0c6" }}
          />
          <select
            aria-label="Sort products"
            value={sort}
            onChange={(event) => setSort(event.target.value as typeof sort)}
            style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #d8d0c6" }}
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name A-Z</option>
          </select>
        </div>
      </section>

      <section className="pgrid">
        {sectionProducts.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", border: "1px solid #eadfce", background: "#fff", borderRadius: 12, padding: 20 }}>
            No products match this filter yet. Try another category or search term.
          </div>
        ) : (
          sectionProducts.map((product) => <ProductCard key={`${section}-${product.id}`} product={product} />)
        )}
      </section>

      <div className="more">
        {sectionProducts.length} product{sectionProducts.length === 1 ? "" : "s"} ready to shop
      </div>

      <p className="quote">
        “A couturier must be an architect for design, a sculptor for shape, a painter for color, a musician for harmony, and a philosopher for temperance.” – Cristóbal Balenciaga
      </p>
    </StoreLayout>
  );
}
