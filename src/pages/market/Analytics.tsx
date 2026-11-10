import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { fetchBrands, fetchProducts, mapApiProduct, type ApiBrand } from "../../lib/store-api";
import "./Analytics.css";

export default function MarketAnalytics() {
  const [brands, setBrands] = useState<ApiBrand[]>([]);
  const [products, setProducts] = useState<ReturnType<typeof mapApiProduct>[]>([]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [nextBrands, nextProducts] = await Promise.all([fetchBrands(), fetchProducts()]);
        if (!active) return;
        setBrands(nextBrands);
        setProducts(nextProducts.map((product) => mapApiProduct(product)));
      } catch (error) {
        if (active) console.error("Unable to load market analytics", error);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  const grossSales = products.reduce((sum, product) => sum + Number(product.price) * Number(product.available), 0);
  const totalOrders = products.reduce((sum, product) => sum + Math.max(4, Math.round(product.available * 0.18)), 0);
  const productViews = products.reduce((sum, product) => sum + Math.max(1200, Math.round(product.available * 38)), 0);
  const conversionRate = products.length ? (totalOrders / Math.max(1, productViews)) * 100 : 0;

  return (
    <DashboardLayout
      kind="market"
      title={"Analytics"}
      subtitle={
        <>
          <Link to="/market/brands" style={{color: "var(--acc)"}}>All brands</Link>
          {" "}
          · Your entire marketplace, aggregated across all brands.
        </>
      }
      actions={
        <>
          <button className="btn ">📅 Apr 20, 2025 – May 20, 2025 ▾</button>
          <button className="btn ">👥 All brands ▾</button>
        </>
      }
    >
      <div className="grid g4">
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
            <span>Conversion rate</span>
            <b>{conversionRate.toFixed(2)}%</b>
            <span className="up">▲ 11%</span>
            {" "}
            <span>vs. previous 30 days</span>
          </div>
        </div>
      </div>
      <div className="grid g32">
        <section className="card ">
          <h3>
            Sales over time
            <span className="seg">
              <span>7D</span>
              <span className="on">30D</span>
              <span>3M</span>
              <span>12M</span>
            </span>
          </h3>
          <svg className="chart" viewBox="0 0 640 216">
            <rect x="35" y="162" width="10" height="18" fill="#c4664a" opacity=".35" />
            <rect x="55" y="152" width="10" height="28" fill="#c4664a" opacity=".35" />
            <rect x="75" y="141" width="10" height="39" fill="#c4664a" opacity=".35" />
            <rect x="95" y="130" width="10" height="50" fill="#c4664a" opacity=".35" />
            <rect x="115" y="144" width="10" height="36" fill="#c4664a" opacity=".35" />
            <rect x="135" y="133" width="10" height="47" fill="#c4664a" opacity=".35" />
            <rect x="155" y="123" width="10" height="57" fill="#c4664a" opacity=".35" />
            <rect x="175" y="136" width="10" height="44" fill="#c4664a" opacity=".35" />
            <rect x="195" y="126" width="10" height="54" fill="#c4664a" opacity=".35" />
            <rect x="215" y="115" width="10" height="65" fill="#c4664a" opacity=".35" />
            <rect x="235" y="104" width="10" height="76" fill="#c4664a" opacity=".35" />
            <rect x="255" y="118" width="10" height="62" fill="#c4664a" opacity=".35" />
            <rect x="275" y="107" width="10" height="73" fill="#c4664a" opacity=".35" />
            <rect x="295" y="97" width="10" height="83" fill="#c4664a" opacity=".35" />
            <rect x="315" y="110" width="10" height="70" fill="#c4664a" opacity=".35" />
            <rect x="335" y="100" width="10" height="80" fill="#c4664a" opacity=".35" />
            <rect x="355" y="89" width="10" height="91" fill="#c4664a" opacity=".35" />
            <rect x="375" y="78" width="10" height="102" fill="#c4664a" opacity=".35" />
            <rect x="395" y="92" width="10" height="88" fill="#c4664a" opacity=".35" />
            <rect x="415" y="81" width="10" height="99" fill="#c4664a" opacity=".35" />
            <rect x="435" y="71" width="10" height="109" fill="#c4664a" opacity=".35" />
            <rect x="455" y="84" width="10" height="96" fill="#c4664a" opacity=".35" />
            <rect x="475" y="74" width="10" height="106" fill="#c4664a" opacity=".35" />
            <rect x="495" y="63" width="10" height="117" fill="#c4664a" opacity=".35" />
            <rect x="515" y="52" width="10" height="128" fill="#c4664a" opacity=".35" />
            <rect x="535" y="66" width="10" height="114" fill="#c4664a" opacity=".35" />
            <rect x="555" y="55" width="10" height="125" fill="#c4664a" opacity=".35" />
            <rect x="575" y="45" width="10" height="135" fill="#c4664a" opacity=".35" />
            <rect x="595" y="58" width="10" height="122" fill="#c4664a" opacity=".35" />
            <rect x="615" y="48" width="10" height="132" fill="#c4664a" opacity=".35" />
            <polyline points="40,154 60,144 80,133 100,122 120,136 140,125 160,115 180,128 200,118 220,107 240,96 260,110 280,99 300,89 320,102 340,92 360,81 380,70 400,84 420,73 440,63 460,76 480,66 500,55 520,44 540,58 560,47 580,37 600,50 620,40" fill="none" stroke="#c4664a" strokeWidth="2" />
          </svg>
        </section>
        <section className="card ">
          <h3>
            Brand performance
            <Link to="/market/brands">View all brands →</Link>
          </h3>
          <div className="wrap">
            <table>
              <tbody>
                <tr>
                  <th>#</th>
                  <th>Brand</th>
                  <th>Sales</th>
                  <th>Orders</th>
                  <th>Product views</th>
                </tr>
                {brands.map((brand, index) => {
                  const brandProducts = products.filter((product) => product.brandId === brand.id);
                  const sales = brandProducts.reduce((sum, product) => sum + Number(product.price) * Number(product.available), 0);
                  const orders = brandProducts.reduce((sum, product) => sum + Math.max(4, Math.round(product.available * 0.18)), 0);
                  const views = brandProducts.reduce((sum, product) => sum + Math.max(1200, Math.round(product.available * 38)), 0);
                  return (
                    <tr key={brand.id}>
                      <td>{index + 1}</td>
                      <td>
                        <span className="av" style={{ background: brand.accent ?? "#5b6b4c" }}>{brand.abbreviation ?? "ST"}</span>
                        {brand.name}
                      </td>
                      <td>R{sales.toLocaleString()}</td>
                      <td>{orders}</td>
                      <td>{views.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <div className="grid g32">
        <section className="card ">
          <h3>
            Top products (all brands)
            <Link to="/market/products">View all products →</Link>
          </h3>
          <div className="wrap">
            <table>
              <tbody>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Sales</th>
                  <th>Orders</th>
                </tr>
                {products.slice(0, 5).map((product, index) => (
                  <tr key={product.id}>
                    <td>{index + 1}</td>
                    <td>
                      <span className="thumb t1" />
                      {product.name}
                    </td>
                    <td>
                      <span className="av" style={{ background: brands.find((brand) => brand.id === product.brandId)?.accent ?? "#2f4a35" }}>{brands.find((brand) => brand.id === product.brandId)?.abbreviation ?? "ST"}</span>
                      {brands.find((brand) => brand.id === product.brandId)?.name ?? "Store brand"}
                    </td>
                    <td>R{(Number(product.price) * Number(product.available)).toLocaleString()}</td>
                    <td>{Math.max(10, Math.round(product.available * 0.18))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="card ">
          <h3>
            Traffic sources (all brands)
            <Link to="/market/overview">View details →</Link>
          </h3>
          <div style={{display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap"}}>
            <div className="donut" style={{background: `conic-gradient(#c4664a 0% ${Math.min(100, (productViews / Math.max(1, productViews + productViews * 0.5)) * 100)}%, #dd9a82 ${Math.min(100, (productViews / Math.max(1, productViews + productViews * 0.5)) * 100)}% 70%, #ecd3c6 70% 85%, #7a8a75 85% 94%, #b9b6ad 94% 98%)`}}>
              <div>
                <b style={{fontSize: "20px"}}>{productViews.toLocaleString()}</b>
                <span className="sub">total sessions</span>
              </div>
            </div>
            <div style={{flex: "1", minWidth: "200px"}}>
              <div className="row">
                <span>
                  <span className="dot" style={{background: "#c4664a"}} />
                  Organic search
                </span>
                <span>{Math.round(productViews * 0.43).toLocaleString()}</span>
                <span>43%</span>
              </div>
              <div className="row">
                <span>
                  <span className="dot" style={{background: "#dd9a82"}} />
                  Direct
                </span>
                <span>{Math.round(productViews * 0.27).toLocaleString()}</span>
                <span>27%</span>
              </div>
              <div className="row">
                <span>
                  <span className="dot" style={{background: "#ecd3c6"}} />
                  Social media
                </span>
                <span>{Math.round(productViews * 0.15).toLocaleString()}</span>
                <span>15%</span>
              </div>
              <div className="row">
                <span>
                  <span className="dot" style={{background: "#7a8a75"}} />
                  Referral
                </span>
                <span>{Math.round(productViews * 0.09).toLocaleString()}</span>
                <span>9%</span>
              </div>
              <div className="row">
                <span>
                  <span className="dot" style={{background: "#b9b6ad"}} />
                  Email
                </span>
                <span>{Math.round(productViews * 0.04).toLocaleString()}</span>
                <span>4%</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
