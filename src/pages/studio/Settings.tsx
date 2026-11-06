import DashboardLayout from "../../components/DashboardLayout";
import "./Settings.css";

export default function StudioSettings() {
  return (
    <DashboardLayout
      kind="studio"
      title={"Store settings"}
      subtitle={"Manage your store details, policies and preferences."}
      actions={
        <>
          <div className="card">
            STRATA
            {" "}
            <span className="sub">SELLER STUDIO</span>
          </div>
        </>
      }
    >
      <div className="tabs">
        <a href="#" className="on">General</a>
        <a href="#">Shipping</a>
        <a href="#">Notifications</a>
        <a href="#">Preorders</a>
        <a href="#">Payments</a>
      </div>
      <div className="grid g32">
        <div className="stack">
          <section className="card ">
            <h3>Brand information</h3>
            <div className="grid g2">
              <div className="field">
                <label>Brand name</label>
                <input defaultValue={"STRATA"} />
              </div>
              <div className="field">
                <label>Store URL</label>
                <input defaultValue={"strata-studio.myshopify.com"} />
              </div>
            </div>
            <label>
              <b>Store logo</b>
            </label>
            <div className="grid g21">
              <div className="card" style={{textAlign: "center"}}>
                <b style={{fontSize: "20px"}}>STRATA</b>
              </div>
              <div className="drop">
                ⬆ Upload logo
                <span className="sub">JPG, PNG or SVG. Max 2MB.</span>
              </div>
            </div>
            <div className="field">
              <label>Contact email</label>
              <input defaultValue={"hello@strata-studio.com"} />
            </div>
            <div className="field">
              <label>Storefront description</label>
              <textarea defaultValue={"Independent clothing for creative minds. Minimal pieces. Maximum impact."} />
            </div>
          </section>
          <section className="card ">
            <h3>Shipping policy</h3>
            <span className="sub">Set your shipping policy and delivery information to display at checkout and in your store footer.</span>
            <br />
            <div className="field">
              <label />
              <textarea defaultValue={"Free shipping on orders over R100.\nShipping takes 3–7 business days."} />
            </div>
          </section>
        </div>
        <div className="stack">
          <section className="card ">
            <h3>
              Preorder settings
              {" "}
              <span className="toggle" />
            </h3>
            <span className="sub">Enable preorders for upcoming releases and manage customer messaging and timelines.</span>
            <br />
            <div className="field">
              <label>Expected shipping timeframe</label>
              <input defaultValue={"May 22, 2025"} />
            </div>
            <div className="field">
              <label>Customer message</label>
              <textarea defaultValue={"Thanks for your support! Preorder items ship on the expected date above. We'll keep you updated every step of the way."} />
            </div>
          </section>
          <section className="card ">
            <h3 />
            <button className="btn pri full">Save changes</button>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
