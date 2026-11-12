import { Link } from "react-router-dom";
import { getStoredAuthSession } from "../lib/storage";

export default function ProfilePage() {
  const session = getStoredAuthSession();

  const roleLabel = {
    customer: "Customer",
    "brand-owner": "Brand owner",
    admin: "Store owner",
  } as const;

  if (!session) {
    return (
      <main style={{
        maxWidth: 560,
        margin: "48px auto",
        padding: 24,
        fontFamily: "Inter, system-ui, sans-serif",
      }}>
        <div style={{
          background: "#fff",
          border: "1px solid rgba(169, 117, 74, 0.25)",
          borderRadius: 18,
          padding: 28,
          boxShadow: "0 12px 30px rgba(0, 0, 0, 0.06)",
        }}>
          <p style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#707070" }}>Account</p>
          <h1 style={{ fontSize: 30, marginTop: 10 }}>Profile</h1>
          <p style={{ marginTop: 12, lineHeight: 1.6, color: "#241f1d" }}>You need to sign in to view your profile.</p>
          <Link to="/" style={{ display: "inline-block", marginTop: 18, color: "#a9754a", fontWeight: 700, textDecoration: "none" }}>
            Return home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{
      maxWidth: 720,
      margin: "48px auto",
      padding: 24,
      fontFamily: "Inter, system-ui, sans-serif",
    }}>
      <h1 style={{ fontSize: 36, margin: "0 0 24px", letterSpacing: "-0.04em" }}>Your profile</h1>

      <section style={{
        background: "linear-gradient(180deg, #f8f4f0 0%, #f3f0eb 100%)",
        border: "1px solid rgba(169, 117, 74, 0.25)",
        borderRadius: 18,
        padding: 28,
        boxShadow: "0 12px 30px rgba(0, 0, 0, 0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 22, flexWrap: "wrap" }}>
          <div style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "#241f1d",
            color: "#fff",
            display: "grid",
            placeItems: "center",
            fontWeight: 700,
            fontSize: 20,
          }}>
            {session.user.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <p style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#707070" }}>Account</p>
            <h2 style={{ fontSize: 28, marginTop: 6 }}>{session.user.name}</h2>
          </div>
        </div>

        <div style={{ display: "grid", gap: 18 }}>
          <div style={{
            background: "rgba(255, 255, 255, 0.6)",
            borderRadius: 12,
            padding: "14px 16px",
            border: "1px solid rgba(169, 117, 74, 0.12)",
          }}>
            <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "#707070" }}>Full name</p>
            <p style={{ marginTop: 8, fontSize: 18 }}>{session.user.name}</p>
          </div>

          <div style={{
            background: "rgba(255, 255, 255, 0.6)",
            borderRadius: 12,
            padding: "14px 16px",
            border: "1px solid rgba(169, 117, 74, 0.12)",
          }}>
            <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "#707070" }}>Email</p>
            <p style={{ marginTop: 8, fontSize: 18 }}>{session.user.email}</p>
          </div>

          <div style={{
            background: "rgba(255, 255, 255, 0.6)",
            borderRadius: 12,
            padding: "14px 16px",
            border: "1px solid rgba(169, 117, 74, 0.12)",
          }}>
            <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "#707070" }}>Role</p>
            <p style={{ marginTop: 8, fontSize: 18 }}>{roleLabel[session.user.role as keyof typeof roleLabel] ?? "Customer"}</p>
          </div>
        </div>
      </section>

      <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link to="/reset-password" style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px 16px",
          borderRadius: 10,
          background: "#241f1d",
          color: "#fff",
          fontWeight: 700,
          textDecoration: "none",
        }}>
          Reset password
        </Link>
        <Link to="/" style={{ color: "#a9754a", fontWeight: 700, textDecoration: "none" }}>Back to home</Link>
      </div>

      <style>{`
        @media (max-width: 300px) {
          main {
            padding: 14px !important;
            margin: 20px auto !important;
          }

          h1 {
            font-size: 26px !important;
            margin-bottom: 16px !important;
          }

          section {
            padding: 18px !important;
            border-radius: 14px !important;
          }

          h2 {
            font-size: 22px !important;
          }

          div[style*="grid"] {
            gap: 12px !important;
          }

          p {
            font-size: 12px !important;
          }

          div[style*="background: rgba(255, 255, 255, 0.6)"] {
            padding: 12px 12px !important;
          }
        }
      `}</style>
    </main>
  );
}
