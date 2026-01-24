"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { saveFeedback, type FeedbackEntry } from "@/lib/feedback";

type Rating = FeedbackEntry["rating"];

const ratings: { value: Rating; emoji: string; label: string }[] = [
  { value: "happy", emoji: "😊", label: "Good" },
  { value: "neutral", emoji: "😐", label: "Okay" },
  { value: "sad", emoji: "😞", label: "Bad" },
];

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selectedRating) return;

    saveFeedback(selectedRating, message);
    setSubmitted(true);

    // Reset after delay
    setTimeout(() => {
      setIsOpen(false);
      setSelectedRating(null);
      setMessage("");
      setSubmitted(false);
    }, 2000);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedRating(null);
    setMessage("");
    setSubmitted(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-16 right-0 w-72 bg-surface border border-surface-light rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-surface-light">
              <span className="text-cream font-medium">Share feedback</span>
              <button
                onClick={handleClose}
                className="text-cream-muted hover:text-cream transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="thanks"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-6"
                  >
                    <span className="text-3xl mb-2 block">🙏</span>
                    <p className="text-cream">Thanks for your feedback!</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Rating selection */}
                    <p className="text-cream-muted text-sm mb-3">
                      How&apos;s your experience?
                    </p>
                    <div className="flex gap-2 mb-4">
                      {ratings.map(({ value, emoji, label }) => (
                        <button
                          key={value}
                          onClick={() => setSelectedRating(value)}
                          className={cn(
                            "flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all duration-200",
                            selectedRating === value
                              ? "bg-sage/20 ring-2 ring-sage"
                              : "bg-surface-light hover:bg-surface-dark"
                          )}
                        >
                          <span className="text-2xl">{emoji}</span>
                          <span className="text-xs text-cream-muted">
                            {label}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Message input */}
                    <AnimatePresence>
                      {selectedRating && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Tell us more (optional)"
                            rows={3}
                            className="w-full bg-surface-light text-cream placeholder:text-cream-muted rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sage mb-3"
                          />
                          <button
                            onClick={handleSubmit}
                            className="w-full bg-sage text-night-200 font-medium py-2.5 rounded-xl hover:bg-sage-dark transition-colors duration-200 flex items-center justify-center gap-2"
                          >
                            <Send size={16} />
                            Send feedback
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-colors duration-200",
          isOpen
            ? "bg-surface-light text-cream"
            : "bg-sage text-night-200 hover:bg-sage-dark"
        )}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle size={22} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
