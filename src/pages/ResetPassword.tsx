import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { resetPassword } from "../lib/auth";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setNotice(null);

    if (!email.trim()) {
      setError("Enter your email address to reset your password.");
      return;
    }

    try {
      setIsSubmitting(true);
      await resetPassword(email.trim());
      setNotice("Password reset email sent. Check your inbox and spam folder.");
      setEmail("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to send password reset email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f3efe7", padding: 24 }}>
      <section style={{ width: "100%", maxWidth: 480, background: "#fff", borderRadius: 18, padding: 32, boxShadow: "0 20px 45px rgba(17,17,17,0.08)" }}>
        <p style={{ margin: 0, textTransform: "uppercase", letterSpacing: 1.7, fontSize: 12, color: "#7b6653" }}>Account recovery</p>
        <h1 style={{ margin: "12px 0 8px", fontSize: 32 }}>Reset password</h1>
        <p style={{ margin: "0 0 24px", color: "#4d433b" }}>
          Enter the email address associated with your account and we’ll send a reset link.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 18 }}>
          <label style={{ display: "grid", gap: 8 }}>
            <span style={{ fontWeight: 600 }}>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@email.com"
              style={{ padding: "12px 14px", borderRadius: 10, border: "1px solid #d8cfc4", fontSize: 16 }}
            />
          </label>

          {error && <p style={{ margin: 0, color: "#9d2d2d", fontWeight: 600 }}>{error}</p>}
          {notice && <p style={{ margin: 0, color: "#1b6c3d", fontWeight: 600 }}>{notice}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              border: "none",
              borderRadius: 10,
              padding: "12px 18px",
              background: "#1f1f1f",
              color: "#fff",
              fontWeight: 700,
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <div style={{ marginTop: 18 }}>
          <Link to="/" style={{ color: "#3a2d25", fontWeight: 600 }}>Back to sign in</Link>
        </div>
      </section>
    </main>
  );
}
