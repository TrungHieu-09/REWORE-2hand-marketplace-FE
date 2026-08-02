export default function Ticker() {
  const items = [
    "Sustainable Fashion", "Curated Vintage Drops", "Trust Score Verified",
    "Live Auctions", "Circular Commerce", "One-of-One Pieces", "Conscious Wardrobing",
    "Sustainable Fashion", "Curated Vintage Drops", "Trust Score Verified",
    "Live Auctions", "Circular Commerce", "One-of-One Pieces", "Conscious Wardrobing",
  ];
  return (
    <div className="ticker-wrap">
      <div className="ticker-track">
        {items.map((item, i) => (
          <span key={i}>✦ {item}</span>
        ))}
      </div>
    </div>
  );
}
