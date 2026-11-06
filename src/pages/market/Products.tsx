import DashboardLayout from "../../components/DashboardLayout";
import "./Products.css";

export default function MarketProducts() {
  return (
    <DashboardLayout
      kind="market"
      title={"Products"}
      subtitle={"Manage your product catalog across all brands in your store."}
      actions={
        <>
          <input className="search" placeholder="Search products, brands, SKU…" />
          <select className="search">
            <option>All brands</option>
          </select>
          <select className="search">
            <option>All categories</option>
          </select>
          <select className="search">
            <option>All statuses</option>
          </select>
          <button className="btn pri">+ Add product</button>
        </>
      }
    >
      <div className="split">
        <div>
          <div className="grid g4">
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Total products</span>
                <b>246</b>
                <span className="up">▲ 12%</span>
                {" "}
                <span>vs. previous 30 days</span>
              </div>
            </div>
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Active products</span>
                <b>228</b>
                <span className="up">▲ 14%</span>
                {" "}
                <span>vs. previous 30 days</span>
              </div>
            </div>
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Drafts</span>
                <b>12</b>
                <span className="up">▲ 33%</span>
                {" "}
                <span>vs. previous 30 days</span>
              </div>
            </div>
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Low stock</span>
                <b>8</b>
                <span className="up">▼ 47%</span>
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
                    <th>☐</th>
                    <th>Product</th>
                    <th>Brand</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Available</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                  <tr>
                    <td>☐</td>
                    <td>
                      <span className="thumb t1" />
                      Atelier Belle Knit Sweater
                      <span className="sub">Sweaters</span>
                    </td>
                    <td>
                      <span className="av" style={{background: "#5b6b4c"}}>AB</span>
                      Atelier Belle
                    </td>
                    <td>AB-KN-001</td>
                    <td>R128.00</td>
                    <td>38</td>
                    <td>
                      <span className="pill green">Active</span>
                    </td>
                    <td>
                      <button className="btn ">Edit</button>
                      {" "}
                      ⋯
                    </td>
                  </tr>
                  <tr>
                    <td>☐</td>
                    <td>
                      <span className="thumb t2" />
                      Linen Wide Leg Trousers
                      <span className="sub">Pants</span>
                    </td>
                    <td>
                      <span className="av" style={{background: "#a89480"}}>R</span>
                      Rivet & Thread
                    </td>
                    <td>RT-TR-002</td>
                    <td>R98.00</td>
                    <td>42</td>
                    <td>
                      <span className="pill green">Active</span>
                    </td>
                    <td>
                      <button className="btn ">Edit</button>
                      {" "}
                      ⋯
                    </td>
                  </tr>
                  <tr>
                    <td>☐</td>
                    <td>
                      <span className="thumb t3" />
                      Organic Cotton Shirt
                      <span className="sub">Shirts</span>
                    </td>
                    <td>
                      <span className="av" style={{background: "#6e6e6a"}}>LL</span>
                      Lines & Loom
                    </td>
                    <td>LL-SH-004</td>
                    <td>R86.00</td>
                    <td>56</td>
                    <td>
                      <span className="pill green">Active</span>
                    </td>
                    <td>
                      <button className="btn ">Edit</button>
                      {" "}
                      ⋯
                    </td>
                  </tr>
                  <tr>
                    <td>☐</td>
                    <td>
                      <span className="thumb t4" />
                      Canvas Jacket
                      <span className="sub">Outerwear</span>
                    </td>
                    <td>
                      <span className="av" style={{background: "#1a1a1a"}}>KA</span>
                      Kinfolk Atelier
                    </td>
                    <td>KA-JK-003</td>
                    <td>R142.00</td>
                    <td>21</td>
                    <td>
                      <span className="pill green">Active</span>
                    </td>
                    <td>
                      <button className="btn ">Edit</button>
                      {" "}
                      ⋯
                    </td>
                  </tr>
                  <tr>
                    <td>☐</td>
                    <td>
                      <span className="thumb t5" />
                      Moss & Maple Tee
                      <span className="sub">Tops</span>
                    </td>
                    <td>
                      <span className="av" style={{background: "#2f4a35"}}>MM</span>
                      Moss & Maple
                    </td>
                    <td>MM-TS-001</td>
                    <td>R54.00</td>
                    <td>87</td>
                    <td>
                      <span className="pill green">Active</span>
                    </td>
                    <td>
                      <button className="btn ">Edit</button>
                      {" "}
                      ⋯
                    </td>
                  </tr>
                  <tr>
                    <td>☐</td>
                    <td>
                      <span className="thumb t6" />
                      Linen Slip Dress
                      <span className="sub">Dresses</span>
                    </td>
                    <td>
                      <span className="av" style={{background: "#a89480"}}>R</span>
                      Rivet & Thread
                    </td>
                    <td>RT-DR-005</td>
                    <td>R118.00</td>
                    <td>19</td>
                    <td>
                      <span className="pill orange">Draft</span>
                    </td>
                    <td>
                      <button className="btn ">Edit</button>
                      {" "}
                      ⋯
                    </td>
                  </tr>
                  <tr>
                    <td>☐</td>
                    <td>
                      <span className="thumb t1" />
                      Ribbed Hoodie
                      <span className="sub">Sweatshirts</span>
                    </td>
                    <td>
                      <span className="av" style={{background: "#6e6e6a"}}>LL</span>
                      Lines & Loom
                    </td>
                    <td>LL-HD-007</td>
                    <td>R96.00</td>
                    <td>33</td>
                    <td>
                      <span className="pill green">Active</span>
                    </td>
                    <td>
                      <button className="btn ">Edit</button>
                      {" "}
                      ⋯
                    </td>
                  </tr>
                  <tr>
                    <td>☐</td>
                    <td>
                      <span className="thumb t2" />
                      Linen Shorts
                      <span className="sub">Shorts</span>
                    </td>
                    <td>
                      <span className="av" style={{background: "#5b6b4c"}}>AB</span>
                      Atelier Belle
                    </td>
                    <td>AB-SH-008</td>
                    <td>R72.00</td>
                    <td>12</td>
                    <td>
                      <span className="pill orange">Low stock</span>
                    </td>
                    <td>
                      <button className="btn ">Edit</button>
                      {" "}
                      ⋯
                    </td>
                  </tr>
                  <tr>
                    <td>☐</td>
                    <td>
                      <span className="thumb t3" />
                      Knit Cardigan
                      <span className="sub">Cardigans</span>
                    </td>
                    <td>
                      <span className="av" style={{background: "#1a1a1a"}}>KA</span>
                      Kinfolk Atelier
                    </td>
                    <td>KA-CD-006</td>
                    <td>R138.00</td>
                    <td>28</td>
                    <td>
                      <span className="pill green">Active</span>
                    </td>
                    <td>
                      <button className="btn ">Edit</button>
                      {" "}
                      ⋯
                    </td>
                  </tr>
                  <tr>
                    <td>☐</td>
                    <td>
                      <span className="thumb t4" />
                      Canvas Cap
                      <span className="sub">Accessories</span>
                    </td>
                    <td>
                      <span className="av" style={{background: "#2f4a35"}}>MM</span>
                      Moss & Maple
                    </td>
                    <td>MM-AC-010</td>
                    <td>R36.00</td>
                    <td>64</td>
                    <td>
                      <span className="pill orange">Draft</span>
                    </td>
                    <td>
                      <button className="btn ">Edit</button>
                      {" "}
                      ⋯
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="pager">
              <span>Showing 1–10 of 246 products</span>
              <span>
                <span className="on">1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </span>
            </div>
          </section>
        </div>
        <aside className="panel">
          <h3>
            Add product
            {" "}
            <span>✕</span>
          </h3>
          <b>Basic information</b>
          <br />
          <br />
          <div className="field">
            <label>Product name *</label>
            <input defaultValue={"e.g. Linen Knit Sweater"} />
          </div>
          <div className="field">
            <label>Brand *</label>
            <input defaultValue={"Select a brand ▾"} />
          </div>
          <div className="field">
            <label>Description *</label>
            <textarea defaultValue={"Describe your product, materials, fit, care, etc."} />
          </div>
          <label>
            <b>Images *</b>
          </label>
          <div className="drop">
            ⬆ Click to upload images
            <span className="sub">or drag and drop · JPG, PNG, WebP · Max 10MB each</span>
          </div>
          <b>Pricing & identifiers</b>
          <br />
          <br />
          <div className="grid g2">
            <div className="field">
              <label>Price *</label>
              <input defaultValue={"R 0.00"} />
            </div>
            <div className="field">
              <label>SKU *</label>
              <input defaultValue={"e.g. 12345-AB"} />
            </div>
          </div>
          <b>Variants</b>
          <br />
          <br />
          <button className="btn ">+ Add variant</button>
          <br />
          <br />
          <b>Inventory</b>
          <br />
          <br />
          <div className="field">
            <label>Available quantity *</label>
            <input defaultValue={"0"} />
          </div>
          <button className="btn pri full">Create product</button>
          <button className="btn full">Cancel</button>
        </aside>
      </div>
    </DashboardLayout>
  );
}
