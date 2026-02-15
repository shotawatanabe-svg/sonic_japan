"use client";

import { useState } from "react";

interface GuestData {
  guestName: string;
  email: string;
  numberOfGuests: number | null;
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
    if (!data.guestName.trim()) newErrors.guestName = "Name is required";
    if (!data.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!data.numberOfGuests || data.numberOfGuests < 1 || data.numberOfGuests > 4) {
      newErrors.numberOfGuests = "Number of guests must be 1–4";
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

  return (
    <div>
      {/* Summary bar */}
      <div className="bg-blue-50 rounded-lg p-3 mb-4 text-xs text-blue-700">
        📅 {dateLabel} {timeLabel} · ¥40,000
      </div>

      {/* Name */}
      <div className="mb-3">
        <label className="block text-[11px] font-bold text-foreground-muted mb-1">
          Name <span className="text-error">*</span>
        </label>
        <input
          type="text"
          value={data.guestName}
          onChange={(e) => { onChange({ guestName: e.target.value }); clearError("guestName"); }}
          placeholder="John Smith"
          className={`w-full px-3 py-2.5 border rounded-lg text-sm bg-background-alt focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.guestName ? "border-error" : "border-border"}`}
        />
        {errors.guestName && <p className="text-[10px] text-error mt-1">{errors.guestName}</p>}
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

      {/* Number of guests - pulldown */}
      <div className="mb-3">
        <label className="block text-[11px] font-bold text-foreground-muted mb-1">
          Number of Guests <span className="text-error">*</span>
        </label>
        <select
          value={data.numberOfGuests ?? ""}
          onChange={(e) => {
            const v = e.target.value ? parseInt(e.target.value) : null;
            onChange({ numberOfGuests: v });
            clearError("numberOfGuests");
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
