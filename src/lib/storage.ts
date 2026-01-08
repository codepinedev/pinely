export interface Cluster {
  id: string;
  title: string;
  ideas: string[];
}

export interface AppState {
  rawDump: string;
  clusters: Cluster[];
  selectedIdea: string | null;
  nextAction: string | null;
  timeChoice: string | null;
  moodChoice: string | null;
}

const STORAGE_KEY = "pinely-state";

const defaultState: AppState = {
  rawDump: "",
  clusters: [],
  selectedIdea: null,
  nextAction: null,
  timeChoice: null,
  moodChoice: null,
};

export function loadState(): AppState {
  if (typeof window === "undefined") return defaultState;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...defaultState, ...JSON.parse(saved) };
    }
  } catch {
    // Ignore parse errors
  }
  return defaultState;
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

export function clearState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
