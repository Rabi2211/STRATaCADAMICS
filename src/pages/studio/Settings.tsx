import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { fetchBrands, type ApiBrand } from "../../lib/store-api";
import "./Settings.css";

const tabOptions = ["General", "Shipping", "Notifications", "Preorders", "Payments"] as const;
type SettingsTab = typeof tabOptions[number];

export default function StudioSettings() {
  const [brands, setBrands] = useState<ApiBrand[]>([]);
  const [activeTab, setActiveTab] = useState<SettingsTab>("General");
  const [saved, setSaved] = useState(false);
  const [brandName, setBrandName] = useState("Your brand");
  const [storeUrl, setStoreUrl] = useState("your-brand.strata.store");
  const [contactEmail, setContactEmail] = useState("hello@brand.store");
  const [description, setDescription] = useState("Independent essentials for modern living.");
  const [shippingPolicy, setShippingPolicy] = useState("Free shipping on orders over R100.\nShipping takes 3–7 business days.");
  const [expectedShipping, setExpectedShipping] = useState("May 22, 2025");
  const [customerMessage, setCustomerMessage] = useState("Thanks for your support! Preorder items ship on the expected date above.");

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const nextBrands = await fetchBrands();
        if (!active) return;
        setBrands(nextBrands);
      } catch (error) {
        if (active) {
          console.error("Unable to load brand settings", error);
        }
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  const brand = brands[0];

  useEffect(() => {
    if (!brand) {
      return;
    }

    setBrandName(brand.name || "Your brand");
    setStoreUrl(`${(brand.name || "your-brand").toLowerCase().replace(/\s+/g, "-")}.strata.store`);
    setContactEmail(`hello@${(brand.name || "brand").toLowerCase().replace(/\s+/g, "-")}.store`);
    setDescription(brand.description ? String(brand.description) : "Independent essentials for modern living.");
  }, [brand]);

  return (
    <DashboardLayout
      kind="studio"
      title={"Store settings"}
      subtitle={`Manage ${brand?.name ?? "your brand"} details, policies and preferences within the shared store.`}
      actions={
        <>
          <div className="card">
            {brand?.abbreviation ?? "BR"}
            {" "}
            <span className="sub">SELLER STUDIO</span>
          </div>
        </>
      }
    >
      <div className="tabs">
        {tabOptions.map((tab) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? "on" : ""}
            onClick={() => { setActiveTab(tab); setSaved(false); }}
            style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, marginRight: 12 }}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="grid g32">
        <div className="stack">
          <section className="card ">
            <h3>Brand information</h3>
            <div className="grid g2">
              <div className="field">
                <label>Brand name</label>
                <input value={brandName} onChange={(event) => setBrandName(event.target.value)} />
              </div>
              <div className="field">
                <label>Store URL</label>
                <input value={storeUrl} onChange={(event) => setStoreUrl(event.target.value)} />
              </div>
            </div>
            <label>
              <b>Store logo</b>
            </label>
            <div className="grid g21">
              <div className="card" style={{textAlign: "center"}}>
                <b style={{fontSize: "20px"}}>{brand?.abbreviation ?? "BR"}</b>
              </div>
              <div className="drop">
                ⬆ Upload logo
                <span className="sub">JPG, PNG or SVG. Max 2MB.</span>
              </div>
            </div>
            <div className="field">
              <label>Contact email</label>
              <input value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} />
            </div>
            <div className="field">
              <label>Storefront description</label>
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} />
            </div>
          </section>
          <section className="card ">
            <h3>Shipping policy</h3>
            <span className="sub">Set your shipping policy and delivery information to display at checkout and in your store footer.</span>
            <br />
            <div className="field">
              <label />
              <textarea value={shippingPolicy} onChange={(event) => setShippingPolicy(event.target.value)} />
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
              <input value={expectedShipping} onChange={(event) => setExpectedShipping(event.target.value)} />
            </div>
            <div className="field">
              <label>Customer message</label>
              <textarea value={customerMessage} onChange={(event) => setCustomerMessage(event.target.value)} />
            </div>
          </section>
          <section className="card ">
            <h3 />
            <button
              className="btn pri full"
              type="button"
              onClick={() => setSaved(true)}
            >
              {saved ? "Saved" : "Save changes"}
            </button>
            {saved && <p className="sub" style={{ marginTop: 8 }}>Store preferences updated successfully.</p>}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
