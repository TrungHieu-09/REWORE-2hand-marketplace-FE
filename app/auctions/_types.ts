export type AuctionStatus = "live" | "starts_soon" | "starts_tomorrow" | "upcoming";
export type AuctionCategory = string;

export interface Auction {
  id: string;
  title: string;
  category: string;
  imageUrl?: string;
  imageAlt: string;
  status: AuctionStatus;
  currentBid?: number;
  startingBid?: number;
  endsInSeconds?: number;
  startsInLabel?: string;
  watcherCount: number;
}
