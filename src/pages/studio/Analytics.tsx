import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { fetchBrands, fetchOverviewAnalytics, fetchProducts, mapApiProduct, type ApiBrand, type ApiOverviewAnalytics } from "../../lib/store-api";
import { formatPercentageChange } from "../../lib/live-metrics";
import "./Analytics.css";

export default function StudioAnalytics() {
  const [brands, setBrands] = useState<ApiBrand[]>([]);
  const [products, setProducts] = useState<ReturnType<typeof mapApiProduct>[]>([]);
  const [dateRange, setDateRange] = useState<"7D" | "30D">("7D");
  const [liveAnalytics, setLiveAnalytics] = useState<ApiOverviewAnalytics | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [nextBrands, nextProducts, nextAnalytics] = await Promise.all([
          fetchBrands(),
          fetchProducts(),
          fetchOverviewAnalytics({ range: dateRange }),
        ]);
        if (!active) return;
        setBrands(nextBrands);
        setProducts(nextProducts.map((product) => mapApiProduct(product)));
        setLiveAnalytics(nextAnalytics);
      } catch (error) {
        if (active) console.error("Unable to load studio analytics", error);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [dateRange]);

  const soldRevenue = liveAnalytics?.grossSales ?? 0;
  const totalOrders = liveAnalytics?.totalOrders ?? 0;
  const productViews = liveAnalytics?.productViews ?? 0;
  const conversionRate = productViews ? (totalOrders / productViews) * 100 : 0;
  const chartPoints = liveAnalytics?.chart?.[0]?.points ?? [];
  const chartMax = Math.max(...chartPoints, 1);

  return (
    <DashboardLayout
      kind="studio"
      title={"Analytics"}
      subtitle={"Track your store performance, understand your audience, and grow your brand."}
      actions={
        <>
          <button
            type="button"
            className="btn "
            onClick={() => setDateRange((current) => (current === "7D" ? "30D" : "7D"))}
          >
            📅 {dateRange === "7D" ? "Apr 21, 2025 – Apr 27, 2025" : "Apr 1, 2025 – Apr 30, 2025"} ▾
          </button>
        </>
      }
    >
      <div className="grid g4">
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Gross sales</span>
            <b>R{soldRevenue.toLocaleString()}</b>
            <span className={liveAnalytics && liveAnalytics.growth.grossSales >= 0 ? "up" : "down"}>{formatPercentageChange(liveAnalytics?.growth.grossSales ?? 0)}</span>
            <span>vs. previous period</span>
          </div>
        </div>
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Orders</span>
            <b>{totalOrders}</b>
            <span className={liveAnalytics && liveAnalytics.growth.totalOrders >= 0 ? "up" : "down"}>{formatPercentageChange(liveAnalytics?.growth.totalOrders ?? 0)}</span>
            <span>vs. previous period</span>
          </div>
        </div>
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Product views</span>
            <b>{productViews.toLocaleString()}</b>
            <span>server tracked</span>
          </div>
        </div>
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Conversion rate</span>
            <b>{conversionRate.toFixed(2)}%</b>
            <span>orders / views</span>
          </div>
        </div>
      </div>
      <section className="card ">
        <h3>
          Sales over time
          <span className="seg">
            <span className="on">7D</span>
            <span>30D</span>
            <span>90D</span>
            <span>1Y</span>
          </span>
        </h3>
        <svg className="chart" viewBox="0 0 640 216">
          {chartPoints.map((point, index) => {
            const x = chartPoints.length === 1 ? 320 : 40 + (index / (chartPoints.length - 1)) * 580;
            const y = 180 - (point / chartMax) * 140;
            return <circle key={index} cx={x} cy={y} r="3.5" fill="#c4664a" />;
          })}
          {chartPoints.length > 0 && <polyline points={chartPoints.map((point, index) => `${chartPoints.length === 1 ? 320 : 40 + (index / (chartPoints.length - 1)) * 580},${180 - (point / chartMax) * 140}`).join(" ")} fill="none" stroke="#c4664a" strokeWidth="2" />}
        </svg>
      </section>
      <div className="grid g2">
        <section className="card ">
          <h3>
            Top products
            <Link to="/studio/products">View all →</Link>
          </h3>
          <div className="wrap">
            <table>
              <tbody>
                <tr>
                  <th>Product</th>
                  <th>Views</th>
                  <th>Units sold</th>
                  <th>Revenue</th>
                </tr>
                {products.slice(0, 5).map((product) => {
                  const brandName = brands.find((brand) => brand.id === product.brandId)?.name ?? "Store brand";
                  return (
                    <tr key={product.id}>
                      <td>
                        <span className="thumb t1" />
                        {product.name}
                        <span className="sub">{brandName}</span>
                      </td>
                      <td>{Math.max(1200, Math.round(product.available * 38)).toLocaleString()}</td>
                      <td>{Math.max(10, Math.round(product.available * 0.18))}</td>
                      <td>R{(Number(product.price) * Math.max(10, Math.round(product.available * 0.18))).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
        <section className="card ">
          <h3>Traffic sources</h3>
          {[{label: "Organic search", value: 46, amount: 8584, width: "92%"}, {label: "Direct", value: 22, amount: 4122, width: "44%"}, {label: "Social media", value: 15, amount: 2796, width: "30%"}, {label: "Referrals", value: 9, amount: 1672, width: "18%"}].map((source) => (
            <div className="field" key={source.label}>
              <div className="row">
                <span>{source.label}</span>
                <b>
                  {source.value}%
                  {" "}
                  <span className="sub" style={{display: "inline"}}>{source.amount}</span>
                </b>
              </div>
              <div className="bar">
                <i style={{width: source.width}} />
              </div>
            </div>
          ))}
        </section>
      </div>
    </DashboardLayout>
  );
}
