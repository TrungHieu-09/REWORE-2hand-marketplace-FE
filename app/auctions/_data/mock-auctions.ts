export type AuctionStatus = "live" | "starts_soon" | "starts_tomorrow" | "upcoming";
export type AuctionCategory = "All" | "Outerwear" | "Denim" | "Tops" | "Accessories";

export interface Auction {
  id: string;
  title: string;
  category: Exclude<AuctionCategory, "All">;
  imageUrl: string;
  imageAlt: string;
  status: AuctionStatus;
  currentBid?: number;
  startingBid?: number;
  endsInSeconds?: number;   // for live items
  startsInLabel?: string;   // "2h", "Tomorrow", etc.
  watcherCount: number;
}

export interface ActiveBid {
  id: string;
  title: string;
  imageUrl: string;
  yourBid: number;
  status: "winning" | "outbid";
}

export const FEATURED_AUCTIONS: Auction[] = [
  {
    id: "fa-001",
    title: "Vintage 70s Suede Bomber",
    category: "Outerwear",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDFVuR2fnpS5gWO97s5QLus64HOBV9VTsTN0DsspNECX-QH_hjl8KU3LZI84u4RLktyrCuQZOnhvyHRK0BWCJTuAXKphGZsM5eQfUNfNFcqjll-LfYR_7UaAdQcNvDNM-KSAbmhAt4bh629sbMr0_6Hj9m-oWqx6q9oOj1tKd1u4Ha_SKf95a-nMO5m2kJYqNfJ9mjU3E-6djPCAMfU_Z2gvrgmHdyi89gtn3mTjtLbwFqh7kh30TACUB29t1OLcmFUHtYz4gaDFjU",
    imageAlt: "Vintage 1970s tan suede bomber jacket on warm cream background",
    status: "live",
    currentBid: 1200000,
    endsInSeconds: 262,
    watcherCount: 42,
  },
  {
    id: "fa-002",
    title: "Archive Leather Saddle Bag",
    category: "Accessories",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBb4aASgtYHCT16LloD34EYw6xWTjshamhrg8oCfNLL0c0XWYSWzQhuFV4vPzQY1CLlrpB7XlbiwMKW-7RnJ-MTNmwGVfv1zKop5LIr-y1rBrkKosXAXgkiAbua8kdHjn_1Vg64ltzl6gVo9ezpaOqCprDNK8fLqk4EWSCEyh_X8sV8c0sV48Xiky5P4tnCDyn_2DM7MSsod26yN1WBbYKKeq4Y3Q6p9earGHLgxccrpJ7mFbsRC3WxdzAPwU7jTWREefubB7prmsk",
    imageAlt: "Pre-loved designer leather saddle bag in rich mahogany on stone plinth",
    status: "live",
    currentBid: 3450000,
    endsInSeconds: 725,
    watcherCount: 89,
  },
];

export const GRID_AUCTIONS: Auction[] = [
  {
    id: "ga-001",
    title: "Selvedge Raw Denim, 1990s",
    category: "Denim",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBNWOoz2Mz0au1wcDPgHK0-H_wyLhKrAg1RjCq9a6qHnWBV_eMkG3Cs0gPj3y5bHm2EnXNMI9Gg0oiIKuNb3CLhhl4sYlkbd7t5CIQKhx-DkefK0tasgRRxiaV8nrWb68zkIjp3h57IvQMDxZZWGw3zX39sJwZ54TG42nOXn6JnMRmygSz4pzJFrz7TVRpMlcUJQLlQZgHQfioOkzltZyKOsCHXsjDZXZrcESqyMOv-mppp0FOEPaLYMb8tB7kukGU06y1JGJpouy4",
    imageAlt: "Perfectly faded vintage raw denim jeans on cream linen surface",
    status: "starts_soon",
    startsInLabel: "2h",
    startingBid: 800000,
    watcherCount: 15,
  },
  {
    id: "ga-002",
    title: "Hand-knit Wool Cardigan",
    category: "Tops",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAhENeJeR4PpN-1zre9tXMXSof1EFMSc7hgCGP3e0-hyrLriLw1niFl9H1JAy6Lfq9ONKW_y1g8Fu2aunDLmsWuisu5QbljOhedVo5WcLsQ79gEe22gl6PYzQTcHnxKcXcGCrj0ZzON4Y3gyrNpdwn9Y3jQznN4vvxeO-t7o9VHoEpDsSICmEkzmH-o6LaYV3R1RaOGazvGgmnbd7_cZqhTW-HeK2vqN6EtuXWvlxjoBRsnFP7GnB_OlmyUiOWGuhkKSVut2hY9fhA",
    imageAlt: "Chunky knit wool sweater in deep olive green draped over wooden stool",
    status: "live",
    currentBid: 550000,
    endsInSeconds: 2712,
    watcherCount: 34,
  },
  {
    id: "ga-003",
    title: "Artisan Silver Cuffs (Set of 2)",
    category: "Accessories",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCh0nOVbFvzwfMzghDK1Lq136XkGvSLMS2NnFBFIaJtpIHrbVnuXeYFATMmRcymuC8ve7Wm3oQ6_wRP3qh3bhD6XnefrDVRreZ7Vr5hV8e1kgcsEdLNCSRhZZ5dy6eyhexM-hDLw9MIbm0y6cHoeQxZd1zKs6ydbwbFqtnD1bNpGTgHn95ItTMIAJxcZ12Cwdl0SInS58guNfeZv1O6rUZZkqQ-1qM-X2DeSJYn4p9vwSIXFemdHi9ecJMH0EDqkVrFEKY03HMRCyI",
    imageAlt: "Vintage silver cuff bracelets with intricate details on linen cloth",
    status: "starts_tomorrow",
    startingBid: 1500000,
    watcherCount: 112,
  },
];

export const ACTIVE_BIDS: ActiveBid[] = [
  {
    id: "bid-001",
    title: "Vintage Silk Scarf",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBXw5ucSmnBZDJkC8wf6-Nk_5DMSagcduF7OqriNk9By5RxC4cGLqhm3UhX0GNrAjiOcqmsF7qUBAJY1b4oAR1ysSxO4zBM9o82--CtQ4LjRQw2zYuHpSBb6IUGAuClV2wmTbywCU1hU237N5gRGMf7xJSV5tv_80ZUtIUKYkC_gkXKqGodyAHBOzlpKZKALCVBvmhjYtlK_48jHeYX81gupFsvNm2kFUUKkmFWqE1apdOZRPX5QvOMdlkDcreEtqc1e1ez4k8Hk8g",
    yourBid: 250000,
    status: "winning",
  },
  {
    id: "bid-002",
    title: "Brass Buckle Belt",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCdu0OW3O0g3xsMx9CK-dfBthBzh997fpysFvX14Egy6XdXAkINhfXrJDeo9uxe06tbKAQx-eE1d7oEsXvsQiiji_YU5EAcIRWYecgvLUq_ohjQuzuCKj1fLpw2bPUhdRyb3JR8eYN563vH0SaOW69OcBylrUt0udPBS9GXavnmExXXvEvFpF3ZLBmuDB1QZ6kq837ezpxlPzRUXK6LRxN_do-4MSaIWfQtlS5W1PiTPSlzVMBb6son9Nn8_-APoHZuyPu53WNCDb4",
    yourBid: 400000,
    status: "outbid",
  },
];

export const CATEGORIES: AuctionCategory[] = [
  "All",
  "Outerwear",
  "Denim",
  "Tops",
  "Accessories",
];
