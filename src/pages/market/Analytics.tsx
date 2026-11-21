import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { fetchBrands, fetchOverviewAnalytics, type ApiBrand, type ApiOverviewAnalytics } from "../../lib/store-api";
import { formatPercentageChange } from "../../lib/live-metrics";
import "./Analytics.css";

export default function MarketAnalytics() {
  const [brands, setBrands] = useState<ApiBrand[]>([]);
  const [liveAnalytics, setLiveAnalytics] = useState<ApiOverviewAnalytics | null>(null);
  const [range, setRange] = useState<"7D" | "30D" | "3M" | "12M">("30D");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [nextBrands, nextAnalytics] = await Promise.all([
          fetchBrands(),
          fetchOverviewAnalytics({ range }),
        ]);
        if (!active) return;
        setBrands(nextBrands);
        setLiveAnalytics(nextAnalytics);
      } catch (loadError) {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : "Unable to load market analytics.");
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [range]);

  const grossSales = liveAnalytics?.grossSales ?? 0;
  const totalOrders = liveAnalytics?.totalOrders ?? 0;
  const productViews = liveAnalytics?.productViews ?? 0;
  const conversionRate = productViews ? (totalOrders / productViews) * 100 : 0;
  const chartPoints = liveAnalytics?.chart?.[0]?.points ?? [];
  const chartLabels = liveAnalytics?.labels ?? [];
  const chartMax = Math.max(...chartPoints, 1);
  const chartCoordinates = chartPoints.map((point, index) => {
    const x = chartPoints.length === 1 ? 320 : 35 + (index / (chartPoints.length - 1)) * 580;
    const y = 180 - (point / chartMax) * 140;
    return `${x},${y}`;
  }).join(" ");

  if (loading || error) {
    return (
      <DashboardLayout
        kind="market"
        title="Analytics"
        subtitle={<> <Link to="/market/brands" style={{ color: "var(--acc)" }}>All brands</Link> · Your entire marketplace, aggregated across all brands.</>}
      >
        <section className="card" aria-live="polite">
          {loading ? "Loading market analytics…" : <p className="auth-error">{error}</p>}
        </section>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      kind="market"
      title={"Analytics"}
      subtitle={<> <Link to="/market/brands" style={{color: "var(--acc)"}}>All brands</Link> · Your entire marketplace, aggregated across all brands.</>}
      actions={<><button className="btn" type="button" onClick={() => setRange((current) => current === "30D" ? "7D" : "30D")}>📅 {range === "7D" ? "Last 7 days" : range === "30D" ? "Last 30 days" : range} ▾</button><button className="btn">👥 All brands ▾</button></>}
    >
      <div className="grid g4">
        <div className="card stat"><div className="ic" /><div><span>Gross sales</span><b>R{grossSales.toLocaleString()}</b><span className={liveAnalytics && liveAnalytics.growth.grossSales >= 0 ? "up" : "down"}>{formatPercentageChange(liveAnalytics?.growth.grossSales ?? 0)}</span><span>vs. previous period</span></div></div>
        <div className="card stat"><div className="ic" /><div><span>Orders</span><b>{totalOrders}</b><span className={liveAnalytics && liveAnalytics.growth.totalOrders >= 0 ? "up" : "down"}>{formatPercentageChange(liveAnalytics?.growth.totalOrders ?? 0)}</span><span>vs. previous period</span></div></div>
        <div className="card stat"><div className="ic" /><div><span>Product views</span><b>{productViews.toLocaleString()}</b><span>server tracked</span></div></div>
        <div className="card stat"><div className="ic" /><div><span>Conversion rate</span><b>{conversionRate.toFixed(2)}%</b><span>orders / views</span></div></div>
      </div>
      <div className="grid g32">
        <section className="card ">
          <h3>Sales over time <span className="seg"><span className={range === "7D" ? "on" : ""} onClick={() => setRange("7D")}>7D</span><span className={range === "30D" ? "on" : ""} onClick={() => setRange("30D")}>30D</span><span className={range === "3M" ? "on" : ""} onClick={() => setRange("3M")}>3M</span><span className={range === "12M" ? "on" : ""} onClick={() => setRange("12M")}>12M</span></span></h3>
          <svg className="chart" viewBox="0 0 640 216">
            {chartPoints.map((_, index) => {
              const [x, y] = chartCoordinates.split(" ")[index]?.split(",").map(Number) ?? [0, 180];
              return <circle key={`${chartLabels[index] ?? index}-${index}`} cx={x} cy={y} r="3" fill="#c4664a" />;
            })}
            {chartCoordinates && <polyline points={chartCoordinates} fill="none" stroke="#c4664a" strokeWidth="2" />}
          </svg>
        </section>
        <section className="card ">
          <h3>Brand performance <Link to="/market/brands">View all brands →</Link></h3>
          <div className="wrap"><table><tbody><tr><th>#</th><th>Brand</th><th>Sales</th><th>Orders</th><th>Product views</th></tr>{(liveAnalytics?.brandPerformance ?? []).map((entry, index) => { const brand = brands.find((item) => item.id === entry.brandId); return <tr key={entry.brandId}><td>{index + 1}</td><td><span className="av" style={{ background: brand?.accent ?? "#5b6b4c" }}>{brand?.abbreviation ?? "ST"}</span>{brand?.name ?? entry.brandId}</td><td>R{entry.sales.toLocaleString()}</td><td>{entry.orders}</td><td>{entry.productCount.toLocaleString()}</td></tr>; })}</tbody></table></div>
        </section>
      </div>
    </DashboardLayout>
  );
}
