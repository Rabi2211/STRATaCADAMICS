import { useState } from "react";
import { Link } from "react-router-dom";
import { FOOTER_COLUMNS } from "../data/storefront";

const POLICY_LINKS: Record<string, string> = {
  "About": "/about",
  "FAQ": "/help",
  "Refund Policy": "/returns",
  "Privacy Policy": "/privacy",
  "Terms & Conditions": "/terms",
  "Shipping": "/shipping",
  "Contact Details": "/contact",
};

export default function StoreFooter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      return;
    }
    setIsSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="footer">
      <div className="footer__panel">
        <div className="footer__top">
          <div>
            <span className="footer__brand">STRATaCADAMICS</span>
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.8 }}>
              <span>Secure checkout</span>
              <span>•</span>
              <span>Free shipping</span>
              <span>•</span>
              <span>24/7 support</span>
            </div>
          </div>
          <p className="footer__tagline">
            Thoughtful essentials for everyday rituals, designed to move beautifully from day to night.
          </p>
        </div>

        <div className="footer__cols">
          {FOOTER_COLUMNS.map((c) => (
            <div key={c.title}>
              <h4>{c.title}</h4>
              <ul>
                {c.links.map((l) => {
                  const target = POLICY_LINKS[l] ?? "#";
                  return (
                    <li key={l}>
                      {target === "#" ? <a href="#">{l}</a> : <Link to={target}>{l}</Link>}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <div className="footer__news">
            <h4>Stay in the loop</h4>
            <p>Get new arrivals, member pricing, and curated style notes delivered to your inbox.</p>
            <form onSubmit={handleSubscribe}>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email address"
                aria-label="Email address"
              />
              <button type="submit" aria-label="Subscribe">➤</button>
            </form>
            {isSubscribed ? (
              <small style={{ color: "#dfe7dc" }}>Subscribed — welcome aboard.</small>
            ) : (
              <small>CLUB.STRATa</small>
            )}
          </div>
        </div>

        <div className="footer__social">
          <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="social social--facebook" title="Facebook">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V7.1c0-.9.3-1.6 1.7-1.6H17V2.5c-.5-.1-1.7-.2-3.1-.2-3.1 0-5.2 1.9-5.2 5.4V11H6v3.2h2.7v8h4.8Z" fill="currentColor"/></svg>
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="social social--instagram" title="Instagram">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.2A4.8 4.8 0 1 1 7.2 12 4.8 4.8 0 0 1 12 7.2Zm0 2A2.8 2.8 0 1 0 14.8 12 2.8 2.8 0 0 0 12 9.2Zm5.1-3.1a1.1 1.1 0 1 1-1.1-1.1 1.1 1.1 0 0 1 1.1 1.1Z" fill="currentColor"/></svg>
          </a>
          <a href="https://www.youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="social social--youtube" title="YouTube">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.5.4A3 3 0 0 0 2.4 7.2 31.5 31.5 0 0 0 2 12a31.5 31.5 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.7.4 7.5.4 7.5.4s5.8 0 7.5-.4a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 22 12a31.5 31.5 0 0 0-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" fill="currentColor"/></svg>
          </a>
        </div>
      </div>

      <div className="footer__legal">
        <span>© 2026 STRATaCADAMICS &nbsp; All Rights Reserved</span>
        <div className="payments" aria-label="Accepted payments">
          <span className="mc"><i /><i /></span>
          <b>VISA</b>
        </div>
        <a href="#top" className="to-top"><span aria-hidden="true">▲</span>back to top</a>
      </div>
    </footer>
  );
}
