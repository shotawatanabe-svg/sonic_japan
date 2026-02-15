"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { INITIAL_BOOKING_STATE } from "@/lib/booking-types";
import type { BookingState } from "@/lib/booking-types";
import ProgressBar from "@/components/ProgressBar";
import Calendar from "@/components/Calendar";
import TimeSlots from "@/components/TimeSlots";
import ActivityPicker from "@/components/ActivityPicker";
import GuestForm from "@/components/GuestForm";
import ConfirmSection from "@/components/ConfirmSection";

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselect = searchParams.get("preselect");

  const [state, setState] = useState<BookingState>(() => ({
    ...INITIAL_BOOKING_STATE,
    activities: preselect ? [preselect] : [],
  }));

  const [direction, setDirection] = useState<1 | -1>(1); // 1 = forward, -1 = back

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [state.currentStep]);

  const goToStep = useCallback(
    (step: 1 | 2 | 3 | 4 | 5, dir?: 1 | -1) => {
      setDirection(dir ?? (step > state.currentStep ? 1 : -1));
      setState((prev) => ({ ...prev, currentStep: step, error: null }));
    },
    [state.currentStep]
  );

  // Close / exit booking
  const handleClose = () => {
    const confirmed = window.confirm(
      "Cancel your booking? All entered information will be lost."
    );
    if (confirmed) {
      router.push("/");
    }
  };

  // Date selection → auto-advance to Step 2
  const handleDateSelect = (date: string) => {
    setState((prev) => ({ ...prev, date }));
    setTimeout(() => goToStep(2, 1), 300);
  };

  // Time selection → auto-advance to Step 3
  const handleTimeSelect = (timeSlot: string) => {
    setState((prev) => ({ ...prev, timeSlot }));
    setTimeout(() => goToStep(3, 1), 300);
  };

  // Toggle activity
  const handleToggleActivity = (id: string) => {
    setState((prev) => {
      const exists = prev.activities.includes(id);
      if (exists) {
        return { ...prev, activities: prev.activities.filter((a) => a !== id) };
      }
      if (prev.activities.length >= 3) return prev;
      return { ...prev, activities: [...prev.activities, id] };
    });
  };

  // Guest data update
  const handleGuestChange = (
    data: Partial<
      Pick<
        BookingState,
        "guestName" | "email" | "numberOfGuests" | "roomNumber" | "specialRequests"
      >
    >
  ) => {
    setState((prev) => ({ ...prev, ...data }));
  };

  // Format helpers
  const dateLabel = state.date
    ? new Date(state.date + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "short",
        month: "long",
        day: "numeric",
      })
    : "";
  const timeLabel = state.timeSlot?.replace("-", "–") ?? "";

  // Submit booking
  const handleSubmit = async () => {
    if (!state.agreedToTerms || state.isSubmitting) return;

    setState((prev) => ({ ...prev, isSubmitting: true, error: null }));

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: state.date,
          timeSlot: state.timeSlot,
          activities: state.activities,
          guestName: state.guestName,
          email: state.email,
          numberOfGuests: state.numberOfGuests,
          roomNumber: state.roomNumber,
          specialRequests: state.specialRequests || undefined,
          agreedToTerms: state.agreedToTerms,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.message || `Request failed (${res.status}). Please try again.`
        );
      }

      const data = await res.json();
      // Use replace so user can't go back to booking form
      router.replace(
        `/thanks?id=${data.bookingId}&date=${state.date}&time=${state.timeSlot}&activities=${state.activities.join(",")}&name=${encodeURIComponent(state.guestName)}&email=${encodeURIComponent(state.email)}&guests=${state.numberOfGuests}`
      );
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setState((prev) => ({
          ...prev,
          isSubmitting: false,
          error: "Request timed out. Please try again.",
        }));
      } else {
        setState((prev) => ({
          ...prev,
          isSubmitting: false,
          error:
            err instanceof Error ? err.message : "An unexpected error occurred.",
        }));
      }
    }
  };

  // Slide animation variants
  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -200 : 200, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="font-heading text-xl font-bold tracking-wider text-foreground"
          >
            SHIDENRYU
          </Link>
          <button
            onClick={handleClose}
            className="bg-gray-500 text-white text-xs font-bold px-3 py-1.5 rounded transition-opacity hover:opacity-85"
          >
            ✕ Close
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <ProgressBar currentStep={state.currentStep} />

      {/* Step Content */}
      <div className="max-w-lg mx-auto overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={state.currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="px-4 py-6"
          >
            {/* Step 1: Date */}
            {state.currentStep === 1 && (
              <div>
                <span className="inline-block bg-orange-700 text-white text-[10px] font-bold px-2 py-0.5 rounded mb-3 tracking-wider uppercase">
                  Date Selection
                </span>
                <h2 className="font-heading text-xl font-bold mb-4 text-foreground">
                  Choose Your Date
                </h2>
                <Calendar
                  selectedDate={state.date}
                  onSelectDate={handleDateSelect}
                />
              </div>
            )}

            {/* Step 2: Time */}
            {state.currentStep === 2 && (
              <div>
                <span className="inline-block bg-orange-700 text-white text-[10px] font-bold px-2 py-0.5 rounded mb-3 tracking-wider uppercase">
                  Time Selection
                </span>
                <h2 className="font-heading text-xl font-bold mb-4 text-foreground">
                  Choose Your Time
                </h2>
                <TimeSlots
                  selectedDate={state.date}
                  selectedSlot={state.timeSlot}
                  onSelectSlot={handleTimeSelect}
                />
                <button
                  onClick={() => goToStep(1, -1)}
                  className="mt-6 text-sm text-foreground-muted hover:text-foreground transition-colors"
                >
                  ← Back
                </button>
              </div>
            )}

            {/* Step 3: Activities */}
            {state.currentStep === 3 && (
              <div>
                <span className="inline-block bg-orange-700 text-white text-[10px] font-bold px-2 py-0.5 rounded mb-3 tracking-wider uppercase">
                  Experience Selection
                </span>
                <h2 className="font-heading text-xl font-bold mb-4 text-foreground">
                  Pick 3 Experiences
                </h2>
                <ActivityPicker
                  selected={state.activities}
                  onToggle={handleToggleActivity}
                />
                <button
                  onClick={() => goToStep(4, 1)}
                  disabled={state.activities.length !== 3}
                  className={`w-full font-bold py-3.5 rounded-lg text-sm mt-4 transition-opacity ${
                    state.activities.length === 3
                      ? "bg-primary text-white hover:opacity-85"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Next: Guest Information →
                </button>
                <button
                  onClick={() => goToStep(2, -1)}
                  className="mt-3 w-full text-sm text-foreground-muted hover:text-foreground transition-colors text-center"
                >
                  ← Back
                </button>
              </div>
            )}

            {/* Step 4: Guest Info */}
            {state.currentStep === 4 && (
              <div>
                <span className="inline-block bg-orange-700 text-white text-[10px] font-bold px-2 py-0.5 rounded mb-3 tracking-wider uppercase">
                  Guest Information
                </span>
                <h2 className="font-heading text-xl font-bold mb-4 text-foreground">
                  Enter Your Details
                </h2>
                <GuestForm
                  data={{
                    guestName: state.guestName,
                    email: state.email,
                    numberOfGuests: state.numberOfGuests,
                    roomNumber: state.roomNumber,
                    specialRequests: state.specialRequests,
                  }}
                  onChange={handleGuestChange}
                  onNext={() => goToStep(5, 1)}
                  dateLabel={dateLabel}
                  timeLabel={timeLabel}
                />
                <button
                  onClick={() => goToStep(3, -1)}
                  className="mt-3 w-full text-sm text-foreground-muted hover:text-foreground transition-colors text-center"
                >
                  ← Back
                </button>
              </div>
            )}

            {/* Step 5: Confirm */}
            {state.currentStep === 5 && (
              <div>
                <span className="inline-block bg-orange-700 text-white text-[10px] font-bold px-2 py-0.5 rounded mb-3 tracking-wider uppercase">
                  Confirmation
                </span>
                <h2 className="font-heading text-xl font-bold mb-4 text-foreground">
                  Confirm Your Request
                </h2>
                <ConfirmSection
                  state={state}
                  onChangeStep={goToStep}
                  onToggleTerms={(agreed) =>
                    setState((prev) => ({ ...prev, agreedToTerms: agreed }))
                  }
                  onSubmit={handleSubmit}
                />
                <button
                  onClick={() => goToStep(4, -1)}
                  className="mt-3 w-full text-sm text-foreground-muted hover:text-foreground transition-colors text-center"
                >
                  ← Back
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-foreground-muted">Loading...</p>
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
