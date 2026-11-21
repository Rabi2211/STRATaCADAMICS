import { useState, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { NAV, type Kind } from "../data/nav";
import "../styles/dashboard.css";

interface DashboardLayoutProps {
  kind: Kind;
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}

export default function DashboardLayout({ kind, title, subtitle, actions, children }: DashboardLayoutProps) {
  const { label, tagline, items } = NAV[kind];
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="dash">
      <div className="app">
        <aside className="side">
          <div className="logo">
            STRATA<i />
          </div>
          <small>{label}</small>
          <button
            type="button"
            className="mobile-menu-button"
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
          <nav className={`mobile-menu${menuOpen ? " open" : ""}`} aria-label="Dashboard navigation">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? "on" : undefined)}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="desktop-nav">
            {items.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? "on" : undefined)}>
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="tag">
            {tagline.map((line, i) => (
              <span key={line}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </div>
        </aside>
        <main className="main">
          <div className="head">
            <div>
              <h1>{title}</h1>
              {subtitle && <p>{subtitle}</p>}
            </div>
            {actions && <div className="acts">{actions}</div>}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
