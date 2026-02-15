"use client";

import { useState } from "react";
import type { GuestSizeEntry } from "@/lib/booking-types";

const ADULT_SIZES = [
  { value: "S", label: "S (~160cm)" },
  { value: "M", label: "M (160-170cm)" },
  { value: "L", label: "L (170-180cm)" },
  { value: "XL", label: "XL (180cm+)" },
];

const KIDS_SIZES = [
  { value: "Kids-S", label: "Kids-S (~110cm)" },
  { value: "Kids-M", label: "Kids-M (110-130cm)" },
  { value: "Kids-L", label: "Kids-L (130-150cm)" },
];

const GUEST_TYPES = [
  { value: "Man", label: "Man (Adult Male)" },
  { value: "Woman", label: "Woman (Adult Female)" },
  { value: "Boy", label: "Boy (Child Male)" },
  { value: "Girl", label: "Girl (Child Female)" },
] as const;

function isKidsType(type: string) {
  return type === "Boy" || type === "Girl";
}

function getDefaultSize(type: string) {
  return isKidsType(type) ? "Kids-M" : "M";
}

interface GuestData {
  nickname: string;
  email: string;
  numberOfGuests: number | null;
  guestSizeEntries: GuestSizeEntry[];
  roomNumber: string;
  specialRequests: string;
}

interface Props {
  data: GuestData;
  onChange: (data: Partial<GuestData>) => void;
  onNext: () => void;
  dateLabel: string;
  timeLabel: string;
}

export default function StepGuestInfo({
  data,
  onChange,
  onNext,
  dateLabel,
  timeLabel,
}: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!data.nickname.trim()) newErrors.nickname = "Nickname is required";
    if (!data.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!data.numberOfGuests || data.numberOfGuests < 1 || data.numberOfGuests > 4) {
      newErrors.numberOfGuests = "Number of guests must be 1–4";
    }
    if (data.numberOfGuests && data.guestSizeEntries.length < data.numberOfGuests) {
      newErrors.guestSizes = "Please select type and size for all guests";
    }
    if (!data.roomNumber.trim()) newErrors.roomNumber = "Room number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onNext();
  };

  const clearError = (field: string) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // ゲスト数変更時にguestSizeEntriesを同期
  const handleGuestCountChange = (count: number | null) => {
    onChange({ numberOfGuests: count });
    clearError("numberOfGuests");
    if (!count) {
      onChange({ guestSizeEntries: [] });
      return;
    }
    const current = [...data.guestSizeEntries];
    if (count > current.length) {
      // 増やす
      for (let i = current.length; i < count; i++) {
        current.push({ type: "Man", size: "M" });
      }
    } else {
      // 減らす
      current.splice(count);
    }
    onChange({ guestSizeEntries: current });
  };

  // ゲストのType変更
  const handleTypeChange = (index: number, type: GuestSizeEntry["type"]) => {
    const entries = [...data.guestSizeEntries];
    const currentSize = entries[index].size;
    const isCurrentKids = currentSize.startsWith("Kids-");
    const needsKids = isKidsType(type);
    entries[index] = {
      type,
      size: isCurrentKids !== needsKids ? getDefaultSize(type) : currentSize,
    };
    onChange({ guestSizeEntries: entries });
    clearError("guestSizes");
  };

  // ゲストのSize変更
  const handleSizeChange = (index: number, size: string) => {
    const entries = [...data.guestSizeEntries];
    entries[index] = { ...entries[index], size };
    onChange({ guestSizeEntries: entries });
    clearError("guestSizes");
  };

  return (
    <div>
      {/* Summary bar */}
      <div className="bg-blue-50 rounded-lg p-3 mb-4 text-xs text-blue-700">
        {dateLabel} {timeLabel} · ¥40,000
      </div>

      {/* Nickname */}
      <div className="mb-3">
        <label className="block text-[11px] font-bold text-foreground-muted mb-1">
          Nickname <span className="text-error">*</span>
        </label>
        <input
          type="text"
          value={data.nickname}
          onChange={(e) => { onChange({ nickname: e.target.value }); clearError("nickname"); }}
          placeholder="John"
          className={`w-full px-3 py-2.5 border rounded-lg text-sm bg-background-alt focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.nickname ? "border-error" : "border-border"}`}
        />
        {errors.nickname && <p className="text-[10px] text-error mt-1">{errors.nickname}</p>}
      </div>

      {/* Email */}
      <div className="mb-3">
        <label className="block text-[11px] font-bold text-foreground-muted mb-1">
          Email <span className="text-error">*</span>
        </label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => { onChange({ email: e.target.value }); clearError("email"); }}
          placeholder="john@example.com"
          className={`w-full px-3 py-2.5 border rounded-lg text-sm bg-background-alt focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.email ? "border-error" : "border-border"}`}
        />
        {errors.email && <p className="text-[10px] text-error mt-1">{errors.email}</p>}
      </div>

      {/* Number of guests */}
      <div className="mb-3">
        <label className="block text-[11px] font-bold text-foreground-muted mb-1">
          Number of Guests <span className="text-error">*</span>
        </label>
        <select
          value={data.numberOfGuests ?? ""}
          onChange={(e) => {
            const v = e.target.value ? parseInt(e.target.value) : null;
            handleGuestCountChange(v);
          }}
          className={`w-full px-3 py-2.5 border rounded-lg text-sm bg-background-alt focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.numberOfGuests ? "border-error" : "border-border"}`}
        >
          <option value="">Select…</option>
          <option value="1">1 guest</option>
          <option value="2">2 guests</option>
          <option value="3">3 guests</option>
          <option value="4">4 guests</option>
        </select>
        {errors.numberOfGuests && <p className="text-[10px] text-error mt-1">{errors.numberOfGuests}</p>}
      </div>

      {/* Guest Type + Size selectors */}
      {data.numberOfGuests && data.numberOfGuests > 0 && (
        <div className="mb-3 border border-border rounded-lg p-3 bg-background-alt">
          <p className="text-[11px] font-bold text-foreground-muted mb-2">
            Costume Size for Each Guest <span className="text-error">*</span>
          </p>
          <div className="space-y-2.5">
            {Array.from({ length: data.numberOfGuests }, (_, i) => {
              const entry = data.guestSizeEntries[i] || { type: "Man", size: "M" };
              const kids = isKidsType(entry.type);
              const sizes = kids ? KIDS_SIZES : ADULT_SIZES;

              return (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-foreground-subtle w-16 shrink-0">
                    Guest {i + 1}
                  </span>
                  <select
                    value={entry.type}
                    onChange={(e) => handleTypeChange(i, e.target.value as GuestSizeEntry["type"])}
                    className="flex-1 px-2 py-2 border border-border rounded-md text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {GUEST_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <select
                    value={entry.size}
                    onChange={(e) => handleSizeChange(i, e.target.value)}
                    className="flex-1 px-2 py-2 border border-border rounded-md text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {sizes.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
          {errors.guestSizes && <p className="text-[10px] text-error mt-1">{errors.guestSizes}</p>}
        </div>
      )}

      {/* Room */}
      <div className="mb-3">
        <label className="block text-[11px] font-bold text-foreground-muted mb-1">
          Room Number <span className="text-error">*</span>
        </label>
        <input
          type="text"
          value={data.roomNumber}
          onChange={(e) => { onChange({ roomNumber: e.target.value }); clearError("roomNumber"); }}
          placeholder="1234"
          className={`w-full px-3 py-2.5 border rounded-lg text-sm bg-background-alt focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.roomNumber ? "border-error" : "border-border"}`}
        />
        {errors.roomNumber && <p className="text-[10px] text-error mt-1">{errors.roomNumber}</p>}
      </div>

      {/* Special requests */}
      <div className="mb-4">
        <label className="block text-[11px] font-bold text-foreground-muted mb-1">
          Special Requests (optional)
        </label>
        <textarea
          value={data.specialRequests}
          onChange={(e) => onChange({ specialRequests: e.target.value })}
          placeholder="Any special requests or notes…"
          rows={3}
          className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-background-alt resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-primary text-white font-bold py-3.5 rounded-lg hover:opacity-85 transition-opacity text-sm"
      >
        Next: Confirm →
      </button>
    </div>
  );
}
