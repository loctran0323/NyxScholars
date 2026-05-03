import Link from "next/link";
import { LayoutDashboard, Users, GraduationCap, DollarSign, FileSearch, Wallet, Sparkles, Tag, Megaphone } from "lucide-react";

const NAV = [
  { href: "/admin",           label: "Overview",  icon: LayoutDashboard },
  { href: "/admin/tutors",    label: "Tutors",    icon: GraduationCap },
  { href: "/admin/students",  label: "Students",  icon: Users },
  { href: "/admin/questions", label: "Questions", icon: Sparkles },
  { href: "/admin/pricing",   label: "Pricing",   icon: Tag },
  { href: "/admin/broadcast", label: "Broadcast", icon: Megaphone },
  { href: "/admin/revenue",   label: "Revenue",   icon: DollarSign },
  { href: "/admin/payouts",   label: "Payouts",   icon: Wallet },
  { href: "/admin/audit",     label: "Audit",     icon: FileSearch },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] pt-[68px]">
      <AdminNav />
      <main>{children}</main>
    </div>
  );
}

function AdminNav() {
  return (
    <nav className="border-b border-[var(--border)] bg-[var(--bg-2)]">
      <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center gap-1 py-2">
        {NAV.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-semibold text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--accent-dim)] transition-colors"
            >
              <Icon size={12.5} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
