import DashboardLayout from "../../components/DashboardLayout";
import "./Inventory.css";

export default function MarketInventory() {
  return (
    <DashboardLayout
      kind="market"
      title={"Inventory"}
      subtitle={"Manage stock levels for all products across your brands."}
      actions={
        <>
          <input className="search" placeholder="Search products, brands or SKU…" />
          <select className="search">
            <option>All brands</option>
          </select>
          <select className="search">
            <option>All stock status</option>
          </select>
          <button className="btn pri">Export ⬆</button>
        </>
      }
    >
      <div className="grid g3">
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Total units in stock</span>
            <b>8,642</b>
            <span className="up">▲ 12%</span>
            {" "}
            <span>Across 6 brands</span>
          </div>
        </div>
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Low stock (≤ 10 units)</span>
            <b>214</b>
            <span className="up">▼ -28%</span>
            {" "}
            <span>Across 6 brands</span>
          </div>
        </div>
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Out of stock</span>
            <b>63</b>
            <span className="up">▼ -46%</span>
            {" "}
            <span>Across 6 brands</span>
          </div>
        </div>
      </div>
      <div className="grid g21">
        <section className="card ">
          <h3 />
          <div className="wrap">
            <table>
              <tbody>
                <tr>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>SKU</th>
                  <th>Available</th>
                  <th>Committed</th>
                  <th>Status</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
                <tr>
                  <td>
                    <span className="thumb t1" />
                    Atelier Belle Jacket
                    <span className="sub">Size M · Beige</span>
                  </td>
                  <td>
                    <span className="av" style={{background: "#5b6b4c"}}>AB</span>
                    Atelier Belle
                  </td>
                  <td>AB-JK-001-M</td>
                  <td>42</td>
                  <td>3</td>
                  <td>
                    <span className="pill green">In stock</span>
                  </td>
                  <td>
                    <span className="qty">− 42 +</span>
                  </td>
                  <td>⋮</td>
                </tr>
                <tr>
                  <td>
                    <span className="thumb t2" />
                    Lines & Loom Tee
                    <span className="sub">Size L · White</span>
                  </td>
                  <td>
                    <span className="av" style={{background: "#6e6e6a"}}>LL</span>
                    Lines & Loom
                  </td>
                  <td>LL-TS-004-L</td>
                  <td>132</td>
                  <td>8</td>
                  <td>
                    <span className="pill green">In stock</span>
                  </td>
                  <td>
                    <span className="qty">− 132 +</span>
                  </td>
                  <td>⋮</td>
                </tr>
                <tr>
                  <td>
                    <span className="thumb t3" />
                    Moss & Maple Knit
                    <span className="sub">Size S · Rust</span>
                  </td>
                  <td>
                    <span className="av" style={{background: "#2f4a35"}}>MM</span>
                    Moss & Maple
                  </td>
                  <td>MM-KN-002-S</td>
                  <td>8</td>
                  <td>2</td>
                  <td>
                    <span className="pill orange">Low stock</span>
                  </td>
                  <td>
                    <span className="qty">− 8 +</span>
                  </td>
                  <td>⋮</td>
                </tr>
                <tr>
                  <td>
                    <span className="thumb t4" />
                    Rivet & Thread Shirt
                    <span className="sub">Size M · Oat</span>
                  </td>
                  <td>
                    <span className="av" style={{background: "#a89480"}}>R</span>
                    Rivet & Thread
                  </td>
                  <td>RT-SH-007-M</td>
                  <td>76</td>
                  <td>5</td>
                  <td>
                    <span className="pill green">In stock</span>
                  </td>
                  <td>
                    <span className="qty">− 76 +</span>
                  </td>
                  <td>⋮</td>
                </tr>
                <tr>
                  <td>
                    <span className="thumb t5" />
                    Kinfolk Atelier Sweater
                    <span className="sub">Size L · Black</span>
                  </td>
                  <td>
                    <span className="av" style={{background: "#1a1a1a"}}>KA</span>
                    Kinfolk Atelier
                  </td>
                  <td>KA-SW-010-L</td>
                  <td>64</td>
                  <td>4</td>
                  <td>
                    <span className="pill green">In stock</span>
                  </td>
                  <td>
                    <span className="qty">− 64 +</span>
                  </td>
                  <td>⋮</td>
                </tr>
                <tr>
                  <td>
                    <span className="thumb t6" />
                    Leather Crossbody Bag
                    <span className="sub">One size · Tan</span>
                  </td>
                  <td>
                    <span className="av" style={{background: "#5b6b4c"}}>AB</span>
                    Atelier Belle
                  </td>
                  <td>AB-BG-003-OS</td>
                  <td>9</td>
                  <td>1</td>
                  <td>
                    <span className="pill orange">Low stock</span>
                  </td>
                  <td>
                    <span className="qty">− 9 +</span>
                  </td>
                  <td>⋮</td>
                </tr>
                <tr>
                  <td>
                    <span className="thumb t1" />
                    Organic Cotton Tee
                    <span className="sub">Size L · Black</span>
                  </td>
                  <td>
                    <span className="av" style={{background: "#6e6e6a"}}>LL</span>
                    Lines & Loom
                  </td>
                  <td>LL-TS-008-L</td>
                  <td>12</td>
                  <td>0</td>
                  <td>
                    <span className="pill green">In stock</span>
                  </td>
                  <td>
                    <span className="qty">− 12 +</span>
                  </td>
                  <td>⋮</td>
                </tr>
                <tr>
                  <td>
                    <span className="thumb t2" />
                    Canvas Jacket
                    <span className="sub">Size M · Black</span>
                  </td>
                  <td>
                    <span className="av" style={{background: "#1a1a1a"}}>KA</span>
                    Kinfolk Atelier
                  </td>
                  <td>KA-CJ-005-M</td>
                  <td>14</td>
                  <td>2</td>
                  <td>
                    <span className="pill green">In stock</span>
                  </td>
                  <td>
                    <span className="qty">− 14 +</span>
                  </td>
                  <td>⋮</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="sub">Showing 1–8 of 8 products</p>
        </section>
        <div className="stack">
          <section className="card ">
            <h3>
              Stock alerts
              <a href="#">View all →</a>
            </h3>
            <div className="row">
              <b>Moss & Maple</b>
              <span className="sub">3 alerts</span>
            </div>
            <div className="row">
              <span>Knit Sweater (S)</span>
              <span style={{color: "var(--acc)"}}>8 left</span>
            </div>
            <div className="row">
              <span>Tote Bag (One size)</span>
              <span style={{color: "var(--acc)"}}>5 left</span>
            </div>
            <div className="row">
              <span>Cap (One size)</span>
              <span style={{color: "var(--acc)"}}>2 left</span>
            </div>
            <div className="row">
              <b>Rivet & Thread</b>
              <span className="sub">2 alerts</span>
            </div>
            <div className="row">
              <span>Shirt (M)</span>
              <span style={{color: "var(--acc)"}}>9 left</span>
            </div>
            <div className="row">
              <span>Jeans (32)</span>
              <span style={{color: "var(--acc)"}}>6 left</span>
            </div>
            <div className="row">
              <b>Atelier Belle</b>
              <span className="sub">2 alerts</span>
            </div>
            <div className="row">
              <span>Leather Bag (One size)</span>
              <span style={{color: "var(--acc)"}}>9 left</span>
            </div>
            <div className="row">
              <span>Slip Dress (S)</span>
              <span style={{color: "var(--acc)"}}>4 left</span>
            </div>
            <div className="row">
              <b>Lines & Loom</b>
              <span className="sub">1 alert</span>
            </div>
            <div className="row">
              <span>Tee (L)</span>
              <span style={{color: "var(--acc)"}}>2 left</span>
            </div>
            <div className="row">
              <b>Kinfolk Atelier</b>
              <span className="sub">1 alert</span>
            </div>
            <div className="row">
              <span>Sweater (L)</span>
              <span style={{color: "var(--acc)"}}>4 left</span>
            </div>
          </section>
          <button className="btn full">Adjust stock</button>
          <button className="btn pri full">✓ Save changes</button>
        </div>
      </div>
    </DashboardLayout>
  );
}
