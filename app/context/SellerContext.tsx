"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
export type VerificationStatus = "none" | "pending" | "approved" | "rejected";

export interface SellerKycData {
  fullName: string;
  dob: string;
  idNumber: string;
  filesCount: number; // 0-3 docs uploaded
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
  submitVerification: (data: SellerKycData) => void;
  simulateApproval: () => void;
  simulateRejection: (reason?: string) => void;
  resetSeller: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Default / helpers
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_STATE: SellerState = {
  isSeller: false,
  sellerScore: 0,
  verificationStatus: "none",
  kycData: null,
};

const STORAGE_KEY = "rewore_seller";

function loadState(): SellerState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return JSON.parse(raw) as SellerState;
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(s: SellerState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

/**
 * Calculate seller score from KYC data.
 * Baseline 50 + bonuses per logic spec.
 */
function calcScore(data: SellerKycData): number {
  let score = 50;
  if (data.fullName && data.dob && data.idNumber) score += 20; // verified ID
  if (data.accountNumber && data.accountHolder) score += 10;   // linked payout
  score += 10; // verified email/phone (assumed for demo)
  return Math.min(score, 100);
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────
const SellerContext = createContext<SellerContextType>({
  sellerState: DEFAULT_STATE,
  submitVerification: () => {},
  simulateApproval: () => {},
  simulateRejection: () => {},
  resetSeller: () => {},
});

export function SellerProvider({ children }: { children: React.ReactNode }) {
  const [sellerState, setSellerState] = useState<SellerState>(DEFAULT_STATE);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setSellerState(loadState());
  }, []);

  const persist = useCallback((next: SellerState) => {
    setSellerState(next);
    saveState(next);
  }, []);

  const submitVerification = useCallback(
    (data: SellerKycData) => {
      const next: SellerState = {
        isSeller: false,
        sellerScore: calcScore(data),
        verificationStatus: "pending",
        kycData: data,
      };
      persist(next);
    },
    [persist]
  );

  const simulateApproval = useCallback(() => {
    setSellerState((prev) => {
      const next: SellerState = {
        ...prev,
        isSeller: true,
        verificationStatus: "approved",
        sellerScore: prev.sellerScore, // already calculated on submit
      };
      saveState(next);
      return next;
    });
  }, []);

  const simulateRejection = useCallback(
    (reason = "ID photo was unclear or information did not match.") => {
      setSellerState((prev) => {
        const next: SellerState = {
          ...prev,
          isSeller: false,
          verificationStatus: "rejected",
          rejectionReason: reason,
        };
        saveState(next);
        return next;
      });
    },
    []
  );

  const resetSeller = useCallback(() => {
    persist(DEFAULT_STATE);
  }, [persist]);

  return (
    <SellerContext.Provider
      value={{
        sellerState,
        submitVerification,
        simulateApproval,
        simulateRejection,
        resetSeller,
      }}
    >
      {children}
    </SellerContext.Provider>
  );
}

export const useSeller = () => useContext(SellerContext);
