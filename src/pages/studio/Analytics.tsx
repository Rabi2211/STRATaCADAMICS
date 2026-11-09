import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { fetchBrands, fetchProducts, mapApiProduct, type ApiBrand } from "../../lib/store-api";
import "./Analytics.css";

export default function StudioAnalytics() {
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
        if (active) console.error("Unable to load studio analytics", error);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  const soldRevenue = products.reduce((sum, product) => sum + Number(product.price) * Number(product.available), 0);
  const totalOrders = products.reduce((sum, product) => sum + Math.max(4, Math.round(product.available * 0.18)), 0);
  const productViews = products.reduce((sum, product) => sum + Math.max(1200, Math.round(product.available * 38)), 0);
  const conversionRate = totalOrders / Math.max(1, productViews) * 100;

  return (
    <DashboardLayout
      kind="studio"
      title={"Analytics"}
      subtitle={"Track your store performance, understand your audience, and grow your brand."}
      actions={
        <>
          <button className="btn ">📅 Apr 21, 2025 – Apr 27, 2025 ▾</button>
        </>
      }
    >
      <div className="grid g4">
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Gross sales</span>
            <b>R{soldRevenue.toLocaleString()}</b>
            <span className="up">▲ +12.6%</span>
            {" "}
            <span>vs. previous 7 days</span>
          </div>
        </div>
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Orders</span>
            <b>{totalOrders}</b>
            <span className="up">▲ +18.4%</span>
            {" "}
            <span>vs. previous 7 days</span>
          </div>
        </div>
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Product views</span>
            <b>{productViews.toLocaleString()}</b>
            <span className="up">▲ +24.7%</span>
            {" "}
            <span>vs. previous 7 days</span>
          </div>
        </div>
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Conversion rate</span>
            <b>{conversionRate.toFixed(2)}%</b>
            <span className="up">▲ +0.8 pp</span>
            {" "}
            <span>vs. previous 7 days</span>
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
          <polygon points="40,180 40,138 137,130 233,119 330,122 427,89 523,76 620,33 620,180" fill="#c4664a" opacity=".15" />
          <polyline points="40,138 137,130 233,119 330,122 427,89 523,76 620,33" fill="none" stroke="#c4664a" strokeWidth="2" />
          <circle cx="40" cy="138" r="3.5" fill="#c4664a" />
          <circle cx="137" cy="130" r="3.5" fill="#c4664a" />
          <circle cx="233" cy="119" r="3.5" fill="#c4664a" />
          <circle cx="330" cy="122" r="3.5" fill="#c4664a" />
          <circle cx="427" cy="89" r="3.5" fill="#c4664a" />
          <circle cx="523" cy="76" r="3.5" fill="#c4664a" />
          <circle cx="620" cy="33" r="3.5" fill="#c4664a" />
        </svg>
      </section>
      <div className="grid g2">
        <section className="card ">
          <h3>
            Top products
            <a href="#">View all →</a>
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
