/**
 * POST /api/practice/adaptive — the infinite, self-adjusting practice loop.
 *
 * Stateless on the server: the client carries the (answer-free) ability state and
 * posts it back each turn. The server picks the next skill + difficulty, serves an
 * item (math generated fresh, R&W drawn from the pool), grades the previous answer
 * by resolving its opaque token back to the key, and returns the updated state plus
 * a live ability readout. There is no terminal condition — it runs forever.
 *
 * Actions:
 *   { action: "start",  section }                       → { state, item, readout }
 *   { action: "answer", state, section, token, picked } → { feedback, state, item, readout }
 */
import { NextRequest, NextResponse } from "next/server";
import { getPortalApi } from "@/lib/portal-auth";
import {
  hydrateState,
  applyResult,
  pickSkill,
  targetDifficulty,
  estimatedScore,
  estimatedSubscore,
  masteryReadout,
  encodeToken,
  decodeToken,
  initInfiniteState,
  type InfiniteState,
  type SectionFilter,
} from "@/lib/practice/infinite-engine";
import {
  servableSkillIds,
  serveItem,
  resolveItem,
  toPublicItem,
  type PublicItem,
} from "@/lib/practice/infinite-bank";

const SECTIONS: SectionFilter[] = ["Math", "Reading & Writing", "Mixed"];

function normSection(s: unknown): SectionFilter {
  return SECTIONS.includes(s as SectionFilter) ? (s as SectionFilter) : "Mixed";
}

function readout(state: InfiniteState) {
  const skills = masteryReadout(state).filter((s) => s.attempts > 0);
  const sorted = [...skills].sort((a, b) => a.mastery - b.mastery);
  return {
    score: estimatedScore(state),
    math: estimatedSubscore(state, "Math"),
    rw: estimatedSubscore(state, "R&W"),
    theta: Math.round(state.theta * 100) / 100,
    totalAnswered: state.totalAnswered,
    totalCorrect: state.totalCorrect,
    accuracy: state.totalAnswered ? Math.round((state.totalCorrect / state.totalAnswered) * 100) : 0,
    streak: state.streak,
    bestStreak: state.bestStreak,
    skills: masteryReadout(state),
    weakest: sorted.slice(0, 3).map((s) => ({ name: s.name, mastery: Math.round(s.mastery * 100) })),
    strongest: [...sorted].reverse().slice(0, 3).map((s) => ({ name: s.name, mastery: Math.round(s.mastery * 100) })),
  };
}

/** Pick a skill + difficulty and serve the next item. Excludes skills that fail to serve so the loop actually rotates. */
function nextItem(state: InfiniteState, step: number): PublicItem | null {
  const servable = servableSkillIds();
  const tried = new Set<string>();
  for (let attempt = 0; attempt < 8; attempt++) {
    const candidates = servable.filter((id) => !tried.has(id));
    if (candidates.length === 0) break;
    const skillId = pickSkill(state, candidates);
    if (!skillId) break;
    tried.add(skillId);
    const difficulty = targetDifficulty(state, skillId);
    const served = serveItem(skillId, difficulty, { recentAsked: state.recentAsked, step: step + attempt });
    if (served) return toPublicItem(served.item, encodeToken(served.token));
  }
  return null;
}

export async function POST(req: NextRequest) {
  const auth = await getPortalApi();
  if (!auth.ok) return auth.response;

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const action = body.action;
  const section = normSection(body.section);

  if (action === "start") {
    const state = initInfiniteState(section);
    const item = nextItem(state, 0);
    if (!item) return NextResponse.json({ error: "No items available" }, { status: 500 });
    return NextResponse.json({ state, item, readout: readout(state) });
  }

  if (action === "answer") {
    const state = hydrateState(body.state as Partial<InfiniteState> | null, section);
    const token = typeof body.token === "string" ? decodeToken(body.token) : null;
    const pickedRaw = body.picked;
    const picked =
      typeof pickedRaw === "number" && pickedRaw >= 0 && pickedRaw <= 3 ? pickedRaw : null;

    let nextState = state;
    let feedback: { correct: boolean; correctIndex: number; rationale?: string } | null = null;

    if (token) {
      const item = resolveItem(token);
      if (item) {
        if (picked === null) {
          // Skipped — don't move ability, but avoid immediately re-serving the same item.
          nextState = { ...state, recentAsked: [...state.recentAsked, item.id].slice(-250) };
        } else {
          const correct = picked === item.correct;
          feedback = { correct, correctIndex: item.correct, rationale: item.rationale };
          nextState = applyResult(state, {
            skillId: item.skillId,
            difficulty: item.difficulty,
            correct,
            questionId: item.id,
          });
        }
      }
    }

    const item = nextItem(nextState, nextState.totalAnswered + nextState.recentAsked.length);
    if (!item) return NextResponse.json({ error: "No items available" }, { status: 500 });
    return NextResponse.json({ feedback, state: nextState, item, readout: readout(nextState) });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
