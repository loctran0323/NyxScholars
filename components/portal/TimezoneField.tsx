"use client";

import * as React from "react";
import { Globe, Wand2 } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { COMMON_TIMEZONES, detectTimezone, tzOffset } from "@/lib/timezone";
import { useToast } from "@/components/system/Toast";

export function TimezoneField({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (tz: string) => void;
}) {
  const { toast } = useToast();
  const [draft, setDraft] = React.useState<string | null>(value);
  React.useEffect(() => setDraft(value), [value]);

  const options = React.useMemo(
    () =>
      COMMON_TIMEZONES.map((t) => ({
        value: t.value,
        label: t.label,
        description: tzOffset(t.value),
        icon: Globe,
      })),
    [],
  );

  function save(tz: string) {
    setDraft(tz);
    onChange(tz);
  }

  function detect() {
    const tz = detectTimezone();
    save(tz);
    toast({ title: "Timezone detected", description: tz, variant: "success", durationMs: 1800 });
  }

  return (
    <div className="space-y-2">
      <Combobox
        ariaLabel="Timezone"
        placeholder="Pick your timezone"
        options={options}
        value={draft}
        onChange={(v) => v && save(v)}
      />
      <Button variant="ghost" size="sm" onClick={detect} type="button">
        <Wand2 size={12} /> Auto-detect
      </Button>
    </div>
  );
}
