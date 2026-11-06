import DashboardLayout from "../../components/DashboardLayout";
import "./Analytics.css";

export default function StudioAnalytics() {
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
            <b>R8,420</b>
            <span className="up">▲ +12.6%</span>
            {" "}
            <span>vs. previous 7 days</span>
          </div>
        </div>
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Orders</span>
            <b>126</b>
            <span className="up">▲ +18.4%</span>
            {" "}
            <span>vs. previous 7 days</span>
          </div>
        </div>
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Product views</span>
            <b>18,640</b>
            <span className="up">▲ +24.7%</span>
            {" "}
            <span>vs. previous 7 days</span>
          </div>
        </div>
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Conversion rate</span>
            <b>2.4%</b>
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
          <polygon points="40,180 40,138 137,130 233,119 330,122 427,89 523,76 620,33 620,180" fill="#c4664a" opacity=".15" />
          <polyline points="40,138 137,130 233,119 330,122 427,89 523,76 620,33" fill="none" stroke="#c4664a" strokeWidth="2" />
          <circle cx="40" cy="138" r="3.5" fill="#c4664a" />
          <circle cx="137" cy="130" r="3.5" fill="#c4664a" />
          <circle cx="233" cy="119" r="3.5" fill="#c4664a" />
          <circle cx="330" cy="122" r="3.5" fill="#c4664a" />
          <circle cx="427" cy="89" r="3.5" fill="#c4664a" />
          <circle cx="523" cy="76" r="3.5" fill="#c4664a" />
          <circle cx="620" cy="33" r="3.5" fill="#c4664a" />
          <text x="40" y="208" fontSize="11" textAnchor="middle" fill="#7a736b">Apr 21</text>
          <text x="137" y="208" fontSize="11" textAnchor="middle" fill="#7a736b">Apr 22</text>
          <text x="233" y="208" fontSize="11" textAnchor="middle" fill="#7a736b">Apr 23</text>
          <text x="330" y="208" fontSize="11" textAnchor="middle" fill="#7a736b">Apr 24</text>
          <text x="427" y="208" fontSize="11" textAnchor="middle" fill="#7a736b">Apr 25</text>
          <text x="523" y="208" fontSize="11" textAnchor="middle" fill="#7a736b">Apr 26</text>
          <text x="620" y="208" fontSize="11" textAnchor="middle" fill="#7a736b">Apr 27</text>
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
                <tr>
                  <td>
                    <span className="thumb t1" />
                    New Punk Hoodie
                    <span className="sub">Heather Grey</span>
                  </td>
                  <td>4,892</td>
                  <td>42</td>
                  <td>R2,884</td>
                </tr>
                <tr>
                  <td>
                    <span className="thumb t2" />
                    Graphic Tee
                    <span className="sub">Natural</span>
                  </td>
                  <td>3,421</td>
                  <td>28</td>
                  <td>R1,736</td>
                </tr>
                <tr>
                  <td>
                    <span className="thumb t3" />
                    Canvas Tote
                    <span className="sub">Natural</span>
                  </td>
                  <td>2,908</td>
                  <td>24</td>
                  <td>R1,248</td>
                </tr>
                <tr>
                  <td>
                    <span className="thumb t4" />
                    Vintage Tee
                    <span className="sub">Charcoal</span>
                  </td>
                  <td>1,965</td>
                  <td>17</td>
                  <td>R884</td>
                </tr>
                <tr>
                  <td>
                    <span className="thumb t5" />
                    Dad Cap
                    <span className="sub">Stone</span>
                  </td>
                  <td>1,120</td>
                  <td>12</td>
                  <td>R576</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section className="card ">
          <h3>Traffic sources</h3>
          <div className="field">
            <div className="row">
              <span>Organic search</span>
              <b>
                46%
                {" "}
                <span className="sub" style={{display: "inline"}}>8,584</span>
              </b>
            </div>
            <div className="bar">
              <i style={{width: "92%"}} />
            </div>
          </div>
          <div className="field">
            <div className="row">
              <span>Direct</span>
              <b>
                22%
                {" "}
                <span className="sub" style={{display: "inline"}}>4,122</span>
              </b>
            </div>
            <div className="bar">
              <i style={{width: "44%"}} />
            </div>
          </div>
          <div className="field">
            <div className="row">
              <span>Social media</span>
              <b>
                15%
                {" "}
                <span className="sub" style={{display: "inline"}}>2,796</span>
              </b>
            </div>
            <div className="bar">
              <i style={{width: "30%"}} />
            </div>
          </div>
          <div className="field">
            <div className="row">
              <span>Referrals</span>
              <b>
                9%
                {" "}
                <span className="sub" style={{display: "inline"}}>1,672</span>
              </b>
            </div>
            <div className="bar">
              <i style={{width: "18%"}} />
            </div>
          </div>
          <div className="field">
            <div className="row">
              <span>Other</span>
              <b>
                8%
                {" "}
                <span className="sub" style={{display: "inline"}}>1,466</span>
              </b>
            </div>
            <div className="bar">
              <i style={{width: "16%"}} />
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
