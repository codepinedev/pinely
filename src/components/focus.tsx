"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FocusProps {
  selectedIdea: string;
  nextAction: string | null;
  onGenerateAction: (time: string, mood: string) => void;
  onBack: () => void;
  onStartOver: () => void;
  isLoading: boolean;
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const timeOptions = [
  { value: "5min", label: "Just a few minutes" },
  { value: "30min", label: "About half an hour" },
  { value: "open", label: "As long as it takes" },
];

const moodOptions = [
  { value: "tired", label: "Low energy" },
  { value: "neutral", label: "Somewhere in between" },
  { value: "focused", label: "Ready to dive in" },
];

export function Focus({
  selectedIdea,
  nextAction,
  onGenerateAction,
  onBack,
  onStartOver,
  isLoading,
}: FocusProps) {
  const [time, setTime] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [step, setStep] = useState<"time" | "mood" | "action">("time");

  const handleTimeSelect = (value: string) => {
    setTime(value);
    setStep("mood");
  };

  const handleMoodSelect = (value: string) => {
    setMood(value);
    setStep("action");
    onGenerateAction(time!, value);
  };

  return (
    <motion.div
      className="flex-1 flex flex-col items-center justify-center px-8 pt-20 pb-12"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-xl flex flex-col gap-12">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-cream-muted hover:text-cream text-sm transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to clusters
        </button>

        {/* The selected idea */}
        <div className="text-center space-y-4">
          <p className="text-cream-muted text-sm uppercase tracking-wider">
            Let's focus on
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-cream-light leading-snug">
            {selectedIdea}
          </h1>
        </div>

        {/* Questions or Action */}
        {step === "time" && (
          <div className="space-y-6">
            <p className="text-center text-cream text-lg">
              How much time do you have?
            </p>
            <div className="flex flex-col gap-3">
              {timeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleTimeSelect(option.value)}
                  className={cn(
                    "p-4 rounded-2xl text-left transition-all duration-200",
                    "bg-surface hover:bg-surface-light text-cream",
                    "border-2 border-transparent hover:border-sage/50"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "mood" && (
          <div className="space-y-6">
            <p className="text-center text-cream text-lg">
              How are you feeling right now?
            </p>
            <div className="flex flex-col gap-3">
              {moodOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleMoodSelect(option.value)}
                  className={cn(
                    "p-4 rounded-2xl text-left transition-all duration-200",
                    "bg-surface hover:bg-surface-light text-cream",
                    "border-2 border-transparent hover:border-sage/50"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "action" && (
          <div className="space-y-8">
            {isLoading ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="w-8 h-8 border-3 border-sage border-t-transparent rounded-full animate-spin" />
                <p className="text-cream-muted">Finding a gentle first step...</p>
              </div>
            ) : nextAction ? (
              <>
                <div className="bg-sage-dark/30 p-8 rounded-3xl">
                  <p className="text-cream-muted text-sm uppercase tracking-wider mb-3">
                    Your next step
                  </p>
                  <p className="text-cream-light text-xl leading-relaxed">
                    {nextAction}
                  </p>
                </div>

                <p className="text-center text-cream-muted text-sm">
                  That's it. Just this one thing.
                </p>
              </>
            ) : null}
          </div>
        )}

        {/* Start over link */}
        <div className="flex justify-center pt-4">
          <button
            onClick={onStartOver}
            className="text-cream-muted hover:text-cream text-sm transition-colors"
          >
            Start fresh
          </button>
        </div>
      </div>
    </motion.div>
  );
}
