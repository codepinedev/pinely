import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `You are the gentle, supportive brain behind "Pinely," a cozy brain-dump app.
Your goal is not to force productivity, but to help the user find a tiny, manageable entry point into their task based on their current state.

INPUTS:
Task: {{Task}}
Time Available: {{Time}}
Current Energy: {{Energy}}

INSTRUCTIONS:
1. Analyze the inputs strictly.
2. Generate ONE specific, "micro-step" action.
3. TONE: Warm, encouraging, and non-judgmental. Avoid corporate speak. Use "we" or "just" to lower pressure.

LOGIC MATRIX:
- IF (Time: Low) AND (Energy: Low) -> The "No-Zero" Day.
  * Suggest a step so small it is impossible to fail (e.g., "Just open the tab," "Find the phone number").
  * Goal: Maintain the habit of showing up.

- IF (Time: High) AND (Energy: Low) -> The "Low-Stakes" prep.
  * Suggest organizing, gathering materials, or passive research.
  * Goal: make it easier for Future Self without burning out Now Self.

- IF (Time: Low) AND (Energy: High) -> The "Sprint".
  * Suggest a high-impact, immediate action.
  * Goal: Use that energy burst for maximum output in minimum time.

- IF (Time: High) AND (Energy: High) -> The "Deep Dive".
  * Suggest a clear starting point for a flow state.
  * Goal: meaningful progress.

OUTPUT RULES:
- Start with a verb, but soften it.
- Maximum 2 sentences.
- If Energy is LOW, explicitly mention that this small step is "enough."

EXAMPLES:
- Task: "Finish presentation", Time: few minutes, Energy: tired
  -> "Just open the presentation file and read the title slide. That's enough to keep the momentum going."
- Task: "Learn Python", Time: half hour, Energy: focused
  -> "Since you have good energy, let's dive in. Complete the very first lesson of the tutorial and run one line of code."
- Task: "Call mom", Time: few minutes, Energy: neutral
  -> "Just send Mom a quick text saying you're thinking of her and will call later."

Return ONLY the gentle action text.`;

export async function POST(request: NextRequest) {
  let idea: string = "";
  let time: string = "";
  let mood: string = "";

  try {
    const body = await request.json();
    idea = body.idea;
    time = body.time;
    mood = body.mood;

    if (!idea || typeof idea !== "string") {
      return NextResponse.json(
        { error: "Please provide an idea" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_api_key_here") {
      // Fallback to simple action generation
      console.log("No API key, using fallback");
      return NextResponse.json({
        action: fallbackAction(idea, time, mood),
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const timeLabel =
      time === "5min" ? "just a few minutes" :
      time === "30min" ? "about half an hour" :
      "as long as it takes";

    const moodLabel =
      mood === "tired" ? "low energy, feeling tired" :
      mood === "focused" ? "energized and ready to dive in" :
      "somewhere in between";

    const prompt = `The person wants to work on: "${idea}"
They have: ${timeLabel}
Their energy level: ${moodLabel}

Generate one gentle, specific next action for them.`;

    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: prompt },
    ]);

    console.log(result.toString())
    const action = result.response.text().trim();

    if (!action) {
      throw new Error("Empty response");
    }

    return NextResponse.json({ action });
  } catch (error) {
    console.error("Action API error:", error);

    // Return fallback action on error if we have the idea
    if (idea && idea.length > 0) {
      return NextResponse.json({
        action: fallbackAction(idea, time, mood),
        fallback: true,
      });
    }

    return NextResponse.json(
      { error: "Failed to generate action" },
      { status: 500 }
    );
  }
}

// Simple fallback action generation
function fallbackAction(idea: string, time: string, mood: string): string {
  const ideaPreview = idea.length > 30 ? idea.slice(0, 30) + "..." : idea;

  const actions = {
    tired: [
      `Just open a blank page and write one sentence about "${ideaPreview}"`,
      `Spend 2 minutes thinking about what the very first step might be`,
      `Write down three words that come to mind about this`,
      `Set a timer for 2 minutes and jot down any thoughts about "${ideaPreview}"`,
    ],
    neutral: [
      `Sketch out a rough outline for "${ideaPreview}"`,
      `List three small pieces you could start with`,
      `Set a 10-minute timer and brainstorm freely`,
      `Write down what "done" would look like for this`,
    ],
    focused: [
      `Draft the first rough version of "${ideaPreview}"`,
      `Block out 30 minutes to explore this idea deeply`,
      `Start with the part that excites you most about "${ideaPreview}"`,
      `Create a simple plan with 3-5 concrete steps`,
    ],
  };

  const moodKey = mood === "tired" ? "tired" : mood === "focused" ? "focused" : "neutral";
  const available = actions[moodKey];

  return available[Math.floor(Math.random() * available.length)];
}
