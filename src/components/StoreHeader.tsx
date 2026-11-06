import { SECTIONS } from "../data/storefront";

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d={d} />
  </svg>
);

export default function StoreHeader() {
  return (
    <header className="header">
      <div className="header__bar">
        <button className="burger" aria-label="Open menu">
          <span /><span /><span />
        </button>
        <a className="logo" href="/">STRATaCADAMICS</a>

        <label className="search">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" />
          </svg>
          <input type="search" placeholder="search brands" aria-label="Search brands" />
        </label>

        <nav className="actions" aria-label="Account">
          <a href="/sign-in"><Icon d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0" /> sign in</a>
          <a href="/cart"><Icon d="M3 4h2l2 12h11l2-8H6" /> cart</a>
          <a href="/wishlist"><Icon d="M12 20s-8-5-8-11a4.5 4.5 0 018-2.5A4.5 4.5 0 0120 9c0 6-8 11-8 11z" /> wishlist</a>
        </nav>
      </div>
      <nav className="subnav" aria-label="Categories">
        {SECTIONS.map((s) => (
          <a key={s} href={`#${s.toLowerCase()}`}>{s.toUpperCase()}</a>
        ))}
      </nav>
    </header>
  );
}
