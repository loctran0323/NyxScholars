"use client";

import * as React from "react";
import { Save, Star, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/system/Toast";
import { fmtUsdWhole } from "@/lib/pricing";

interface Row {
  id: "month" | "two-month" | "three-month";
  name: string;
  weeks: number;
  total_hours: number;
  total_price: number;
  effective_hourly: number;
  discount_pct: number;
  summary: string;
  recommended: boolean;
  enabled: boolean;
}

export function PricingEditor({ initial }: { initial: Row[] }) {
  const { toast } = useToast();
  const [rows, setRows] = React.useState<Row[]>(initial);
  const [saving, setSaving] = React.useState<string | null>(null);

  function patch(id: Row["id"], p: Partial<Row>) {
    setRows((curr) => curr.map((r) => (r.id === id ? { ...r, ...p } : r)));
  }

  async function save(row: Row) {
    setSaving(row.id);
    const res = await fetch("/api/admin/pricing", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id:               row.id,
        name:             row.name,
        weeks:            row.weeks,
        total_hours:      row.total_hours,
        total_price:      row.total_price,
        effective_hourly: row.effective_hourly,
        discount_pct:     row.discount_pct,
        summary:          row.summary,
        recommended:      row.recommended,
        enabled:          row.enabled,
      }),
    });
    setSaving(null);
    if (!res.ok) {
      toast({ title: "Couldn't save", variant: "error" });
      return;
    }
    toast({ title: "Saved", description: row.name, variant: "success", durationMs: 1800 });
  }

  return (
    <div className="space-y-4">
      {rows.map((row) => (
        <article key={row.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
            <div className="min-w-0">
              <p className="text-[10.5px] uppercase tracking-[0.22em] text-[var(--text-3)] font-semibold">{row.id}</p>
              <h2 className="text-[16px] font-semibold text-[var(--text-1)] mt-0.5">{row.name}</h2>
              <p className="text-[12.5px] text-[var(--text-2)] mt-1">
                {fmtUsdWhole(row.total_price)} for {row.total_hours}h ·
                ${row.effective_hourly}/hr ({row.discount_pct}% off)
              </p>
            </div>
            <div className="flex items-center gap-2">
              {row.recommended && <Badge variant="gold"><Star size={10} /> Most popular</Badge>}
              {!row.enabled && <Badge variant="red">Disabled</Badge>}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="mb-1.5 block">Display name</Label>
              <Input value={row.name} onChange={(e) => patch(row.id, { name: e.target.value })} />
            </div>
            <div>
              <Label className="mb-1.5 block">Total price (USD)</Label>
              <Input type="number" min={0} value={row.total_price} onChange={(e) => patch(row.id, { total_price: parseInt(e.target.value || "0", 10) })} />
            </div>
            <div>
              <Label className="mb-1.5 block">Weeks</Label>
              <Input type="number" min={1} value={row.weeks} onChange={(e) => patch(row.id, { weeks: parseInt(e.target.value || "0", 10) })} />
            </div>
            <div>
              <Label className="mb-1.5 block">Total hours</Label>
              <Input type="number" min={1} value={row.total_hours} onChange={(e) => patch(row.id, { total_hours: parseInt(e.target.value || "0", 10) })} />
            </div>
            <div>
              <Label className="mb-1.5 block">Effective $/hr</Label>
              <Input type="number" min={0} value={row.effective_hourly} onChange={(e) => patch(row.id, { effective_hourly: parseInt(e.target.value || "0", 10) })} />
            </div>
            <div>
              <Label className="mb-1.5 block">Discount %</Label>
              <Input type="number" min={0} max={80} value={row.discount_pct} onChange={(e) => patch(row.id, { discount_pct: parseInt(e.target.value || "0", 10) })} />
            </div>
            <div className="sm:col-span-2">
              <Label className="mb-1.5 block">Summary</Label>
              <Textarea rows={2} value={row.summary} onChange={(e) => patch(row.id, { summary: e.target.value })} />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 text-[12.5px] text-[var(--text-2)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={row.recommended}
                  onChange={(e) => patch(row.id, { recommended: e.target.checked })}
                  className="accent-[var(--gold-soft)]"
                />
                Most popular
              </label>
              <label className="inline-flex items-center gap-2 text-[12.5px] text-[var(--text-2)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={row.enabled}
                  onChange={(e) => patch(row.id, { enabled: e.target.checked })}
                  className="accent-[var(--accent)]"
                />
                Enabled
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRows((curr) => curr.map((r) => (r.id === row.id ? initial.find((i) => i.id === row.id)! : r)))}
              >
                <RotateCcw size={12} /> Revert
              </Button>
              <Button variant="primary" size="sm" loading={saving === row.id} onClick={() => save(row)}>
                <Save size={12} /> Save
              </Button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
