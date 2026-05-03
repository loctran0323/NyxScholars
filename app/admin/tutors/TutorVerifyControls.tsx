"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ShieldOff } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/system/Toast";

type Background = "not_started" | "pending" | "cleared" | "flagged";

export function TutorVerifyControls({
  tutorId,
  verified,
  ndaSigned,
  background,
}: {
  tutorId: string;
  verified: boolean;
  ndaSigned: boolean;
  background: Background;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, setPending] = React.useState<string | null>(null);

  async function patch(p: { verify?: boolean; nda_signed?: boolean; background?: Background }) {
    setPending(JSON.stringify(p));
    const res = await fetch("/api/admin/verify-tutor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tutor_id: tutorId, ...p }),
    });
    setPending(null);
    if (!res.ok) {
      toast({ title: "Failed", variant: "error" });
      return;
    }
    toast({ title: "Updated", variant: "success", durationMs: 1500 });
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button
        variant={verified ? "outline" : "primary"}
        size="sm"
        loading={pending === JSON.stringify({ verify: !verified })}
        onClick={() => patch({ verify: !verified })}
      >
        {verified ? <><ShieldOff size={11} /> Unverify</> : <><ShieldCheck size={11} /> Verify</>}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        loading={pending === JSON.stringify({ nda_signed: !ndaSigned })}
        onClick={() => patch({ nda_signed: !ndaSigned })}
      >
        {ndaSigned ? "Clear NDA" : "Mark NDA"}
      </Button>
      <Select value={background} onValueChange={(v) => patch({ background: v as Background })}>
        <SelectTrigger className="h-8 text-[11.5px] min-w-[110px]"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="not_started">Not started</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="cleared">Cleared</SelectItem>
          <SelectItem value="flagged">Flagged</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
