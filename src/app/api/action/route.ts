import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `You generate ONE specific next action for someone based on their task, time, and energy.

CRITICAL: The action MUST match both their TIME and ENERGY level:

TIME CONSTRAINTS:
- "just a few minutes" → 2-5 minute tasks only (open a doc, write one sentence, make a quick list)
- "about half an hour" → 15-30 minute tasks (draft something, outline a plan, do focused work)
- "as long as it takes" → can suggest deeper work, but still give a clear starting point

ENERGY CONSTRAINTS:
- "low energy, feeling tired" → effortless tasks (jot a note, bookmark something, send a quick text)
- "somewhere in between" → moderate effort (sketch ideas, write a paragraph, organize thoughts)
- "energized and ready to dive in" → can tackle harder tasks (write a draft, make calls, deep work)

EXAMPLES:
- Task: "finish presentation", Time: few minutes, Energy: tired → "Open the presentation and just read through the first 3 slides"
- Task: "learn Python", Time: half hour, Energy: focused → "Complete the first lesson of a Python tutorial and write your first 'hello world' program"
- Task: "call mom", Time: few minutes, Energy: neutral → "Send mom a text saying you'll call her tonight"

Return ONLY the action, 1-2 sentences max. Be specific and concrete.`;

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
