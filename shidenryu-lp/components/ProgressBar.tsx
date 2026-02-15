"use client";

interface Props {
  currentStep: number;
  totalSteps?: number;
}

const stepLabels = ["Date", "Time", "Activities", "Info", "Confirm"];

export default function ProgressBar({ currentStep, totalSteps = 5 }: Props) {
  return (
    <div className="bg-background-alt px-4 py-3">
      <div className="max-w-lg mx-auto">
        <div className="flex gap-1.5 mb-1.5">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-colors duration-300 ${
                i + 1 <= currentStep ? "bg-primary" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between">
          {stepLabels.map((label, i) => (
            <span
              key={label}
              className={`text-[9px] font-semibold transition-colors ${
                i + 1 <= currentStep
                  ? "text-primary"
                  : "text-foreground-subtle"
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
