"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RecordingState } from "@/lib/speech";

interface VoiceButtonProps {
  state: RecordingState;
  isSupported: boolean;
  onClick: () => void;
  className?: string;
}

export function VoiceButton({
  state,
  isSupported,
  onClick,
  className,
}: VoiceButtonProps) {
  const isRecording = state === "recording";
  const isProcessing = state === "processing";
  const isError = state === "error";

  if (!isSupported) {
    return (
      <button
        disabled
        className={cn(
          "relative p-3 rounded-xl text-cream-muted/50 cursor-not-allowed",
          className
        )}
        title="Voice input not supported in this browser"
      >
        <MicOff className="w-5 h-5" />
      </button>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={isProcessing}
      className={cn(
        "relative p-3 rounded-xl transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-night-200",
        isRecording
          ? "bg-sage text-night-200"
          : isError
            ? "bg-red-500/20 text-red-400"
            : "bg-surface-light text-cream-muted hover:text-cream hover:bg-surface",
        className
      )}
      whileTap={{ scale: 0.95 }}
    >
      {/* Pulsing ring during recording */}
      <AnimatePresence>
        {isRecording && (
          <motion.span
            className="absolute inset-0 rounded-xl bg-sage"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Icon */}
      <span className="relative z-10">
        {isProcessing ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isRecording ? (
          <motion.span
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          >
            <MicOff className="w-5 h-5" />
          </motion.span>
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </span>
    </motion.button>
  );
}
