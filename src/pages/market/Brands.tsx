import DashboardLayout from "../../components/DashboardLayout";
import "./Brands.css";

export default function MarketBrands() {
  return (
    <DashboardLayout
      kind="market"
      title={"Brands"}
      subtitle={"Manage all brand partners on your marketplace. Approve new brands, track performance and keep your store ecosystem healthy."}
      actions={
        <>
          <input className="search" placeholder="Search brands by name, contact or email…" />
          <span className="seg">
            <span className="on">All (18)</span>
            <span>Active (15)</span>
            <span>Pending (3)</span>
          </span>
          <button className="btn pri">+ Add brand</button>
        </>
      }
    >
      <div className="split">
        <div>
          <div className="grid g3">
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Total brands</span>
                <b>18</b>
                {" "}
                <span>across your marketplace</span>
              </div>
            </div>
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Active brands</span>
                <b>15</b>
                {" "}
                <span>83% of total</span>
              </div>
            </div>
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Pending review</span>
                <b>3</b>
                {" "}
                <span>17% of total</span>
              </div>
            </div>
          </div>
          <section className="card ">
            <h3 />
            <div className="wrap">
              <table>
                <tbody>
                  <tr>
                    <th>Brand</th>
                    <th>Contact</th>
                    <th>Products</th>
                    <th>Sales</th>
                    <th>Orders</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                  <tr>
                    <td>
                      <span className="av" style={{background: "#2f4a35"}}>MM</span>
                      Moss & Maple
                      <span className="sub">Timeless essentials</span>
                    </td>
                    <td>
                      Taylor Brooks
                      <span className="sub">taylor.brooks@example.com</span>
                    </td>
                    <td>42</td>
                    <td>R12,480</td>
                    <td>166</td>
                    <td>
                      <span className="pill green">● Active</span>
                    </td>
                    <td>⋯</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="av" style={{background: "#a89480"}}>R</span>
                      Rivet & Thread
                      <span className="sub">Modern classics</span>
                    </td>
                    <td>
                      Jordan Lee
                      <span className="sub">jordan.lee@example.com</span>
                    </td>
                    <td>36</td>
                    <td>R8,920</td>
                    <td>132</td>
                    <td>
                      <span className="pill green">● Active</span>
                    </td>
                    <td>⋯</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="av" style={{background: "#5b6b4c"}}>AB</span>
                      Atelier Belle
                      <span className="sub">Luxury for everyday</span>
                    </td>
                    <td>
                      Casey Nguyen
                      <span className="sub">casey.nguyen@example.com</span>
                    </td>
                    <td>28</td>
                    <td>R5,980</td>
                    <td>98</td>
                    <td>
                      <span className="pill green">● Active</span>
                    </td>
                    <td>⋯</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="av" style={{background: "#6e6e6a"}}>LL</span>
                      Lines & Loom
                      <span className="sub">Minimal. Modern.</span>
                    </td>
                    <td>
                      Morgan Patel
                      <span className="sub">morgan.patel@example.com</span>
                    </td>
                    <td>24</td>
                    <td>R7,620</td>
                    <td>112</td>
                    <td>
                      <span className="pill green">● Active</span>
                    </td>
                    <td>⋯</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="av" style={{background: "#1a1a1a"}}>KA</span>
                      Kinfolk Atelier
                      <span className="sub">Heritage in modern form</span>
                    </td>
                    <td>
                      Riley Carter
                      <span className="sub">riley.carter@example.com</span>
                    </td>
                    <td>18</td>
                    <td>R5,480</td>
                    <td>76</td>
                    <td>
                      <span className="pill green">● Active</span>
                    </td>
                    <td>⋯</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="av" style={{background: "#d9b9a8"}}>S</span>
                      Sunday Collective
                      <span className="sub">Everyday elevated</span>
                    </td>
                    <td>
                      Jamie Ellis
                      <span className="sub">jamie.ellis@example.com</span>
                    </td>
                    <td>14</td>
                    <td>R3,210</td>
                    <td>54</td>
                    <td>
                      <span className="pill green">● Active</span>
                    </td>
                    <td>⋯</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="av" style={{background: "#1f2a20"}}>V</span>
                      Velvet & Oak
                      <span className="sub">Sustainable style</span>
                    </td>
                    <td>
                      Alex Rivera
                      <span className="sub">alex.rivera@example.com</span>
                    </td>
                    <td>12</td>
                    <td>R2,980</td>
                    <td>42</td>
                    <td>
                      <span className="pill green">● Active</span>
                    </td>
                    <td>⋯</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="av" style={{background: "#c9a98a"}}>P</span>
                      Pine & Stone
                      <span className="sub">Rugged & refined</span>
                    </td>
                    <td>
                      Sam Wilson
                      <span className="sub">sam.wilson@example.com</span>
                    </td>
                    <td>16</td>
                    <td>R4,760</td>
                    <td>68</td>
                    <td>
                      <span className="pill green">● Active</span>
                    </td>
                    <td>⋯</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="av" style={{background: "#a89480"}}>J</span>
                      Juniper Lane
                      <span className="sub">Modern bohemian</span>
                    </td>
                    <td>
                      Dana Kim
                      <span className="sub">dana.kim@example.com</span>
                    </td>
                    <td>10</td>
                    <td>R2,340</td>
                    <td>34</td>
                    <td>
                      <span className="pill orange">● Pending</span>
                    </td>
                    <td>⋯</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="av" style={{background: "#1a1a1a"}}>C</span>
                      Coastal & Co.
                      <span className="sub">Beach to city</span>
                    </td>
                    <td>
                      Evan Hall
                      <span className="sub">evan.hall@example.com</span>
                    </td>
                    <td>8</td>
                    <td>R1,870</td>
                    <td>26</td>
                    <td>
                      <span className="pill orange">● Pending</span>
                    </td>
                    <td>⋯</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="av" style={{background: "#7a8a75"}}>T</span>
                      The Wilde Label
                      <span className="sub">Artisan made</span>
                    </td>
                    <td>
                      Sophie Laurent
                      <span className="sub">sophie.laurent@example.com</span>
                    </td>
                    <td>6</td>
                    <td>R1,230</td>
                    <td>18</td>
                    <td>
                      <span className="pill orange">● Pending</span>
                    </td>
                    <td>⋯</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
        <aside className="panel">
          <h3>
            <span className="av" style={{background: "#2f4a35"}}>M&</span>
            Moss & Maple
            <span className="sub">Timeless essentials</span>
            {" "}
            <span>✕</span>
          </h3>
          <button className="btn pri">✎ Edit brand</button>
          {" "}
          <button className="btn ">View products ↗</button>
          <h3 style={{marginTop: "18px"}}>Brand contact</h3>
          <div className="row">
            <span className="sub">Contact name</span>
            <span>Taylor Brooks</span>
          </div>
          <div className="row">
            <span className="sub">Email</span>
            <span>taylor@example.com</span>
          </div>
          <div className="row">
            <span className="sub">Phone</span>
            <span>+1 (415) 555-0189</span>
          </div>
          <div className="row">
            <span className="sub">Website</span>
            <span>www.mossandmaple.com</span>
          </div>
          <h3 style={{marginTop: "18px"}}>
            Brand status
            {" "}
            <span className="pill green">Active</span>
          </h3>
          <span className="sub">This brand is approved and can sell on your marketplace.</span>
          <h3 style={{marginTop: "18px"}}>
            Store performance
            {" "}
            <span className="sub">Last 30 days ▾</span>
          </h3>
          <div className="grid g2">
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Products</span>
                <b>42</b>
                <span className="up">▲ 12%</span>
                {" "}
                <span />
              </div>
            </div>
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Sales</span>
                <b>R12,480</b>
                <span className="up">▲ 14%</span>
                {" "}
                <span />
              </div>
            </div>
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Orders</span>
                <b>166</b>
                <span className="up">▲ 16%</span>
                {" "}
                <span />
              </div>
            </div>
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Conversion rate</span>
                <b>3.8%</b>
                <span className="up">▲ 0.6%</span>
                {" "}
                <span />
              </div>
            </div>
          </div>
          <h3>
            Recent activity
            {" "}
            <a href="#" style={{color: "var(--acc)", fontSize: "12px"}}>View all activity →</a>
          </h3>
          <div className="ord">
            <div>
              <b>Brand approved</b>
              <span className="sub">Moss & Maple was approved to sell on the marketplace. Apr 22, 2025 · 10:24 AM</span>
            </div>
          </div>
          <div className="ord">
            <div>
              <b>Product updated</b>
              <span className="sub">New item added to collection: Linen Shirt. Apr 18, 2025</span>
            </div>
          </div>
          <div className="ord">
            <div>
              <b>Order received</b>
              <span className="sub">Order #STR-10432 for R128.00. Apr 16, 2025</span>
            </div>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}
