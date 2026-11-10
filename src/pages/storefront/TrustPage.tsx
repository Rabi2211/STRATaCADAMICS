import { Link, useLocation } from "react-router-dom";
import StoreLayout from "../../components/StoreLayout";

type PageCopy = {
  title: string;
  intro: string;
  points: string[];
  highlights: Array<{ label: string; value: string }>;
  faq: Array<{ question: string; answer: string }>;
};

const PAGE_COPY: Record<string, PageCopy> = {
  "/about": {
    title: "About STRATaCADAMICS",
    intro: "We design elevated essentials for modern wardrobes and meaningful everyday living.",
    points: [
      "Independent brands curated with craftsmanship and longevity in mind.",
      "Built around premium materials, responsible sourcing, and everyday wearability.",
      "A global fashion marketplace shaped for creators, tastemakers, and repeat customers.",
    ],
    highlights: [
      { label: "Curated brands", value: "18+" },
      { label: "Average dispatch", value: "24h" },
      { label: "Customer care", value: "Live support" },
    ],
    faq: [
      { question: "Do you sell original products?", answer: "Yes. We only curate established labels and premium capsule collections that are sourced through verified retail channels." },
      { question: "Can I shop across multiple categories?", answer: "Absolutely. The store is designed to support wardrobe layering, gifting, and repeat purchases across pieces and brands." },
    ],
  },
  "/contact": {
    title: "Contact support",
    intro: "Need help with an order, return, or product question? Our team is here to help.",
    points: [
      "Email: hello@stratacadamics.com",
      "Phone: +27 (0) 11 555 0198",
      "Business hours: Monday to Friday, 08:00-17:00 SAST",
    ],
    highlights: [
      { label: "Email reply", value: "within 24h" },
      { label: "Phone support", value: "Mon-Fri" },
      { label: "Order help", value: "Always available" },
    ],
    faq: [
      { question: "What if my order is delayed?", answer: "Reach out with your order number and we’ll check shipment progress, stock status, or delivery updates immediately." },
      { question: "Can I ask product questions before checkout?", answer: "Yes. We welcome style and sizing guidance before purchase so customers can order with confidence." },
    ],
  },
  "/shipping": {
    title: "Shipping & delivery",
    intro: "We aim to dispatch in-stock orders within 24 hours and deliver across South Africa and selected international destinations.",
    points: [
      "Standard shipping: 3-5 business days",
      "Express shipping: 1-2 business days for qualifying orders",
      "Free shipping is available on orders above R2,000",
    ],
    highlights: [
      { label: "Dispatch", value: "Within 24h" },
      { label: "Tracking", value: "Included" },
      { label: "Free threshold", value: "R2,000" },
    ],
    faq: [
      { question: "Where do you ship to?", answer: "We service South Africa by default and support selected international destinations depending on product and courier availability." },
      { question: "Will I receive tracking?", answer: "Yes. Once your order is dispatched, you’ll receive a tracking reference and status updates through your order record." },
    ],
  },
  "/returns": {
    title: "Returns & exchanges",
    intro: "We want every order to feel right. If something isn’t quite right, we’ll make the return easy.",
    points: [
      "Returns are accepted within 14 days of delivery for unworn items in original condition.",
      "Refunds are processed within 5-7 business days after the item is received.",
      "Exchanges are prioritized while stock is available.",
    ],
    highlights: [
      { label: "Return window", value: "14 days" },
      { label: "Refund timing", value: "5-7 days" },
      { label: "Exchange support", value: "Priority" },
    ],
    faq: [
      { question: "Can I exchange an item instead of refunding it?", answer: "Yes. Exchanges are prioritized whenever the alternative size or colour is available in stock." },
      { question: "Do items need to be unworn?", answer: "Yes. To qualify for a refund or exchange, returned items should be unworn, unused, and in their original condition." },
    ],
  },
  "/privacy": {
    title: "Privacy policy",
    intro: "Your data is handled with care and used only to support your shopping experience and order updates.",
    points: [
      "We collect contact, delivery, and order data needed to fulfill your purchase.",
      "Payment details are processed securely through trusted third-party gateways.",
      "We do not sell or rent your personal data to unrelated parties.",
    ],
    highlights: [
      { label: "Data use", value: "Order-only" },
      { label: "Security", value: "Gateway encrypted" },
      { label: "Data sharing", value: "Never sold" },
    ],
    faq: [
      { question: "What information do you keep?", answer: "We keep the necessary contact, billing, shipping, and order details required to process and deliver your purchase." },
      { question: "Are payments secure?", answer: "Yes. We use trusted third-party payment providers and do not store full card details directly in our store." },
    ],
  },
  "/terms": {
    title: "Terms & conditions",
    intro: "By shopping with STRATaCADAMICS you agree to our marketplace policies and order terms.",
    points: [
      "All purchases are subject to product availability and payment confirmation.",
      "Pricing can be updated without notice, but committed prices are confirmed at checkout.",
      "Customers remain responsible for accurate delivery details at the time of ordering.",
    ],
    highlights: [
      { label: "Confirmation", value: "At checkout" },
      { label: "Pricing", value: "Confirmed order" },
      { label: "Accuracy", value: "Customer responsibility" },
    ],
    faq: [
      { question: "Can prices change before I pay?", answer: "Pricing may change in the marketplace, but your confirmed checkout price is the price held for your order once accepted." },
      { question: "What if my delivery details are wrong?", answer: "Please update your details as soon as possible. Once an order has entered the dispatch process, changes may be limited." },
    ],
  },
};

export default function TrustPage() {
  const location = useLocation();
  const page = PAGE_COPY[location.pathname] ?? PAGE_COPY["/about"];

  return (
    <StoreLayout>
      <main style={{ maxWidth: 980, margin: "32px auto", padding: "0 20px 80px" }}>
        <div
          style={{
            border: "1px solid #e7dfd4",
            background: "linear-gradient(180deg, #fff 0%, #f9f4f0 100%)",
            borderRadius: 22,
            padding: 28,
            boxShadow: "0 18px 50px rgba(52, 40, 31, 0.05)",
          }}
        >
          <p style={{ textTransform: "uppercase", letterSpacing: 1.6, color: "#7d6d5d", marginBottom: 12, fontWeight: 700 }}>
            Store policy
          </p>
          <h1 style={{ marginTop: 0, marginBottom: 12, fontSize: "clamp(2rem, 4vw, 3rem)" }}>{page.title}</h1>
          <p style={{ marginTop: 0, marginBottom: 24, color: "#4f4a45", fontSize: 17, lineHeight: 1.6 }}>{page.intro}</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14, marginBottom: 28 }}>
            {page.highlights.map((item) => (
              <div
                key={item.label}
                style={{
                  background: "#fff",
                  border: "1px solid #e9e0d7",
                  borderRadius: 16,
                  padding: "16px 18px",
                }}
              >
                <div style={{ color: "#7d6d5d", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: "#1f1a17" }}>{item.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 22, alignItems: "start" }}>
            <div>
              <h2 style={{ margin: "0 0 12px", fontSize: 24 }}>What to expect</h2>
              <ul style={{ display: "grid", gap: 12, paddingLeft: 20, color: "#2f2f2f", margin: 0, lineHeight: 1.6 }}>
                {page.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>

            <aside
              style={{
                background: "#1f1a17",
                color: "#f7f2ee",
                borderRadius: 18,
                padding: 20,
              }}
            >
              <div style={{ fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", opacity: 0.75, marginBottom: 14 }}>
                Why customers trust us
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                <div>
                  <strong style={{ display: "block", marginBottom: 4 }}>Secure checkout</strong>
                  <span style={{ opacity: 0.78 }}>Protected payments via trusted merchant partners.</span>
                </div>
                <div>
                  <strong style={{ display: "block", marginBottom: 4 }}>Transparent support</strong>
                  <span style={{ opacity: 0.78 }}>Fast help from a team that understands orders and fulfilment.</span>
                </div>
                <div>
                  <strong style={{ display: "block", marginBottom: 4 }}>Real catalog care</strong>
                  <span style={{ opacity: 0.78 }}>Curated brands and premium essentials with staged fulfillment.</span>
                </div>
              </div>
            </aside>
          </div>

          <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
            {page.faq.map((item) => (
              <div key={item.question} style={{ background: "#fff", border: "1px solid #e9e0d7", borderRadius: 16, padding: 18 }}>
                <h3 style={{ margin: "0 0 10px", fontSize: 18 }}>{item.question}</h3>
                <p style={{ margin: 0, color: "#4f4a45", lineHeight: 1.6 }}>{item.answer}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: 18, alignItems: "stretch" }}>
            <div style={{ background: "linear-gradient(135deg, #efe4d8 0%, #f8f3ef 100%)", borderRadius: 22, padding: 22, border: "1px solid #e8ddd3" }}>
              <p style={{ margin: 0, textTransform: "uppercase", letterSpacing: 1.2, color: "#7d6d5d", fontWeight: 700, fontSize: 12 }}>
                Our story
              </p>
              <h2 style={{ margin: "10px 0 12px", fontSize: 30 }}>Designed for a better everyday wardrobe</h2>
              <p style={{ margin: 0, color: "#3b3733", lineHeight: 1.7 }}>
                STRATaCADAMICS brings together elevated essentials, thoughtful layering pieces, and premium textures to build a wardrobe that feels considered, functional, and quietly luxurious. We curate brands and styles that move easily from work to weekend without losing identity.
              </p>
            </div>

            <div style={{ background: "#1d1a17", color: "#f8f1ea", borderRadius: 22, padding: 22 }}>
              <p style={{ margin: 0, textTransform: "uppercase", letterSpacing: 1.2, opacity: 0.75, fontSize: 12 }}>What matters</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "18px 0 0", display: "grid", gap: 14 }}>
                {[
                  "Premium fabric and finish",
                  "Function-first styling",
                  "Long-wear essentials",
                  "Refined, easy layering",
                ].map((item) => (
                  <li key={item} style={{ paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.14)", opacity: 0.9 }}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ marginTop: 32 }}>
            <div style={{ marginBottom: 16 }}>
              <p style={{ margin: 0, textTransform: "uppercase", letterSpacing: 1.2, color: "#7d6d5d", fontWeight: 700, fontSize: 12 }}>
                Customer stories
              </p>
              <h2 style={{ margin: "8px 0 0", fontSize: 30 }}>Loved by customers who buy well and wear often</h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
              {[
                {
                  quote: "The quality feels premium and the fit is exactly what I wanted. Delivery was efficient and the whole experience felt polished.",
                  name: "Maya R.",
                  meta: "Johannesburg",
                },
                {
                  quote: "I ordered a layered look for work and weekend and it arrived quickly with clear updates. It felt like a premium retail experience.",
                  name: "Liam T.",
                  meta: "Cape Town",
                },
                {
                  quote: "The styling and packaging made it feel like a proper luxury brand. The return support was also straightforward and reassuring.",
                  name: "Anathi K.",
                  meta: "Durban",
                },
              ].map((review) => (
                <div key={review.name} style={{ background: "#fff", border: "1px solid #e9e0d7", borderRadius: 18, padding: 18 }}>
                  <div style={{ fontSize: 30, lineHeight: 1, color: "#b38c6d", marginBottom: 12 }}>“</div>
                  <p style={{ margin: "0 0 18px", color: "#2f2e2d", lineHeight: 1.7 }}>{review.quote}</p>
                  <div style={{ borderTop: "1px solid #efe6df", paddingTop: 12 }}>
                    <strong style={{ display: "block", fontSize: 16 }}>{review.name}</strong>
                    <span style={{ color: "#6c625d", fontSize: 13 }}>{review.meta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link to="/men" className="btn" style={{ display: "inline-block" }}>Shop now</Link>
            <Link to="/contact" className="btn btn--secondary" style={{ display: "inline-block" }}>Contact us</Link>
          </div>
        </div>
      </main>
    </StoreLayout>
  );
}
