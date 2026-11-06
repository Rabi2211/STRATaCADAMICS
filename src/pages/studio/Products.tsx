import DashboardLayout from "../../components/DashboardLayout";
import "./Products.css";

export default function StudioProducts() {
  return (
    <DashboardLayout
      kind="studio"
      title={"Products"}
      subtitle={"Manage your product catalog and keep your store up to date."}
      actions={
        <>
          <button className="btn pri">+ Add product</button>
        </>
      }
    >
      <div className="tools">
        <input className="search" placeholder="Search products…" />
        <select className="search">
          <option>All categories</option>
        </select>
        <select className="search">
          <option>All status</option>
        </select>
        <button className="btn ">⚲</button>
      </div>
      <section className="card ">
        <h3 />
        <div className="wrap">
          <table>
            <tbody>
              <tr>
                <th>PRODUCT</th>
                <th>SKU</th>
                <th>PRICE</th>
                <th>AVAILABLE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
              <tr>
                <td>
                  <span className="thumb t1" />
                  <b>Graphic Tee</b>
                  <span className="sub">Unisex heavyweight tee</span>
                </td>
                <td>GT-TEE-002</td>
                <td>R32.00</td>
                <td>128</td>
                <td>
                  <span className="pill green">Active</span>
                </td>
                <td>✎ Edit &nbsp; ⋯</td>
              </tr>
              <tr>
                <td>
                  <span className="thumb t2" />
                  <b>Hoodie</b>
                  <span className="sub">Classic pullover hoodie</span>
                </td>
                <td>NP-HOOD-001</td>
                <td>R68.00</td>
                <td>42</td>
                <td>
                  <span className="pill green">Active</span>
                </td>
                <td>✎ Edit &nbsp; ⋯</td>
              </tr>
              <tr>
                <td>
                  <span className="thumb t3" />
                  <b>Tote Bag</b>
                  <span className="sub">Canvas tote with logo</span>
                </td>
                <td>CT-TOTE-003</td>
                <td>R22.00</td>
                <td>76</td>
                <td>
                  <span className="pill orange">Draft</span>
                </td>
                <td>✎ Edit &nbsp; ⋯</td>
              </tr>
              <tr>
                <td>
                  <span className="thumb t4" />
                  <b>Crewneck Sweatshirt</b>
                  <span className="sub">Premium fleece crewneck</span>
                </td>
                <td>SW-CRW-004</td>
                <td>R58.00</td>
                <td>34</td>
                <td>
                  <span className="pill blue">Preorder</span>
                </td>
                <td>✎ Edit &nbsp; ⋯</td>
              </tr>
              <tr>
                <td>
                  <span className="thumb t5" />
                  <b>Logo Cap</b>
                  <span className="sub">Embroidered 6-panel cap</span>
                </td>
                <td>AC-CAP-005</td>
                <td>R28.00</td>
                <td>60</td>
                <td>
                  <span className="pill green">Active</span>
                </td>
                <td>✎ Edit &nbsp; ⋯</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="pager">
          <span>Showing 1–5 of 5 products</span>
          <span>
            <span className="on">1</span>
          </span>
        </div>
      </section>
    </DashboardLayout>
  );
}
