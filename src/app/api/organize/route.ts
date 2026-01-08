import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `You are a gentle, thoughtful assistant helping someone organize their scattered thoughts.

Your task: Take the user's brain dump and organize it into meaningful clusters.

Rules:
1. Create 2-6 clusters based on themes you notice
2. Each cluster should have a short, warm title (2-4 words)
3. Group thoughts by meaning and intent, not just keywords
4. Keep the original phrasing of thoughts (clean up slightly if needed)
5. Every thought should belong to exactly one cluster
6. If a thought is very short or unclear, still include it

Return ONLY valid JSON in this exact format:
{
  "clusters": [
    {
      "id": "1",
      "title": "Cluster Title",
      "ideas": ["thought 1", "thought 2"]
    }
  ]
}

Be warm and non-judgmental. These are someone's private thoughts.`;

export async function POST(request: NextRequest) {
  let rawDump: string = "";

  try {
    const body = await request.json();
    rawDump = body.rawDump;

    if (!rawDump || typeof rawDump !== "string" || rawDump.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide more text to organize" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_api_key_here") {
      // Fallback to simple clustering if no API key
      console.log("No API key, using fallback");
      return NextResponse.json({
        clusters: fallbackClustering(rawDump),
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: `Here's my brain dump:\n\n${rawDump}` },
    ]);

    const response = result.response.text();

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in response:", response);
      throw new Error("Invalid response format");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.clusters || !Array.isArray(parsed.clusters)) {
      console.error("Invalid clusters structure:", parsed);
      throw new Error("Invalid clusters format");
    }

    return NextResponse.json({ clusters: parsed.clusters });
  } catch (error) {
    console.error("Organize API error:", error);

    // Return fallback clustering on error if we have rawDump
    if (rawDump && rawDump.length > 0) {
      return NextResponse.json({
        clusters: fallbackClustering(rawDump),
        fallback: true,
      });
    }

    return NextResponse.json(
      { error: "Failed to organize thoughts" },
      { status: 500 }
    );
  }
}

// Simple fallback clustering (similar to original stubbed logic)
function fallbackClustering(rawDump: string) {
  const lines = rawDump
    .split(/[\n.!?]+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 3);

  if (lines.length === 0) {
    return [
      {
        id: "1",
        title: "Your thoughts",
        ideas: ["Start by writing down what's on your mind"],
      },
    ];
  }

  // Simple keyword-based fallback
  const clusters: { id: string; title: string; ideas: string[] }[] = [];
  const keywords = [
    { match: /work|project|deadline|meeting|task|job/i, title: "Work & Projects" },
    { match: /idea|create|build|make|start|design/i, title: "Creative Seeds" },
    { match: /learn|read|study|understand|explore/i, title: "Learning & Growth" },
    { match: /feel|worry|stress|happy|sad|anxious/i, title: "Feelings & Reflections" },
    { match: /friend|family|call|message|people/i, title: "People & Connections" },
  ];

  const uncategorized: string[] = [];

  for (const line of lines) {
    let matched = false;
    for (const { match, title } of keywords) {
      if (match.test(line)) {
        let cluster = clusters.find((c) => c.title === title);
        if (!cluster) {
          cluster = { id: String(clusters.length + 1), title, ideas: [] };
          clusters.push(cluster);
        }
        cluster.ideas.push(line);
        matched = true;
        break;
      }
    }
    if (!matched) {
      uncategorized.push(line);
    }
  }

  if (uncategorized.length > 0) {
    clusters.push({
      id: String(clusters.length + 1),
      title: "Other Thoughts",
      ideas: uncategorized,
    });
  }

  return clusters.slice(0, 6);
}
