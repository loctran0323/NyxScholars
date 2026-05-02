"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Compass,
  Sparkles,
  CalendarPlus,
  Calendar,
  BookOpen,
  MessageSquare,
  User,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { NyxLockup } from "@/components/system";
import type { Profile, PlanType } from "@/types/portal";

const allNavItems = [
  { href: "/portal",              label: "Dashboard",        icon: LayoutDashboard, exact: true,  plans: ["session", "monthly", "counseling"] },
  { href: "/portal/consultation", label: "My Sky",           icon: Compass,         exact: false, plans: ["session", "monthly", "counseling"] },
  { href: "/portal/diagnostic",   label: "Intake",           icon: Sparkles,        exact: false, plans: ["session", "monthly", "counseling"] },
  { href: "/portal/schedule",     label: "Schedule Session", icon: CalendarPlus,    exact: false, plans: ["session", "monthly", "counseling"] },
  { href: "/portal/sessions",     label: "My Sessions",      icon: Calendar,        exact: false, plans: ["session", "monthly", "counseling"] },
  { href: "/portal/materials",    label: "Materials",        icon: BookOpen,        exact: false, plans: ["session", "monthly", "counseling"] },
  { href: "/portal/messages",     label: "Messages",         icon: MessageSquare,   exact: false, plans: ["session", "monthly", "counseling"] },
  { href: "/portal/profile",      label: "Profile",          icon: User,            exact: false, plans: ["session", "monthly", "counseling"] },
];

function planLabel(plan: PlanType | null): string {
  switch (plan) {
    case "session":    return "Session Plan";
    case "monthly":    return "Scholar Plan";
    case "counseling": return "Constellation Plan";
    default:           return "Student";
  }
}

interface PortalSidebarProps {
  profile: Profile | null;
  userEmail: string;
  unreadCount?: number;
}

function NavItem({
  href, label, icon: Icon, exact, unreadCount, onClick,
}: {
  href: string; label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  exact: boolean; unreadCount?: number; onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all border",
        isActive
          ? "bg-[var(--accent-dim)] text-[var(--accent)] border-[var(--border-accent)]"
          : "text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-white/[0.04] border-transparent"
      )}
    >
      <Icon size={16} className="shrink-0" />
      <span className="flex-1">{label}</span>
      {label === "Messages" && unreadCount && unreadCount > 0 ? (
        <span className="w-5 h-5 rounded-full bg-[var(--accent)] text-black text-[10px] font-bold flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      ) : null}
      {isActive && <ChevronRight size={12} className="opacity-40" />}
    </Link>
  );
}

function SidebarContent({
  profile, userEmail, unreadCount, onNavClick,
}: PortalSidebarProps & { onNavClick?: () => void }) {
  const router = useRouter();
  const plan = profile?.plan ?? null;

  const visibleNav = allNavItems.filter((item) => !plan || item.plans.includes(plan));

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) await supabase.auth.signOut();
    router.push("/portal/login");
    router.refresh();
  };

  const displayName = profile?.full_name || userEmail.split("@")[0];
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <>
      <div className="px-5 h-[68px] flex items-center border-b border-[var(--border)] shrink-0">
        <Link href="/">
          <NyxLockup size="sm" />
        </Link>
      </div>

      <div className="px-4 py-4 border-b border-[var(--border)] shrink-0">
        <div className="flex items-center gap-3 px-2 py-2.5 rounded-xl bg-white/[0.03] border border-[var(--border)]">
          <div className="w-9 h-9 rounded-full bg-[var(--accent-dim)] border border-[var(--border-accent)] flex items-center justify-center shrink-0">
            <span className="text-[12px] font-bold text-[var(--accent)]">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-[var(--text-1)] truncate">{displayName}</p>
            <p className="text-[11px] text-[var(--text-3)] truncate">{planLabel(plan)}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {visibleNav.map((item) => (
          <NavItem key={item.href} {...item} unreadCount={unreadCount} onClick={onNavClick} />
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-[var(--border)] space-y-1 shrink-0">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-[13.5px] font-medium text-[var(--text-2)] hover:text-red-400 hover:bg-red-500/[0.05] transition-all"
        >
          <LogOut size={16} className="shrink-0" />
          Sign Out
        </button>
      </div>
    </>
  );
}

export function PortalSidebar(props: PortalSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 min-h-screen bg-[var(--bg-2)] border-r border-[var(--border)] shrink-0">
        <SidebarContent {...props} />
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[var(--bg-2)]/95 backdrop-blur-xl border-b border-[var(--border)] flex items-center justify-between px-4">
        <Link href="/portal">
          <NyxLockup size="sm" />
        </Link>
        <div className="flex items-center gap-2">
          {props.unreadCount ? (
            <span className="w-5 h-5 rounded-full bg-[var(--accent)] text-black text-[10px] font-bold flex items-center justify-center">
              {props.unreadCount > 9 ? "9+" : props.unreadCount}
            </span>
          ) : null}
          <button
            onClick={() => setMobileOpen(true)}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-white/[0.06] transition-colors"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={cn(
        "md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-[var(--bg-2)] border-r border-[var(--border)] flex flex-col transition-transform duration-300",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-white/[0.06] transition-colors"
        >
          <X size={16} />
        </button>
        <SidebarContent {...props} onNavClick={() => setMobileOpen(false)} />
      </aside>
    </>
  );
}
