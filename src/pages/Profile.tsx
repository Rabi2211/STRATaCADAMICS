import { Link, useNavigate } from "react-router-dom";
import { clearAuthSession, getStoredAuthSession } from "../lib/storage";

export default function ProfilePage() {
  const navigate = useNavigate();
  const session = getStoredAuthSession();

  const handleLogout = () => {
    clearAuthSession();
    navigate("/");
  };

  const roleLabel = {
    customer: "Customer",
    "brand-owner": "Brand owner",
    admin: "Store owner",
  } as const;

  if (!session) {
    return (
      <main className="profile-page profile-page--signed-out">
        <div className="profile-card profile-card--empty">
          <p className="eyebrow">Account</p>
          <h1>Profile</h1>
          <p className="profile-notice">You need to sign in to view your profile.</p>
          <Link to="/" className="profile-link profile-link--primary">
            Return home
          </Link>
        </div>

        <style>{`
          .profile-page {
            max-width: 760px;
            margin: 48px auto;
            padding: 24px;
            font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            color: #1d1b1a;
          }

          .profile-page--signed-out {
            max-width: 560px;
          }

          .profile-card {
            background: linear-gradient(180deg, #ffffff 0%, #f7f2ee 100%);
            border: 1px solid rgba(37, 27, 24, 0.08);
            border-radius: 20px;
            box-shadow: 0 18px 40px rgba(31, 23, 19, 0.08);
          }

          .profile-card--empty {
            padding: 32px 28px;
          }

          .eyebrow {
            margin: 0;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: #7a6f68;
          }

          h1 {
            margin: 12px 0 0;
            font-size: clamp(2rem, 3vw, 2.4rem);
            letter-spacing: -0.05em;
            line-height: 1.05;
          }

          .profile-notice {
            margin: 16px 0 0;
            line-height: 1.7;
            color: #2f2a28;
          }

          .profile-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-top: 22px;
            padding: 11px 16px;
            border-radius: 10px;
            font-weight: 700;
            text-decoration: none;
            transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          }

          .profile-link:hover,
          .profile-link:focus-visible {
            transform: translateY(-1px);
          }

          .profile-link--primary {
            background: #211d1b;
            color: #fff;
            box-shadow: 0 10px 20px rgba(33, 29, 27, 0.14);
          }

          @media (max-width: 600px) {
            .profile-page {
              margin: 28px auto;
              padding: 16px;
            }

            .profile-card--empty {
              padding: 24px 20px;
            }
          }
        `}</style>
      </main>
    );
  }

  const accountRole = roleLabel[session.user.role as keyof typeof roleLabel] ?? "Customer";
  const userInitial = session.user.name?.charAt(0)?.toUpperCase() ?? "U";

  return (
    <main className="profile-page">
      <div className="profile-shell">
        <header className="profile-header">
          <div>
            <p className="eyebrow">Account overview</p>
            <h1>Your profile</h1>
          </div>
          <span className="profile-status">Active session</span>
        </header>

        <section className="profile-card profile-card--details">
          <div className="profile-summary">
            <div className="profile-avatar">{userInitial}</div>
            <div className="profile-identity">
              <p className="eyebrow">Member</p>
              <h2>{session.user.name}</h2>
              <span className="profile-role">{accountRole}</span>
            </div>
          </div>

          <div className="profile-detail-grid">
            <div className="profile-detail-item">
              <p className="detail-label">Full name</p>
              <p className="detail-value">{session.user.name}</p>
            </div>

            <div className="profile-detail-item">
              <p className="detail-label">Email</p>
              <p className="detail-value">{session.user.email}</p>
            </div>

            <div className="profile-detail-item">
              <p className="detail-label">Role</p>
              <p className="detail-value">{accountRole}</p>
            </div>
          </div>
        </section>

        <div className="profile-actions">
          <Link to="/reset-password" className="profile-action profile-action--primary">
            Reset password
          </Link>
          <button type="button" onClick={handleLogout} className="profile-action profile-action--secondary">
            Log out
          </button>
          <Link to="/" className="profile-action profile-action--text">
            Back to home
          </Link>
        </div>
      </div>

      <style>{`
        .profile-page {
          max-width: 760px;
          margin: 48px auto;
          padding: 24px;
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: #1d1b1a;
        }

        .profile-shell {
          display: grid;
          gap: 22px;
        }

        .profile-header {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 16px;
          padding: 0 4px;
        }

        .profile-header h1 {
          margin: 10px 0 0;
          font-size: clamp(2.1rem, 3vw, 2.9rem);
          letter-spacing: -0.06em;
          line-height: 1;
        }

        .profile-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(34, 160, 98, 0.08);
          border: 1px solid rgba(34, 160, 98, 0.18);
          color: #1f7d4e;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .profile-status::before {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #24a35d;
          box-shadow: 0 0 0 4px rgba(36, 163, 93, 0.14);
        }

        .profile-card {
          background: linear-gradient(180deg, #faf6f2 0%, #f4efe9 100%);
          border: 1px solid rgba(21, 18, 17, 0.06);
          border-radius: 22px;
          box-shadow: 0 20px 40px rgba(21, 18, 17, 0.06);
        }

        .profile-card--details {
          padding: 28px;
        }

        .profile-summary {
          display: flex;
          align-items: center;
          gap: 18px;
          padding-bottom: 22px;
          border-bottom: 1px solid rgba(21, 18, 17, 0.08);
        }

        .profile-avatar {
          width: 68px;
          height: 68px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: linear-gradient(135deg, #241f1d 0%, #433a36 100%);
          color: #fff;
          font-size: 1.5rem;
          font-weight: 800;
          box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.18);
        }

        .profile-identity h2 {
          margin: 8px 0 0;
          font-size: clamp(1.7rem, 3vw, 2.3rem);
          letter-spacing: -0.05em;
          line-height: 1.1;
        }

        .profile-role {
          display: inline-block;
          margin-top: 10px;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(169, 117, 74, 0.08);
          border: 1px solid rgba(169, 117, 74, 0.18);
          color: #7d5133;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .profile-detail-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          margin-top: 22px;
        }

        .profile-detail-item {
          background: rgba(255, 255, 255, 0.55);
          border: 1px solid rgba(21, 18, 17, 0.06);
          border-radius: 16px;
          padding: 16px 18px;
        }

        .detail-label {
          margin: 0;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #7a6f68;
        }

        .detail-value {
          margin: 10px 0 0;
          font-size: 1.05rem;
          font-weight: 600;
          color: #201d1b;
          word-break: break-word;
          line-height: 1.5;
        }

        .profile-actions {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .profile-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 46px;
          padding: 0 18px;
          border-radius: 12px;
          font-weight: 700;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;
        }

        .profile-action:hover,
        .profile-action:focus-visible {
          transform: translateY(-1px);
        }

        .profile-action--primary {
          background: #211d1b;
          color: #fff;
          box-shadow: 0 12px 24px rgba(33, 29, 27, 0.14);
        }

        .profile-action--secondary {
          background: #fff;
          border: 1px solid rgba(33, 29, 27, 0.1);
          color: #1d1b1a;
          cursor: pointer;
        }

        .profile-action--text {
          color: #a9754a;
          padding-left: 4px;
          padding-right: 4px;
          border-radius: 8px;
        }

        @media (max-width: 700px) {
          .profile-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .profile-detail-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .profile-actions {
            align-items: stretch;
          }

          .profile-action--primary {
            width: 100%;
            flex: 1 1 100%;
          }
        }

        @media (max-width: 520px) {
          .profile-page {
            margin: 28px auto;
            padding: 16px;
          }

          .profile-card--details {
            padding: 20px 18px;
          }

          .profile-summary {
            align-items: flex-start;
          }

          .profile-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .profile-action {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
