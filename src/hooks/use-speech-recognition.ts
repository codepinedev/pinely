"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  getSpeechRecognition,
  isSpeechRecognitionSupported,
  type RecordingState,
  type SpeechRecognitionEventResult,
  type SpeechRecognitionErrorEventResult,
  type UseSpeechRecognitionReturn,
  type SpeechRecognitionInstance,
} from "@/lib/speech";

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [state, setState] = useState<RecordingState>("idle");
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Check support on mount (client-side only)
  useEffect(() => {
    setIsSupported(isSpeechRecognitionSupported());
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognitionConstructor = getSpeechRecognition();
    if (!SpeechRecognitionConstructor) {
      setError("Speech recognition not supported");
      setState("error");
      return;
    }

    // Reset state
    setError(null);
    setTranscript("");
    setInterimTranscript("");

    const recognition = new SpeechRecognitionConstructor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setState("recording");
    };

    recognition.onresult = (event: SpeechRecognitionEventResult) => {
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          // Each final result is a complete thought - emit it immediately
          const finalText = result[0].transcript.trim();
          if (finalText) {
            setTranscript(finalText);
          }
        } else {
          interim += result[0].transcript;
        }
      }

      setInterimTranscript(interim);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEventResult) => {
      // Don't treat 'no-speech' as a hard error
      if (event.error === "no-speech") {
        setState("idle");
        return;
      }

      const errorMessages: Record<string, string> = {
        "not-allowed":
          "Microphone access denied. Please enable it in your browser settings.",
        "audio-capture":
          "No microphone found. Please connect one and try again.",
        network: "Network error. Please check your connection.",
        aborted: "Recording was cancelled.",
      };

      setError(errorMessages[event.error] || `Error: ${event.error}`);
      setState("error");
    };

    recognition.onend = () => {
      setState("idle");
      setInterimTranscript("");
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      setState("processing");
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  return {
    isSupported,
    state,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
  };
}
