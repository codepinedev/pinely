// Type definitions for Web Speech API (not fully typed in TypeScript)

export interface SpeechRecognitionEventResult {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResultItem;
  [index: number]: SpeechRecognitionResultItem;
}

export interface SpeechRecognitionResultItem {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionErrorEventResult {
  error: string;
  message: string;
}

export type RecordingState = "idle" | "recording" | "processing" | "error";

export interface UseSpeechRecognitionReturn {
  isSupported: boolean;
  state: RecordingState;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
}

// SpeechRecognition instance interface
export interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventResult) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventResult) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

// Constructor type
export interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

// Check browser support
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  return !!(
    (window as WindowWithSpeechRecognition).SpeechRecognition ||
    (window as WindowWithSpeechRecognition).webkitSpeechRecognition
  );
}

// Window with SpeechRecognition
interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

// Get SpeechRecognition constructor
export function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const win = window as WindowWithSpeechRecognition;
  return win.SpeechRecognition || win.webkitSpeechRecognition || null;
}
