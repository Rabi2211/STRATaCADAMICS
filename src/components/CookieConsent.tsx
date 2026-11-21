import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const COOKIE_CONSENT_KEY = "strata-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(localStorage.getItem(COOKIE_CONSENT_KEY) !== "accepted");
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      role="region"
      aria-label="Cookie consent"
      style={{ position: "fixed", zIndex: 1000, left: 16, right: 16, bottom: 16, maxWidth: 560, margin: "0 auto", padding: 16, borderRadius: 14, background: "#1f1a17", color: "#fff", boxShadow: "0 12px 40px rgba(0,0,0,.24)" }}
    >
      <p style={{ margin: "0 0 12px", lineHeight: 1.5 }}>We use essential storage to keep your cart and account working. Read our <Link to="/privacy" style={{ color: "#fff", textDecoration: "underline" }}>Privacy Policy</Link>.</p>
      <button type="button" onClick={accept} style={{ border: 0, borderRadius: 8, background: "#fff", color: "#1f1a17", padding: "10px 16px", fontWeight: 700, cursor: "pointer" }}>Accept</button>
    </aside>
  );
}
