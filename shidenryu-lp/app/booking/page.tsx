"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { INITIAL_BOOKING_STATE } from "@/lib/booking-types";
import type { BookingState } from "@/lib/booking-types";
import type { Service } from "@/lib/services";
import { submitBooking } from "@/lib/booking";
import BookingProgressBar from "@/components/booking/ProgressBar";
import StepCalendar from "@/components/booking/StepCalendar";
import StepTimeSlots from "@/components/booking/StepTimeSlots";
import StepActivities from "@/components/booking/StepActivities";
import StepGuestInfo from "@/components/booking/StepGuestInfo";
import StepConfirm from "@/components/booking/StepConfirm";

const STORAGE_KEY = "shidenryu_booking";

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [state, setState] = useState<BookingState>(INITIAL_BOOKING_STATE);
  const [initialized, setInitialized] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [services, setServices] = useState<Service[]>([]);

  // ── Fetch services from API on mount ──
  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((d) => setServices(d.services || []))
      .catch(() => setServices([]));
  }, []);

  // ── Mount: restore from sessionStorage, then apply query param overrides ──
  useEffect(() => {
    const dateParam = searchParams.get("date");
    const preselectParam = searchParams.get("preselect");

    // 1. Try restoring from sessionStorage
    let restored: BookingState = { ...INITIAL_BOOKING_STATE };
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        restored = { ...restored, ...parsed, isSubmitting: false, error: null };
      }
    } catch { /* ignore parse errors */ }

    // 2. Query params override sessionStorage values
    if (dateParam) {
      restored.date = dateParam;
      restored.currentStep = 2;
    }
    if (preselectParam) {
      if (!restored.activities.includes(preselectParam)) {
        restored.activities = [
          ...restored.activities.filter((a) => a !== preselectParam),
          preselectParam,
        ].slice(0, 3);
      }
    }

    setState(restored);
    setInitialized(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-save to sessionStorage on every state change ──
  useEffect(() => {
    if (!initialized) return;
    try {
      // Exclude transient fields from persistence
      const { isSubmitting: _s, error: _e, ...toSave } = state;
      void _s; void _e;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch { /* storage full or unavailable */ }
  }, [state, initialized]);

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

  // Close / exit booking with confirmation dialog
  const handleClose = () => {
    const confirmed = window.confirm(
      "Cancel your booking? All entered information will be lost."
    );
    if (confirmed) router.push("/");
  };

  // Step 1: Date → auto-advance to Step 2
  const handleDateSelect = (date: string) => {
    setState((prev) => ({ ...prev, date }));
    setTimeout(() => goToStep(2, 1), 300);
  };

  // Step 2: Time → auto-advance to Step 3
  const handleTimeSelect = (timeSlot: string) => {
    setState((prev) => ({ ...prev, timeSlot }));
    setTimeout(() => goToStep(3, 1), 300);
  };

  // Step 3: Toggle activity
  const handleToggleActivity = (id: string) => {
    setState((prev) => {
      const exists = prev.activities.includes(id);
      if (exists) return { ...prev, activities: prev.activities.filter((a) => a !== id) };
      if (prev.activities.length >= 3) return prev;
      return { ...prev, activities: [...prev.activities, id] };
    });
  };

  // Step 4: Guest data update
  const handleGuestChange = (
    data: Partial<Pick<BookingState, "guestName" | "email" | "numberOfGuests" | "roomNumber" | "specialRequests">>
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

  // Step 5: Submit booking via lib/booking.ts
  const handleSubmit = async () => {
    if (!state.agreedToTerms || state.isSubmitting) return;

    setState((prev) => ({ ...prev, isSubmitting: true, error: null }));

    const result = await submitBooking({
      date: state.date!,
      timeSlot: state.timeSlot!,
      activities: state.activities,
      guestName: state.guestName,
      email: state.email,
      numberOfGuests: state.numberOfGuests!,
      roomNumber: state.roomNumber,
      specialRequests: state.specialRequests || undefined,
      agreedToTerms: state.agreedToTerms,
    });

    if (result.success && result.bookingId) {
      // Clear saved session before navigating away
      sessionStorage.removeItem(STORAGE_KEY);
      // Use replace so browser back doesn't return to /booking
      router.replace(
        `/thanks?id=${result.bookingId}&date=${state.date}&time=${state.timeSlot}&activities=${state.activities.join(",")}&name=${encodeURIComponent(state.guestName)}&email=${encodeURIComponent(state.email)}&guests=${state.numberOfGuests}`
      );
    } else if (result.error === "slot_taken") {
      // Slot was taken → show message and go back to Step 2
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        timeSlot: null,
        error: "This time slot has just been booked. Please select a different time.",
      }));
      goToStep(2, -1);
    } else {
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: result.message || "An unexpected error occurred. Please try again.",
      }));
    }
  };

  // Slide animation
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
          <Link href="/" className="font-heading text-xl font-bold tracking-wider text-foreground">
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
      <BookingProgressBar currentStep={state.currentStep} />

      {/* Step Content */}
      <div className="max-w-lg mx-auto overflow-hidden">
        {!initialized ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
          </div>
        ) : (
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
            {/* ── Step 1: Date ── */}
            {state.currentStep === 1 && (
              <div>
                <StepTag>Date Selection</StepTag>
                <h2 className="font-heading text-xl font-bold mb-4 text-foreground">
                  Choose Your Date
                </h2>
                <StepCalendar
                  selectedDate={state.date}
                  onSelectDate={handleDateSelect}
                />
              </div>
            )}

            {/* ── Step 2: Time ── */}
            {state.currentStep === 2 && (
              <div>
                <StepTag>Time Selection</StepTag>
                <h2 className="font-heading text-xl font-bold mb-4 text-foreground">
                  Choose Your Time
                </h2>
                {state.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-error">{state.error}</p>
                  </div>
                )}
                <StepTimeSlots
                  selectedDate={state.date}
                  selectedSlot={state.timeSlot}
                  onSelectSlot={handleTimeSelect}
                />
                <BackButton onClick={() => goToStep(1, -1)} />
              </div>
            )}

            {/* ── Step 3: Activities ── */}
            {state.currentStep === 3 && (
              <div>
                <StepTag>Experience Selection</StepTag>
                <h2 className="font-heading text-xl font-bold mb-4 text-foreground">
                  Pick 3 Experiences
                </h2>
                <StepActivities
                  services={services}
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
                <BackButton onClick={() => goToStep(2, -1)} />
              </div>
            )}

            {/* ── Step 4: Guest Info ── */}
            {state.currentStep === 4 && (
              <div>
                <StepTag>Guest Information</StepTag>
                <h2 className="font-heading text-xl font-bold mb-4 text-foreground">
                  Enter Your Details
                </h2>
                <StepGuestInfo
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
                <BackButton onClick={() => goToStep(3, -1)} />
              </div>
            )}

            {/* ── Step 5: Confirm ── */}
            {state.currentStep === 5 && (
              <div>
                <StepTag>Confirmation</StepTag>
                <h2 className="font-heading text-xl font-bold mb-4 text-foreground">
                  Confirm Your Request
                </h2>
                <StepConfirm
                  services={services}
                  state={state}
                  onChangeStep={goToStep}
                  onToggleTerms={(agreed) =>
                    setState((prev) => ({ ...prev, agreedToTerms: agreed }))
                  }
                  onSubmit={handleSubmit}
                />
                <BackButton onClick={() => goToStep(4, -1)} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        )}
      </div>
    </div>
  );
}

/* ── Tiny sub-components ── */

function StepTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block bg-orange-700 text-white text-[10px] font-bold px-2 py-0.5 rounded mb-3 tracking-wider uppercase">
      {children}
    </span>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mt-3 w-full text-sm text-foreground-muted hover:text-foreground transition-colors text-center"
    >
      ← Back
    </button>
  );
}

/* ── Page export with Suspense boundary ── */

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-foreground-muted">Loading…</p>
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
