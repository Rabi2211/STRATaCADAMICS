import { lazy, Suspense, type ReactNode } from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { canAccessDashboardRoute, getCurrentSession, getPostLoginPath } from "./lib/auth";

function ProtectedDashboardRoute({ path, children }: { path: string; children: ReactNode }) {
  const location = useLocation();
  const session = getCurrentSession();

  if (!session?.token || !session.user) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  if (!canAccessDashboardRoute(path, session.user.role)) {
    return <Navigate to={getPostLoginPath(session.user.role)} replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

const ROUTES = [
  { path: "/", label: "Storefront · Home", Component: lazy(() => import("./pages/storefront/Home")) },
  { path: "/men", label: "Storefront · Men’s Items", Component: lazy(() => import("./pages/storefront/MensItems")) },
  { path: "/women", label: "Storefront · Women’s Items", Component: lazy(() => import("./pages/storefront/MensItems")) },
  { path: "/kids", label: "Storefront · Kids’ Items", Component: lazy(() => import("./pages/storefront/MensItems")) },
  { path: "/cart", label: "Storefront · Cart", Component: lazy(() => import("./pages/storefront/Cart")) },
  { path: "/wishlist", label: "Storefront · Wishlist", Component: lazy(() => import("./pages/storefront/Wishlist")) },
  { path: "/product/:productId", label: "Storefront · Product detail", Component: lazy(() => import("./pages/storefront/ProductDetail")) },
  { path: "/checkout", label: "Storefront · Checkout", Component: lazy(() => import("./pages/storefront/Checkout")) },
  { path: "/about", label: "Storefront · About", Component: lazy(() => import("./pages/storefront/TrustPage")) },
  { path: "/help", label: "Storefront · Help centre", Component: lazy(() => import("./pages/storefront/HelpCenter")) },
  { path: "/faq", label: "Storefront · FAQ", Component: lazy(() => import("./pages/storefront/HelpCenter")) },
  { path: "/contact", label: "Storefront · Contact", Component: lazy(() => import("./pages/storefront/TrustPage")) },
  { path: "/shipping", label: "Storefront · Shipping", Component: lazy(() => import("./pages/storefront/TrustPage")) },
  { path: "/returns", label: "Storefront · Returns", Component: lazy(() => import("./pages/storefront/TrustPage")) },
  { path: "/privacy", label: "Storefront · Privacy", Component: lazy(() => import("./pages/storefront/TrustPage")) },
  { path: "/terms", label: "Storefront · Terms", Component: lazy(() => import("./pages/storefront/TrustPage")) },
  { path: "/payment/callback", label: "Storefront · Payment callback", Component: lazy(() => import("./pages/storefront/PaymentCallback")) },
  { path: "/account/orders", label: "Storefront · My orders", Component: lazy(() => import("./pages/storefront/MyOrders")) },
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
  { path: "/reset-password", label: "Account · Reset password", Component: lazy(() => import("./pages/ResetPassword")) },
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
        {ROUTES.map(({ path, Component }) => {
          const isDashboardRoute = path.startsWith("/studio") || path.startsWith("/market");

          return (
            <Route
              key={path}
              path={path}
              element={
                isDashboardRoute ? (
                  <ProtectedDashboardRoute path={path}>
                    <Component />
                  </ProtectedDashboardRoute>
                ) : (
                  <Component />
                )
              }
            />
          );
        })}
        <Route path="/admin" element={<Navigate to="/market/overview" replace />} />
        <Route path="/brand-owner" element={<Navigate to="/studio/overview" replace />} />
        <Route path="/market" element={<Navigate to="/market/overview" replace />} />
        <Route path="/studio" element={<Navigate to="/studio/overview" replace />} />
        <Route path="/pages" element={<PageIndex />} />
      </Routes>
    </Suspense>
  );
}
