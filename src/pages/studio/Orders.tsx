import DashboardLayout from "../../components/DashboardLayout";
import "./Orders.css";

export default function StudioOrders() {
  return (
    <DashboardLayout
      kind="studio"
      title={"Orders"}
      subtitle={"Track orders, fulfill shipments, and keep your customers informed."}
      actions={
        <>
          <input className="search" placeholder="Search by order #, customer, or product…" />
          <button className="btn ">📅 Apr 1, 2025 – Apr 27, 2025 ▾</button>
        </>
      }
    >
      <div className="split">
        <div>
          <div className="tabs">
            <a href="#" className="on">All 48</a>
            <a href="#">Unfulfilled 12</a>
            <a href="#">Shipped 34</a>
            <a href="#">Preorders 6</a>
          </div>
          <div className="wrap">
            <table>
              <tbody>
                <tr>
                  <th>ORDER #</th>
                  <th>CUSTOMER</th>
                  <th>DATE</th>
                  <th>ITEMS</th>
                  <th>TOTAL</th>
                  <th>STATUS</th>
                </tr>
                <tr>
                  <td>
                    <b>#1043</b>
                  </td>
                  <td>
                    Jordan Mitchell
                    <span className="sub">jordan.mitchell@example.com</span>
                  </td>
                  <td>
                    Apr 22, 2025
                    <span className="sub">10:24 AM</span>
                  </td>
                  <td>
                    <span className="thumb t1" />
                    2 items
                  </td>
                  <td>R86.00</td>
                  <td>
                    <span className="pill orange">Unfulfilled</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>#1042</b>
                  </td>
                  <td>
                    Taylor Kim
                    <span className="sub">taylor.kim@example.com</span>
                  </td>
                  <td>
                    Apr 21, 2025
                    <span className="sub">4:17 PM</span>
                  </td>
                  <td>
                    <span className="thumb t2" />
                    3 items
                  </td>
                  <td>R142.00</td>
                  <td>
                    <span className="pill green">Shipped</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>#1041</b>
                  </td>
                  <td>
                    Riley Patel
                    <span className="sub">riley.patel@example.com</span>
                  </td>
                  <td>
                    Apr 20, 2025
                    <span className="sub">1:03 PM</span>
                  </td>
                  <td>
                    <span className="thumb t3" />
                    1 item
                  </td>
                  <td>R32.00</td>
                  <td>
                    <span className="pill green">Shipped</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>#1040</b>
                  </td>
                  <td>
                    Jamie Chen
                    <span className="sub">jamie.chen@example.com</span>
                  </td>
                  <td>
                    Apr 19, 2025
                    <span className="sub">11:28 AM</span>
                  </td>
                  <td>
                    <span className="thumb t4" />
                    2 items
                  </td>
                  <td>R68.00</td>
                  <td>
                    <span className="pill orange">Unfulfilled</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>#1039</b>
                  </td>
                  <td>
                    Morgan Lee
                    <span className="sub">morgan.lee@example.com</span>
                  </td>
                  <td>
                    Apr 18, 2025
                    <span className="sub">9:54 AM</span>
                  </td>
                  <td>
                    <span className="thumb t5" />
                    1 item
                  </td>
                  <td>R47.00</td>
                  <td>
                    <span className="pill green">Shipped</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>#1038</b>
                  </td>
                  <td>
                    Casey Rivera
                    <span className="sub">casey.rivera@example.com</span>
                  </td>
                  <td>
                    Apr 17, 2025
                    <span className="sub">3:12 PM</span>
                  </td>
                  <td>
                    <span className="thumb t6" />
                    1 item
                  </td>
                  <td>R58.00</td>
                  <td>
                    <span className="pill green">Shipped</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>#1037</b>
                  </td>
                  <td>
                    Jamie Ortiz
                    <span className="sub">jamie.ortiz@example.com</span>
                  </td>
                  <td>
                    Apr 16, 2025
                    <span className="sub">6:45 PM</span>
                  </td>
                  <td>
                    <span className="thumb t1" />
                    2 items
                  </td>
                  <td>R76.00</td>
                  <td>
                    <span className="pill blue">Preorder</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>#1036</b>
                  </td>
                  <td>
                    Avery Brooks
                    <span className="sub">avery.brooks@example.com</span>
                  </td>
                  <td>
                    Apr 15, 2025
                    <span className="sub">12:20 PM</span>
                  </td>
                  <td>
                    <span className="thumb t2" />
                    1 item
                  </td>
                  <td>R40.00</td>
                  <td>
                    <span className="pill green">Shipped</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>#1035</b>
                  </td>
                  <td>
                    Quinn Davis
                    <span className="sub">quinn.davis@example.com</span>
                  </td>
                  <td>
                    Apr 14, 2025
                    <span className="sub">8:33 AM</span>
                  </td>
                  <td>
                    <span className="thumb t3" />
                    3 items
                  </td>
                  <td>R109.00</td>
                  <td>
                    <span className="pill orange">Unfulfilled</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>#1034</b>
                  </td>
                  <td>
                    Parker Wells
                    <span className="sub">parker.wells@example.com</span>
                  </td>
                  <td>
                    Apr 13, 2025
                    <span className="sub">2:11 PM</span>
                  </td>
                  <td>
                    <span className="thumb t4" />
                    1 item
                  </td>
                  <td>R32.00</td>
                  <td>
                    <span className="pill green">Shipped</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="pager">
            <span>Showing 1–10 of 48 orders</span>
            <span>
              <span className="on">1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </span>
          </div>
        </div>
        <aside className="panel">
          <h3>
            Order #1043
            {" "}
            <span className="pill orange">Unfulfilled</span>
            {" "}
            <span>✕</span>
          </h3>
          <span className="sub">Placed Apr 22, 2025 · 10:24 AM</span>
          <br />
          <h3>
            Customer
            {" "}
            <button className="btn ">View customer ↗</button>
          </h3>
          Jordan Mitchell
          <span className="sub">
            jordan.mitchell@example.com
            <br />
            318 Maple Ave, Austin, TX 78701
          </span>
          <br />
          <h3>Order items</h3>
          <div className="row">
            <span>
              <span className="thumb t1" />
              New Punk Hoodie
              <span className="sub">Heather Gray · M</span>
            </span>
            <b>R68.00</b>
          </div>
          <div className="row">
            <span>
              <span className="thumb t2" />
              Graphic Tee
              <span className="sub">Sand · L</span>
            </span>
            <b>R18.00</b>
          </div>
          <div className="row">
            <span>Subtotal</span>
            <span>R86.00</span>
          </div>
          <div className="row">
            <span>Shipping</span>
            <span>R7.50</span>
          </div>
          <div className="row">
            <b>Total</b>
            <b>R93.50</b>
          </div>
          <br />
          <h3>Shipping method</h3>
          <div className="row">
            <span className="sub">Standard Shipping (3–7 business days)</span>
            <span>R7.50</span>
          </div>
          <h3>Tracking number</h3>
          <div className="tools">
            <input className="search" placeholder="e.g. 1Z12345E0205271684" />
            <button className="btn pri">Add tracking number</button>
          </div>
          <button className="btn pri full">Mark shipped</button>
        </aside>
      </div>
    </DashboardLayout>
  );
}
