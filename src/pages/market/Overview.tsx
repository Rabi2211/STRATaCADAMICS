import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { fetchBrands, fetchProducts, mapApiProduct, type ApiBrand } from "../../lib/store-api";
import "./Overview.css";

export default function MarketOverview() {
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
        if (active) {
          console.error("Unable to load market overview", error);
        }
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  const grossSales = products.reduce((sum, product) => sum + Number(product.price) * Number(product.available), 0);
  const totalOrders = products.reduce((sum, product) => sum + Math.max(4, Math.round(product.available * 0.18)), 0);
  const productViews = products.length * 1640;

  return (
    <DashboardLayout
      kind="market"
      title={"Store overview"}
      subtitle={"Manage your entire store — brands, products, orders, inventory and more from one owner account."}
      actions={
        <>
          <button className="btn ">📅 Apr 20, 2025 – May 20, 2025 ▾</button>
          🔔
          <Link to="/" className="btn pri">View storefront ↗</Link>
        </>
      }
    >
      <div className="grid g5">
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
            <span>Active brands</span>
            <b>{brands.length}</b>
            –
            {" "}
            <span>vs. previous 30 days</span>
          </div>
        </div>
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Products</span>
            <b>{products.length}</b>
            <span className="up">▲ 9%</span>
            {" "}
            <span>vs. previous 30 days</span>
          </div>
        </div>
      </div>
      <div className="grid g32">
        <div className="stack">
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
              Orders needing attention
              <a href="#">View all orders →</a>
            </h3>
            <div className="wrap">
              <table>
                <tbody>
                  <tr>
                    <th>Order #</th>
                    <th>Brand</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                  <tr>
                    <td>#STR-10432</td>
                    <td>
                      <span className="av" style={{background: "#2f4a35"}}>MM</span>
                      Moss & Maple
                    </td>
                    <td>
                      Taylor Brooks
                      <span className="sub">taylor.brooks@example.com</span>
                    </td>
                    <td>R128.00</td>
                    <td>
                      <span className="pill orange">Processing</span>
                    </td>
                    <td>
                      <button className="btn ">View order</button>
                    </td>
                  </tr>
                  <tr>
                    <td>#STR-10431</td>
                    <td>
                      <span className="av" style={{background: "#a89480"}}>R</span>
                      Rivet & Thread
                    </td>
                    <td>
                      Jordan Lee
                      <span className="sub">jordan.lee@example.com</span>
                    </td>
                    <td>R86.50</td>
                    <td>
                      <span className="pill green">Paid</span>
                    </td>
                    <td>
                      <button className="btn ">View order</button>
                    </td>
                  </tr>
                  <tr>
                    <td>#STR-10429</td>
                    <td>
                      <span className="av" style={{background: "#5b6b4c"}}>AB</span>
                      Atelier Belle
                    </td>
                    <td>
                      Casey Nguyen
                      <span className="sub">casey.nguyen@example.com</span>
                    </td>
                    <td>R176.00</td>
                    <td>
                      <span className="pill green">Shipped</span>
                    </td>
                    <td>
                      <button className="btn ">View order</button>
                    </td>
                  </tr>
                  <tr>
                    <td>#STR-10426</td>
                    <td>
                      <span className="av" style={{background: "#6e6e6a"}}>LL</span>
                      Lines & Loom
                    </td>
                    <td>
                      Morgan Patel
                      <span className="sub">morgan.patel@example.com</span>
                    </td>
                    <td>R94.20</td>
                    <td>
                      <span className="pill orange">Processing</span>
                    </td>
                    <td>
                      <button className="btn ">View order</button>
                    </td>
                  </tr>
                  <tr>
                    <td>#STR-10423</td>
                    <td>
                      <span className="av" style={{background: "#1a1a1a"}}>KA</span>
                      Kinfolk Atelier
                    </td>
                    <td>
                      Riley Carter
                      <span className="sub">riley.carter@example.com</span>
                    </td>
                    <td>R142.00</td>
                    <td>
                      <span className="pill green">Paid</span>
                    </td>
                    <td>
                      <button className="btn ">View order</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          <section className="card ">
            <h3>Quick actions</h3>
            <div className="grid g3">
              <div className="qa">
                <b>Add brand</b>
                <span>Bring a new brand to the marketplace</span>
              </div>
              <div className="qa">
                <b>Add product</b>
                <span>List a product from any brand</span>
              </div>
              <div className="qa">
                <b>Write blog post</b>
                <span>Share news, stories or updates</span>
              </div>
            </div>
          </section>
        </div>
        <div className="stack">
          <section className="card ">
            <h3>Brand performance</h3>
            <div className="wrap">
              <table>
                <tbody>
                  <tr>
                    <th>#</th>
                    <th>Brand</th>
                    <th>Sales</th>
                    <th>Orders</th>
                    <th>Products</th>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>
                      <span className="av" style={{background: "#5b6b4c"}}>AB</span>
                      Atelier Belle
                    </td>
                    <td>R12,480</td>
                    <td>186</td>
                    <td>42</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>
                      <span className="av" style={{background: "#6e6e6a"}}>LL</span>
                      Lines & Loom
                    </td>
                    <td>R8,920</td>
                    <td>132</td>
                    <td>36</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>
                      <span className="av" style={{background: "#2f4a35"}}>MM</span>
                      Moss & Maple
                    </td>
                    <td>R7,620</td>
                    <td>98</td>
                    <td>28</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>
                      <span className="av" style={{background: "#a89480"}}>R</span>
                      Rivet & Thread
                    </td>
                    <td>R6,340</td>
                    <td>76</td>
                    <td>26</td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>
                      <span className="av" style={{background: "#1a1a1a"}}>KA</span>
                      Kinfolk Atelier
                    </td>
                    <td>R5,980</td>
                    <td>64</td>
                    <td>24</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          <section className="card ">
            <h3>
              Low stock / inventory alerts
              <a href="#">View all inventory →</a>
            </h3>
            <div className="wrap">
              <table>
                <tbody>
                  <tr>
                    <th>Brand</th>
                    <th>Product</th>
                    <th>Available</th>
                  </tr>
                  <tr>
                    <td>
                      <span className="av" style={{background: "#2f4a35"}}>MM</span>
                      Moss & Maple
                    </td>
                    <td>
                      <span className="thumb t1" />
                      Linen Knit Sweater
                      <span className="sub">Size M</span>
                    </td>
                    <td>4</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="av" style={{background: "#a89480"}}>R</span>
                      Rivet & Thread
                    </td>
                    <td>
                      <span className="thumb t2" />
                      Wide Leg Trousers
                      <span className="sub">Size S</span>
                    </td>
                    <td>7</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="av" style={{background: "#5b6b4c"}}>AB</span>
                      Atelier Belle
                    </td>
                    <td>
                      <span className="thumb t3" />
                      Leather Crossbody Bag
                      <span className="sub">One size</span>
                    </td>
                    <td>9</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="av" style={{background: "#6e6e6a"}}>LL</span>
                      Lines & Loom
                    </td>
                    <td>
                      <span className="thumb t4" />
                      Organic Cotton Tee
                      <span className="sub">Size L</span>
                    </td>
                    <td>12</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="av" style={{background: "#1a1a1a"}}>KA</span>
                      Kinfolk Atelier
                    </td>
                    <td>
                      <span className="thumb t5" />
                      Canvas Jacket
                      <span className="sub">Size M</span>
                    </td>
                    <td>14</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          <section className="card ">
            <h3>
              Latest blog posts
              <a href="#">Manage blog →</a>
            </h3>
            <div className="ord">
              <span className="thumb t1" />
              <div>
                <b>Spring Style Edit: 5 Looks We Love</b>
                <span className="sub">May 18, 2025 · 3 min read</span>
              </div>
            </div>
            <div className="ord">
              <span className="thumb t2" />
              <div>
                <b>Meet the Makers: Rivet & Thread</b>
                <span className="sub">May 15, 2025 · 4 min read</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
