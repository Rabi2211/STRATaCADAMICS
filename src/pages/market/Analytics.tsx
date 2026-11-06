import DashboardLayout from "../../components/DashboardLayout";
import "./Analytics.css";

export default function MarketAnalytics() {
  return (
    <DashboardLayout
      kind="market"
      title={"Analytics"}
      subtitle={
        <>
          <a href="#" style={{color: "var(--acc)"}}>All brands</a>
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
            <b>R42,860</b>
            <span className="up">▲ 14%</span>
            {" "}
            <span>vs. previous 30 days</span>
          </div>
        </div>
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Orders</span>
            <b>638</b>
            <span className="up">▲ 12%</span>
            {" "}
            <span>vs. previous 30 days</span>
          </div>
        </div>
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Product views</span>
            <b>84,210</b>
            <span className="up">▲ 18%</span>
            {" "}
            <span>vs. previous 30 days</span>
          </div>
        </div>
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Conversion rate</span>
            <b>0.76%</b>
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
            <line x1="40" x2="620" y1="20" y2="20" stroke="#e9e3da" />
            <text x="34" y="24" fontSize="10" textAnchor="end" fill="#7a736b">R2,500</text>
            <line x1="40" x2="620" y1="52" y2="52" stroke="#e9e3da" />
            <text x="34" y="56" fontSize="10" textAnchor="end" fill="#7a736b">R2,000</text>
            <line x1="40" x2="620" y1="84" y2="84" stroke="#e9e3da" />
            <text x="34" y="88" fontSize="10" textAnchor="end" fill="#7a736b">R1,500</text>
            <line x1="40" x2="620" y1="116" y2="116" stroke="#e9e3da" />
            <text x="34" y="120" fontSize="10" textAnchor="end" fill="#7a736b">R1,000</text>
            <line x1="40" x2="620" y1="148" y2="148" stroke="#e9e3da" />
            <text x="34" y="152" fontSize="10" textAnchor="end" fill="#7a736b">R500</text>
            <line x1="40" x2="620" y1="180" y2="180" stroke="#e9e3da" />
            <text x="34" y="184" fontSize="10" textAnchor="end" fill="#7a736b">R0</text>
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
            <text x="40" y="208" fontSize="11" textAnchor="middle" fill="#7a736b">Apr 20</text>
            <text x="185" y="208" fontSize="11" textAnchor="middle" fill="#7a736b">Apr 27</text>
            <text x="330" y="208" fontSize="11" textAnchor="middle" fill="#7a736b">May 4</text>
            <text x="475" y="208" fontSize="11" textAnchor="middle" fill="#7a736b">May 11</text>
            <text x="620" y="208" fontSize="11" textAnchor="middle" fill="#7a736b">May 20</text>
          </svg>
        </section>
        <section className="card ">
          <h3>
            Brand performance
            <a href="#">View all brands →</a>
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
                <tr>
                  <td>1</td>
                  <td>
                    <span className="av" style={{background: "#5b6b4c"}}>AB</span>
                    Atelier Belle
                  </td>
                  <td>R12,480</td>
                  <td>166</td>
                  <td>24,330</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>
                    <span className="av" style={{background: "#a89480"}}>R</span>
                    Rivet & Thread
                  </td>
                  <td>R8,920</td>
                  <td>132</td>
                  <td>18,420</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>
                    <span className="av" style={{background: "#2f4a35"}}>MM</span>
                    Moss & Maple
                  </td>
                  <td>R7,620</td>
                  <td>98</td>
                  <td>13,860</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>
                    <span className="av" style={{background: "#6e6e6a"}}>LL</span>
                    Lines & Loom
                  </td>
                  <td>R6,340</td>
                  <td>76</td>
                  <td>11,240</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>
                    <span className="av" style={{background: "#1a1a1a"}}>KA</span>
                    Kinfolk Atelier
                  </td>
                  <td>R5,980</td>
                  <td>64</td>
                  <td>9,760</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <div className="grid g32">
        <section className="card ">
          <h3>
            Top products (all brands)
            <a href="#">View all products →</a>
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
                <tr>
                  <td>1</td>
                  <td>
                    <span className="thumb t1" />
                    Linen Knit Sweater
                  </td>
                  <td>
                    <span className="av" style={{background: "#2f4a35"}}>MM</span>
                    Moss & Maple
                  </td>
                  <td>R4,820</td>
                  <td>121</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>
                    <span className="thumb t2" />
                    Canvas Jacket
                  </td>
                  <td>
                    <span className="av" style={{background: "#1a1a1a"}}>KA</span>
                    Kinfolk Atelier
                  </td>
                  <td>R3,960</td>
                  <td>98</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>
                    <span className="thumb t3" />
                    Linen Button Down
                  </td>
                  <td>
                    <span className="av" style={{background: "#5b6b4c"}}>AB</span>
                    Atelier Belle
                  </td>
                  <td>R3,740</td>
                  <td>92</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>
                    <span className="thumb t4" />
                    Wide Leg Trousers
                  </td>
                  <td>
                    <span className="av" style={{background: "#a89480"}}>R</span>
                    Rivet & Thread
                  </td>
                  <td>R3,120</td>
                  <td>78</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>
                    <span className="thumb t5" />
                    Leather Crossbody Bag
                  </td>
                  <td>
                    <span className="av" style={{background: "#a89480"}}>R</span>
                    Rivet & Thread
                  </td>
                  <td>R2,860</td>
                  <td>71</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section className="card ">
          <h3>
            Traffic sources (all brands)
            <a href="#">View details →</a>
          </h3>
          <div style={{display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap"}}>
            <div className="donut" style={{background: "conic-gradient(#c4664a 0% 43%,#dd9a82 43% 70%,#ecd3c6 70% 85%,#7a8a75 85% 94%,#b9b6ad 94% 98%)"}}>
              <div>
                <b style={{fontSize: "20px"}}>84,210</b>
                <span className="sub">total sessions</span>
              </div>
            </div>
            <div style={{flex: "1", minWidth: "200px"}}>
              <div className="row">
                <span>
                  <span className="dot" style={{background: "#c4664a"}} />
                  Organic search
                </span>
                <span>36,412</span>
                <span>43%</span>
              </div>
              <div className="row">
                <span>
                  <span className="dot" style={{background: "#dd9a82"}} />
                  Direct
                </span>
                <span>22,860</span>
                <span>27%</span>
              </div>
              <div className="row">
                <span>
                  <span className="dot" style={{background: "#ecd3c6"}} />
                  Social media
                </span>
                <span>12,364</span>
                <span>15%</span>
              </div>
              <div className="row">
                <span>
                  <span className="dot" style={{background: "#7a8a75"}} />
                  Referral
                </span>
                <span>7,539</span>
                <span>9%</span>
              </div>
              <div className="row">
                <span>
                  <span className="dot" style={{background: "#b9b6ad"}} />
                  Email
                </span>
                <span>3,025</span>
                <span>4%</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
