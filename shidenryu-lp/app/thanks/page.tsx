"use client";

import { Suspense, useEffect, useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Service } from "@/lib/services";

function ThanksContent() {
  const searchParams = useSearchParams();

  const bookingId = searchParams.get("id") ?? "N/A";
  const date = searchParams.get("date") ?? "";
  const timeSlot = searchParams.get("time") ?? "";
  const activitiesParam = searchParams.get("activities") ?? "";
  const guestName = searchParams.get("name") ?? "Guest";
  const email = searchParams.get("email") ?? "";
  const guests = searchParams.get("guests") ?? "1";

  const [services, setServices] = useState<Service[]>([]);

  // Fetch services for activity name resolution
  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((d) => setServices(d.services || []))
      .catch(() => setServices([]));
  }, []);

  const activityIds = activitiesParam.split(",").filter(Boolean);
  const activityNames = activityIds
    .map((id) => services.find((s) => s.id === id)?.name.split("(")[0].trim())
    .filter(Boolean)
    .join(" / ");

  const dateDisplay = date
    ? new Date(date + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const timeDisplay = timeSlot.replace("-", "–");

  // Prevent back to /booking — redirect to LP
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      window.location.href = "/";
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // .ics calendar download
  const handleCalendarDownload = useCallback(() => {
    if (!date || !timeSlot) return;

    const [startH, startM] = timeSlot.split("-")[0].split(":").map(Number);
    const startDate = new Date(date + "T00:00:00");
    startDate.setHours(startH, startM, 0);

    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + 90);

    const pad = (n: number) => String(n).padStart(2, "0");
    const formatICS = (d: Date) =>
      `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//SHIDENRYU//Booking//EN",
      "BEGIN:VEVENT",
      `DTSTART:${formatICS(startDate)}`,
      `DTEND:${formatICS(endDate)}`,
      `SUMMARY:Shidenryu Experience (Tentative)`,
      `DESCRIPTION:Booking ID: ${bookingId}\\nExperiences: ${activityNames}\\nGuests: ${guests}\\nStatus: Pending confirmation`,
      `STATUS:TENTATIVE`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shidenryu-${date}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [date, timeSlot, bookingId, activityNames, guests]);

  // Progress bar (all complete)
  const progressBar = (
    <div className="bg-background-alt px-4 py-3">
      <div className="max-w-lg mx-auto flex gap-1.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 h-1 rounded-full bg-primary" />
        ))}
      </div>
    </div>
  );

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
        </div>
      </header>

      {progressBar}

      <div className="max-w-lg mx-auto px-4">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center pt-8 pb-6 border-b border-border-light"
        >
          <span className="inline-block bg-success text-white text-[10px] font-bold px-2 py-0.5 rounded mb-3 tracking-wider uppercase">
            Request Received
          </span>
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl">📩</span>
          </div>
          <h1 className="font-heading text-xl font-bold mb-2 text-foreground">
            Booking Request
            <br />
            Received!
          </h1>
          <p className="text-sm text-foreground-muted">
            Thank you, <strong>{guestName}</strong>.
          </p>
          <p className="text-[10px] text-foreground-subtle mt-1">
            ID: {bookingId}
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="py-6 border-b border-border-light"
        >
          <h3 className="text-sm font-bold text-foreground mb-4">
            What Happens Next
          </h3>
          <div className="space-y-0">
            {[
              {
                icon: "✅",
                title: "Request Received",
                desc: "Just now",
                dotClass: "bg-success",
              },
              {
                icon: "⏳",
                title: "Under Review",
                desc: "Our team is checking availability",
                dotClass: "bg-orange-400",
              },
              {
                icon: "📧",
                title: "Confirmation Email",
                desc: `Within 24 hours to ${email}`,
                dotClass: "bg-gray-300",
              },
              {
                icon: "🎉",
                title: "Experience Day",
                desc: `${dateDisplay} ${timeDisplay}`,
                dotClass: "bg-gray-300",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 relative py-2">
                {/* Connecting line */}
                {i < 3 && (
                  <div className="absolute left-[5px] top-[22px] bottom-[-4px] w-0.5 bg-gray-200" />
                )}
                <div
                  className={`w-3 h-3 rounded-full ${item.dotClass} shrink-0 mt-0.5`}
                />
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    {item.icon} {item.title}
                  </h4>
                  <p className="text-[11px] text-foreground-muted">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Request Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="py-6 border-b border-border-light"
        >
          <h3 className="text-sm font-bold text-foreground mb-3">
            Request Summary
          </h3>
          <div className="space-y-0">
            {[
              { label: "📅 Date", value: dateDisplay },
              { label: "🕐 Time", value: timeDisplay },
              { label: "🎯 Experiences", value: activityNames || "Loading..." },
              {
                label: "👥 Guests",
                value: `${guests} guest${Number(guests) > 1 ? "s" : ""}`,
              },
              {
                label: "💴 Price",
                value: "¥40,000 (pay on-site)",
                highlight: true,
              },
            ].map((row, i, arr) => (
              <div
                key={row.label}
                className={`flex justify-between items-center py-2.5 ${
                  i < arr.length - 1 ? "border-b border-border-light" : ""
                }`}
              >
                <span className="text-xs text-foreground-subtle">
                  {row.label}
                </span>
                <span
                  className={`text-xs font-bold ${
                    row.highlight ? "text-primary" : ""
                  } text-right max-w-[55%]`}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Notice & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="py-6 text-center"
        >
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5 text-left">
            <p className="text-xs text-amber-800">
              📬 <strong>Check your email</strong>
              <br />
              We&apos;ll send a confirmation or alternative date suggestion to{" "}
              <strong>{email}</strong> within 24 hours.
            </p>
          </div>

          <button
            onClick={handleCalendarDownload}
            className="w-full bg-white text-primary border-2 border-primary font-bold py-3 rounded-lg hover:bg-primary-light transition-colors text-sm"
          >
            📲 Add to Calendar (Tentative)
          </button>

          <Link
            href="/"
            className="block w-full mt-3 bg-foreground text-white font-bold py-3 rounded-lg hover:opacity-85 transition-opacity text-sm text-center"
          >
            Return to Top Page
          </Link>

          <p className="mt-5 text-[11px] text-foreground-subtle">
            Questions? Contact us at
            <br />
            <a
              href="mailto:support@example.com"
              className="font-bold hover:text-foreground transition-colors"
            >
              support@example.com
            </a>
          </p>
        </motion.div>

        {/* Footer */}
        <div className="border-t border-border py-4 text-center">
          <p className="text-[10px] text-foreground-subtle">
            Operated by Sammy Corporation
          </p>
          <div className="flex items-center justify-center gap-2 mt-1 text-[10px] text-foreground-subtle">
            <Link href="/terms" target="_blank" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <span>|</span>
            <Link href="/privacy" target="_blank" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
          </div>
          <div className="flex items-center justify-center gap-2 mt-1 text-[10px] text-foreground-subtle">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              Instagram
            </a>
            <span>|</span>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              YouTube
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ThanksPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-foreground-muted">Loading...</p>
        </div>
      }
    >
      <ThanksContent />
    </Suspense>
  );
}
