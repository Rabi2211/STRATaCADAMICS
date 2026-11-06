import { lazy, Suspense } from "react";
import { Link, Route, Routes } from "react-router-dom";

const ROUTES = [
  { path: "/", label: "Storefront · Home", Component: lazy(() => import("./pages/storefront/Home")) },
  { path: "/men", label: "Storefront · Men’s Items", Component: lazy(() => import("./pages/storefront/MensItems")) },
  { path: "/studio/overview", label: "Studio · Overview", Component: lazy(() => import("./pages/studio/Overview")) },
  { path: "/studio/products", label: "Studio · Products", Component: lazy(() => import("./pages/studio/Products")) },
  { path: "/studio/orders", label: "Studio · Orders", Component: lazy(() => import("./pages/studio/Orders")) },
  { path: "/studio/inventory", label: "Studio · Inventory", Component: lazy(() => import("./pages/studio/Inventory")) },
  { path: "/studio/purchases", label: "Studio · Purchases", Component: lazy(() => import("./pages/studio/Purchases")) },
  { path: "/studio/analytics", label: "Studio · Analytics", Component: lazy(() => import("./pages/studio/Analytics")) },
  { path: "/studio/settings", label: "Studio · Store settings", Component: lazy(() => import("./pages/studio/Settings")) },
  { path: "/market/overview", label: "Market · Overview", Component: lazy(() => import("./pages/market/Overview")) },
  { path: "/market/brands", label: "Market · Brands", Component: lazy(() => import("./pages/market/Brands")) },
  { path: "/market/products", label: "Market · Products", Component: lazy(() => import("./pages/market/Products")) },
  { path: "/market/orders", label: "Market · Orders", Component: lazy(() => import("./pages/market/Orders")) },
  { path: "/market/inventory", label: "Market · Inventory", Component: lazy(() => import("./pages/market/Inventory")) },
  { path: "/market/blog", label: "Market · Blog", Component: lazy(() => import("./pages/market/Blog")) },
  { path: "/market/analytics", label: "Market · Analytics", Component: lazy(() => import("./pages/market/Analytics")) },
  { path: "/market/settings", label: "Market · Store settings", Component: lazy(() => import("./pages/market/Settings")) },
];

function PageIndex() {
  return (
    <main style={{ maxWidth: 520, margin: "0 auto", padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>STRATA pages</h1>
      <ul>
        {ROUTES.map((r) => (
          <li key={r.path} style={{ margin: "8px 0" }}>
            <Link to={r.path}>{r.label}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default function App() {
  return (
    <Suspense fallback={<p style={{ padding: 24 }}>Loading…</p>}>
      <Routes>
        {ROUTES.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
        <Route path="/pages" element={<PageIndex />} />
      </Routes>
    </Suspense>
  );
}
