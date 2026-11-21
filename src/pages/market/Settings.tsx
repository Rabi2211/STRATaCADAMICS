import { Link } from "react-router-dom";
import { useEffect, useState, type FormEvent } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { fetchBrands, type ApiBrand } from "../../lib/store-api";
import { fetchNewsletterCampaigns, sendNewsletterUpdate, type NewsletterCampaign } from "../../lib/newsletter-store";
import { DEFAULT_STORE_SETTINGS, loadStoreSettings, saveStoreSettings } from "../../lib/store-settings";
import "./Settings.css";

const tabs = ["General", "Storefront", "Shipping", "Notifications", "Payments", "Team & permissions"] as const;

export default function MarketSettings() {
  const [brands, setBrands] = useState<ApiBrand[]>([]);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("General");
  const [notice, setNotice] = useState("");
  const [shippingDraft, setShippingDraft] = useState("Free shipping on orders over R100. Ships within 2–5 business days.");
  const [shippingEditOpen, setShippingEditOpen] = useState(false);
  const [showRolePanel, setShowRolePanel] = useState(false);
  const [teamMembers, setTeamMembers] = useState<Array<{ id: string; name: string; role: string }>>([]);
  const [logoName, setLogoName] = useState("STRATA");
  const [notificationSettings, setNotificationSettings] = useState({
    orderConfirmations: true,
    shippingUpdates: true,
    orderDelivered: false,
    customerInquiries: true,
  });
  const [newsletterSubject, setNewsletterSubject] = useState("");
  const [newsletterContent, setNewsletterContent] = useState("");
  const [sendingNewsletter, setSendingNewsletter] = useState(false);
  const [newsletterCampaigns, setNewsletterCampaigns] = useState<NewsletterCampaign[]>([]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [nextBrands, nextSettings] = await Promise.all([fetchBrands(), loadStoreSettings()]);
        if (!active) return;
        setBrands(nextBrands);
        setShippingDraft(nextSettings.shippingPolicy);
        setNotificationSettings(nextSettings.notifications);
        const campaignPayload = await fetchNewsletterCampaigns();
        if (active) setNewsletterCampaigns(campaignPayload.campaigns);
      } catch (error) {
        if (active) {
          console.error("Unable to load store settings", error);
        }
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  const storeName = brands[0]?.name ? `${brands[0].name} Store` : "STRATA Market";

  const handleLogoClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        setLogoName(file.name);
        setNotice("Logo updated.");
      }
    };
    input.click();
  };

  const toggleNotification = (key: keyof typeof notificationSettings) => {
    setNotificationSettings((current) => {
      const next = { ...current, [key]: !current[key] };
      void persistSettings({ notifications: next }).then(() => setNotice("Notification preferences updated."));
      return next;
    });
  };

  const persistSettings = async (patch: Partial<typeof DEFAULT_STORE_SETTINGS>) => {
    try {
      const current = await loadStoreSettings();
      await saveStoreSettings({ ...current, ...patch });
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to save store settings.");
      throw error;
    }
  };

  const renderTabContent = () => {
    if (activeTab === "Shipping") {
      return (
        <section className="card ">
          <h3>Shipping policy</h3>
          <span className="sub">Your store’s shipping policy, delivery times and regions.</span>
          <div className="row card" style={{ marginTop: "10px" }}>
            <span>
              <b>Default shipping policy</b>
              <span className="sub">{shippingDraft}</span>
            </span>
            <button type="button" className="btn " onClick={() => setShippingEditOpen((current) => !current)}>Edit</button>
          </div>
          {shippingEditOpen && (
            <div className="field" style={{ marginTop: 12 }}>
              <label>Shipping policy text</label>
              <textarea value={shippingDraft} onChange={(event) => setShippingDraft(event.target.value)} />
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button type="button" className="btn pri" onClick={async () => { await persistSettings({ shippingPolicy: shippingDraft }); setShippingEditOpen(false); setNotice("Shipping policy saved."); }}>Save policy</button>
                <button type="button" className="btn" onClick={() => setShippingEditOpen(false)}>Cancel</button>
              </div>
            </div>
          )}
        </section>
      );
    }

    if (activeTab === "Notifications") {
      const handleSendNewsletter = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSendingNewsletter(true);
        setNotice("");
        try {
          const result = await sendNewsletterUpdate({ subject: newsletterSubject, content: newsletterContent });
          setNotice(`Newsletter sent: ${result.sent} delivered, ${result.failed} failed.`);
          setNewsletterSubject("");
          setNewsletterContent("");
          const campaignPayload = await fetchNewsletterCampaigns();
          setNewsletterCampaigns(campaignPayload.campaigns);
        } catch (sendError) {
          setNotice(sendError instanceof Error ? sendError.message : "Unable to send newsletter.");
        } finally {
          setSendingNewsletter(false);
        }
      };

      return (
        <>
          <section className="card ">
            <h3>Customer notification preferences</h3>
            <div className="row">
              <span><b>Order confirmations</b><span className="sub">Send an email when an order is placed.</span></span>
              <button type="button" className="toggle" aria-pressed={notificationSettings.orderConfirmations} onClick={() => toggleNotification("orderConfirmations")} aria-label="Toggle order confirmations" />
            </div>
            <div className="row">
              <span><b>Shipping updates</b><span className="sub">Notify customers when their order ships.</span></span>
              <button type="button" className="toggle" aria-pressed={notificationSettings.shippingUpdates} onClick={() => toggleNotification("shippingUpdates")} aria-label="Toggle shipping updates" />
            </div>
            <div className="row">
              <span><b>Order delivered</b><span className="sub">Notify customers when their order is delivered.</span></span>
              <button type="button" className="toggle" aria-pressed={notificationSettings.orderDelivered} onClick={() => toggleNotification("orderDelivered")} aria-label="Toggle order delivered notifications" />
            </div>
            <div className="row">
              <span><b>Customer inquiries</b><span className="sub">Receive new customer messages via email.</span></span>
              <button type="button" className="toggle" aria-pressed={notificationSettings.customerInquiries} onClick={() => toggleNotification("customerInquiries")} aria-label="Toggle customer inquiries" />
            </div>
          </section>
          <section className="card">
            <h3>Send newsletter</h3>
            <span className="sub">Send an update to all active newsletter subscribers.</span>
            <form onSubmit={handleSendNewsletter}>
              <div className="field" style={{ marginTop: 12 }}>
                <label>Subject</label>
                <input value={newsletterSubject} maxLength={150} onChange={(event) => setNewsletterSubject(event.target.value)} placeholder="New arrivals and store updates" required />
              </div>
              <div className="field">
                <label>Message</label>
                <textarea value={newsletterContent} maxLength={10000} onChange={(event) => setNewsletterContent(event.target.value)} placeholder="Write the newsletter message…" rows={8} required />
              </div>
              <button type="submit" className="btn pri" disabled={sendingNewsletter || !newsletterSubject.trim() || !newsletterContent.trim()}>
                {sendingNewsletter ? "Sending…" : "Send newsletter"}
              </button>
            </form>
          </section>
          <section className="card">
            <h3>Campaign history</h3>
            <span className="sub">Recent newsletter sends and delivery totals.</span>
            {newsletterCampaigns.length === 0 ? (
              <p className="sub" style={{ marginTop: 12 }}>No campaigns sent yet.</p>
            ) : (
              <div className="wrap" style={{ marginTop: 12 }}>
                <table>
                  <thead><tr><th>Subject</th><th>Recipients</th><th>Sent</th><th>Failed</th><th>Date</th></tr></thead>
                  <tbody>
                    {newsletterCampaigns.map((campaign) => (
                      <tr key={campaign.id}>
                        <td>{campaign.subject}</td>
                        <td>{campaign.recipientCount}</td>
                        <td>{campaign.sent}</td>
                        <td>{campaign.failed}</td>
                        <td>{campaign.createdAt ? new Date(campaign.createdAt).toLocaleString() : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      );
    }

    if (activeTab === "Team & permissions") {
      return (
        <section className="card ">
          <h3>Team roles & permissions</h3>
          <span className="sub">Manage who can access and manage your store.</span>
          <div className="row card" style={{ margin: "10px 0" }}>
            <span>
              <b>{teamMembers.length} team members</b>
              <span className="sub">{teamMembers.length} active · 0 pending</span>
            </span>
            <button type="button" className="btn " onClick={() => setShowRolePanel((current) => !current)}>Manage roles</button>
          </div>
          {showRolePanel && (
            <div className="card" style={{ padding: 12 }}>
              {teamMembers.map((member) => (
                <div key={member.id} className="row">
                  <span>
                    <b>{member.name}</b>
                    <span className="sub">{member.role}</span>
                  </span>
                  <button type="button" className="btn " onClick={() => setNotice(`${member.name} role updated.`)}>Update role</button>
                </div>
              ))}
            </div>
          )}
          <button type="button" className="btn pri full" onClick={() => { setTeamMembers((current) => [...current, { id: `tm-${Date.now()}`, name: "New team member", role: "Manager" }]); setNotice("Team member added."); }}>Invite team member</button>
        </section>
      );
    }

    return (
      <section className="card ">
        <h3>General settings</h3>
        <span className="sub">Update the core store information for your storefront and owner dashboard.</span>
        <br />
        <div className="field">
          <label>Marketplace store name *</label>
          <input defaultValue={storeName} />
        </div>
        <div className="field">
          <label>Store URL *</label>
          <input defaultValue={"stratamarket.com/store"} />
        </div>
        <label>
          <b>Store logo</b>
        </label>
        <div style={{ display: "flex", gap: "14px", alignItems: "center", margin: "6px 0 14px" }}>
          <div className="card">
            <b style={{ fontSize: "20px" }}>{(logoName || "STRATA").slice(0, 6).toUpperCase()}</b>
          </div>
          <div>
            <button type="button" className="btn pri" onClick={handleLogoClick}>⬆ Upload logo</button>
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
          <textarea defaultValue={"A curated store for independent brands creating high-quality, timeless products. Discover unique styles, new perspectives and support small businesses."} />
        </div>
        <button type="button" className="btn pri" onClick={() => setNotice("General settings saved.")}>Save changes</button>
      </section>
    );
  };

  return (
    <DashboardLayout
      kind="market"
      title={"Store settings"}
      subtitle={`Manage ${storeName} details, policies and access for the store owner account.`}
      actions={
        <>
          🔔
          <Link to="/" className="btn pri">View storefront ↗</Link>
        </>
      }
    >
      <div className="tabs">
        {tabs.map((tab) => (
          <button key={tab} type="button" className={activeTab === tab ? "on" : ""} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>
      <div className="grid g32">
        {renderTabContent()}
        <div className="stack">
          {activeTab === "General" && (
            <>
              <section className="card ">
                <h3>Shipping policy</h3>
                <span className="sub">Your store’s shipping policy, delivery times and regions.</span>
                <div className="row card" style={{ marginTop: "10px" }}>
                  <span>
                    <b>Default shipping policy</b>
                    <span className="sub">{shippingDraft}</span>
                  </span>
                  <button type="button" className="btn " onClick={() => { setShippingEditOpen(true); setActiveTab("Shipping"); }}>Edit</button>
                </div>
              </section>
              <section className="card ">
                <h3>Customer notification preferences</h3>
                <div className="row">
                  <span>
                    <b>Order confirmations</b>
                    <span className="sub">Send an email when an order is placed.</span>
                  </span>
                  <button type="button" className="toggle" aria-pressed={notificationSettings.orderConfirmations} onClick={() => toggleNotification("orderConfirmations")} aria-label="Toggle order confirmations" />
                </div>
                <div className="row">
                  <span>
                    <b>Shipping updates</b>
                    <span className="sub">Notify customers when their order ships.</span>
                  </span>
                  <button type="button" className="toggle" aria-pressed={notificationSettings.shippingUpdates} onClick={() => toggleNotification("shippingUpdates")} aria-label="Toggle shipping updates" />
                </div>
                <div className="row">
                  <span>
                    <b>Order delivered</b>
                    <span className="sub">Notify customers when their order is delivered.</span>
                  </span>
                  <button type="button" className="toggle" aria-pressed={notificationSettings.orderDelivered} onClick={() => toggleNotification("orderDelivered")} aria-label="Toggle order delivered notifications" />
                </div>
                <div className="row">
                  <span>
                    <b>Customer inquiries</b>
                    <span className="sub">Receive new customer messages via email.</span>
                  </span>
                  <button type="button" className="toggle" aria-pressed={notificationSettings.customerInquiries} onClick={() => toggleNotification("customerInquiries")} aria-label="Toggle customer inquiries" />
                </div>
              </section>
              <section className="card ">
                <h3>Team roles & permissions</h3>
                <span className="sub">Manage who can access and manage your store.</span>
                <div className="row card" style={{ margin: "10px 0" }}>
                  <span>
                    <b>{teamMembers.length} team members</b>
                    <span className="sub">{teamMembers.length} active · 0 pending</span>
                  </span>
                  <button type="button" className="btn " onClick={() => { setShowRolePanel(true); setActiveTab("Team & permissions"); }}>Manage roles</button>
                </div>
                <button type="button" className="btn pri full" onClick={() => { setTeamMembers((current) => [...current, { id: `tm-${Date.now()}`, name: "New team member", role: "Manager" }]); setNotice("Team member added."); }}>Invite team member</button>
              </section>
            </>
          )}
          {notice && <p className="sub" style={{ marginTop: 8 }}>{notice}</p>}
        </div>
      </div>
    </DashboardLayout>
  );
}
