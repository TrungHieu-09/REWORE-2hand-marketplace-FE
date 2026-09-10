"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, getPendingOtpEmail, setPendingOtpEmail } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";

function initialEmail() {
  if (typeof window === "undefined") return "";
  const emailParam = new URLSearchParams(window.location.search).get("email");
  if (emailParam && emailParam !== "undefined" && emailParam !== "null") {
    return emailParam;
  }
  return getPendingOtpEmail();
}

export default function VerifyOtpPage() {
  const router = useRouter();
  const { verifyOtp, resendOtp } = useAuth();
  const [email, setEmail] = useState(() => initialEmail());
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [message, setMessage] = useState("Enter the 6-digit OTP sent to your email.");
  const [error, setError] = useState("");

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setInterval(() => {
      setCooldown((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [cooldown]);

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    const cleanEmail = email.trim();
    const cleanOtp = otp.trim();
    if (!cleanEmail) {
      setError("Please enter your email.");
      return;
    }
    if (!/^\d{6}$/.test(cleanOtp)) {
      setError("OTP must be 6 digits.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await verifyOtp(cleanEmail, cleanOtp);
      router.push("/shop");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError("Please enter your email before resending OTP.");
      return;
    }

    setError("");
    setResending(true);
    try {
      const res = await resendOtp(cleanEmail);
      setMessage(res.message || "OTP resent.");
      setCooldown(60);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.retryAfter) setCooldown(err.retryAfter);
        if (err.email) {
          setEmail(err.email);
          setPendingOtpEmail(err.email);
        }
      } else {
        setError("Unable to resend OTP.");
      }
    } finally {
      setResending(false);
    }
  };

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
          <Link href="/" className="auth-brand-serif">EARTHEN ELEGANCE</Link>
          <p className="auth-brand-sub">A Secondhand Dream</p>
        </div>
        <div className="auth-hero-bottom">
          <div className="auth-tagline-card">
            <h2 className="auth-tagline-title">One more stitch before you enter.</h2>
            <p className="auth-tagline-desc">
              Verify your email to protect bidding, wishlist, and seller activity on REWORE.
            </p>
          </div>
          <div className="auth-hero-footer">
            <Link href="/" className="auth-brand-primary">REWORE.</Link>
            <div className="auth-trust-seal">
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#974226", fontVariationSettings: "'FILL' 1" }}>verified</span>
              <span>Email Verification</span>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-card">
          <div className="auth-mobile-logo">
            <Link href="/" className="brand">REWORE</Link>
          </div>

          <div className="auth-card-header">
            <h1 className="auth-card-title">Verify your email</h1>
            <p className="auth-card-sub">{message}</p>
          </div>

          {!email && (
            <div className="auth-error">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>error</span>
              Please register or log in again so we know which email to verify.
            </div>
          )}

          <form className="auth-form" onSubmit={handleVerify} noValidate>
            <div className="auth-field">
              <label className="auth-label">Email</label>
              <div className="auth-input-wrap">
                <span className="material-symbols-outlined auth-input-icon">mail</span>
                <div className="auth-input flex items-center text-[#55443d]">
                  {email || "No email selected"}
                </div>
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="otp-code">OTP Code</label>
              <div className="auth-input-wrap">
                <span className="material-symbols-outlined auth-input-icon">pin</span>
                <input
                  id="otp-code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  className="auth-input"
                  placeholder="123456"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  autoComplete="one-time-code"
                />
              </div>
            </div>

            {error && (
              <div className="auth-error">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>error</span>
                {error}
              </div>
            )}

            <button type="submit" className="auth-btn-primary" disabled={loading || !email}>
              {loading ? (
                <><span className="auth-spinner" />Verifying...</>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>verified_user</span>
                  Verify OTP
                </>
              )}
            </button>
          </form>

          <p className="auth-signup-link">
            Didn&apos;t receive it?{" "}
            <button
              type="button"
              className="auth-link"
              disabled={resending || cooldown > 0 || !email}
              onClick={handleResend}
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : resending ? "Resending..." : "Resend OTP"}
            </button>
          </p>
          <p className="auth-signup-link">
            Already verified? <Link href="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
