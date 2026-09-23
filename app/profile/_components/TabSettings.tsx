"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { ApiError, usersApi } from "@/app/lib/api";

function fieldValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export default function TabSettings() {
  const { user, refreshMe } = useAuth();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user?.id) return;

    const formData = new FormData(event.currentTarget);
    const name = fieldValue(formData, "name");
    const bio = fieldValue(formData, "bio");
    const phone = fieldValue(formData, "phone");
    const address = fieldValue(formData, "address");
    const avatar = fieldValue(formData, "avatar");

    setSaving(true);
    setMessage("");
    try {
      await usersApi.update(user.id, {
        name,
        bio: bio || undefined,
        phone: phone || undefined,
        address: address || undefined,
        avatar: avatar || undefined,
      });
      await refreshMe();
      setMessage("Profile saved.");
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Could not save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 opacity-0 animate-fade-in-up">
      <div>
        <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#231a11] mb-1">
          Account Settings
        </h3>
        {message && <p className="text-sm text-[#974226] mt-2">{message}</p>}
      </div>

      <div className="bg-white rounded-[20px] shadow-[0_4px_24px_-4px_rgba(43,33,24,0.06)] border border-[#f2dfd1] p-6 sm:p-8">
        <form key={user?.id ?? "guest"} className="space-y-6 max-w-xl" onSubmit={save}>
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#231a11] border-b border-[#f2dfd1] pb-2">
              Personal Information
            </h4>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#55443d]">Display Name</label>
              <input
                name="name"
                type="text"
                defaultValue={user?.name ?? ""}
                minLength={2}
                className="w-full px-4 py-2.5 rounded-xl border border-[#dbc1b9] bg-[#fff8f5] text-[#231a11] text-sm focus:outline-none focus:border-[#974226] focus:ring-1 focus:ring-[#974226] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#55443d]">Email Address</label>
              <input
                type="email"
                value={user?.email ?? ""}
                readOnly
                className="w-full px-4 py-2.5 rounded-xl border border-[#dbc1b9] bg-[#f2dfd1] text-[#55443d] text-sm focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#55443d]">Bio</label>
              <textarea
                name="bio"
                defaultValue={user?.bio ?? ""}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-[#dbc1b9] bg-[#fff8f5] text-[#231a11] text-sm focus:outline-none focus:border-[#974226] focus:ring-1 focus:ring-[#974226] transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-[#55443d]">Phone</label>
                <input
                  name="phone"
                  type="tel"
                  defaultValue={user?.phone ?? ""}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#dbc1b9] bg-[#fff8f5] text-[#231a11] text-sm focus:outline-none focus:border-[#974226] focus:ring-1 focus:ring-[#974226] transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-[#55443d]">Address</label>
                <input
                  name="address"
                  type="text"
                  defaultValue={user?.address ?? ""}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#dbc1b9] bg-[#fff8f5] text-[#231a11] text-sm focus:outline-none focus:border-[#974226] focus:ring-1 focus:ring-[#974226] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#55443d]">Avatar URL</label>
              <input
                name="avatar"
                type="url"
                defaultValue={user?.avatar ?? ""}
                placeholder="https://example.com/avatar.png"
                className="w-full px-4 py-2.5 rounded-xl border border-[#dbc1b9] bg-[#fff8f5] text-[#231a11] text-sm focus:outline-none focus:border-[#974226] focus:ring-1 focus:ring-[#974226] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h4 className="text-lg font-semibold text-[#231a11] border-b border-[#f2dfd1] pb-2">
              Preferences
            </h4>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative w-10 h-6 bg-[#b65a3c] rounded-full transition-colors">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full translate-x-4 transition-transform" />
              </div>
              <span className="text-sm font-medium text-[#231a11] group-hover:text-[#974226] transition-colors">
                Receive auction outbid alerts via email
              </span>
            </label>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={saving || !user?.id}
              className="py-2.5 px-6 bg-[#b65a3c] text-white rounded-xl text-sm font-semibold shadow-md shadow-[#b65a3c]/30 hover:bg-[#974226] hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
