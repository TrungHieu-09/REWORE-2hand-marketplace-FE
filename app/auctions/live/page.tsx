"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

/* ── Types ── */
type BidEntry = { user: string; initials: string; amount: number; ago: string };
type DemoState = "live" | "ending" | "won" | "outbid";

/* ── Mock data ── */
const BID_HISTORY: BidEntry[] = [
  { user: "@mai.vintage", initials: "M", amount: 570000, ago: "Just now" },
  { user: "@hieu_le",     initials: "H", amount: 550000, ago: "12s ago"  },
  { user: "@trang.n",     initials: "T", amount: 500000, ago: "45s ago"  },
  { user: "@dung_99",     initials: "D", amount: 480000, ago: "1m ago"   },
  { user: "@lan.anh",     initials: "L", amount: 450000, ago: "2m ago"   },
];

const THUMBNAILS = ["/product3.png", "/product1.png", "/product2.png"];

/* ── Helpers ── */
function fmt(n: number) {
  return "₫" + n.toLocaleString("vi-VN");
}

/* ── Countdown Hook ── */
function useCountdown(initSeconds: number) {
  const [sec, setSec] = useState(initSeconds);
  useEffect(() => {
    const id = setInterval(() => setSec((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return { display: `${m}:${s}`, seconds: sec };
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function LiveAuctionPage() {
  const [activeThumb, setActiveThumb] = useState(0);
  const [bidAmount, setBidAmount] = useState(590000);
  const [bids, setBids] = useState<BidEntry[]>(BID_HISTORY);
  const [demoState, setDemoState] = useState<DemoState>("live");
  const [bidPlaced, setBidPlaced] = useState(false);
  const [watching] = useState(42);
  const { display: timeDisplay, seconds } = useCountdown(
    demoState === "ending" ? 28 : 204
  );
  const historyRef = useRef<HTMLDivElement>(null);

  const isEndingSoon = seconds <= 30;
  const currentBid = bids[0]?.amount ?? 570000;

  function quickBid(increment: number) {
    const next = currentBid + increment;
    setBidAmount(next);
    placeBid(next);
  }

  function placeBid(amount = bidAmount) {
    if (amount <= currentBid) return;
    const newEntry: BidEntry = {
      user: "@you",
      initials: "Y",
      amount,
      ago: "Just now",
    };
    setBids((prev) => [newEntry, ...prev]);
    setBidAmount(amount + 20000);
    setBidPlaced(true);
    setTimeout(() => setBidPlaced(false), 2500);
    // scroll history to top
    historyRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="la-root">
      {/* ── Top bar ── */}
      <div className="la-topbar">
        <nav className="la-breadcrumb">
          <a href="/auctions" className="la-bc-link">Auctions</a>
          <span className="la-bc-sep">›</span>
          <span className="la-bc-cur">Archive Denim Jacket 90s</span>
        </nav>
        {/* Live pill */}
        <div className={`la-live-pill${isEndingSoon ? " ending" : ""}`}>
          <span className="la-live-dot" />
          {isEndingSoon ? "ENDING SOON" : "LIVE · CONNECTED"}
        </div>
      </div>

      {/* ── Main 3-column grid ── */}
      <div className="la-grid">

        {/* ══ LEFT: Product Panel ══ */}
        <aside className="la-product-panel">
          {/* Main image */}
          <div className="la-main-img-wrap">
            <Image
              src={THUMBNAILS[activeThumb]}
              alt="Archive Denim Jacket 90s"
              fill
              className="la-main-img"
              style={{ objectFit: "cover" }}
              sizes="400px"
            />
            <div className="la-est-badge">Est. ₫600k – ₫800k</div>
          </div>

          {/* Thumbnails */}
          <div className="la-thumbs">
            {THUMBNAILS.map((src, i) => (
              <button
                key={i}
                className={`la-thumb${activeThumb === i ? " active" : ""}`}
                onClick={() => setActiveThumb(i)}
              >
                <Image src={src} alt="" fill className="la-thumb-img" style={{ objectFit: "cover" }} sizes="80px" />
              </button>
            ))}
          </div>

          {/* Product info */}
          <div className="la-product-info">
            <h1 className="la-product-name">Archive Denim Jacket 90s</h1>
            <p className="la-product-desc">
              Authentic late 90s heavyweight denim sourced from Tokyo. Features natural fading, slight distressing on the cuffs, and original copper rivets.
            </p>
            <div className="la-product-tags">
              <span className="la-tag olive">Vintage</span>
              <span className="la-tag">Size: L</span>
              <span className="la-tag">Condition: Excellent</span>
            </div>
          </div>
        </aside>

        {/* ══ CENTER: Bid Panel ══ */}
        <main className="la-bid-panel">
          {/* Bid flash notification */}
          <div className={`la-bid-flash${bidPlaced ? " show" : ""}`}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check_circle</span>
            Your bid of {fmt(bids[0]?.amount)} was placed!
          </div>

          {/* Timer */}
          <div className="la-timer-section">
            <p className="la-timer-label">TIME REMAINING</p>
            <div className={`la-timer-digits${isEndingSoon ? " ending" : ""}`}>
              {timeDisplay}
            </div>
            {isEndingSoon && (
              <p className="la-timer-warning">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>warning</span>
                Bids placed in the last 30 seconds reset the timer.
              </p>
            )}
          </div>

          <div className="la-divider" />

          {/* Current bid */}
          <div className="la-current-bid-section">
            <p className="la-cb-label">Current Bid</p>
            <div className="la-cb-amount">{fmt(currentBid)}</div>
            <div className="la-cb-bidder">
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#556138", fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
              <span>{bids[0]?.user ?? "@mai.vintage"}</span>
            </div>
          </div>

          <div className="la-divider" />

          {/* Trust Score */}
          <div className="la-trust-row">
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#88726c" }}>shield_person</span>
            <span className="la-trust-text">Trust Score: 86</span>
            <span className="la-eligible-badge">Eligible</span>
          </div>

          {/* Quick bid buttons */}
          <div className="la-quick-bids">
            {[20000, 50000, 100000].map((inc) => (
              <button key={inc} className="la-quick-btn" onClick={() => quickBid(inc)}>
                + {fmt(inc).replace("₫", "₫")}
              </button>
            ))}
          </div>

          {/* Custom amount */}
          <div className="la-custom-bid-row">
            <span className="la-currency-prefix">₫</span>
            <input
              className="la-bid-input"
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(Number(e.target.value))}
              min={currentBid + 10000}
              step={10000}
            />
          </div>

          {/* Place Bid */}
          <button
            className="la-place-bid-btn"
            onClick={() => placeBid()}
            disabled={bidAmount <= currentBid}
          >
            Place Bid
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
          </button>

          {!isEndingSoon && (
            <p className="la-reset-note">Bids placed in the last 30 seconds reset the timer.</p>
          )}

          {/* Demo state switcher */}
          <div className="la-demo-switcher">
            <span className="la-demo-label">Demo States</span>
            <select
              className="la-demo-select"
              value={demoState}
              onChange={(e) => setDemoState(e.target.value as DemoState)}
            >
              <option value="live">Normal Live</option>
              <option value="ending">Ending Soon</option>
              <option value="won">Won</option>
              <option value="outbid">Outbid</option>
            </select>
          </div>
        </main>

        {/* ══ RIGHT: Live Sidebar ══ */}
        <aside className="la-sidebar">
          {/* Watchers */}
          <div className="la-watchers-card">
            <div className="la-watcher-stat">
              <span className="la-watcher-num">{watching}</span>
              <span className="la-watcher-lbl">WATCHING</span>
            </div>
            <div className="la-watcher-divider" />
            <div className="la-watcher-stat">
              <span className="la-watcher-num">{bids.length}</span>
              <span className="la-watcher-lbl">ACTIVE</span>
            </div>
          </div>

          {/* Live history */}
          <div className="la-history-card">
            <div className="la-history-header">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>history</span>
              LIVE HISTORY
            </div>
            <div className="la-history-list" ref={historyRef}>
              {bids.map((b, i) => (
                <div
                  key={i}
                  className={`la-history-row${i === 0 ? " top-bid" : ""}`}
                >
                  <div
                    className="la-hist-avatar"
                    style={{
                      background: i === 0 ? "#feeadc" : "#f2dfd1",
                      color: i === 0 ? "#974226" : "#55433d",
                    }}
                  >
                    {b.initials}
                  </div>
                  <div className="la-hist-info">
                    <span className="la-hist-user">{b.user}</span>
                    <span className="la-hist-ago">{b.ago}</span>
                  </div>
                  <span className={`la-hist-amount${i === 0 ? " top" : ""}`}>
                    {fmt(b.amount).replace("₫", "₫").replace("000", "k").slice(0, -3) + "k"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Seller info */}
          <div className="la-seller-card">
            <p className="la-seller-title">Sold by</p>
            <div className="la-seller-row">
              <div className="la-seller-avatar">M</div>
              <div>
                <p className="la-seller-name">@mai.vintage</p>
                <p className="la-seller-meta">⭐ 4.9 · 47 trades</p>
              </div>
              <span className="material-symbols-outlined la-seller-verified" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
            </div>
            <div className="la-seller-stats">
              <div className="la-seller-stat">
                <span className="la-ss-val">100%</span>
                <span className="la-ss-lbl">Response</span>
              </div>
              <div className="la-seller-stat">
                <span className="la-ss-val">24h</span>
                <span className="la-ss-lbl">Avg ship</span>
              </div>
              <div className="la-seller-stat">
                <span className="la-ss-val">0</span>
                <span className="la-ss-lbl">Disputes</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
