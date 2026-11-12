import React, { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, firebaseConfigured } from "./firebase";

export default function App() {
  const [mode, setMode] = useState("login");
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
  }, []);

  function changeMode(nextMode) {
    setMode(nextMode);
    setError("");
    setNotice("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!firebaseConfigured || !auth) {
      setError("Firebase is not configured yet. Add your Firebase web app values to .env, then restart the dev server.");
      return;
    }

    setBusy(true);
    try {
      if (mode === "register") {
        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        if (name.trim()) await updateProfile(credential.user, { displayName: name.trim() });
        setNotice("Your account has been created.");
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        setNotice("You are signed in.");
      }
      setPassword("");
    } catch (err) {
      const messages = {
        "auth/email-already-in-use": "That email address already has an account.",
        "auth/invalid-email": "Enter a valid email address.",
        "auth/weak-password": "Choose a password with at least 6 characters.",
        "auth/invalid-credential": "Email or password is incorrect.",
        "auth/too-many-requests": "Too many attempts. Please wait and try again.",
        "auth/network-request-failed": "Network error. Check your connection and try again.",
      };
      setError(messages[err.code] || err.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleReset() {
    setError("");
    setNotice("");
    if (!auth || !firebaseConfigured) {
      setError("Configure Firebase first to use password reset.");
      return;
    }
    if (!email.trim()) {
      setError("Enter your email address first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setNotice("If an account exists for that email, a password reset message has been sent.");
    } catch (err) {
      setError(err.message || "Could not send the reset email.");
    }
  }

  async function handleSignOut() {
    if (auth) await signOut(auth);
    setNotice("You have signed out.");
  }

  return (
    <main className="page">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Northstar home">
          <span className="brand-icon">N</span><span>northstar</span>
        </a>
        <span className="top-note">A simple, secure account starter</span>
      </header>

      <section className="layout">
        <div className="story">
          <div className="eyebrow"><span className="pulse" /> YOUR SPACE STARTS HERE</div>
          <h1>Good things<br />start with <em>you.</em></h1>
          <p className="story-copy">A clean authentication starter built with React and Firebase. Create an account, sign in, and make this space your own.</p>
          <div className="trust"><span className="shield">✓</span><span>Authentication handled by Firebase</span></div>
          <div className="decor decor-one" /><div className="decor decor-two" />
        </div>

        <section className="auth-card" aria-label="Account access">
          {user ? (
            <div className="signed-in">
              <div className="avatar">{(user.displayName || user.email || "U").slice(0, 1).toUpperCase()}</div>
              <p className="eyebrow">YOU'RE SIGNED IN</p>
              <h2>Welcome{user.displayName ? `, ${user.displayName}` : " back"}.</h2>
              <p className="muted">Your Firebase Authentication session is active.</p>
              <div className="account-detail"><span>Email</span><strong>{user.email}</strong></div>
              <button className="primary full" onClick={handleSignOut}>Sign out</button>
            </div>
          ) : (
            <>
              <div className="card-heading">
                <p className="eyebrow">{mode === "login" ? "WELCOME BACK" : "GET STARTED"}</p>
                <h2>{mode === "login" ? "Sign in" : "Create account"}</h2>
                <p className="muted">{mode === "login" ? "Enter your details to access your account." : "A few details and you're ready to go."}</p>
              </div>

              <div className="tabs" role="tablist" aria-label="Account action">
                <button className={mode === "login" ? "tab active" : "tab"} onClick={() => changeMode("login")} role="tab" aria-selected={mode === "login"}>Sign in</button>
                <button className={mode === "register" ? "tab active" : "tab"} onClick={() => changeMode("register")} role="tab" aria-selected={mode === "register"}>Register</button>
              </div>

              <form onSubmit={handleSubmit}>
                {mode === "register" && (
                  <label>
                    Full name
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Morgan" autoComplete="name" required />
                  </label>
                )}
                <label>
                  Email address
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required />
                </label>
                <label>
                  Password
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={6} required />
                </label>
                {mode === "login" && <button type="button" className="text-button reset" onClick={handleReset}>Forgot password?</button>}
                {error && <p className="alert error" role="alert">{error}</p>}
                {notice && <p className="alert success" role="status">{notice}</p>}
                <button className="primary full" type="submit" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"} <span>→</span></button>
              </form>

              <p className="switch-copy">
                {mode === "login" ? "New around here?" : "Already have an account?"}
                <button className="text-button" onClick={() => changeMode(mode === "login" ? "register" : "login")}>{mode === "login" ? " Create an account" : " Sign in"}</button>
              </p>
              {!firebaseConfigured && <p className="config-hint">Setup needed: add your Firebase config to <code>.env</code>.</p>}
            </>
          )}
        </section>
      </section>
      <footer><span>© {new Date().getFullYear()} Northstar starter</span><span>React · Firebase Authentication</span></footer>
    </main>
  );
}
