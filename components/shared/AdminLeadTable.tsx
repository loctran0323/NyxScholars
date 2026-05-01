"use client";

import { useState } from "react";
import { Lead } from "@/types/lead";
import { X } from "lucide-react";

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

export default function AdminLeadTable({ leads }: AdminLeadTableProps) {
  const [selected, setSelected] = useState<Lead | null>(null);

  return (
    <>
      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#2a3a52]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a3a52] bg-[#0f1623]">
              {["Name", "Email", "Phone", "Service", "Grade", "Submitted"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[#8896a7] font-medium text-xs uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-[#8896a7]">
                  No leads submitted yet.
                </td>
              </tr>
            )}
            {leads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => setSelected(lead)}
                className="border-b border-[#2a3a52]/50 hover:bg-[#161e2e] cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 text-[#f0ede6] font-medium">{lead.student_name}</td>
                <td className="px-4 py-3 text-[#8896a7]">{lead.email}</td>
                <td className="px-4 py-3 text-[#8896a7]">{lead.phone || "—"}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-xs border border-amber-500/20">
                    {lead.service}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#8896a7]">{lead.grade || "—"}</td>
                <td className="px-4 py-3 text-[#8896a7] text-xs">{formatDate(lead.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-[#161e2e] border border-[#2a3a52] rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#f0ede6]">{selected.student_name}</h2>
                <p className="text-[#8896a7] text-sm">{selected.email}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-[#8896a7] hover:text-[#f0ede6] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <dl className="space-y-3">
              {[
                ["Parent / Guardian", selected.parent_name],
                ["Phone", selected.phone],
                ["Grade", selected.grade],
                ["Service", selected.service],
                ["AP Subject", selected.ap_subject],
                ["Current Score", selected.current_score],
                ["Target Score", selected.target_score],
                ["Test Date", selected.test_date],
                ["Tutoring Format", selected.tutoring_format],
                ["Availability", selected.availability_notes],
                ["What they need help with", selected.help_needed],
                ["Submitted", formatDate(selected.created_at)],
              ]
                .filter(([, v]) => Boolean(v))
                .map(([label, value]) => (
                  <div key={label} className="flex gap-3">
                    <dt className="text-[#8896a7] text-sm shrink-0 w-40">{label}:</dt>
                    <dd className="text-[#f0ede6] text-sm">{value}</dd>
                  </div>
                ))}
            </dl>
          </div>
        </div>
      )}
    </>
  );
}
