"use client";

import { createContext, useContext, useMemo } from "react";
import { useAuth } from "./AuthContext";
import type { SellerStatus } from "@/app/lib/api";

export type VerificationStatus = "none" | "pending" | "approved" | "rejected" | "suspended";

export interface SellerKycData {
  fullName: string;
  dob: string;
  idNumber: string;
  filesCount: number;
  payoutType: "bank" | "ewallet";
  bank: string;
  accountNumber: string;
  accountHolder: string;
}

export interface SellerState {
  isSeller: boolean;
  sellerScore: number;
  verificationStatus: VerificationStatus;
  kycData: SellerKycData | null;
  rejectionReason?: string;
}

interface SellerContextType {
  sellerState: SellerState;
  submitVerification: (_data: SellerKycData) => void;
  resetSeller: () => void;
}

const DEFAULT_STATE: SellerState = {
  isSeller: false,
  sellerScore: 0,
  verificationStatus: "none",
  kycData: null,
};

const statusToVerification = (status?: SellerStatus): VerificationStatus => {
  if (status === "APPROVED") return "approved";
  if (status === "PENDING" || status === "PENDING_VERIFICATION") return "pending";
  if (status === "REJECTED") return "rejected";
  if (status === "SUSPENDED") return "suspended";
  return "none";
};

const SellerContext = createContext<SellerContextType>({
  sellerState: DEFAULT_STATE,
  submitVerification: () => {},
  resetSeller: () => {},
});

export function SellerProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const sellerState = useMemo<SellerState>(() => {
    const verificationStatus = statusToVerification(user?.sellerStatus);
    const isSeller = user?.role === "SELLER" && verificationStatus === "approved";

    return {
      isSeller,
      sellerScore: user?.reputation ?? 0,
      verificationStatus,
      kycData: null,
      rejectionReason: user?.sellerSuspendedReason ?? undefined,
    };
  }, [user?.reputation, user?.role, user?.sellerStatus, user?.sellerSuspendedReason]);

  return (
    <SellerContext.Provider
      value={{
        sellerState,
        submitVerification: () => {},
        resetSeller: () => {},
      }}
    >
      {children}
    </SellerContext.Provider>
  );
}

export const useSeller = () => useContext(SellerContext);
