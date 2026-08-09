"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import { useSeller } from "../../../context/SellerContext";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type Step = 1 | 2 | 3;
type PayoutType = "bank" | "ewallet";

interface Step1Data {
  fullName: string;
  dob: string;
  idNumber: string;
  files: { front: File | null; back: File | null; selfie: File | null };
}

interface Step2Data {
  payoutType: PayoutType;
  bank: string;
  accountNumber: string;
  accountHolder: string;
}

const BANKS = [
  "Vietcombank", "Techcombank", "MB Bank", "VPBank",
  "BIDV", "VietinBank", "TPBank", "Agribank", "ACB", "SHB",
];

// ─────────────────────────────────────────────────────────────────────────────
// Progress Bar (UI 10 / 11 style — left-aligned label above 3 segments)
// ─────────────────────────────────────────────────────────────────────────────
function StepHeader({ step, label }: { step: Step; label: string }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-bold text-[#974226] uppercase tracking-[0.12em]">
          Step {step} of 3 — {label}
        </p>
      </div>
      <div className="flex gap-1.5 w-full h-1.5">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 rounded-full transition-all duration-500 ${
              s <= step ? "bg-[#974226]" : "bg-[#f2dfd1]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Upload Dropzone
// ─────────────────────────────────────────────────────────────────────────────
function UploadZone({
  icon, label, hint, file, wide, error, onChange,
}: {
  icon: string; label: string; hint?: string;
  file: File | null; wide?: boolean; error?: boolean;
  onChange: (f: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) onChange(f);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-7 flex flex-col items-center justify-center gap-3 cursor-pointer group transition-all duration-200 ${
        wide ? "col-span-2" : ""
      } ${
        file
          ? "border-[#6d7a4f] bg-[#dae9b5]/20"
          : error
          ? "border-[#ba1a1a]/50 bg-[#ffdad6]/10"
          : "border-[#974226]/40 bg-[#feeadc]/20 hover:bg-[#feeadc]/50 hover:border-[#974226]/60"
      }`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,application/pdf"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
          file ? "bg-[#6d7a4f] scale-105" : error ? "bg-[#ba1a1a]/10" : "bg-[#974226]/10 group-hover:scale-105"
        }`}
      >
        <span
          className={`material-symbols-outlined text-[22px] ${
            file ? "text-white" : error ? "text-[#ba1a1a]" : "text-[#974226]"
          }`}
          style={{ fontVariationSettings: file ? "'FILL' 1" : "'FILL' 0" }}
        >
          {file ? "check_circle" : icon}
        </span>
      </div>
      <div className="text-center">
        <span className="block text-[14px] font-semibold text-[#231a11]">
          {file ? file.name : label}
        </span>
        {!file && hint && (
          <span className="block text-[12px] text-[#88726c] mt-0.5">{hint}</span>
        )}
        {file && (
          <span className="block text-[12px] text-[#6d7a4f] mt-0.5">✓ Uploaded — click to replace</span>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Field wrapper with error
// ─────────────────────────────────────────────────────────────────────────────
function Field({ label, error, children, className = "" }: {
  label: string; error?: string; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[13px] font-semibold text-[#231a11]">{label}</label>
      {children}
      {error && (
        <span className="flex items-center gap-1 text-[12px] text-[#ba1a1a]">
          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
          {error}
        </span>
      )}
    </div>
  );
}

const inputCls = (err?: string) =>
  `w-full bg-white border rounded-lg px-4 py-3 text-[15px] text-[#231a11] placeholder:text-[#88726c]/50 focus:outline-none transition-colors ${
    err ? "border-[#ba1a1a] focus:border-[#ba1a1a]" : "border-[#dbc1b9] focus:border-[#231a11]"
  }`;

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — Identity Verification (UI 9)
// ─────────────────────────────────────────────────────────────────────────────
function Step1Form({
  data, onChange, errors,
}: {
  data: Step1Data;
  onChange: (d: Step1Data) => void;
  errors: Partial<Record<keyof Step1Data | "files", string>>;
}) {
  return (
    <div className="space-y-7">
      <div className="text-center mb-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-[32px] font-semibold text-[#231a11] mb-3">
          Verify your identity
        </h1>
        <p className="text-[15px] text-[#55433d] max-w-[480px] mx-auto leading-relaxed">
          To maintain a safe and authentic marketplace, we require a quick identity check for all sellers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Full legal name" error={errors.fullName} className="md:col-span-2">
          <input
            type="text"
            placeholder="As it appears on your ID"
            value={data.fullName}
            onChange={(e) => onChange({ ...data, fullName: e.target.value })}
            className={inputCls(errors.fullName)}
          />
        </Field>

        <Field label="Date of birth" error={errors.dob}>
          <input
            type="date"
            value={data.dob}
            onChange={(e) => onChange({ ...data, dob: e.target.value })}
            className={inputCls(errors.dob)}
          />
        </Field>

        <Field label="ID number (CCCD)" error={errors.idNumber}>
          <input
            type="text"
            placeholder="Enter your ID number"
            value={data.idNumber}
            onChange={(e) => onChange({ ...data, idNumber: e.target.value })}
            className={inputCls(errors.idNumber)}
          />
        </Field>
      </div>

      <hr className="border-t border-dashed border-[#dbc1b9]/60" />

      <div>
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-[17px] font-semibold text-[#231a11]">Identity Documents</h2>
          <span className="text-[12px] text-[#88726c]">Accepted: JPG, PNG, PDF. Max 5MB.</span>
        </div>
        {errors.files && (
          <div className="flex items-center gap-1.5 text-[13px] text-[#ba1a1a] mb-3 bg-[#ffdad6]/30 border border-[#ba1a1a]/20 rounded-lg px-4 py-2.5">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
            {errors.files}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <UploadZone icon="upload_file" label="ID front photo" file={data.files.front} error={!!errors.files && !data.files.front}
            onChange={(f) => onChange({ ...data, files: { ...data.files, front: f } })} />
          <UploadZone icon="upload_file" label="ID back photo" file={data.files.back} error={!!errors.files && !data.files.back}
            onChange={(f) => onChange({ ...data, files: { ...data.files, back: f } })} />
          <UploadZone icon="photo_camera" label="Selfie holding your ID" hint="Ensure your face and ID text are clearly visible"
            file={data.files.selfie} wide error={!!errors.files && !data.files.selfie}
            onChange={(f) => onChange({ ...data, files: { ...data.files, selfie: f } })} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — Payout Account (UI 10)
// ─────────────────────────────────────────────────────────────────────────────
function Step2Form({
  data, onChange, errors,
}: {
  data: Step2Data;
  onChange: (d: Step2Data) => void;
  errors: Partial<Record<keyof Step2Data, string>>;
}) {
  return (
    <div className="space-y-7">
      <div className="mb-2">
        <h1 className="font-[family-name:var(--font-playfair)] text-[32px] md:text-[40px] font-semibold text-[#974226] leading-tight mb-4">
          Where should we send your earnings?
        </h1>
        <p className="text-[15px] text-[#55433d] max-w-[520px] leading-relaxed">
          Link your preferred payout method to receive funds securely after every sale. Your data is protected by industry-leading encryption.
        </p>
      </div>

      {/* Tab toggle */}
      <div className="flex p-1 bg-[#feeadc] rounded-lg w-full max-w-xs">
        {(["bank", "ewallet"] as PayoutType[]).map((t) => (
          <button
            key={t}
            onClick={() => onChange({ ...data, payoutType: t })}
            className={`flex-1 py-2.5 px-4 text-[13px] font-semibold rounded-md transition-all duration-200 ${
              data.payoutType === t
                ? "bg-white text-[#974226] shadow-sm"
                : "text-[#88726c] hover:text-[#974226]"
            }`}
          >
            {t === "bank" ? "Bank Account" : "E-wallet"}
          </button>
        ))}
      </div>

      {data.payoutType === "bank" ? (
        <div className="flex flex-col gap-5">
          <Field label="Bank Name" error={errors.bank}>
            <div className="relative">
              <select
                value={data.bank}
                onChange={(e) => onChange({ ...data, bank: e.target.value })}
                className={`${inputCls(errors.bank)} appearance-none pr-10`}
              >
                <option value="">Select your bank</option>
                {BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <span className="material-symbols-outlined text-[20px] text-[#88726c]">expand_more</span>
              </div>
            </div>
          </Field>

          <Field label="Account Number" error={errors.accountNumber}>
            <input
              type="text"
              placeholder="Enter routing & account details"
              value={data.accountNumber}
              onChange={(e) => onChange({ ...data, accountNumber: e.target.value })}
              className={inputCls(errors.accountNumber)}
            />
          </Field>

          <Field label="Account Holder Full Name" error={errors.accountHolder}>
            <input
              type="text"
              placeholder="As it appears on your bank statement"
              value={data.accountHolder}
              onChange={(e) => onChange({ ...data, accountHolder: e.target.value })}
              className={inputCls(errors.accountHolder)}
            />
          </Field>

          {/* Security note */}
          <div className="flex items-center gap-2.5 py-3 px-4 bg-[#ede1d2]/40 rounded-lg border border-[#dbc1b9]/30">
            <span className="material-symbols-outlined text-[18px] text-[#556138]" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
            <p className="text-[13px] text-[#556138] font-medium">Your info is encrypted and never shown to buyers</p>
          </div>
        </div>
      ) : (
        /* E-wallet placeholder */
        <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-[#dbc1b9]/60 rounded-xl">
          <span className="material-symbols-outlined text-[40px] text-[#dbc1b9] mb-3" style={{ fontVariationSettings: "'FILL' 0" }}>
            account_balance_wallet
          </span>
          <p className="text-[15px] font-semibold text-[#55433d] mb-1">E-wallet support coming soon</p>
          <p className="text-[13px] text-[#88726c]">MoMo, ZaloPay & VNPay integration is on the roadmap.</p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 — Review & Confirm (UI 11)
// ─────────────────────────────────────────────────────────────────────────────
function Step3Review({
  step1, step2, checks, onCheckChange, onGoTo, errors,
}: {
  step1: Step1Data;
  step2: Step2Data;
  checks: [boolean, boolean, boolean];
  onCheckChange: (i: number, v: boolean) => void;
  onGoTo: (s: Step) => void;
  errors: { checks?: string };
}) {
  const mask = (v: string, keep = 4) =>
    v.length > keep ? "●●●● " + v.slice(-keep) : v || "—";

  const rows = [
    { label: "Full Name", value: step1.fullName || "—", step: 1 as Step },
    { label: "ID Number", value: mask(step1.idNumber), step: 1 as Step },
    {
      label: "Bank Account",
      value: step2.payoutType === "bank"
        ? (step2.accountNumber ? mask(step2.accountNumber) : "—")
        : "E-wallet (pending)",
      step: 2 as Step,
    },
  ];

  const CHECKBOX_LABELS = [
    { text: "I agree to ", link: "REWORE Seller Terms", href: "#" },
    { text: "I agree to the ", link: "Return & Dispute Policy", href: "#" },
    { text: "I confirm all information provided is accurate", link: "", href: "" },
  ];

  return (
    <div className="space-y-7">
      <div className="text-center mb-2">
        <h1 className="font-[family-name:var(--font-playfair)] text-[32px] font-semibold text-[#231a11] mb-3">
          Review your details
        </h1>
        <p className="text-[15px] text-[#55433d] max-w-[420px] mx-auto leading-relaxed">
          Please confirm everything looks correct before submitting.
        </p>
      </div>

      {/* Summary card */}
      <div className="bg-[#fff1e8] rounded-xl border border-[#dbc1b9]/40 overflow-hidden">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-center justify-between px-5 py-4 ${
              i < rows.length - 1 ? "border-b border-[#f2dfd1]" : ""
            }`}
          >
            <div>
              <span className="block text-[12px] text-[#88726c] mb-0.5 font-medium">{row.label}</span>
              <span className="block text-[16px] font-semibold text-[#231a11]">{row.value}</span>
            </div>
            <button
              onClick={() => onGoTo(row.step)}
              className="text-[13px] font-semibold text-[#974226] hover:text-[#b65a3c] hover:underline underline-offset-4 transition-colors"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Checkboxes */}
      <div className="flex flex-col gap-4">
        {errors.checks && (
          <div className="flex items-center gap-1.5 text-[13px] text-[#ba1a1a] bg-[#ffdad6]/30 border border-[#ba1a1a]/20 rounded-lg px-4 py-2.5">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
            {errors.checks}
          </div>
        )}
        {CHECKBOX_LABELS.map((cb, i) => (
          <label key={i} className="flex items-start gap-3 cursor-pointer group">
            <div className={`relative w-5 h-5 rounded border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
              checks[i] ? "bg-[#974226] border-[#974226]" : "bg-white border-[#dbc1b9] group-hover:border-[#974226]"
            }`}>
              {checks[i] && (
                <span className="material-symbols-outlined text-[13px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
              )}
              <input
                type="checkbox"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                checked={checks[i]}
                onChange={(e) => onCheckChange(i, e.target.checked)}
              />
            </div>
            <span className="text-[14px] text-[#231a11] leading-snug">
              {cb.text}
              {cb.link && (
                <a href={cb.href} className="text-[#974226] underline underline-offset-4 hover:text-[#b65a3c]">
                  {cb.link}
                </a>
              )}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
export default function VerifyPage() {
  const router = useRouter();
  const { submitVerification } = useSeller();
  const [step, setStep] = useState<Step>(1);

  // Form data
  const [step1, setStep1] = useState<Step1Data>({
    fullName: "", dob: "", idNumber: "",
    files: { front: null, back: null, selfie: null },
  });
  const [step2, setStep2] = useState<Step2Data>({
    payoutType: "bank", bank: "", accountNumber: "", accountHolder: "",
  });
  const [checks, setChecks] = useState<[boolean, boolean, boolean]>([false, false, false]);

  // Errors
  const [s1Errors, setS1Errors] = useState<Partial<Record<string, string>>>({});
  const [s2Errors, setS2Errors] = useState<Partial<Record<string, string>>>({});
  const [s3Errors, setS3Errors] = useState<{ checks?: string }>({});

  const validateStep1 = useCallback(() => {
    const errs: Partial<Record<string, string>> = {};
    if (!step1.fullName.trim()) errs.fullName = "Full legal name is required";
    if (!step1.dob) errs.dob = "Date of birth is required";
    if (!step1.idNumber.trim()) errs.idNumber = "ID number is required";
    const uploaded = Object.values(step1.files).filter(Boolean).length;
    if (uploaded < 3) errs.files = `Please upload all 3 documents (${uploaded}/3 uploaded)`;
    setS1Errors(errs);
    return Object.keys(errs).length === 0;
  }, [step1]);

  const validateStep2 = useCallback(() => {
    const errs: Partial<Record<string, string>> = {};
    if (step2.payoutType === "bank") {
      if (!step2.bank) errs.bank = "Please select your bank";
      if (!step2.accountNumber.trim()) errs.accountNumber = "Account number is required";
      if (!step2.accountHolder.trim()) errs.accountHolder = "Account holder name is required";
    }
    setS2Errors(errs);
    return Object.keys(errs).length === 0;
  }, [step2]);

  const validateStep3 = useCallback(() => {
    const errs: { checks?: string } = {};
    if (!checks.every(Boolean)) errs.checks = "Please confirm all 3 checkboxes to continue";
    setS3Errors(errs);
    return Object.keys(errs).length === 0;
  }, [checks]);

  const handleBack = () => {
    if (step === 1) router.push("/profile/become-seller");
    else setStep((s) => (s - 1) as Step);
  };

  const handleContinue = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    } else {
      if (validateStep3()) {
        // Submit to SellerContext
        submitVerification({
          fullName: step1.fullName,
          dob: step1.dob,
          idNumber: step1.idNumber,
          filesCount: Object.values(step1.files).filter(Boolean).length,
          payoutType: step2.payoutType,
          bank: step2.bank,
          accountNumber: step2.accountNumber,
          accountHolder: step2.accountHolder,
        });
        router.push("/profile/become-seller/status");
      }
    }
  };

  const stepLabels: Record<Step, string> = {
    1: "Identity Verification",
    2: "Payout Account",
    3: "Review & Confirm",
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#fff8f5] pt-24 pb-20">
        {/* Breadcrumb */}
        <div className="max-w-[1280px] mx-auto px-5 md:px-12 mb-8">
          <nav className="flex items-center gap-2 text-[13px] text-[#88726c]">
            <Link href="/profile" className="hover:text-[#974226] transition-colors font-medium">Profile</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link href="/profile/become-seller" className="hover:text-[#974226] transition-colors font-medium">Become a Seller</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-[#231a11] font-semibold">{stepLabels[step]}</span>
          </nav>
        </div>

        <main className="max-w-[800px] mx-auto px-5 md:px-12">
          <div className="bg-white rounded-[24px] shadow-[0_12px_48px_-8px_rgba(43,33,24,0.09)] border border-[#dbc1b9]/30 overflow-hidden opacity-0 animate-fade-in-up">

            {/* Step header + progress inside card */}
            <div className="px-8 md:px-12 lg:px-14 pt-8 md:pt-10">
              <StepHeader step={step} label={stepLabels[step]} />
            </div>

            {/* Form content */}
            <div className="px-8 md:px-12 lg:px-14 pb-2">
              {step === 1 && <Step1Form data={step1} onChange={setStep1} errors={s1Errors} />}
              {step === 2 && <Step2Form data={step2} onChange={setStep2} errors={s2Errors} />}
              {step === 3 && (
                <Step3Review
                  step1={step1} step2={step2}
                  checks={checks}
                  onCheckChange={(i, v) => {
                    const next = [...checks] as [boolean, boolean, boolean];
                    next[i] = v;
                    setChecks(next);
                  }}
                  onGoTo={(s) => setStep(s)}
                  errors={s3Errors}
                />
              )}
            </div>

            {/* Footer nav */}
            <div className="flex items-center justify-between px-8 md:px-12 lg:px-14 py-6 mt-4 border-t border-[#f2dfd1]">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-[13px] font-semibold text-[#655d52] hover:text-[#974226] transition-colors group"
              >
                <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
                Back
              </button>
              <button
                onClick={handleContinue}
                className="px-8 py-3 rounded-lg bg-[#974226] text-white text-[13px] font-semibold tracking-wide hover:bg-[#b65a3c] active:scale-[0.97] transition-all shadow-sm"
              >
                {step === 3 ? "Submit for Review" : "Continue"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
