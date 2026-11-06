import DashboardLayout from "../../components/DashboardLayout";
import "./Settings.css";

export default function MarketSettings() {
  return (
    <DashboardLayout
      kind="market"
      title={"Store settings"}
      subtitle={"Manage your marketplace store details, policies and team access."}
      actions={
        <>
          🔔
          <button className="btn pri">View storefront ↗</button>
        </>
      }
    >
      <div className="tabs">
        <a href="#" className="on">General</a>
        <a href="#">Storefront</a>
        <a href="#">Shipping</a>
        <a href="#">Notifications</a>
        <a href="#">Payments</a>
        <a href="#">Team & permissions</a>
      </div>
      <div className="grid g32">
        <section className="card ">
          <h3>General settings</h3>
          <span className="sub">Update your marketplace store information. This will be visible to your customers.</span>
          <br />
          <div className="field">
            <label>Marketplace store name *</label>
            <input defaultValue={"STRATA Market"} />
          </div>
          <div className="field">
            <label>Store URL *</label>
            <input defaultValue={"stratamarket.com/store"} />
          </div>
          <label>
            <b>Store logo</b>
          </label>
          <div style={{display: "flex", gap: "14px", alignItems: "center", margin: "6px 0 14px"}}>
            <div className="card">
              <b style={{fontSize: "20px"}}>STRATA</b>
            </div>
            <div>
              <button className="btn pri">⬆ Upload logo</button>
              <span className="sub">
                Recommended size: 512 × 512px
                <br />
                PNG, JPG or SVG · Max 2MB
              </span>
            </div>
          </div>
          <div className="field">
            <label>Support email *</label>
            <input defaultValue={"support@stratamarket.com"} />
          </div>
          <div className="field">
            <label>Store description</label>
            <textarea defaultValue={"A curated marketplace for independent brands creating high-quality, timeless products. Discover unique styles, new perspectives and support small businesses."} />
          </div>
          <button className="btn pri">Save changes</button>
        </section>
        <div className="stack">
          <section className="card ">
            <h3>Shipping policy</h3>
            <span className="sub">Your store’s shipping policy, delivery times and regions.</span>
            <div className="row card" style={{marginTop: "10px"}}>
              <span>
                <b>Default shipping policy</b>
                <span className="sub">Free shipping on orders over R100. Ships within 2–5 business days.</span>
              </span>
              <button className="btn ">Edit</button>
            </div>
          </section>
          <section className="card ">
            <h3>Customer notification preferences</h3>
            <div className="row">
              <span>
                <b>Order confirmations</b>
                <span className="sub">Send an email when an order is placed.</span>
              </span>
              <span className="toggle" />
            </div>
            <div className="row">
              <span>
                <b>Shipping updates</b>
                <span className="sub">Notify customers when their order ships.</span>
              </span>
              <span className="toggle" />
            </div>
            <div className="row">
              <span>
                <b>Order delivered</b>
                <span className="sub">Notify customers when their order is delivered.</span>
              </span>
              <span className="toggle" />
            </div>
            <div className="row">
              <span>
                <b>Customer inquiries</b>
                <span className="sub">Receive new customer messages via email.</span>
              </span>
              <span className="toggle" />
            </div>
          </section>
          <section className="card ">
            <h3>Team roles & permissions</h3>
            <span className="sub">Manage who can access and manage your store.</span>
            <div className="row card" style={{margin: "10px 0"}}>
              <span>
                <b>2 team members</b>
                <span className="sub">2 active · 0 pending</span>
              </span>
              <button className="btn ">Manage roles</button>
            </div>
            <button className="btn pri full">Invite team member</button>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
