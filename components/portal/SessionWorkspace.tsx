"use client";

import * as React from "react";
import { PenTool, Video, FileText, ChevronRight, Sparkles, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export interface SessionMedia {
  recordingUrl?: string;
  recordingProvider?: string;
  transcriptUrl?: string;
  whiteboardUrl?: string;
  summaryTopics?: string[];
  summaryHomework?: string[];
}

/**
 * Drop-in session workspace. Renders four panels — whiteboard, recording,
 * AI-generated summary, and homework — using whichever URLs are present.
 * Designed to embed inside /portal/sessions/[id]; degrades gracefully when
 * a media provider isn't configured.
 *
 * Whiteboard uses an Excalidraw embed by default (no SDK required); swap
 * the iframe `src` to a Tldraw room for collaborative editing.
 */
export function SessionWorkspace({ media, sessionId }: { media: SessionMedia; sessionId: string }) {
  const whiteboardSrc =
    media.whiteboardUrl
    ?? `https://excalidraw.com/#room=nyx-${sessionId.slice(0, 12)},${encodeURIComponent(`nyx-${sessionId}`)}`;

  return (
    <Tabs defaultValue="whiteboard" className="w-full">
      <TabsList aria-label="Session workspace">
        <TabsTrigger value="whiteboard"><PenTool size={13} className="mr-1.5" />Whiteboard</TabsTrigger>
        <TabsTrigger value="recording"> <Video      size={13} className="mr-1.5" />Recording</TabsTrigger>
        <TabsTrigger value="summary">   <Sparkles   size={13} className="mr-1.5" />AI summary</TabsTrigger>
        <TabsTrigger value="homework">  <ListChecks size={13} className="mr-1.5" />Homework</TabsTrigger>
      </TabsList>

      <TabsContent value="whiteboard" className="mt-3">
        <div className="rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)]">
          <iframe
            title="Session whiteboard"
            src={whiteboardSrc}
            className="w-full h-[560px] bg-white"
            allow="clipboard-write"
          />
        </div>
        <p className="text-[11.5px] text-[var(--text-3)] mt-2">
          Swap the iframe to <code className="text-[var(--accent)]">tldraw</code> for granular permissions.
        </p>
      </TabsContent>

      <TabsContent value="recording" className="mt-3">
        {media.recordingUrl ? (
          <div className="rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)]">
            <video controls className="w-full max-h-[560px] bg-black" src={media.recordingUrl} />
            {media.transcriptUrl && (
              <div className="px-4 py-3 border-t border-[var(--border)] flex items-center justify-between text-[12.5px]">
                <span className="text-[var(--text-2)] flex items-center gap-1.5"><FileText size={13} />Transcript available</span>
                <a className="text-[var(--accent)] hover:text-[var(--accent-bright)] flex items-center gap-1" href={media.transcriptUrl} target="_blank" rel="noreferrer">
                  Download <ChevronRight size={12} />
                </a>
              </div>
            )}
          </div>
        ) : (
          <Empty
            icon={Video}
            title="Recording not available yet"
            body="If your tutor opted into recording, the playback (and a Whisper transcript) will show up here within an hour of the session ending."
          />
        )}
      </TabsContent>

      <TabsContent value="summary" className="mt-3">
        {media.summaryTopics?.length ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h3 className="text-[13px] uppercase tracking-wider text-[var(--text-3)] font-semibold mb-3">Topics covered</h3>
            <ul className="space-y-1.5 text-[13.5px] text-[var(--text-1)]">
              {media.summaryTopics.map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-2 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <Empty
            icon={Sparkles}
            title="No summary yet"
            body="Your tutor will review and send the AI-generated recap within 24h after the session."
          />
        )}
      </TabsContent>

      <TabsContent value="homework" className="mt-3">
        {media.summaryHomework?.length ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h3 className="text-[13px] uppercase tracking-wider text-[var(--text-3)] font-semibold mb-3">Practice for next time</h3>
            <ul className="space-y-1.5 text-[13.5px] text-[var(--text-1)]">
              {media.summaryHomework.map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold-soft)] mt-2 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <Empty
            icon={ListChecks}
            title="No homework yet"
            body="Your tutor pushes 3–5 questions here at the end of each session — they roll into your spaced-repetition queue."
          />
        )}
      </TabsContent>
    </Tabs>
  );
}

function Empty({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
      <Icon size={26} className={cn("mx-auto text-[var(--text-3)] mb-3")} />
      <p className="text-[14px] font-semibold text-[var(--text-1)]">{title}</p>
      <p className="text-[12.5px] text-[var(--text-2)] mt-1.5 max-w-sm mx-auto leading-relaxed">{body}</p>
    </div>
  );
}
