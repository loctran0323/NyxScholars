"use client";

import { useState } from "react";
import { Lead } from "@/types/lead";
import { X, Mail, Phone, Calendar } from "lucide-react";

interface AdminLeadTableProps {
  leads: Lead[];
}

function formatDate(ts: string) {
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDateShort(ts: string) {
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

const SERVICE_COLORS: Record<string, string> = {
  SAT: "text-blue-400 bg-blue-400/10",
  ACT: "text-violet-400 bg-violet-400/10",
  AP: "text-emerald-400 bg-emerald-400/10",
  "College Admissions": "text-[var(--accent)] bg-[var(--accent)]/10",
};

function serviceColor(service: string) {
  for (const [key, cls] of Object.entries(SERVICE_COLORS)) {
    if (service?.toLowerCase().includes(key.toLowerCase())) return cls;
  }
  return "text-[var(--text-2)] bg-white/[0.06]";
}

export default function AdminLeadTable({ leads }: AdminLeadTableProps) {
  const [selected, setSelected] = useState<Lead | null>(null);

  if (leads.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-[var(--text-3)] text-[14px]">No consultation requests yet.</p>
        <p className="text-[#2e3a4a] text-[13px] mt-1">Submissions will appear here.</p>
      </div>
    );
  }

  return (
    <>
      {/* Lead list */}
      <div className="divide-y divide-white/[0.04]">
        {leads.map((lead) => (
          <button
            key={lead.id}
            onClick={() => setSelected(lead)}
            className="w-full flex items-center gap-4 py-3.5 px-4 -mx-4 rounded-xl hover:bg-white/[0.03] transition-colors text-left group"
          >
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-[var(--accent)]/10 border border-[var(--border-accent)] flex items-center justify-center shrink-0">
              <span className="text-[11px] font-bold text-[var(--accent)]">{initials(lead.student_name)}</span>
            </div>

            {/* Name + email */}
            <div className="flex-1 min-w-0">
              <p className="text-[var(--text-1)] text-[14px] font-medium truncate">{lead.student_name}</p>
              <p className="text-[var(--text-3)] text-[12px] truncate">{lead.email}</p>
            </div>

            {/* Service badge */}
            {lead.service && (
              <span className={`hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${serviceColor(lead.service)}`}>
                {lead.service}
              </span>
            )}

            {/* Grade */}
            {lead.grade && (
              <span className="hidden md:block text-[var(--text-3)] text-[12px] shrink-0">{lead.grade}</span>
            )}

            {/* Date */}
            <span className="text-[var(--text-3)] text-[12px] shrink-0">{formatDateShort(lead.created_at)}</span>
          </button>
        ))}
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Sheet */}
          <div
            className="relative w-full max-w-md rounded-2xl overflow-hidden"
            style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 32px 80px rgba(0,0,0,0.8)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[var(--surface)] px-6 pt-6 pb-5">
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 border border-[var(--border-accent)] flex items-center justify-center shrink-0">
                    <span className="text-[12px] font-bold text-[var(--accent)]">{initials(selected.student_name)}</span>
                  </div>
                  <div>
                    <h2 className="text-[17px] font-bold text-[var(--text-1)]">{selected.student_name}</h2>
                    {selected.grade && <p className="text-[var(--text-2)] text-[12px]">{selected.grade}</p>}
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-white/[0.06] transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {selected.service && (
                <span className={`mt-3 inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${serviceColor(selected.service)}`}>
                  {selected.service}
                </span>
              )}
            </div>

            {/* Contact row */}
            <div className="bg-[var(--bg-2)] px-6 py-4 flex flex-wrap gap-4 border-y border-white/[0.04]">
              <a href={`mailto:${selected.email}`} className="flex items-center gap-2 text-[var(--text-2)] hover:text-[var(--text-1)] text-[13px] transition-colors">
                <Mail size={12} />
                {selected.email}
              </a>
              {selected.phone && (
                <a href={`tel:${selected.phone}`} className="flex items-center gap-2 text-[var(--text-2)] hover:text-[var(--text-1)] text-[13px] transition-colors">
                  <Phone size={12} />
                  {selected.phone}
                </a>
              )}
              <span className="flex items-center gap-2 text-[var(--text-3)] text-[13px]">
                <Calendar size={12} />
                {formatDate(selected.created_at)}
              </span>
            </div>

            {/* Details */}
            <div className="bg-[var(--surface)] px-6 py-5 space-y-3 max-h-64 overflow-y-auto">
              {[
                ["Parent / Guardian", selected.parent_name],
                ["AP Subject", selected.ap_subject],
                ["Current Score", selected.current_score],
                ["Target Score", selected.target_score],
                ["Test Date", selected.test_date],
                ["Format", selected.tutoring_format],
                ["Availability", selected.availability_notes],
                ["What they need help with", selected.help_needed],
              ]
                .filter(([, v]) => Boolean(v))
                .map(([label, value]) => (
                  <div key={label} className="flex gap-4">
                    <dt className="text-[var(--text-3)] text-[12px] font-medium shrink-0 w-36 pt-0.5">{label}</dt>
                    <dd className="text-[var(--text-1)] text-[13px] leading-relaxed">{value}</dd>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
