import type { ReactNode } from "react";
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
  return (
    <div className="dash">
      <div className="app">
        <aside className="side">
          <div className="logo">
            STRATA<i />
          </div>
          <small>{label}</small>
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? "on" : undefined)}>
              {item.label}
            </NavLink>
          ))}
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
