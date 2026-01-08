import type { Cluster } from "./storage";

export async function organizeIdeas(rawDump: string): Promise<Cluster[]> {
  try {
    const response = await fetch("/api/organize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rawDump }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.clusters;
  } catch (error) {
    console.error("Failed to organize ideas:", error);
    // Return a simple fallback cluster
    return [
      {
        id: "1",
        title: "Your Thoughts",
        ideas: rawDump
          .split(/[\n.!?]+/)
          .map((l) => l.trim())
          .filter((l) => l.length > 3)
          .slice(0, 10),
      },
    ];
  }
}

export async function generateNextAction(
  idea: string,
  time: string,
  mood: string
): Promise<string> {
  try {
    const response = await fetch("/api/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea, time, mood }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.action;
  } catch (error) {
    console.error("Failed to generate action:", error);
    // Return a simple fallback action
    return `Take a moment to think about "${idea.slice(0, 30)}..." and write down one small thing you could do right now.`;
  }
}

export function pickRandomIdea(clusters: Cluster[]): string | null {
  const allIdeas = clusters.flatMap((c) => c.ideas);
  if (allIdeas.length === 0) return null;
  return allIdeas[Math.floor(Math.random() * allIdeas.length)];
}
