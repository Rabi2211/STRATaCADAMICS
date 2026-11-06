import DashboardLayout from "../../components/DashboardLayout";
import "./Overview.css";

export default function StudioOverview() {
  return (
    <DashboardLayout
      kind="studio"
      title={"Good morning, Alex"}
      subtitle={"Here's what happening with your store today."}
      actions={
        <>
          <button className="btn ">📅 Apr 21, 2025 – Apr 27, 2025 ▾</button>
          🔔
          <button className="btn pri">View storefront ↗</button>
        </>
      }
    >
      <div className="grid g4">
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Gross sales</span>
            <b>R8,420</b>
            <span className="up">▲ +12.8%</span>
            {" "}
            <span>vs. previous 7 days</span>
          </div>
        </div>
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Orders</span>
            <b>126</b>
            <span className="up">▲ +12.8%</span>
            {" "}
            <span>vs. previous 7 days</span>
          </div>
        </div>
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Product views</span>
            <b>18,640</b>
            <span className="up">▲ +8.2%</span>
            {" "}
            <span>vs. previous 7 days</span>
          </div>
        </div>
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Conversion rate</span>
            <b>2.4%</b>
            <span className="up">▲ +0.3%</span>
            {" "}
            <span>vs. previous 7 days</span>
          </div>
        </div>
      </div>
      <div className="grid g21">
        <div className="stack">
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
              <polygon points="40,180 40,138 88,130 137,126 185,116 233,127 282,124 330,103 378,105 427,111 475,92 523,74 572,58 620,33 620,180" fill="#c4664a" opacity=".15" />
              <polyline points="40,138 88,130 137,126 185,116 233,127 282,124 330,103 378,105 427,111 475,92 523,74 572,58 620,33" fill="none" stroke="#c4664a" strokeWidth="2" />
              <circle cx="40" cy="138" r="3.5" fill="#c4664a" />
              <circle cx="88" cy="130" r="3.5" fill="#c4664a" />
              <circle cx="137" cy="126" r="3.5" fill="#c4664a" />
              <circle cx="185" cy="116" r="3.5" fill="#c4664a" />
              <circle cx="233" cy="127" r="3.5" fill="#c4664a" />
              <circle cx="282" cy="124" r="3.5" fill="#c4664a" />
              <circle cx="330" cy="103" r="3.5" fill="#c4664a" />
              <circle cx="378" cy="105" r="3.5" fill="#c4664a" />
              <circle cx="427" cy="111" r="3.5" fill="#c4664a" />
              <circle cx="475" cy="92" r="3.5" fill="#c4664a" />
              <circle cx="523" cy="74" r="3.5" fill="#c4664a" />
              <circle cx="572" cy="58" r="3.5" fill="#c4664a" />
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
                      <span className="thumb t2" />
                      New Punk Tee
                    </td>
                    <td>6,482</td>
                    <td>64</td>
                    <td>R2,944</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="thumb t3" />
                      Tag Hoodie
                    </td>
                    <td>4,921</td>
                    <td>38</td>
                    <td>R2,356</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="thumb t5" />
                      Cowboy Tee
                    </td>
                    <td>3,217</td>
                    <td>27</td>
                    <td>R1,620</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
        <section className="card ">
          <h3>
            Orders to fulfill
            {" "}
            <span className="pill orange">3</span>
          </h3>
          <div className="ord">
            <span className="thumb t1" />
            <div>
              <b>#1043</b>
              {" "}
              <span className="pill orange">Pending</span>
              <span className="sub">Apr 27, 2025 · 2 items</span>
              Jordan Mitchell
              <span className="sub">📍 Austin, TX</span>
              <div className="acts">
                <button className="btn pri">Mark shipped</button>
                <button className="btn ">Add tracking</button>
              </div>
            </div>
          </div>
          <div className="ord">
            <span className="thumb t2" />
            <div>
              <b>#1042</b>
              {" "}
              <span className="pill orange">Processing</span>
              <span className="sub">Apr 26, 2025 · 1 item</span>
              Taylor Brooks
              <span className="sub">📍 Seattle, WA</span>
              <div className="acts">
                <button className="btn pri">Mark shipped</button>
                <button className="btn ">Add tracking</button>
              </div>
            </div>
          </div>
          <div className="ord">
            <span className="thumb t3" />
            <div>
              <b>#1041</b>
              {" "}
              <span className="pill green">Shipped</span>
              <span className="sub">Apr 25, 2025 · 1 item</span>
              Casey Rivera
              <span className="sub">📍 Denver, CO</span>
              <div className="acts">
                <button className="btn pri">Mark shipped</button>
                <button className="btn ">Add tracking</button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <section className="card ">
        <h3>
          Inventory & preorders
          {" "}
          <span className="toggle" />
          {" "}
          <span className="sub">Allow preorders · Preorders: 42 · Expected ship: May 23, 2025</span>
        </h3>
        <div className="wrap">
          <table>
            <tbody>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Variant</th>
                <th>Remaining</th>
                <th>Status</th>
                <th>Preorder</th>
              </tr>
              <tr>
                <td>
                  <span className="thumb t2" />
                  New Punk Tee
                </td>
                <td>NP-TEE-001</td>
                <td>White / L</td>
                <td>6</td>
                <td>
                  <span className="pill orange">Low stock</span>
                </td>
                <td>–</td>
              </tr>
              <tr>
                <td>
                  <span className="thumb t3" />
                  Tag Hoodie
                </td>
                <td>TAG-HOOD-001</td>
                <td>Gray / L</td>
                <td>0</td>
                <td>
                  <span className="pill orange">Out of stock</span>
                </td>
                <td>–</td>
              </tr>
              <tr>
                <td>
                  <span className="thumb t5" />
                  Cowboy Tee
                </td>
                <td>COWBOY-001</td>
                <td>Natural / M</td>
                <td>18</td>
                <td>
                  <span className="pill orange">Low stock</span>
                </td>
                <td>
                  <span className="pill green">Open</span>
                  {" "}
                  (12)
                </td>
              </tr>
              <tr>
                <td>
                  <span className="thumb t4" />
                  Riverside Tee
                </td>
                <td>RIVER-001</td>
                <td>Black / L</td>
                <td>32</td>
                <td>
                  <span className="pill green">In stock</span>
                </td>
                <td>–</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
}
