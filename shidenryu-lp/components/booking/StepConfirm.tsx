"use client";

import type { Service } from "@/lib/services";
import type { BookingState } from "@/lib/booking-types";

interface Props {
  services: Service[];
  state: BookingState;
  onChangeStep: (step: 1 | 2 | 3 | 4 | 5) => void;
  onToggleTerms: (agreed: boolean) => void;
  onSubmit: () => void;
}

export default function StepConfirm({
  services,
  state,
  onChangeStep,
  onToggleTerms,
  onSubmit,
}: Props) {
  const dateDisplay = state.date
    ? new Date(state.date + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
  const timeDisplay = state.timeSlot?.replace("-", "–") ?? "";
  const activityNames = state.activities
    .map((id) => services.find((s) => s.id === id)?.name.split("(")[0].trim())
    .filter(Boolean)
    .join(" / ");

  return (
    <div>
      <div className="space-y-0">
        <ConfirmRow label="📅 Date" value={dateDisplay} onEdit={() => onChangeStep(1)} />
        <ConfirmRow label="🕐 Time" value={timeDisplay} onEdit={() => onChangeStep(2)} />
        <ConfirmRow label="🎯 Experiences" value={activityNames} onEdit={() => onChangeStep(3)} small />
        <ConfirmRow label="👤 Name" value={state.guestName} />
        <ConfirmRow label="👥 Guests" value={`${state.numberOfGuests} guest${(state.numberOfGuests ?? 0) > 1 ? "s" : ""}`} />
        <ConfirmRow label="🚪 Room" value={`#${state.roomNumber}`} />
        <div className="flex justify-between items-center py-2.5">
          <span className="text-xs text-foreground-subtle">💴 Price</span>
          <span className="text-lg font-bold text-primary">¥40,000</span>
        </div>
      </div>

      {/* Payment */}
      <div className="bg-background-alt border border-border rounded-lg p-3 mt-3">
        <h3 className="text-xs font-bold text-foreground mb-1">💳 Pay On-Site</h3>
        <p className="text-[11px] text-foreground-muted">
          Cash · Credit Card · Apple Pay · Google Pay
        </p>
      </div>

      {/* Pending notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
        <p className="text-xs text-amber-800">
          ⏳ This is a <strong>booking request</strong>. Our team will confirm availability
          and send a confirmation email within <strong>24 hours</strong>.
        </p>
      </div>

      {/* Terms */}
      <label className="flex items-start gap-2 mt-4 cursor-pointer">
        <input
          type="checkbox"
          checked={state.agreedToTerms}
          onChange={(e) => onToggleTerms(e.target.checked)}
          className="mt-0.5 shrink-0 accent-primary"
        />
        <span className="text-[11px] text-foreground-muted">
          I agree to the{" "}
          <a href="/terms" target="_blank" className="underline text-blue-600">Terms of Service</a>
          {" "}and{" "}
          <a href="/privacy" target="_blank" className="underline text-blue-600">Privacy Policy</a>
        </span>
      </label>

      {/* Error */}
      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
          <p className="text-xs text-error">{state.error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={onSubmit}
        disabled={!state.agreedToTerms || state.isSubmitting}
        className={`w-full font-bold py-4 rounded-lg text-base mt-4 transition-opacity ${
          state.agreedToTerms && !state.isSubmitting
            ? "bg-primary text-white hover:opacity-85"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {state.isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
            </svg>
            Submitting…
          </span>
        ) : (
          "Submit Booking Request"
        )}
      </button>
    </div>
  );
}

/* ── small helper ── */
function ConfirmRow({
  label,
  value,
  onEdit,
  small,
}: {
  label: string;
  value: string;
  onEdit?: () => void;
  small?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-border-light">
      <span className="text-xs text-foreground-subtle">{label}</span>
      <span className={`${small ? "text-[11px]" : "text-xs"} font-bold text-right max-w-[55%]`}>
        {value}
        {onEdit && (
          <button onClick={onEdit} className="text-[10px] text-blue-600 ml-1.5 font-normal">
            Edit
          </button>
        )}
      </span>
    </div>
  );
}
