"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { VoiceButton } from "@/components/ui/voice-button";
import { cn } from "@/lib/utils";
import { Sparkle } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";

interface BrainDumpProps {
  value: string;
  onChange: (value: string) => void;
  onOrganize: () => void;
  isLoading: boolean;
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export function BrainDump({
  value,
  onChange,
  onOrganize,
  isLoading,
}: BrainDumpProps) {
  const {
    isSupported,
    state,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
  } = useSpeechRecognition();

  // Track the last appended transcript to avoid duplicates
  const lastTranscriptRef = useRef("");

  // Append finalized transcript to the textarea value - each phrase on a new line
  useEffect(() => {
    if (transcript && transcript !== lastTranscriptRef.current) {
      // Each spoken phrase goes on its own line (new thought)
      const separator = value.trim() ? "\n" : "";
      onChange(value.trimEnd() + separator + transcript);
      lastTranscriptRef.current = transcript;
    }
  }, [transcript, value, onChange]);

  const handleVoiceClick = () => {
    if (state === "recording") {
      stopListening();
    } else {
      startListening();
    }
  };

  const placeholders = [
    "What's swirling around in your head right now?\n\nDon't worry about making sense. Just let it flow...",
    "Pour out whatever's on your mind...\n\nMessy is fine. This is just for you.",
    "What thoughts are taking up space today?\n\nNo need to organize yet. Just write.",
  ];

  const placeholder = placeholders[0];

  return (
    <motion.div
      className="flex-1 flex flex-col items-center justify-start md:justify-center px-4 md:px-8 pt-20 pb-12 min-h-screen"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-2xl flex flex-col gap-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="font-serif text-3xl md:text-4xl text-cream-light tracking-tight">
            Brain Dump
          </h1>
          <p className="text-cream-muted text-base md:text-lg">
            Let it all out. We'll make sense of it together.
          </p>
        </div>

        {/* Textarea with Voice Button */}
        <div className="relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={cn(
              "w-full h-[300px] md:h-[400px] p-6 md:p-8 pb-16 text-base md:text-lg leading-relaxed",
              "bg-surface border-0 rounded-2xl md:rounded-3xl resize-none",
              "text-cream placeholder:text-cream-muted/60",
              "focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-4 focus:ring-offset-night-200",
              "transition-shadow duration-300"
            )}
            autoFocus
          />

          {/* Voice Button - positioned bottom right */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            {/* Show interim transcript while recording */}
            {interimTranscript && (
              <span className="text-sm text-cream-muted/70 italic max-w-[200px] truncate">
                {interimTranscript}...
              </span>
            )}
            <VoiceButton
              state={state}
              isSupported={isSupported}
              onClick={handleVoiceClick}
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="absolute -bottom-6 left-0 text-sm text-red-400">
              {error}
            </p>
          )}
        </div>

        {/* Action */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={onOrganize}
            disabled={isLoading || value.trim().length < 10}
            className="min-w-[160px]"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-cream-muted border-t-transparent rounded-full animate-spin" />
                Thinking...
              </span>
            ) : (
              <span className="flex gap-2 items-center">
                <Sparkle />
                Organize
              </span>
            )}
          </Button>
        </div>

        {/* Gentle hint */}
        {value.trim().length > 0 && value.trim().length < 10 && (
          <p className="text-center text-cream-muted/70 text-sm">
            Keep going... a few more words
          </p>
        )}
      </div>
    </motion.div>
  );
}
