/**
 * Thin Claude/OpenAI wrapper used for:
 *   • Session summaries (Whisper transcript → Claude summary)
 *   • Item authoring (skill+difficulty → draft question + 4 choices)
 *   • Tutor matching nudges (profile → which tutor to pair)
 *
 * Returns {ok:false, reason: 'not_configured'} when no key is set, so
 * callers degrade gracefully (manual flows still work).
 */

interface ChatTurn { role: "user" | "assistant" | "system"; content: string }

interface CompleteOptions {
  system?: string;
  prompt: string | ChatTurn[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

type CompleteResult =
  | { ok: true; text: string; provider: "anthropic" | "openai" }
  | { ok: false; reason: string };

const DEFAULT_ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";
const DEFAULT_OPENAI_MODEL    = process.env.OPENAI_MODEL    ?? "gpt-4o-mini";

export async function complete(opts: CompleteOptions): Promise<CompleteResult> {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey    = process.env.OPENAI_API_KEY;

  const userTurns: ChatTurn[] = Array.isArray(opts.prompt)
    ? opts.prompt
    : [{ role: "user", content: opts.prompt }];

  if (anthropicKey) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: opts.model ?? DEFAULT_ANTHROPIC_MODEL,
          max_tokens: opts.maxTokens ?? 1024,
          temperature: opts.temperature ?? 0.4,
          system: opts.system,
          messages: userTurns.filter((t) => t.role !== "system"),
        }),
      });
      if (!res.ok) return { ok: false, reason: `anthropic ${res.status}` };
      const data = (await res.json()) as { content: { type: string; text?: string }[] };
      const text = data.content?.find((c) => c.type === "text")?.text ?? "";
      return { ok: true, text, provider: "anthropic" };
    } catch (err) {
      return { ok: false, reason: err instanceof Error ? err.message : "anthropic error" };
    }
  }

  if (openaiKey) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: opts.model ?? DEFAULT_OPENAI_MODEL,
          temperature: opts.temperature ?? 0.4,
          max_tokens: opts.maxTokens ?? 1024,
          messages: [
            ...(opts.system ? [{ role: "system", content: opts.system }] : []),
            ...userTurns,
          ],
        }),
      });
      if (!res.ok) return { ok: false, reason: `openai ${res.status}` };
      const data = (await res.json()) as { choices: { message: { content: string } }[] };
      return { ok: true, text: data.choices[0]?.message?.content ?? "", provider: "openai" };
    } catch (err) {
      return { ok: false, reason: err instanceof Error ? err.message : "openai error" };
    }
  }

  return { ok: false, reason: "not_configured" };
}

/** Convenience: ask Claude/OpenAI to summarize a session transcript. */
export async function summarizeSession(input: { transcript: string; subject: string; tutorName?: string; targetScore?: string | null; }): Promise<{
  topicsCovered: string[];
  mistakes: string[];
  homework: string[];
  raw: string;
}> {
  const system = `You are a tutoring co-pilot for an online SAT/ACT/AP/admissions tutoring service. Read a session transcript and produce a concise post-session summary the tutor will edit before sending to the student. Keep it specific, factual, and student-readable.`;

  const result = await complete({
    system,
    prompt: `Subject: ${input.subject}
Tutor: ${input.tutorName ?? "unknown"}
Student goal: ${input.targetScore ?? "—"}

Transcript:
"""
${input.transcript.slice(0, 12000)}
"""

Return JSON only, with keys topicsCovered (string[]), mistakes (string[]), homework (string[]).`,
    maxTokens: 800,
    temperature: 0.3,
  });

  const empty = { topicsCovered: [], mistakes: [], homework: [], raw: "" };
  if (!result.ok) return empty;

  try {
    const json = JSON.parse(extractJson(result.text)) as { topicsCovered?: string[]; mistakes?: string[]; homework?: string[] };
    return {
      topicsCovered: json.topicsCovered ?? [],
      mistakes:      json.mistakes      ?? [],
      homework:      json.homework      ?? [],
      raw:           result.text,
    };
  } catch {
    return empty;
  }
}

function extractJson(text: string): string {
  const fence = text.match(/```(?:json)?\s*([\s\S]+?)```/);
  if (fence?.[1]) return fence[1];
  const start = text.indexOf("{");
  const end   = text.lastIndexOf("}");
  if (start >= 0 && end > start) return text.slice(start, end + 1);
  return text;
}
