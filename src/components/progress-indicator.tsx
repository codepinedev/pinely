"use client";

import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  currentStep: 1 | 2 | 3;
}

const steps = [
  { num: 1, label: "Dump" },
  { num: 2, label: "Organize" },
  { num: 3, label: "Focus" },
];

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  return (
    <div className="fixed top-3 md:top-4 left-1/2 -translate-x-1/2 z-30">
      <div className="flex items-center gap-2 bg-night-200/80 backdrop-blur-md px-4 py-2 rounded-full">
        {steps.map((step, index) => (
          <div key={step.num} className="flex items-center">
            <div
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                currentStep === step.num
                  ? "bg-sage w-6"
                  : currentStep > step.num
                  ? "bg-sage/50"
                  : "bg-surface-light"
              )}
            />
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-8 h-px mx-1 transition-colors duration-300",
                  currentStep > step.num ? "bg-sage/50" : "bg-surface-light"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
