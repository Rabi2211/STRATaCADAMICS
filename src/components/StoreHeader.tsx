import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPostLoginPath, loginUser, registerUser } from "../lib/auth";
import { clearAuthSession, getStoredAuthSession } from "../lib/storage";
import { SECTIONS } from "../data/storefront";

type AuthRole = "customer" | "brand-owner" | "admin";
type AuthMode = "login" | "register";

type AuthFormState = {
  email: string;
  password: string;
  fullName: string;
  brandName: string;
};

export function isBrandNameRequired(role: AuthRole): boolean {
  return role === "brand-owner";
}

export function getRegistrationDisplayName(
  fullName: string,
  brandName: string,
  email: string,
  role: AuthRole,
): string {
  const trimmedFullName = fullName.trim();
  if (trimmedFullName) {
    return trimmedFullName;
  }

  if (isBrandNameRequired(role)) {
    const trimmedBrandName = brandName.trim();
    if (trimmedBrandName) {
      return trimmedBrandName;
    }
  }

  return email.trim() || "User";
}

const initialFormState: AuthFormState = {
  email: "",
  password: "",
  fullName: "",
  brandName: "",
};

const menuItems = [
  { label: "Women", secondary: "categories +" },
  { label: "Men", secondary: "categories +" },
  { label: "Kids", secondary: "categories +" },
  { label: "Sales" },
  { label: "blog" },
];

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d={d} />
  </svg>
);

export default function StoreHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [selectedRole, setSelectedRole] = useState<AuthRole>("customer");
  const [session, setSession] = useState(() => getStoredAuthSession());
  const [form, setForm] = useState<AuthFormState>(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isAuthOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsAuthOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isAuthOpen]);

  const roleLabel: Record<AuthRole, string> = {
    customer: "Customer",
    "brand-owner": "Brand owner",
    admin: "Admin",
  };

  const handleFieldChange = (field: keyof AuthFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleLogout = () => {
    clearAuthSession();
    setSession(null);
    setIsAuthOpen(false);
    navigate("/");
  };

  const portalPath = session && session.user.role !== "customer" ? getPostLoginPath(session.user.role) : null;
  const portalLabel = session?.user.role === "admin"
    ? "Store owner portal"
    : session?.user.role === "brand-owner"
      ? "Seller Studio"
      : null;

  const handleForgotPassword = () => {
    setError(null);
    setNotice(null);
    setIsAuthOpen(false);
    navigate("/reset-password");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setNotice(null);

    if (!form.email.trim() || !form.password.trim()) {
      setError("Email and password are required.");
      return;
    }

    if (authMode === "register" && selectedRole === "brand-owner" && !form.brandName.trim()) {
      setError("Brand or company name is required for brand owners.");
      return;
    }

    try {
      setIsSubmitting(true);

      const nextSession = authMode === "login"
        ? await loginUser({
            email: form.email.trim(),
            password: form.password,
            role: selectedRole,
          })
        : await registerUser({
            email: form.email.trim(),
            password: form.password,
            name: getRegistrationDisplayName(form.fullName, form.brandName, form.email, selectedRole),
            role: selectedRole,
          });

      if (!nextSession?.user) {
        throw new Error("Authentication response was empty.");
      }

      setSession(nextSession);
      setForm(initialFormState);
      setIsAuthOpen(false);
      navigate(getPostLoginPath(nextSession.user.role));
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to complete authentication.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <header className="header">
      <div className="header__bar">
        <div className="header__menu-wrap" ref={menuRef}>
          <button
            className="burger"
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            aria-controls="storefront-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span /><span /><span />
          </button>

          {isMenuOpen && (
            <div id="storefront-menu" className="menu-panel" role="dialog" aria-modal="false">
              <button className="close-button" type="button" aria-label="Close menu" onClick={() => setIsMenuOpen(false)}>
                <span /><span />
              </button>
              <nav className="menu-panel__nav" aria-label="Main menu">
                {menuItems.map((item) => (
                  <a key={item.label} href="#" className="menu-panel__item">
                    <span>{item.label}</span>
                    {item.secondary ? <em>{item.secondary}</em> : null}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </div>

        <a className="logo" href="/">STRATaCADAMICS</a>

        <label className="search">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" />
          </svg>
          <input type="search" placeholder="search brands" aria-label="Search brands" />
        </label>

        <nav className="actions" aria-label="Account">
          <button type="button" className="auth-trigger" onClick={() => setIsAuthOpen(true)}>
            <Icon d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0" />
            {session ? session.user.name : "sign in"}
          </button>
          {portalPath && portalLabel && (
            <Link to={portalPath} className="auth-trigger" onClick={() => setIsAuthOpen(false)}>
              {portalLabel}
            </Link>
          )}
          {session && (
            <button type="button" className="auth-trigger" onClick={handleLogout}>
              sign out
            </button>
          )}
          <a href="/cart"><Icon d="M3 4h2l2 12h11l2-8H6" /> cart</a>
          <a href="/wishlist"><Icon d="M12 20s-8-5-8-11a4.5 4.5 0 018-2.5A4.5 4.5 0 0120 9c0 6-8 11-8 11z" /> wishlist</a>
        </nav>
      </div>
      {isAuthOpen && (
        <div className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title" onClick={() => setIsAuthOpen(false)}>
          <div className="auth-panel" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="close-button" aria-label="Close sign in" onClick={() => setIsAuthOpen(false)}>
              <span /><span />
            </button>

            <div className="auth-header">
              <p className="eyebrow">welcome back</p>
              <h2 id="auth-modal-title">{authMode === "login" ? "Sign in" : "Create account"}</h2>
            </div>

            <div className="auth-role-switch" aria-label="Account type">
              {(["customer", "brand-owner", "admin"] as AuthRole[]).map((role) => (
                <button
                  key={role}
                  type="button"
                  className={selectedRole === role ? "is-active" : ""}
                  onClick={() => setSelectedRole(role)}
                >
                  {roleLabel[role]}
                </button>
              ))}
            </div>

            <div className="auth-mode-switch" aria-label="Authentication mode">
              <button type="button" className={authMode === "login" ? "is-active" : ""} onClick={() => setAuthMode("login")}>Login</button>
              <button type="button" className={authMode === "register" ? "is-active" : ""} onClick={() => setAuthMode("register")}>Register</button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={form.email}
                  placeholder="name@email.com"
                  onChange={(event) => handleFieldChange("email", event.target.value)}
                />
              </label>

              {authMode === "register" && (
                <label>
                  <span>Full name</span>
                  <input
                    type="text"
                    value={form.fullName}
                    placeholder="Your full name"
                    onChange={(event) => handleFieldChange("fullName", event.target.value)}
                  />
                </label>
              )}

              <label>
                <span>Password</span>
                <input
                  type="password"
                  value={form.password}
                  placeholder="••••••••"
                  onChange={(event) => handleFieldChange("password", event.target.value)}
                />
              </label>

              {authMode === "register" && selectedRole === "brand-owner" && (
                <label>
                  <span>Brand or company name</span>
                  <input
                    type="text"
                    value={form.brandName}
                    placeholder="Your brand name"
                    onChange={(event) => handleFieldChange("brandName", event.target.value)}
                  />
                </label>
              )}

              {error && <p className="auth-error">{error}</p>}
              {notice && <p className="auth-success">{notice}</p>}

              {authMode === "login" && (
                <button type="button" className="auth-link" onClick={handleForgotPassword} disabled={isSubmitting}>
                  Forgot password?
                </button>
              )}

              <button type="submit" className="btn auth-submit" disabled={isSubmitting}>
                {isSubmitting ? "Please wait..." : `${authMode === "login" ? "Login as " : "Register as "}${roleLabel[selectedRole]}`}
              </button>
            </form>
          </div>
        </div>
      )}
      <nav className="subnav" aria-label="Categories">
        {SECTIONS.map((s) => {
          const href = s === "Men" ? "/men" : s === "Women" ? "/women" : "/kids";
          return (
            <a key={s} href={href}>{s.toUpperCase()}</a>
          );
        })}
      </nav>
    </header>
  );
}
