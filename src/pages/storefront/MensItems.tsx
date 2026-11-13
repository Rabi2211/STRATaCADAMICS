import { useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import StoreLayout from "../../components/StoreLayout";
import { STORE, filterAndSortProducts, type StoreProduct } from "../../data/store";
import { addToCart } from "../../lib/cart";
import { readWishlist, toggleWishlist } from "../../lib/wishlist";
import "./MensItems.css";

const SECTION_DATA: Record<string, { title: string; categories: string[] }> = {
  men: { title: "MEN’S ITEMS", categories: ["All", "Pants", "Shirts", "Sweaters", "Outerwear", "Tops"] },
  women: { title: "WOMEN’S ITEMS", categories: ["All", "Sweaters", "Pants", "Outerwear", "Shirts", "Tops"] },
  kids: { title: "KIDS’ ITEMS", categories: ["All", "Tops", "Outerwear", "Shirts", "Pants"] },
};

type VisualSignature = {
  avg: [number, number, number];
  brightness: number;
  contrast: number;
  dominant: [number, number, number][];
};

type CollectionMode = "featured" | "bestsellers";

type CloudImageAnalysis = {
  primaryCategory?: string;
  productType?: string;
  style?: string;
  colorPalette?: string[];
  summary?: string;
  confidence?: number;
};

const CLOUD_IMAGE_MODEL_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

function resolveAiCategory(value?: string): string | null {
  if (!value) return null;

  const normalized = value.toLowerCase();
  for (const category of ["Pants", "Shirts", "Sweaters", "Outerwear", "Tops"]) {
    if (normalized.includes(category.toLowerCase())) return category;
  }

  return null;
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result.split(",")[1] : null;
      if (!result) {
        reject(new Error("Image file could not be converted to base64."));
        return;
      }
      resolve(result);
    };
    reader.onerror = () => reject(new Error("The image could not be read."));
    reader.readAsDataURL(file);
  });
}

async function analyzeImageWithCloudAi(file: File): Promise<CloudImageAnalysis | null> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const base64Data = await fileToBase64(file);
  const response = await fetch(`${CLOUD_IMAGE_MODEL_URL}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{
        parts: [
          {
            text: "You are a luxury fashion product matching assistant. Analyze the product image and return strict JSON only with keys: primaryCategory, productType, style, colorPalette, summary, confidence. primaryCategory must be one of Pants, Shirts, Sweaters, Outerwear, Tops. productType should describe the garment type. style should be a short descriptor like relaxed, tailored, minimalist, sporty, premium. colorPalette should be an array of 3 representative colors in hex format. summary is a brief sentence about the outfit. confidence is a number from 0 to 100."
          },
          {
            inlineData: {
              mimeType: file.type || "image/jpeg",
              data: base64Data,
            },
          },
        ],
      }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    return null;
  }

  const payload = await response.json();
  const rawText = payload?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part.text ?? "")
    .join("")
    .trim();

  if (!rawText) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawText) as CloudImageAnalysis;
    return {
      ...parsed,
      primaryCategory: resolveAiCategory(parsed.primaryCategory) ?? parsed.primaryCategory,
      productType: parsed.productType ?? undefined,
      style: parsed.style ?? undefined,
      colorPalette: parsed.colorPalette ?? [],
      summary: parsed.summary ?? undefined,
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0,
    };
  } catch {
    return null;
  }
}

function getCloudMatchScore(aiAnalysis: CloudImageAnalysis, product: StoreProduct) {
  const categoryMatch = resolveAiCategory(aiAnalysis.primaryCategory) === product.category ? 0.65 : 0;
  const productTypeScore = resolveAiCategory(aiAnalysis.productType) === product.category ? 0.2 : 0;
  const styleBoost = aiAnalysis.style && `${product.name} ${product.description}`.toLowerCase().includes(aiAnalysis.style.toLowerCase()) ? 0.15 : 0;
  const confidenceScore = Number.isFinite(aiAnalysis.confidence) ? (aiAnalysis.confidence ?? 0) / 100 : 0.4;
  return categoryMatch + productTypeScore + styleBoost + confidenceScore * 0.3;
}

function hexToRgb(hex: string): [number, number, number] {
  const safeHex = hex.replace("#", "");
  const normalized = safeHex.length === 3
    ? safeHex.split("").map((char) => char + char).join("")
    : safeHex;

  const parsed = Number.parseInt(normalized, 16);
  return [
    (parsed >> 16) & 255,
    (parsed >> 8) & 255,
    parsed & 255,
  ];
}

function colorDistance(a: [number, number, number], b: [number, number, number]) {
  return Math.sqrt(
    (a[0] - b[0]) ** 2 +
    (a[1] - b[1]) ** 2 +
    (a[2] - b[2]) ** 2,
  );
}

function getCategoryPalette(category: string): [number, number, number][] {
  const paletteMap: Record<string, [number, number, number][]> = {
    Sweaters: [[112, 76, 60], [176, 151, 130], [228, 216, 196]],
    Pants: [[83, 96, 88], [128, 143, 130], [193, 185, 176]],
    Shirts: [[152, 110, 76], [186, 152, 126], [233, 216, 197]],
    Outerwear: [[67, 71, 79], [109, 96, 86], [182, 170, 160]],
    Tops: [[124, 92, 70], [172, 151, 123], [210, 194, 181]],
  };

  return paletteMap[category] ?? [[169, 117, 74], [228, 214, 198], [79, 64, 58]];
}

function getProductVisualSignature(product: StoreProduct): VisualSignature {
  const brand = STORE.brands.find((entry) => entry.id === product.brandId);
  const accent = hexToRgb(brand?.accent ?? "#a9754a");
  const categoryPalette = getCategoryPalette(product.category);
  const dominant = [accent, ...categoryPalette].slice(0, 3) as [number, number, number][];
  const avg: [number, number, number] = [
    Math.round(dominant.reduce((sum, color) => sum + color[0], 0) / dominant.length),
    Math.round(dominant.reduce((sum, color) => sum + color[1], 0) / dominant.length),
    Math.round(dominant.reduce((sum, color) => sum + color[2], 0) / dominant.length),
  ];
  const brightness = (avg[0] + avg[1] + avg[2]) / 3;
  const contrast = Math.max(...avg) - Math.min(...avg);

  return { avg, brightness, contrast, dominant };
}

function readImageSignature(file: File): Promise<VisualSignature> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      if (!result || typeof result !== "string") {
        reject(new Error("Image could not be read."));
        return;
      }

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDimension = 40;
        const scale = Math.min(maxDimension / image.width, maxDimension / image.height, 1);
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));

        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Canvas is unavailable."));
          return;
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const pixelData = context.getImageData(0, 0, canvas.width, canvas.height).data;

        let red = 0;
        let green = 0;
        let blue = 0;
        let sampledPixels = 0;
        const dominantColors: [number, number, number][] = [];

        for (let index = 0; index < pixelData.length; index += 16) {
          const alpha = pixelData[index + 3];
          if (alpha < 128) continue;

          const r = pixelData[index];
          const g = pixelData[index + 1];
          const b = pixelData[index + 2];

          red += r;
          green += g;
          blue += b;
          sampledPixels += 1;
        }

        if (sampledPixels > 0) {
          const avg: [number, number, number] = [
            Math.round(red / sampledPixels),
            Math.round(green / sampledPixels),
            Math.round(blue / sampledPixels),
          ];
          dominantColors.push(avg);
        }

        resolve({
          avg: dominantColors[0] ?? [220, 220, 220],
          brightness: ((dominantColors[0]?.[0] ?? 220) + (dominantColors[0]?.[1] ?? 220) + (dominantColors[0]?.[2] ?? 220)) / 3,
          contrast: 50,
          dominant: dominantColors.length ? dominantColors.slice(0, 3) as [number, number, number][] : [[220, 220, 220]],
        });
      };

      image.src = result;
    };

    reader.readAsDataURL(file);
  });
}

function getVisualMatchScore(uploadedImage: VisualSignature, product: StoreProduct) {
  const productSignature = getProductVisualSignature(product);
  const colorDistanceScore = colorDistance(uploadedImage.avg, productSignature.avg) / 441.67;
  const brightnessDifference = Math.abs(uploadedImage.brightness - productSignature.brightness) / 255;
  const categoryBonus = product.category === "Sweaters" || product.category === "Outerwear" ? 0.12 : 0.06;

  return Math.max(0, 1 - (colorDistanceScore * 0.7 + brightnessDifference * 0.2) + categoryBonus);
}

function ProductCard({ product }: { product: StoreProduct }) {
  const [isAdded, setIsAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(() => readWishlist().includes(product.id));
  const brand = STORE.brands.find((entry) => entry.id === product.brandId);

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

  const handleToggleFavorite = () => {
    setIsFavorite(toggleWishlist(product.id).includes(product.id));
  };

  return (
    <article className="catalog-card" aria-label={`${product.name} from ${product.category}`}>
      <div className={`catalog-card__image ${product.imageClass}`}>
        <button
          type="button"
          className="catalog-card__favorite"
          aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isFavorite}
          onClick={handleToggleFavorite}
        >
          {isFavorite ? "♥" : "♡"}
        </button>
        <span className={`catalog-card__badge ${product.available >= 30 ? "catalog-card__badge--featured" : "catalog-card__badge--seller"}`}>
          {product.available >= 30 ? "Featured" : "Best seller"}
        </span>
      </div>
      <div className="catalog-card__body">
        <div className="catalog-card__meta">
          <span>{product.category}</span>
          <span>{brand?.abbreviation ?? "STRATA"}</span>
        </div>
        <h3>{product.name}</h3>
        <div className="catalog-card__price-row">
          <strong>R{product.price.toFixed(2)}</strong>
          <small>{product.available} in stock</small>
        </div>
        <div className="catalog-card__actions">
          <Link to={`/product/${product.id}`} className="btn btn--small">View details</Link>
          <button type="button" className="btn btn--small" onClick={handleAddToCart}>{isAdded ? "Added" : "Add to cart"}</button>
        </div>
      </div>
    </article>
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
  const [collectionMode, setCollectionMode] = useState<CollectionMode>("featured");
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc" | "name-asc">("featured");
  const [visualSignature, setVisualSignature] = useState<VisualSignature | null>(null);
  const [cloudAiAnalysis, setCloudAiAnalysis] = useState<CloudImageAnalysis | null>(null);
  const [imageMatchText, setImageMatchText] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const aiAnalysis = await analyzeImageWithCloudAi(file);

      if (aiAnalysis) {
        setCloudAiAnalysis(aiAnalysis);
        setVisualSignature(null);
        setImageMatchText(
          aiAnalysis.summary
            ? `Cloud AI match: ${aiAnalysis.summary}`
            : `Cloud AI match: ${file.name.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " ").trim() || "uploaded image"}`,
        );
      } else {
        const nextSignature = await readImageSignature(file);
        setVisualSignature(nextSignature);
        setCloudAiAnalysis(null);
        setImageMatchText(`Visual match: ${file.name.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " ").trim() || "uploaded image"}`);
      }

      setSelectedCategory("All");
      setSort("featured");
    } catch (error) {
      console.error("Image visual search failed", error);
      setCloudAiAnalysis(null);
      setVisualSignature(null);
      setImageMatchText("Image search unavailable right now. Please try again.");
    } finally {
      event.target.value = "";
    }
  };

  const sectionProducts = useMemo(() => {
    const products = STORE.products.filter((product) => {
      if (section === "men") return ["Pants", "Shirts", "Sweaters", "Outerwear", "Tops"].includes(product.category);
      if (section === "women") return ["Sweaters", "Pants", "Outerwear", "Shirts", "Tops"].includes(product.category);
      return ["Tops", "Outerwear", "Shirts", "Pants"].includes(product.category);
    });

    const effectiveSort = collectionMode === "bestsellers" ? "price-desc" : sort;

    const filtered = filterAndSortProducts(products, {
      query,
      category: selectedCategory === "All" ? undefined : selectedCategory,
      sort: effectiveSort,
    });

    if (cloudAiAnalysis) {
      return [...filtered].sort((left, right) => {
        const leftScore = getCloudMatchScore(cloudAiAnalysis, left);
        const rightScore = getCloudMatchScore(cloudAiAnalysis, right);
        return rightScore - leftScore;
      });
    }

    if (!visualSignature) {
      return filtered;
    }

    return [...filtered].sort((left, right) => {
      const leftScore = getVisualMatchScore(visualSignature, left);
      const rightScore = getVisualMatchScore(visualSignature, right);
      return rightScore - leftScore;
    });
  }, [query, section, selectedCategory, sort, visualSignature, cloudAiAnalysis, collectionMode]);

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

        {imageMatchText && (
          <div className="catalog-match-banner">{imageMatchText}</div>
        )}
      </section>

      <div className="catalog-toolbar">
        <div className="catalog-toolbar__segmentation" aria-label="Browse collection type">
          <button
            type="button"
            className={collectionMode === "featured" ? "is-active" : ""}
            onClick={() => setCollectionMode("featured")}
          >
            Featured
          </button>
          <button
            type="button"
            className={collectionMode === "bestsellers" ? "is-active" : ""}
            onClick={() => setCollectionMode("bestsellers")}
          >
            Best sellers
          </button>
        </div>

        <div className="catalog-toolbar__controls">
          <label className="catalog-search" aria-label="Search products">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products"
            />
          </label>

          <button
            type="button"
            className="visual-search"
            onClick={() => fileInputRef.current?.click()}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
              <path d="M10.5 4.5a5.5 5.5 0 0 0-5.5 5.5v.5a5.5 5.5 0 0 0 8.68 4.3l3.8 3.8a1 1 0 0 0 1.41-1.41l-3.8-3.8A5.5 5.5 0 0 0 10.5 4.5Zm0 2a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 1 0-7Zm6.5 12.5a1 1 0 0 1 0-2h1.5a1 1 0 0 1 0 2H17Zm-7.5-5.5a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5Z" fill="currentColor"/>
            </svg>
            Search with image
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageSearch}
            aria-label="Search by image"
          />

          <select
            aria-label="Sort products"
            value={sort}
            onChange={(event) => setSort(event.target.value as typeof sort)}
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name A-Z</option>
          </select>
        </div>
      </div>

      <section className="pgrid">
        {sectionProducts.length === 0 ? (
          <div className="catalog-empty-state">
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
