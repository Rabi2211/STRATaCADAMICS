import DashboardLayout from "../../components/DashboardLayout";
import "./Purchases.css";

export default function StudioPurchases() {
  return (
    <DashboardLayout
      kind="studio"
      title={"Purchases"}
      subtitle={"Create purchase orders and manage supplier replenishment."}
      actions={
        <>
          <button className="btn pri">+ Create purchase order</button>
        </>
      }
    >
      <div className="split">
        <div>
          <div className="grid g3">
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Open purchase orders</span>
                <b>6</b>
                {" "}
                <span>Awaiting arrival or in transit</span>
              </div>
            </div>
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Units incoming</span>
                <b>1,480</b>
                {" "}
                <span>Across 6 purchase orders</span>
              </div>
            </div>
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Estimated cost</span>
                <b>R12,560</b>
                {" "}
                <span>Total value of open orders</span>
              </div>
            </div>
          </div>
          <section className="card ">
            <h3>Supplier purchase orders</h3>
            <input className="search" placeholder="Search PO number, supplier, or product…" />
            <div className="wrap">
              <table>
                <tbody>
                  <tr>
                    <th>PO #</th>
                    <th>Supplier</th>
                    <th>Products</th>
                    <th>Quantity</th>
                    <th>Expected arrival</th>
                    <th>Cost</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                  <tr>
                    <td>
                      <b>PO-1043</b>
                    </td>
                    <td>
                      New Punk Hoodie
                      <span className="sub">Los Angeles, CA</span>
                    </td>
                    <td>
                      <span className="thumb t1" />
                      3 products
                      <span className="sub">Hoodie, Tee, Cap</span>
                    </td>
                    <td>420 units</td>
                    <td>Apr 22, 2025</td>
                    <td>R2,840</td>
                    <td>
                      <span className="pill orange">Draft</span>
                    </td>
                    <td>👁 View ⋯</td>
                  </tr>
                  <tr>
                    <td>
                      <b>PO-1042</b>
                    </td>
                    <td>
                      Canvas Co.
                      <span className="sub">Los Angeles, CA</span>
                    </td>
                    <td>
                      <span className="thumb t2" />
                      2 products
                      <span className="sub">Tee, Hoodie</span>
                    </td>
                    <td>380 units</td>
                    <td>Apr 18, 2025</td>
                    <td>R2,412</td>
                    <td>
                      <span className="pill green">Ordered</span>
                    </td>
                    <td>👁 View ⋯</td>
                  </tr>
                  <tr>
                    <td>
                      <b>PO-1041</b>
                    </td>
                    <td>
                      Urban Tee Supply
                      <span className="sub">Chicago, IL</span>
                    </td>
                    <td>
                      <span className="thumb t3" />
                      1 product
                      <span className="sub">Tee</span>
                    </td>
                    <td>250 units</td>
                    <td>Apr 15, 2025</td>
                    <td>R1,520</td>
                    <td>
                      <span className="pill green">Ordered</span>
                    </td>
                    <td>👁 View ⋯</td>
                  </tr>
                  <tr>
                    <td>
                      <b>PO-1039</b>
                    </td>
                    <td>
                      Graphic Tee
                      <span className="sub">Toronto, CA</span>
                    </td>
                    <td>
                      <span className="thumb t4" />
                      2 products
                      <span className="sub">Tee, Hoodie</span>
                    </td>
                    <td>300 units</td>
                    <td>Apr 12, 2025</td>
                    <td>R2,060</td>
                    <td>
                      <span className="pill green">Received</span>
                    </td>
                    <td>👁 View ⋯</td>
                  </tr>
                  <tr>
                    <td>
                      <b>PO-1038</b>
                    </td>
                    <td>
                      Canvas Co.
                      <span className="sub">Los Angeles, CA</span>
                    </td>
                    <td>
                      <span className="thumb t5" />
                      1 product
                      <span className="sub">Tote</span>
                    </td>
                    <td>180 units</td>
                    <td>Apr 08, 2025</td>
                    <td>R1,080</td>
                    <td>
                      <span className="pill green">Received</span>
                    </td>
                    <td>👁 View ⋯</td>
                  </tr>
                  <tr>
                    <td>
                      <b>PO-1036</b>
                    </td>
                    <td>
                      New Punk Hoodie
                      <span className="sub">Los Angeles, CA</span>
                    </td>
                    <td>
                      <span className="thumb t6" />
                      2 products
                      <span className="sub">Hoodie, Tee</span>
                    </td>
                    <td>140 units</td>
                    <td>Apr 05, 2025</td>
                    <td>R980</td>
                    <td>
                      <span className="pill green">Received</span>
                    </td>
                    <td>👁 View ⋯</td>
                  </tr>
                  <tr>
                    <td>
                      <b>PO-1034</b>
                    </td>
                    <td>
                      Vintage Tee
                      <span className="sub">New York, NY</span>
                    </td>
                    <td>
                      <span className="thumb t1" />
                      1 product
                      <span className="sub">Tee</span>
                    </td>
                    <td>120 units</td>
                    <td>Mar 28, 2025</td>
                    <td>R760</td>
                    <td>
                      <span className="pill green">Received</span>
                    </td>
                    <td>👁 View ⋯</td>
                  </tr>
                  <tr>
                    <td>
                      <b>PO-1032</b>
                    </td>
                    <td>
                      Tag Hoodie
                      <span className="sub">Toronto, CA</span>
                    </td>
                    <td>
                      <span className="thumb t2" />
                      2 products
                      <span className="sub">Hoodie, Cap</span>
                    </td>
                    <td>90 units</td>
                    <td>Mar 22, 2025</td>
                    <td>R640</td>
                    <td>
                      <span className="pill green">Received</span>
                    </td>
                    <td>👁 View ⋯</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
        <aside className="panel">
          <h3>Incoming stock</h3>
          <span className="sub">Products from open purchase orders</span>
          <div className="ord">
            <span className="thumb t1" />
            <div>
              <b>New Punk Hoodie</b>
              <span className="sub">
                420 units
                <br />
                Arriving Apr 22, 2025
              </span>
            </div>
          </div>
          <div className="ord">
            <span className="thumb t2" />
            <div>
              <b>Canvas Tee</b>
              <span className="sub">
                380 units
                <br />
                Arriving Apr 18, 2025
              </span>
            </div>
          </div>
          <div className="ord">
            <span className="thumb t3" />
            <div>
              <b>Urban Tee</b>
              <span className="sub">
                250 units
                <br />
                Arriving Apr 15, 2025
              </span>
            </div>
          </div>
          <div className="ord">
            <span className="thumb t4" />
            <div>
              <b>Graphic Tee</b>
              <span className="sub">
                300 units
                <br />
                Arriving Apr 12, 2025
              </span>
            </div>
          </div>
          <div className="ord">
            <span className="thumb t5" />
            <div>
              <b>Canvas Tote</b>
              <span className="sub">
                180 units
                <br />
                Arriving Apr 08, 2025
              </span>
            </div>
          </div>
          <p className="sub">ⓘ Need to update a PO? You can edit quantities, change expected dates, or cancel an order before it ships.</p>
          <a href="#" style={{color: "var(--acc)"}}>Manage purchase orders →</a>
        </aside>
      </div>
    </DashboardLayout>
  );
}
