"use client";

import { services } from "@/lib/services";
import type { BookingState } from "@/lib/booking-types";

interface Props {
  state: BookingState;
  onChangeStep: (step: 1 | 2 | 3 | 4 | 5) => void;
  onToggleTerms: (agreed: boolean) => void;
  onSubmit: () => void;
}

export default function ConfirmSection({
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

  const timeDisplay =
    state.timeSlot?.replace("-", "–") ?? "";

  const activityNames = state.activities
    .map((id) => services.find((s) => s.id === id)?.name.split("(")[0].trim())
    .filter(Boolean)
    .join(" / ");

  return (
    <div>
      <div className="space-y-0">
        {/* Date */}
        <div className="flex justify-between items-center py-2.5 border-b border-border-light">
          <span className="text-xs text-foreground-subtle">📅 Date</span>
          <span className="text-xs font-bold text-right">
            {dateDisplay}
            <button
              onClick={() => onChangeStep(1)}
              className="text-[10px] text-blue-600 ml-1.5 font-normal"
            >
              Edit
            </button>
          </span>
        </div>

        {/* Time */}
        <div className="flex justify-between items-center py-2.5 border-b border-border-light">
          <span className="text-xs text-foreground-subtle">🕐 Time</span>
          <span className="text-xs font-bold text-right">
            {timeDisplay}
            <button
              onClick={() => onChangeStep(2)}
              className="text-[10px] text-blue-600 ml-1.5 font-normal"
            >
              Edit
            </button>
          </span>
        </div>

        {/* Activities */}
        <div className="flex justify-between items-center py-2.5 border-b border-border-light">
          <span className="text-xs text-foreground-subtle">🎯 Experiences</span>
          <span className="text-[11px] font-bold text-right max-w-[55%]">
            {activityNames}
            <button
              onClick={() => onChangeStep(3)}
              className="text-[10px] text-blue-600 ml-1.5 font-normal"
            >
              Edit
            </button>
          </span>
        </div>

        {/* Guest Name */}
        <div className="flex justify-between items-center py-2.5 border-b border-border-light">
          <span className="text-xs text-foreground-subtle">👤 Name</span>
          <span className="text-xs font-bold">{state.guestName}</span>
        </div>

        {/* Guests */}
        <div className="flex justify-between items-center py-2.5 border-b border-border-light">
          <span className="text-xs text-foreground-subtle">👥 Guests</span>
          <span className="text-xs font-bold">
            {state.numberOfGuests} guest{(state.numberOfGuests ?? 0) > 1 ? "s" : ""}
          </span>
        </div>

        {/* Room */}
        <div className="flex justify-between items-center py-2.5 border-b border-border-light">
          <span className="text-xs text-foreground-subtle">🚪 Room</span>
          <span className="text-xs font-bold">#{state.roomNumber}</span>
        </div>

        {/* Price */}
        <div className="flex justify-between items-center py-2.5">
          <span className="text-xs text-foreground-subtle">💴 Price</span>
          <span className="text-lg font-bold text-primary">¥40,000</span>
        </div>
      </div>

      {/* Payment note */}
      <div className="bg-background-alt border border-border rounded-lg p-3 mt-3">
        <h3 className="text-xs font-bold text-foreground mb-1">
          💳 Pay On-Site
        </h3>
        <p className="text-[11px] text-foreground-muted">
          Cash · Credit Card · Apple Pay · Google Pay
        </p>
      </div>

      {/* Pending notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
        <p className="text-xs text-amber-800">
          ⏳ This is a <strong>booking request</strong>. Our team will confirm
          availability and send a confirmation email within{" "}
          <strong>24 hours</strong>.
        </p>
      </div>

      {/* Terms checkbox */}
      <label className="flex items-start gap-2 mt-4 cursor-pointer">
        <input
          type="checkbox"
          checked={state.agreedToTerms}
          onChange={(e) => onToggleTerms(e.target.checked)}
          className="mt-0.5 shrink-0 accent-primary"
        />
        <span className="text-[11px] text-foreground-muted">
          I agree to the{" "}
          <a
            href="/terms"
            target="_blank"
            className="underline text-blue-600"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            target="_blank"
            className="underline text-blue-600"
          >
            Privacy Policy
          </a>
        </span>
      </label>

      {/* Error message */}
      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
          <p className="text-xs text-error">{state.error}</p>
        </div>
      )}

      {/* Submit button */}
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
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                className="opacity-25"
              />
              <path
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                className="opacity-75"
              />
            </svg>
            Submitting...
          </span>
        ) : (
          "Submit Booking Request"
        )}
      </button>
    </div>
  );
}
