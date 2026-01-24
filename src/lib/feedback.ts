// Feedback storage utilities
// Replace with Supabase later

export interface FeedbackEntry {
  id: string;
  rating: "happy" | "neutral" | "sad";
  message?: string;
  page: string;
  timestamp: string;
}

const STORAGE_KEY = "pinely_feedback";

export function saveFeedback(
  rating: FeedbackEntry["rating"],
  message?: string
): FeedbackEntry {
  const entry: FeedbackEntry = {
    id: crypto.randomUUID(),
    rating,
    message: message?.trim() || undefined,
    page: typeof window !== "undefined" ? window.location.pathname : "/",
    timestamp: new Date().toISOString(),
  };

  const existing = loadAllFeedback();
  existing.push(entry);

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  }

  // Log for development visibility
  console.log("[Feedback]", entry);

  return entry;
}

export function loadAllFeedback(): FeedbackEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function clearFeedback(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}
