"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Renders a question passage. Supports two light conventions used by the bank:
 *  - **double asterisks** mark a referenced ("underlined") sentence → bold.
 *  - A block whose lines are mostly pipe-delimited is treated as a data table
 *    and rendered in a monospace card so columns line up.
 */
export function Passage({ text, className }: { text: string; className?: string }) {
  if (!text?.trim()) return null;
  const blocks = text.split(/\n{2,}/);
  return (
    <div className={cn("space-y-3", className)}>
      {blocks.map((block, bi) => {
        const lines = block.split("\n");
        const pipeLines = lines.filter((l) => l.includes("|")).length;
        const isTable = lines.length > 1 && pipeLines >= Math.max(2, lines.length - 1);
        if (isTable) {
          return (
            <pre
              key={bi}
              className="overflow-x-auto whitespace-pre rounded-lg border border-[var(--border)] bg-[var(--bg-2)] p-3 font-mono text-[12.5px] leading-relaxed text-[var(--text-2)]"
            >
              {block}
            </pre>
          );
        }
        return (
          <p key={bi} className="whitespace-pre-wrap text-[15px] leading-relaxed text-[var(--text-1)]">
            {renderInline(block)}
          </p>
        );
      })}
    </div>
  );
}

function renderInline(s: string): React.ReactNode {
  const parts = s.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const m = /^\*\*([^*]+)\*\*$/.exec(part);
    if (m) {
      return (
        <strong key={i} className="font-semibold text-[var(--text-1)] underline decoration-[var(--border-2)] underline-offset-4">
          {m[1]}
        </strong>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}
