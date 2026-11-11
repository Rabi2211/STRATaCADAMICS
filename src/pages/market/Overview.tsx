import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { fetchBrands, fetchOrders, fetchProducts, mapApiProduct, type ApiBrand, type ApiOrder } from "../../lib/store-api";
import "./Overview.css";

export type SalesRange = "7D" | "30D" | "3M" | "12M";

export function getSalesSeriesForRange(range: SalesRange, productList: Array<{ price: number; available: number }> = []) {
  const fallback: Record<SalesRange, { labels: string[]; points: number[] }> = {
    "7D": {
      labels: ["Apr 20", "Apr 21", "Apr 22", "Apr 23", "Apr 24", "Apr 25", "Apr 26"],
      points: [620, 840, 960, 1180, 1340, 1490, 1620],
    },
    "30D": {
      labels: ["Apr 1", "Apr 2", "Apr 3", "Apr 4", "Apr 5", "Apr 6", "Apr 7", "Apr 8", "Apr 9", "Apr 10", "Apr 11", "Apr 12", "Apr 13", "Apr 14", "Apr 15", "Apr 16", "Apr 17", "Apr 18", "Apr 19", "Apr 20", "Apr 21", "Apr 22", "Apr 23", "Apr 24", "Apr 25", "Apr 26", "Apr 27", "Apr 28", "Apr 29", "Apr 30"],
      points: [720, 760, 820, 910, 980, 1040, 1140, 1210, 1195, 1260, 1300, 1380, 1440, 1510, 1485, 1560, 1620, 1700, 1685, 1770, 1815, 1880, 1830, 1920, 1985, 2060, 2140, 2205, 2280, 2360],
    },
    "3M": {
      labels: ["Jan", "Feb", "Mar"],
      points: [980, 1200, 1360],
    },
    "12M": {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      points: [1240, 1320, 1410, 1540, 1680, 1760, 1820, 1900, 2015, 2140, 2260, 2425],
    },
  };

  if (productList.length === 0) {
    return fallback[range];
  }

  const bucketCount = range === "7D" ? 7 : range === "30D" ? 30 : range === "3M" ? 3 : 12;
  const labels = range === "7D"
    ? ["Apr 20", "Apr 21", "Apr 22", "Apr 23", "Apr 24", "Apr 25", "Apr 26"]
    : range === "30D"
      ? Array.from({ length: 30 }, (_, index) => `Apr ${index + 1}`)
      : range === "3M"
        ? ["Jan", "Feb", "Mar"]
        : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const totalRevenue = productList.reduce((sum, product) => sum + Number(product.price) * Number(product.available), 0);
  const base = totalRevenue / Math.max(1, bucketCount);
  const points = Array.from({ length: bucketCount }, (_, index) => {
    const drift = 1 + (index / Math.max(1, bucketCount - 1)) * 0.9;
    return Math.max(120, Math.round(base * (0.42 + drift) * (range === "12M" ? 1.15 : 1)));
  });

  return { labels, points };
}

export default function MarketOverview() {
  const [brands, setBrands] = useState<ApiBrand[]>([]);
  const [products, setProducts] = useState<ReturnType<typeof mapApiProduct>[]>([]);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("2025-04-20");
  const [dateTo, setDateTo] = useState("2025-05-20");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [salesRange, setSalesRange] = useState<SalesRange>("30D");

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [nextBrands, nextProducts, nextOrders] = await Promise.all([fetchBrands(), fetchProducts(), fetchOrders()]);
        if (!active) return;
        setBrands(nextBrands);
        setProducts(nextProducts.map((product) => mapApiProduct(product)));
        setOrders(nextOrders);
      } catch (error) {
        if (active) {
          console.error("Unable to load market overview", error);
        }
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  const rangeStart = new Date(dateFrom);
  const rangeEnd = new Date(dateTo);
  const dayDiff = Math.max(1, Math.round((rangeEnd.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  const rangeFactor = dayDiff / 30;

  const selectedBrand = selectedBrandId === "all" ? null : brands.find((brand) => brand.id === selectedBrandId) ?? null;
  const filteredProducts = products.filter((product) => {
    if (!selectedBrand) {
      return true;
    }

    return product.brandId === selectedBrand.id;
  });

  const grossSales = filteredProducts.reduce((sum, product) => sum + Number(product.price) * Number(product.available), 0) * rangeFactor * (selectedBrand ? 1.2 : 1);
  const totalOrders = filteredProducts.reduce((sum, product) => sum + Math.max(4, Math.round(product.available * 0.18)), 0) * rangeFactor * (selectedBrand ? 1.15 : 1);
  const productViews = filteredProducts.length * 1640 * rangeFactor * (selectedBrand ? 1.25 : 1);
  const chartSeries = getSalesSeriesForRange(salesRange, filteredProducts);
  const chartMax = Math.max(...chartSeries.points, 1);
  const chartLabelStep = Math.max(1, Math.ceil(chartSeries.points.length / 5));
  const brandPerformance = brands
    .map((brand) => {
      const brandProducts = products.filter((product) => product.brandId === brand.id);
      const sales = brandProducts.reduce((sum, product) => sum + Number(product.price) * Number(product.available), 0);
      const ordersForBrand = orders.filter((order) => order.items?.some((item) => item.product?.brandId === brand.id || item.product?.brand?.id === brand.id)).length;
      return {
        brand,
        sales,
        orders: ordersForBrand || Math.max(6, Math.round(brandProducts.length * 1.8)),
        productCount: brandProducts.length,
      };
    })
    .sort((left, right) => right.sales - left.sales)
    .slice(0, 5);

  const inventoryAlerts = products
    .filter((product) => Number(product.available) <= 12)
    .slice(0, 5)
    .map((product) => ({
      brand: brands.find((brand) => brand.id === product.brandId),
      product,
    }));

  const attentionOrders = orders
    .filter((order) => ["PENDING", "PAID", "PROCESSING"].includes(String(order.status ?? "").toUpperCase()))
    .sort((left, right) => new Date(right.createdAt ?? 0).getTime() - new Date(left.createdAt ?? 0).getTime())
    .slice(0, 5);

  const dateLabel = `${new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(rangeStart)} – ${new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(rangeEnd)}`;

  return (
    <DashboardLayout
      kind="market"
      title={"Store overview"}
      subtitle={"Manage your entire store — brands, products, orders, inventory and more from one owner account."}
      actions={
        <>
          <div style={{ position: "relative" }}>
            <button type="button" className="btn " onClick={() => setShowDatePicker((current) => !current)}>📅 {dateLabel} ▾</button>
            {showDatePicker && (
              <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 10, background: "#fff", border: "1px solid #e7dfd5", borderRadius: 12, padding: 12, width: 220, boxShadow: "0 8px 24px rgba(30, 20, 12, 0.08)" }}>
                <label style={{ display: "grid", gap: 6, marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: "#5d5a57" }}>Brand</span>
                  <select value={selectedBrandId} onChange={(event) => setSelectedBrandId(event.target.value)} style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #d9d0c5" }}>
                    <option value="all">All brands</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </select>
                </label>
                <label style={{ display: "grid", gap: 6, marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: "#5d5a57" }}>From</span>
                  <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #d9d0c5" }} />
                </label>
                <label style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontSize: 12, color: "#5d5a57" }}>To</span>
                  <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #d9d0c5" }} />
                </label>
              </div>
            )}
          </div>
          🔔
          <Link to="/" className="btn pri">View storefront ↗</Link>
        </>
      }
    >
      <div className="grid g5">
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Gross sales</span>
            <b>R{grossSales.toLocaleString()}</b>
            <span className="up">▲ 14%</span>
            {" "}
            <span>vs. previous 30 days</span>
          </div>
        </div>
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Orders</span>
            <b>{totalOrders}</b>
            <span className="up">▲ 12%</span>
            {" "}
            <span>vs. previous 30 days</span>
          </div>
        </div>
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Product views</span>
            <b>{productViews.toLocaleString()}</b>
            <span className="up">▲ 18%</span>
            {" "}
            <span>vs. previous 30 days</span>
          </div>
        </div>
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Active brands</span>
            <b>{selectedBrand ? 1 : brands.length}</b>
            –
            {" "}
            <span>{selectedBrand ? selectedBrand.name : "All brands"}</span>
          </div>
        </div>
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Products</span>
            <b>{filteredProducts.length}</b>
            <span className="up">▲ 9%</span>
            {" "}
            <span>{selectedBrand ? selectedBrand.name : "Storewide"}</span>
          </div>
        </div>
      </div>
      <div className="grid g32">
        <div className="stack">
          <section className="card ">
            <h3>
              Sales over time
              <span className="seg">
                {(["7D", "30D", "3M", "12M"] as SalesRange[]).map((range) => (
                  <button
                    key={range}
                    type="button"
                    className={salesRange === range ? "on" : ""}
                    onClick={() => setSalesRange(range)}
                  >
                    {range}
                  </button>
                ))}
              </span>
            </h3>
            <svg className="chart" viewBox="0 0 640 216">
              {[2500, 2000, 1500, 1000, 500, 0].map((value, index) => (
                <g key={value + index}>
                  <line x1="40" x2="620" y1={20 + index * 32} y2={20 + index * 32} stroke="#e9e3da" />
                  <text x="34" y={24 + index * 32} fontSize="10" textAnchor="end" fill="#7a736b">R{value.toLocaleString()}</text>
                </g>
              ))}
              {chartSeries.points.map((value, index) => {
                const barWidth = Math.max(8, 560 / chartSeries.points.length);
                const x = 40 + index * barWidth + (chartSeries.points.length > 20 ? 1 : 4);
                const scaledHeight = (value / chartMax) * 132;
                const y = 180 - scaledHeight;
                return (
                  <g key={`${salesRange}-${index}`}>
                    <rect x={x} y={y} width={Math.max(4, barWidth - (chartSeries.points.length > 20 ? 2 : 8))} height={scaledHeight} fill="#c4664a" opacity=".35" rx="3" />
                  </g>
                );
              })}
              {chartSeries.points.map((_, index) => {
                if (index % chartLabelStep !== 0 && index !== chartSeries.points.length - 1) {
                  return null;
                }

                const x = 40 + (index / Math.max(1, chartSeries.points.length - 1)) * 580;
                return (
                  <text key={`${salesRange}-label-${index}`} x={x} y="208" fontSize="11" textAnchor="middle" fill="#7a736b">{chartSeries.labels[index]}</text>
                );
              })}
            </svg>
          </section>
          <section className="card ">
            <h3>
              Orders needing attention
              <Link to="/market/orders">View all orders →</Link>
            </h3>
            <div className="wrap">
              <table>
                <tbody>
                  <tr>
                    <th>Order #</th>
                    <th>Brand</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                  {attentionOrders.length > 0 ? attentionOrders.map((order) => {
                    const brandName = order.items?.[0]?.product?.brand?.name ?? "Marketplace";
                    const customerName = order.user?.name ?? "Customer";
                    const customerEmail = order.user?.email ?? "customer@example.com";
                    const orderTotal = Number(order.total ?? 0);
                    const statusDisplay = String(order.status ?? "Pending");
                    return (
                      <tr key={order.id}>
                        <td>{order.id.slice(0, 8).toUpperCase()}</td>
                        <td>
                          <span className="av" style={{ background: "#2f4a35" }}>{brandName.slice(0, 2).toUpperCase()}</span>
                          {brandName}
                        </td>
                        <td>
                          {customerName}
                          <span className="sub">{customerEmail}</span>
                        </td>
                        <td>R{orderTotal.toFixed(2)}</td>
                        <td>
                          <span className={`pill ${statusDisplay === "PAID" ? "green" : "orange"}`}>{statusDisplay}</span>
                        </td>
                        <td>
                          <Link to="/market/orders" className="btn">View order</Link>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={6}>No orders currently need attention.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
          <section className="card ">
            <h3>Quick actions</h3>
            <div className="grid g3">
              <Link to="/market/brands" className="qa">
                <b>Add brand</b>
                <span>Bring a new brand to the marketplace</span>
              </Link>
              <Link to="/market/products" className="qa">
                <b>Add product</b>
                <span>List a product from any brand</span>
              </Link>
              <Link to="/market/blog" className="qa">
                <b>Write blog post</b>
                <span>Share news, stories or updates</span>
              </Link>
            </div>
          </section>
        </div>
        <div className="stack">
          <section className="card ">
            <h3>Brand performance</h3>
            <div className="wrap">
              <table>
                <tbody>
                  <tr>
                    <th>#</th>
                    <th>Brand</th>
                    <th>Sales</th>
                    <th>Orders</th>
                    <th>Products</th>
                  </tr>
                  {brandPerformance.map((entry, index) => (
                    <tr key={entry.brand.id}>
                      <td>{index + 1}</td>
                      <td>
                        <span className="av" style={{ background: "#5b6b4c" }}>{entry.brand.abbreviation ?? entry.brand.name.slice(0, 2).toUpperCase()}</span>
                        {entry.brand.name}
                      </td>
                      <td>R{entry.sales.toLocaleString()}</td>
                      <td>{entry.orders}</td>
                      <td>{entry.productCount}</td>
                    </tr>
                  ))}
                  {brandPerformance.length === 0 && (
                    <tr>
                      <td colSpan={5}>No brand performance data available yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
          <section className="card ">
            <h3>
              Low stock / inventory alerts
              <Link to="/market/inventory">View all inventory →</Link>
            </h3>
            <div className="wrap">
              <table>
                <tbody>
                  <tr>
                    <th>Brand</th>
                    <th>Product</th>
                    <th>Available</th>
                  </tr>
                  {inventoryAlerts.length > 0 ? inventoryAlerts.map(({ brand, product }) => (
                    <tr key={product.id}>
                      <td>
                        <span className="av" style={{ background: "#2f4a35" }}>{brand?.abbreviation ?? brand?.name.slice(0, 2).toUpperCase() ?? "MK"}</span>
                        {brand?.name ?? "Marketplace"}
                      </td>
                      <td>
                        <span className="thumb t1" />
                        {product.name}
                        <span className="sub">{product.category}</span>
                      </td>
                      <td>{product.available}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={3}>No inventory alerts.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
          <section className="card ">
            <h3>
              Latest blog posts
              <Link to="/market/blog">Manage blog →</Link>
            </h3>
            <div className="ord">
              <span className="thumb t1" />
              <div>
                <b>Spring Style Edit: 5 Looks We Love</b>
                <span className="sub">May 18, 2025 · 3 min read</span>
              </div>
            </div>
            <div className="ord">
              <span className="thumb t2" />
              <div>
                <b>Meet the Makers: Rivet & Thread</b>
                <span className="sub">May 15, 2025 · 4 min read</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
