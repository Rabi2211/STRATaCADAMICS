import DashboardLayout from "../../components/DashboardLayout";
import "./Inventory.css";

export default function StudioInventory() {
  return (
    <DashboardLayout
      kind="studio"
      title={"Inventory"}
      subtitle={"Track stock levels and manage inventory across your products."}
      actions={
        <>
          <button className="btn ">⬇ Export</button>
          <button className="btn pri">Adjust stock</button>
        </>
      }
    >
      <div className="tools">
        <input className="search" placeholder="Search products, SKU, or name…" />
        <select className="search">
          <option>All categories</option>
        </select>
        <select className="search">
          <option>All status</option>
        </select>
        <button className="btn ">⚲</button>
      </div>
      <div className="grid g4">
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Total units</span>
            <b>8,420</b>
            {" "}
            <span>Across all products</span>
          </div>
        </div>
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Low stock</span>
            <b>7</b>
            {" "}
            <span>≤ 10 units remaining</span>
          </div>
        </div>
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Out of stock</span>
            <b>3</b>
            {" "}
            <span>No units available</span>
          </div>
        </div>
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Preorder units</span>
            <b>542</b>
            {" "}
            <span>Awaiting fulfillment</span>
          </div>
        </div>
      </div>
      <section className="card ">
        <h3 />
        <div className="wrap">
          <table>
            <tbody>
              <tr>
                <th>☐</th>
                <th>Product / SKU</th>
                <th>Available</th>
                <th>Committed</th>
                <th>Preorder qty</th>
                <th>Status</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
              <tr>
                <td>☐</td>
                <td>
                  <span className="thumb t1" />
                  New Punk Hoodie
                  <span className="sub">NP-HOOD-001</span>
                </td>
                <td>42</td>
                <td>8</td>
                <td>15</td>
                <td>
                  <span className="pill green">In stock</span>
                </td>
                <td>
                  <span className="qty">− 42 +</span>
                </td>
                <td>⋯</td>
              </tr>
              <tr>
                <td>☐</td>
                <td>
                  <span className="thumb t2" />
                  Graphic Tee
                  <span className="sub">GT-TEE-002</span>
                </td>
                <td>8</td>
                <td>2</td>
                <td>0</td>
                <td>
                  <span className="pill orange">Low stock</span>
                </td>
                <td>
                  <span className="qty">− 8 +</span>
                </td>
                <td>⋯</td>
              </tr>
              <tr>
                <td>☐</td>
                <td>
                  <span className="thumb t3" />
                  Canvas Tote
                  <span className="sub">CT-TOTE-003</span>
                </td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>
                  <span className="pill orange">Out of stock</span>
                </td>
                <td>
                  <span className="qty">− 0 +</span>
                </td>
                <td>⋯</td>
              </tr>
              <tr>
                <td>☐</td>
                <td>
                  <span className="thumb t4" />
                  Vintage Tee
                  <span className="sub">VT-TEE-004</span>
                </td>
                <td>16</td>
                <td>5</td>
                <td>0</td>
                <td>
                  <span className="pill green">In stock</span>
                </td>
                <td>
                  <span className="qty">− 16 +</span>
                </td>
                <td>⋯</td>
              </tr>
              <tr>
                <td>☐</td>
                <td>
                  <span className="thumb t5" />
                  Classic Cap
                  <span className="sub">CP-CAP-005</span>
                </td>
                <td>3</td>
                <td>1</td>
                <td>12</td>
                <td>
                  <span className="pill orange">Low stock</span>
                </td>
                <td>
                  <span className="qty">− 3 +</span>
                </td>
                <td>⋯</td>
              </tr>
              <tr>
                <td>☐</td>
                <td>
                  <span className="thumb t6" />
                  Utility Jacket
                  <span className="sub">UJ-JKT-006</span>
                </td>
                <td>0</td>
                <td>2</td>
                <td>25</td>
                <td>
                  <span className="pill orange">Out of stock</span>
                </td>
                <td>
                  <span className="qty">− 0 +</span>
                </td>
                <td>⋯</td>
              </tr>
              <tr>
                <td>☐</td>
                <td>
                  <span className="thumb t1" />
                  Crew Socks
                  <span className="sub">SK-SOC-007</span>
                </td>
                <td>128</td>
                <td>12</td>
                <td>0</td>
                <td>
                  <span className="pill green">In stock</span>
                </td>
                <td>
                  <span className="qty">− 128 +</span>
                </td>
                <td>⋯</td>
              </tr>
              <tr>
                <td>☐</td>
                <td>
                  <span className="thumb t2" />
                  Beanie
                  <span className="sub">BN-BEA-008</span>
                </td>
                <td>6</td>
                <td>0</td>
                <td>8</td>
                <td>
                  <span className="pill orange">Low stock</span>
                </td>
                <td>
                  <span className="qty">− 6 +</span>
                </td>
                <td>⋯</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="pager">
          <span>Showing 1–8 of 8 products</span>
          <button className="btn pri">Save changes</button>
        </div>
      </section>
    </DashboardLayout>
  );
}
