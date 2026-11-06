import DashboardLayout from "../../components/DashboardLayout";
import "./Blog.css";

export default function MarketBlog() {
  return (
    <DashboardLayout
      kind="market"
      title={"Blog"}
      subtitle={"Share your story, showcase new collections, and grow your brand."}
      actions={
        <>
          <button className="btn pri">✎ Write a post</button>
        </>
      }
    >
      <div className="split">
        <div>
          <div className="tabs">
            <a href="#" className="on">All posts</a>
            <a href="#">Published</a>
            <a href="#">Drafts</a>
          </div>
          <div className="tools">
            <input className="search" placeholder="Search posts by title or author…" />
            <select className="search">
              <option>All categories</option>
            </select>
            <select className="search">
              <option>All status</option>
            </select>
          </div>
          <div className="grid g21">
            <section className="card ">
              <h3 />
              <div className="wrap">
                <table>
                  <tbody>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                    <tr>
                      <td>
                        <span className="thumb t1" />
                        <b>The Art of Modern Layering for Spring</b>
                        <span className="sub">Taylor Brooks · May 18, 2025</span>
                      </td>
                      <td>
                        <span className="pill orange">Style Guide</span>
                      </td>
                      <td>
                        <span className="pill green">Published</span>
                      </td>
                      <td>
                        <button className="btn ">Edit</button>
                        {" "}
                        <button className="btn ">Preview</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="thumb t2" />
                        <b>Sustainable Fabrics, Lasting Wardrobes</b>
                        <span className="sub">Jordan Lee · May 15, 2025</span>
                      </td>
                      <td>
                        <span className="pill orange">Sustainability</span>
                      </td>
                      <td>
                        <span className="pill green">Published</span>
                      </td>
                      <td>
                        <button className="btn ">Edit</button>
                        {" "}
                        <button className="btn ">Preview</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="thumb t3" />
                        <b>Five Emerging Brands to Watch This Season</b>
                        <span className="sub">Casey Nguyen · May 12, 2025</span>
                      </td>
                      <td>
                        <span className="pill orange">Brand News</span>
                      </td>
                      <td>
                        <span className="pill green">Published</span>
                      </td>
                      <td>
                        <button className="btn ">Edit</button>
                        {" "}
                        <button className="btn ">Preview</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="thumb t4" />
                        <b>Why Linen Is the Ultimate Summer Fabric</b>
                        <span className="sub">Morgan Patel · May 9, 2025</span>
                      </td>
                      <td>
                        <span className="pill orange">Style Guide</span>
                      </td>
                      <td>
                        <span className="pill orange">Draft</span>
                      </td>
                      <td>
                        <button className="btn ">Edit</button>
                        {" "}
                        <button className="btn ">Preview</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="thumb t5" />
                        <b>The Timeless Appeal of Leather Accessories</b>
                        <span className="sub">Riley Carter · May 6, 2025</span>
                      </td>
                      <td>
                        <span className="pill orange">Product Focus</span>
                      </td>
                      <td>
                        <span className="pill green">Published</span>
                      </td>
                      <td>
                        <button className="btn ">Edit</button>
                        {" "}
                        <button className="btn ">Preview</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="thumb t6" />
                        <b>Color Trends for Fall 2025</b>
                        <span className="sub">Taylor Brooks · May 1, 2025</span>
                      </td>
                      <td>
                        <span className="pill orange">Trend Report</span>
                      </td>
                      <td>
                        <span className="pill orange">Draft</span>
                      </td>
                      <td>
                        <button className="btn ">Edit</button>
                        {" "}
                        <button className="btn ">Preview</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="thumb t1" />
                        <b>Behind the Scenes: Our Design Process</b>
                        <span className="sub">Jordan Lee · Apr 28, 2025</span>
                      </td>
                      <td>
                        <span className="pill orange">Brand Story</span>
                      </td>
                      <td>
                        <span className="pill green">Published</span>
                      </td>
                      <td>
                        <button className="btn ">Edit</button>
                        {" "}
                        <button className="btn ">Preview</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
            <div className="stack">
              <section className="card ">
                <h3>Blog performance</h3>
                <div className="row">
                  <span>
                    <b style={{fontSize: "20px"}}>32,480</b>
                    <span className="sub">Total views</span>
                  </span>
                  <span className="up">▲ 18%</span>
                </div>
                <div className="row">
                  <span>
                    <b style={{fontSize: "20px"}}>1,240</b>
                    <span className="sub">Unique readers</span>
                  </span>
                  <span className="up">▲ 22%</span>
                </div>
                <div className="row">
                  <span>
                    <b style={{fontSize: "20px"}}>246</b>
                    <span className="sub">Total comments</span>
                  </span>
                  <span className="up">▲ 12%</span>
                </div>
              </section>
              <section className="card ">
                <h3>
                  Recent comments
                  <a href="#">View all →</a>
                </h3>
                <div className="ord">
                  <span className="av" style={{background: "#a89480"}}>S</span>
                  <div>
                    <b>Sarah Kim</b>
                    <span className="sub">Love this! The styling tips are so helpful and inspiring.</span>
                  </div>
                </div>
                <div className="ord">
                  <span className="av" style={{background: "#a89480"}}>A</span>
                  <div>
                    <b>Alex Rivera</b>
                    <span className="sub">Great article! Can you share more about the fabric sourcing?</span>
                  </div>
                </div>
                <div className="ord">
                  <span className="av" style={{background: "#a89480"}}>P</span>
                  <div>
                    <b>Priya Sharma</b>
                    <span className="sub">This brand is on my radar now. Excited to see what’s next!</span>
                  </div>
                </div>
                <div className="ord">
                  <span className="av" style={{background: "#a89480"}}>J</span>
                  <div>
                    <b>James Lee</b>
                    <span className="sub">The color palette is stunning. Perfect for fall!</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
        <aside className="panel">
          <h3>
            Edit post
            {" "}
            <span>✕</span>
          </h3>
          <div className="field">
            <label>Title *</label>
            <input defaultValue={"The Art of Modern Layering for Spring"} />
          </div>
          <div className="field">
            <label>Content *</label>
            <textarea defaultValue={"Layering isn't just a practical choice — it's an art form. This season, we're embracing lightweight textures, thoughtful proportions, and versatile pieces that move with your day.\n\nAt STRATA, we believe in timeless pieces that work across seasons."} />
          </div>
          <b>Featured image</b>
          <br />
          <br />
          <div className="grid g2">
            <span className="thumb t4" style={{width: "100%", height: "90px"}} />
            <div className="drop">
              ⬆ Replace image
              <span className="sub">JPG, PNG, WebP (max 5MB)</span>
            </div>
          </div>
          <div className="field">
            <label>Tags</label>
            <input defaultValue={"layering ✕   spring ✕   women ✕"} />
          </div>
          <div className="field">
            <label>Category *</label>
            <input defaultValue={"Style Guide ▾"} />
          </div>
          <div className="grid g2">
            <div className="field">
              <label>Publish date</label>
              <input defaultValue={"May 18, 2025"} />
            </div>
            <div className="field">
              <label>Status</label>
              <input defaultValue={"Published ›"} />
            </div>
          </div>
          <div className="grid g2">
            <button className="btn ">Save draft</button>
            <button className="btn pri">Publish</button>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}
