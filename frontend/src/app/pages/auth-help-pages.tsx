import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { downloadContent } from "../../core/utils";

export function AuthLoginPage({ onLogin }: { onLogin: (email: string) => void }) {
  const [email, setEmail] = useState(() => localStorage.getItem("life-os-remembered-email") ?? "");
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(() => localStorage.getItem("life-os-remember-email") === "true");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lastAttemptAt, setLastAttemptAt] = useState<string | null>(null);
  const emailDomain = email.includes("@") ? email.split("@")[1] : "";
  const loginPayload = { email: email.trim().toLowerCase(), rememberEmail };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setLastAttemptAt(new Date().toISOString());
    if (!email.trim() || !password.trim()) {
      setFailedAttempts((current) => current + 1);
      return;
    }
    localStorage.setItem("life-os-remember-email", String(rememberEmail));
    if (rememberEmail) localStorage.setItem("life-os-remembered-email", email.trim().toLowerCase());
    else localStorage.removeItem("life-os-remembered-email");
    onLogin(email.trim().toLowerCase());
    setFailedAttempts(0);
    setDone(true);
  };

  return (
    <section>
      <h2>Login</h2>
      <form className="stack" onSubmit={onSubmit}>
        <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
        <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
        <label>
          <input type="checkbox" checked={showPassword} onChange={(event) => setShowPassword(event.target.checked)} /> Show password
        </label>
        <label>
          <input type="checkbox" checked={rememberEmail} onChange={(event) => setRememberEmail(event.target.checked)} /> Remember email preference
        </label>
        <button type="submit">Login</button>
        <button type="button" onClick={() => { setEmail(""); setPassword(""); setDone(false); }}>
          Clear Form
        </button>
      </form>
      <div className="cards">
        <Link to="/auth/register">Create account</Link>
        <Link to="/auth/reset">Reset password</Link>
        <button type="button" onClick={() => void navigator.clipboard?.writeText(email)} disabled={!email.trim()}>
          Copy Email
        </button>
        <button type="button" onClick={() => downloadContent(JSON.stringify(loginPayload, null, 2), "life-os-login-payload.json", "application/json")} disabled={!email.trim()}>
          Export Login Payload
        </button>
        <button type="button" onClick={() => downloadContent(`email=${loginPayload.email}\nremember=${loginPayload.rememberEmail}`, "life-os-login-payload.txt", "text/plain")} disabled={!email.trim()}>
          Export Login Payload TXT
        </button>
        <button type="button" onClick={() => setEmail(localStorage.getItem("life-os-remembered-email") ?? "")}>
          Use Remembered Email
        </button>
        <article className="card">Email domain: {emailDomain || "n/a"}</article>
        <article className="card">Password length: {password.length}</article>
        <article className="card">Failed attempts: {failedAttempts}</article>
        <article className="card">Last attempt: {lastAttemptAt ? new Date(lastAttemptAt).toLocaleTimeString() : "n/a"}</article>
      </div>
      {done ? <p>Logged in locally.</p> : null}
    </section>
  );
}

export function AuthRegisterPage({ onRegister }: { onRegister: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptUpdates, setAcceptUpdates] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [done, setDone] = useState(false);
  const passwordStrongEnough = password.length >= 8;
  const passwordsMatch = password === confirmPassword;
  const emailLocalPart = email.includes("@") ? email.split("@")[0] : email;
  const registerPayload = { email: email.trim().toLowerCase(), acceptUpdates };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password.trim() || !passwordStrongEnough || !passwordsMatch || !acceptTerms) return;
    localStorage.setItem("life-os-marketing-opt-in", String(acceptUpdates));
    onRegister(email.trim().toLowerCase());
    setDone(true);
  };

  return (
    <section>
      <h2>Register</h2>
      <form className="stack" onSubmit={onSubmit}>
        <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
        <input type={showPasswords ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
        <input type={showPasswords ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm password" />
        <label>
          <input type="checkbox" checked={showPasswords} onChange={(event) => setShowPasswords(event.target.checked)} /> Show passwords
        </label>
        <label>
          <input type="checkbox" checked={acceptUpdates} onChange={(event) => setAcceptUpdates(event.target.checked)} /> Receive product updates
        </label>
        <label>
          <input type="checkbox" checked={acceptTerms} onChange={(event) => setAcceptTerms(event.target.checked)} /> Accept local terms
        </label>
        <article className="card">Password strength: {passwordStrongEnough ? "ok" : "min 8 chars"}</article>
        <article className="card">Passwords match: {passwordsMatch ? "yes" : "no"}</article>
        <button type="submit">Create Account</button>
      </form>
      <div className="cards">
        <Link to="/auth/login">Already have an account?</Link>
        <button type="button" onClick={() => void navigator.clipboard?.writeText(email)} disabled={!email.trim()}>
          Copy Email
        </button>
        <button type="button" onClick={() => downloadContent(JSON.stringify(registerPayload, null, 2), "life-os-register-payload.json", "application/json")} disabled={!email.trim()}>
          Export Register Payload
        </button>
        <button type="button" onClick={() => downloadContent(`email=${registerPayload.email}\nupdates=${registerPayload.acceptUpdates}`, "life-os-register-payload.txt", "text/plain")} disabled={!email.trim()}>
          Export Register Payload TXT
        </button>
        <button type="button" onClick={() => { setEmail(""); setPassword(""); setConfirmPassword(""); setAcceptUpdates(false); setAcceptTerms(false); setDone(false); }}>
          Clear Form
        </button>
        <button type="button" onClick={() => setEmail("sample@lifeos.app")}>
          Use Sample Email
        </button>
        <article className="card">Email local-part: {emailLocalPart || "n/a"}</article>
        <article className="card">Updates opt-in: {acceptUpdates ? "yes" : "no"}</article>
      </div>
      {done ? <p>Account created locally and signed in.</p> : null}
    </section>
  );
}

export function AuthResetPage() {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState<"forgot" | "security" | "rotation">("forgot");
  const [includeRecentActivity, setIncludeRecentActivity] = useState(false);
  const [done, setDone] = useState(false);
  const resetPayload = { email: email.trim(), reason, includeRecentActivity };
  const resetTip = reason === "security" ? "Consider rotating active sessions too." : reason === "rotation" ? "Schedule regular updates." : "Use account recovery if needed.";

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  };

  return (
    <section>
      <h2>Password Reset</h2>
      <form className="stack" onSubmit={onSubmit}>
        <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
        <select value={reason} onChange={(event) => setReason(event.target.value as typeof reason)}>
          <option value="forgot">Forgot password</option>
          <option value="security">Security concern</option>
          <option value="rotation">Routine rotation</option>
        </select>
        <label>
          <input type="checkbox" checked={includeRecentActivity} onChange={(event) => setIncludeRecentActivity(event.target.checked)} /> Include recent account activity
        </label>
        <button type="submit">Send Reset Link</button>
      </form>
      <div className="cards">
        <button type="button" onClick={() => downloadContent(JSON.stringify(resetPayload, null, 2), "life-os-reset-request.json", "application/json")} disabled={!email.trim()}>
          Export Reset Request JSON
        </button>
        <button type="button" onClick={() => void navigator.clipboard?.writeText(JSON.stringify(resetPayload))} disabled={!email.trim()}>
          Copy Reset Payload
        </button>
        <button type="button" onClick={() => void navigator.clipboard?.writeText(email)} disabled={!email.trim()}>
          Copy Email
        </button>
        <button type="button" onClick={() => setEmail(localStorage.getItem("life-os-auth-email") ?? "")}>
          Use Current Auth Email
        </button>
        <button type="button" onClick={() => downloadContent(`email=${resetPayload.email}\nreason=${resetPayload.reason}\nincludeRecentActivity=${resetPayload.includeRecentActivity}`, "life-os-reset-request.txt", "text/plain")} disabled={!email.trim()}>
          Export Reset Request TXT
        </button>
        <button type="button" onClick={() => { setEmail(""); setReason("forgot"); setIncludeRecentActivity(false); setDone(false); }}>
          Clear Form
        </button>
        <article className="card">Reset reason: {reason}</article>
        <article className="card">{resetTip}</article>
      </div>
      {done ? <p>Reset instruction queued locally.</p> : null}
    </section>
  );
}

export function HelpPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | "navigation" | "sync" | "data" | "coach">("all");
  const helpItems = [
    { category: "navigation", text: "Use Global Search to query Journal, Notes, Tasks, and Storage records." },
    { category: "sync", text: "Use Sync page to monitor queue operations and trigger sync." },
    { category: "data", text: "Use Export/Import pages for JSON, Markdown, CSV backups and restores." },
    { category: "coach", text: "Use Coach page for reviews, notifications, life moments, and insight actions." },
  ];
  const visibleItems = helpItems.filter((item) => {
    const categoryMatch = category === "all" || item.category === category;
    const textMatch = !search.trim() || item.text.toLowerCase().includes(search.trim().toLowerCase());
    return categoryMatch && textMatch;
  });
  const visibleCategories = Array.from(new Set(visibleItems.map((item) => item.category)));
  return (
    <section>
      <h2>Help</h2>
      <div className="cards">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search help topics" />
        <select value={category} onChange={(event) => setCategory(event.target.value as typeof category)}>
          <option value="all">All categories</option>
          <option value="navigation">Navigation</option>
          <option value="sync">Sync</option>
          <option value="data">Data</option>
          <option value="coach">Coach</option>
        </select>
        <button type="button" onClick={() => downloadContent(visibleItems.map((item) => `- (${item.category}) ${item.text}`).join("\n"), "life-os-help-visible.md", "text/markdown")} disabled={visibleItems.length === 0}>
          Export Visible Help MD
        </button>
        <button type="button" onClick={() => void navigator.clipboard?.writeText(visibleItems.map((item) => item.text).join("\n"))} disabled={visibleItems.length === 0}>
          Copy Visible Help
        </button>
        <button type="button" onClick={() => downloadContent(JSON.stringify(visibleItems, null, 2), "life-os-help-visible.json", "application/json")} disabled={visibleItems.length === 0}>
          Export Visible Help JSON
        </button>
        <button type="button" onClick={() => downloadContent(visibleItems.map((item) => `${item.category}: ${item.text}`).join("\n"), "life-os-help-visible.txt", "text/plain")} disabled={visibleItems.length === 0}>
          Export Visible Help TXT
        </button>
        <button type="button" onClick={() => void navigator.clipboard?.writeText(visibleCategories.join(", "))} disabled={visibleCategories.length === 0}>
          Copy Categories
        </button>
        <button type="button" onClick={() => { setSearch(""); setCategory("all"); }}>
          Reset Help Filters
        </button>
        <Link to="/export">Open Export</Link>
        <Link to="/import">Open Import</Link>
        <Link to="/settings">Open Settings</Link>
        <article className="card">Visible help items: {visibleItems.length}</article>
        <article className="card">Visible categories: {visibleCategories.join(", ") || "none"}</article>
      </div>
      <ul className="stack">
        {visibleItems.map((item) => (
          <li key={`${item.category}-${item.text}`} className="card">
            [{item.category}] {item.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
