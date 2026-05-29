/**
 * Passage-reference audit. Flags any question whose PROMPT refers to material
 * (a passage, a marked sentence, paired texts, a table, notes) that is MISSING
 * from its `passage` field — i.e. a question that would render with nothing to
 * read. Run: node --experimental-strip-types scripts/scan-passages.ts
 */
import { DATA as inferences } from "../lib/practice/data/inferences.ts";
import { DATA as evidenceTextual } from "../lib/practice/data/evidence-textual.ts";
import { DATA as evidenceQuantitative } from "../lib/practice/data/evidence-quantitative.ts";
import { DATA as centralIdeas } from "../lib/practice/data/central-ideas.ts";
import { DATA as wordsInContext } from "../lib/practice/data/words-in-context.ts";
import { DATA as textStructure } from "../lib/practice/data/text-structure.ts";
import { DATA as crossText } from "../lib/practice/data/cross-text.ts";
import { DATA as transitions } from "../lib/practice/data/transitions.ts";
import { DATA as rhetoricalSynthesis } from "../lib/practice/data/rhetorical-synthesis.ts";
import { DATA as boundaries } from "../lib/practice/data/boundaries.ts";
import { DATA as formStructureSense } from "../lib/practice/data/form-structure-sense.ts";

const ALL = [
  inferences, evidenceTextual, evidenceQuantitative, centralIdeas, wordsInContext,
  textStructure, crossText, transitions, rhetoricalSynthesis, boundaries, formStructureSense,
].flatMap((d) => d.questions);

const flags = [];

for (const q of ALL) {
  const p = (q.prompt || "").toLowerCase();
  const psg = q.passage || "";
  const lp = psg.toLowerCase();
  const hasBlank = psg.includes("______") || psg.includes("____") || psg.includes("___");
  const hasBold = psg.includes("**");
  const hasText12 = lp.includes("text 1") && lp.includes("text 2");
  const hasTable = psg.split("\n").some((l) => l.includes("|")) || /\d/.test(psg);
  const hasNotes = psg.includes("•") || /(^|\n)\s*[-*]\s/.test(psg);
  const nonEmpty = psg.trim().length > 20;
  const add = (why) => flags.push(`${q.id} [${q.skill}] — ${why}`);

  if ((p.includes("underlined") || p.includes("marked sentence")) && !hasBold)
    add("prompt refers to a marked/underlined sentence but passage has no **…** marking");
  if ((p.includes("text 1") || p.includes("text 2") || p.includes("both texts") || p.includes("author of text")) && !hasText12)
    add("prompt references Text 1/Text 2 but passage lacks both labels");
  if ((p.includes("table") || p.includes("graph") || p.includes("figure")) && !hasTable)
    add("prompt references a table/graph but passage has no data block");
  if (p.includes("notes") && !hasNotes)
    add("prompt references notes but passage has no bullet list");
  if ((q.skill === "transitions" || q.skill === "boundaries" || q.skill === "form-structure-sense") && !hasBlank)
    add("fill-in item but passage has no ______ blank");
  if (q.skill === "words-in-context" && !hasBlank && !hasBold)
    add("words-in-context item but passage has neither a ______ blank nor a **word**");
  // Generic: prompt talks about a passage/author/sentence but there's nothing to read.
  if (!nonEmpty && /(the text|the passage|the author|the sentence|the paragraph|the excerpt)/.test(p))
    add("prompt refers to a passage but `passage` is empty/too short");
}

console.log(`\nPassage-reference audit — ${ALL.length} questions scanned`);
if (flags.length === 0) {
  console.log("✓ Every question that references a passage has it present.\n");
} else {
  console.log(`⚠ ${flags.length} potential issue(s):\n`);
  for (const f of flags) console.log("  - " + f);
  console.log("");
  process.exit(2);
}
