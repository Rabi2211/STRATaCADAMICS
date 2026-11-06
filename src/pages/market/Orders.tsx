import DashboardLayout from "../../components/DashboardLayout";
import "./Orders.css";

export default function MarketOrders() {
  return (
    <DashboardLayout
      kind="market"
      title={"Orders"}
      subtitle={"Manage orders from all marketplace brands in one place."}
      actions={
        <>
          <button className="btn ">📅 Apr 20, 2025 – May 20, 2025 ▾</button>
          🔔
          <button className="btn pri">View storefront ↗</button>
        </>
      }
    >
      <div className="split">
        <div>
          <input className="search" placeholder="Search by order number, customer, or brand…" />
          <br />
          <br />
          <div className="tabs">
            <a href="#" className="on">All 248</a>
            <a href="#">Unfulfilled 46</a>
            <a href="#">Shipped 178</a>
            <a href="#">Cancelled 24</a>
          </div>
          <div className="grid g2">
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Total orders</span>
                <b>248</b>
                <span className="up">▲ 12%</span>
                {" "}
                <span>vs. previous 30 days</span>
              </div>
            </div>
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Awaiting shipment</span>
                <b>46</b>
                <span className="up">▲ 18%</span>
                {" "}
                <span>vs. previous 30 days</span>
              </div>
            </div>
          </div>
          <section className="card ">
            <h3 />
            <div className="wrap">
              <table>
                <tbody>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Brand(s)</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Fulfillment</th>
                    <th>Action</th>
                  </tr>
                  <tr>
                    <td>#STR-10432</td>
                    <td>
                      Taylor Brooks
                      <span className="sub">taylor.brooks@example.com</span>
                    </td>
                    <td>
                      <span className="av" style={{background: "#2f4a35"}}>MM</span>
                      Moss & Maple
                    </td>
                    <td>
                      May 20, 2025
                      <span className="sub">10:24 AM</span>
                    </td>
                    <td>R128.00</td>
                    <td>
                      <span className="pill green">Shipped</span>
                    </td>
                    <td>
                      <button className="btn ">View</button>
                    </td>
                  </tr>
                  <tr>
                    <td>#STR-10431</td>
                    <td>
                      Jordan Lee
                      <span className="sub">jordan.lee@example.com</span>
                    </td>
                    <td>
                      <span className="av" style={{background: "#a89480"}}>R</span>
                      Rivet & Thread
                    </td>
                    <td>
                      May 20, 2025
                      <span className="sub">09:17 AM</span>
                    </td>
                    <td>R86.50</td>
                    <td>
                      <span className="pill orange">Processing</span>
                    </td>
                    <td>
                      <button className="btn ">View</button>
                    </td>
                  </tr>
                  <tr>
                    <td>#STR-10429</td>
                    <td>
                      Casey Nguyen
                      <span className="sub">casey.nguyen@example.com</span>
                    </td>
                    <td>
                      <span className="av" style={{background: "#5b6b4c"}}>AB</span>
                      Atelier Belle
                    </td>
                    <td>
                      May 19, 2025
                      <span className="sub">04:42 PM</span>
                    </td>
                    <td>R176.00</td>
                    <td>
                      <span className="pill green">Paid</span>
                    </td>
                    <td>
                      <button className="btn ">View</button>
                    </td>
                  </tr>
                  <tr>
                    <td>#STR-10426</td>
                    <td>
                      Morgan Patel
                      <span className="sub">morgan.patel@example.com</span>
                    </td>
                    <td>
                      <span className="av" style={{background: "#6e6e6a"}}>LL</span>
                      Lines & Loom
                    </td>
                    <td>
                      May 19, 2025
                      <span className="sub">02:31 PM</span>
                    </td>
                    <td>R94.20</td>
                    <td>
                      <span className="pill orange">Processing</span>
                    </td>
                    <td>
                      <button className="btn ">View</button>
                    </td>
                  </tr>
                  <tr>
                    <td>#STR-10423</td>
                    <td>
                      Riley Carter
                      <span className="sub">riley.carter@example.com</span>
                    </td>
                    <td>
                      <span className="av" style={{background: "#1a1a1a"}}>KA</span>
                      Kinfolk Atelier
                    </td>
                    <td>
                      May 18, 2025
                      <span className="sub">11:15 AM</span>
                    </td>
                    <td>R142.00</td>
                    <td>
                      <span className="pill green">Paid</span>
                    </td>
                    <td>
                      <button className="btn ">View</button>
                    </td>
                  </tr>
                  <tr>
                    <td>#STR-10420</td>
                    <td>
                      Avery Johnson
                      <span className="sub">avery.johnson@example.com</span>
                    </td>
                    <td>
                      <span className="av" style={{background: "#6e6e6a"}}>LL</span>
                      Lines & Loom
                    </td>
                    <td>
                      May 17, 2025
                      <span className="sub">03:28 PM</span>
                    </td>
                    <td>R67.50</td>
                    <td>
                      <span className="pill green">Shipped</span>
                    </td>
                    <td>
                      <button className="btn ">View</button>
                    </td>
                  </tr>
                  <tr>
                    <td>#STR-10418</td>
                    <td>
                      Quinn Davis
                      <span className="sub">quinn.davis@example.com</span>
                    </td>
                    <td>
                      <span className="av" style={{background: "#2f4a35"}}>MM</span>
                      Moss & Maple
                    </td>
                    <td>
                      May 17, 2025
                      <span className="sub">11:03 AM</span>
                    </td>
                    <td>R212.00</td>
                    <td>
                      <span className="pill ">Cancelled</span>
                    </td>
                    <td>
                      <button className="btn ">View</button>
                    </td>
                  </tr>
                  <tr>
                    <td>#STR-10416</td>
                    <td>
                      Jamie Wilson
                      <span className="sub">jamie.wilson@example.com</span>
                    </td>
                    <td>
                      <span className="av" style={{background: "#a89480"}}>R</span>
                      Rivet & Thread
                    </td>
                    <td>
                      May 16, 2025
                      <span className="sub">04:21 PM</span>
                    </td>
                    <td>R73.80</td>
                    <td>
                      <span className="pill green">Paid</span>
                    </td>
                    <td>
                      <button className="btn ">View</button>
                    </td>
                  </tr>
                  <tr>
                    <td>#STR-10412</td>
                    <td>
                      Skylar Martinez
                      <span className="sub">skylar.martinez@example.com</span>
                    </td>
                    <td>
                      <span className="av" style={{background: "#5b6b4c"}}>AB</span>
                      Atelier Belle
                    </td>
                    <td>
                      May 16, 2025
                      <span className="sub">10:57 AM</span>
                    </td>
                    <td>R118.40</td>
                    <td>
                      <span className="pill green">Shipped</span>
                    </td>
                    <td>
                      <button className="btn ">View</button>
                    </td>
                  </tr>
                  <tr>
                    <td>#STR-10408</td>
                    <td>
                      Reese Taylor
                      <span className="sub">reese.taylor@example.com</span>
                    </td>
                    <td>
                      <span className="av" style={{background: "#1a1a1a"}}>KA</span>
                      Kinfolk Atelier
                    </td>
                    <td>
                      May 15, 2025
                      <span className="sub">01:12 PM</span>
                    </td>
                    <td>R159.00</td>
                    <td>
                      <span className="pill orange">Processing</span>
                    </td>
                    <td>
                      <button className="btn ">View</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
        <aside className="panel">
          <h3>
            ← Order #STR-10432
            {" "}
            <span className="pill green">Shipped</span>
          </h3>
          <h3>Customer</h3>
          Taylor Brooks
          <span className="sub">
            taylor@example.com
            <br />
            742 Oak Ridge Drive, Austin, TX 78704, United States
          </span>
          <br />
          <h3>Ordered items (3)</h3>
          <div className="ord">
            <span className="thumb t1" />
            <div style={{flex: "1"}}>
              <b>Linen Knit Sweater</b>
              <span className="sub">
                Moss & Maple
                <br />
                Size M · Sand
              </span>
            </div>
            <span>
              x1
              <br />
              <b>R62.00</b>
            </span>
          </div>
          <div className="ord">
            <span className="thumb t2" />
            <div style={{flex: "1"}}>
              <b>Leather Crossbody Bag</b>
              <span className="sub">
                Rivet & Thread
                <br />
                One Size · Cognac
              </span>
            </div>
            <span>
              x1
              <br />
              <b>R54.00</b>
            </span>
          </div>
          <div className="ord">
            <span className="thumb t3" />
            <div style={{flex: "1"}}>
              <b>Canvas Jacket</b>
              <span className="sub">
                Kinfolk Atelier
                <br />
                Size M · Charcoal
              </span>
            </div>
            <span>
              x1
              <br />
              <b>R68.00</b>
            </span>
          </div>
          <h3>Shipping</h3>
          <div className="field">
            <label>Carrier</label>
            <input defaultValue={"USPS ▾"} />
          </div>
          <div className="field">
            <label>Tracking number</label>
            <input defaultValue={"9400111899223887654321"} />
          </div>
          <span className="sub">Enter tracking number to mark as shipped.</span>
          <button className="btn pri full">Mark shipped</button>
          <div className="acts" style={{marginTop: "8px"}}>
            <button className="btn ">Save changes</button>
            <a href="#" style={{color: "var(--acc)"}}>Cancel</a>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}
