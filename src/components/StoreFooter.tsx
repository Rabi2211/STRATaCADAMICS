import { FOOTER_COLUMNS } from "../data/storefront";

export default function StoreFooter() {
  return (
    <footer className="footer">
      <div className="footer__panel">
        <div className="footer__top">
          <span className="footer__brand">STRATaCADAMICS</span>
          <p className="footer__tagline">
            We're committed to innovating to become a future brand that helps creators.
          </p>
        </div>

        <div className="footer__cols">
          {FOOTER_COLUMNS.map((c) => (
            <div key={c.title}>
              <h4>{c.title}</h4>
              <ul>
                {c.links.map((l) => (
                  <li key={l}><a href="#">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
          <div className="footer__news">
            <h4>Stay in the loop</h4>
            <p>Get the latest fashion trends, new arrivals, and exclusive offers delivered straight to your inbox</p>
            <form onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="enter your email address" aria-label="Email address" />
              <button type="submit" aria-label="Subscribe">➤</button>
            </form>
            <small>CLUB.STRATa</small>
          </div>
        </div>

        <div className="footer__social">
          {["Facebook", "Instagram", "YouTube"].map((n) => (
            <a key={n} href="#" aria-label={n} className="social">{n[0]}</a>
          ))}
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
