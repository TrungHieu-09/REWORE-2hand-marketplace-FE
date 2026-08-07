"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) { setError("Please enter your full name."); return; }
    if (!email) { setError("Please enter your email address."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (!agree) { setError("Please agree to the Terms of Service and Privacy Policy."); return; }
    setError("");
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("rewore_authed", "true");
      setLoading(false);
      router.push("/shop");
    }, 1400);
  };

  const passwordStrength = (() => {
    if (password.length === 0) return null;
    if (password.length < 6) return "weak";
    if (password.length < 10 || !/[^a-zA-Z0-9]/.test(password)) return "medium";
    return "strong";
  })();

  return (
    <div className="auth-layout">
      <div className="auth-hero">
        <div className="auth-hero-bg">
          <Image
            src="/login-hero.png"
            alt="Vintage fashion editorial"
            fill
            style={{ objectFit: "cover", opacity: 0.82 }}
            priority
            sizes="50vw"
          />
          <div className="auth-hero-gradient" />
        </div>
        <div className="auth-hero-top">
          <a href="/" className="auth-brand-serif">EARTHEN ELEGANCE</a>
          <p className="auth-brand-sub">A Secondhand Dream</p>
        </div>
        <div className="auth-hero-bottom">
          <div className="auth-tagline-card">
            <h2 className="auth-tagline-title">Join a community that cares about fashion & planet.</h2>
            <p className="auth-tagline-desc">
              Create your free account and start discovering curated vintage pieces, live auction drops, and sustainable style.
            </p>
          </div>
          <div className="auth-hero-footer">
            <a href="/" className="auth-brand-primary">REWORE.</a>
            <div className="auth-trust-seal">
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#974226", fontVariationSettings: "'FILL' 1" }}>verified</span>
              <span>Trust Verified Platform</span>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-card">
          <div className="auth-mobile-logo">
            <a href="/" className="brand">REWORE</a>
          </div>
          <div className="auth-card-header">
            <h1 className="auth-card-title">Create your account</h1>
            <p className="auth-card-sub">Free forever. No credit card required.</p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit} id="registerForm" noValidate>
            <div className="auth-field">
              <label className="auth-label" htmlFor="fullName">Full Name</label>
              <div className="auth-input-wrap">
                <span className="material-symbols-outlined auth-input-icon">person</span>
                <input
                  id="fullName"
                  type="text"
                  className="auth-input"
                  placeholder="Jane Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            </div>
            <div className="auth-field">
              <label className="auth-label" htmlFor="reg-email">Email</label>
              <div className="auth-input-wrap">
                <span className="material-symbols-outlined auth-input-icon">mail</span>
                <input
                  id="reg-email"
                  type="email"
                  className="auth-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="auth-field">
              <label className="auth-label" htmlFor="reg-password">Password</label>
              <div className="auth-input-wrap">
                <span className="material-symbols-outlined auth-input-icon">lock</span>
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  className="auth-input auth-input-padded"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button type="button" className="auth-input-toggle" onClick={() => setShowPassword((v) => !v)} tabIndex={-1} aria-label="Toggle password">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              {passwordStrength && (
                <div className="auth-strength-wrap">
                  <div className={`auth-strength-bar auth-strength-${passwordStrength}`} />
                  <span className={`auth-strength-label auth-strength-label-${passwordStrength}`}>
                    {passwordStrength === "weak" ? "Weak" : passwordStrength === "medium" ? "Medium" : "Strong"}
                  </span>
                </div>
              )}
            </div>
            <div className="auth-field">
              <label className="auth-label" htmlFor="confirmPassword">Confirm Password</label>
              <div className="auth-input-wrap">
                <span className="material-symbols-outlined auth-input-icon">lock_reset</span>
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  className={`auth-input auth-input-padded${confirmPassword && confirmPassword !== password ? " auth-input-error" : confirmPassword && confirmPassword === password ? " auth-input-success" : ""}`}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button type="button" className="auth-input-toggle" onClick={() => setShowConfirm((v) => !v)} tabIndex={-1} aria-label="Toggle confirm password">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    {showConfirm ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              {confirmPassword && confirmPassword !== password && (
                <p className="auth-field-hint auth-field-hint-error">Passwords do not match</p>
              )}
              {confirmPassword && confirmPassword === password && (
                <p className="auth-field-hint auth-field-hint-success">Passwords match ✓</p>
              )}
            </div>
            <label className="auth-checkbox-label">
              <input
                type="checkbox"
                className="auth-checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                id="agreeTerms"
              />
              <span>
                I agree to the{" "}
                <a href="#" className="auth-link">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="auth-link">Privacy Policy</a>
              </span>
            </label>
            {error && (
              <div className="auth-error">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>error</span>
                {error}
              </div>
            )}
            <button type="submit" className="auth-btn-primary" id="create-account-btn" disabled={loading}>
              {loading ? (
                <><span className="auth-spinner" />Creating account…</>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person_add</span>
                  Create Account
                </>
              )}
            </button>
          </form>
          <p className="auth-signup-link">
            Already have an account?{" "}
            <a href="/login" className="auth-link">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
