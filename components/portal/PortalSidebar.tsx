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
  Menu,
  X,
  SlidersHorizontal,
  CreditCard,
  ClipboardList,
  PlayCircle,
  Timer,
  Infinity as InfinityIcon,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { FEATURES } from "@/lib/features";
import { NyxLockup } from "@/components/system";
import { NotificationsBell } from "@/components/portal/NotificationsBell";
import { NavBadge } from "@/components/portal/NavBadge";
import type { Profile, PlanType } from "@/types/portal";

interface NavItemDef {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  exact?: boolean;
  plans?: PlanType[];
  badgeKey?: "messages";
  soon?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItemDef[];
}

const studentNavGroups: NavGroup[] = [
  {
    label: "Today",
    items: [
      { href: "/portal",            label: "Dashboard",   icon: LayoutDashboard, exact: true },
      { href: "/portal/adaptive",   label: "Endless practice", icon: InfinityIcon },
      { href: "/portal/practice",   label: "Daily review", icon: Sparkles },
      { href: "/portal/sessions",   label: "Sessions",    icon: Calendar },
      { href: "/portal/schedule",   label: "Schedule",    icon: CalendarPlus },
    ],
  },
  {
    label: "Learn",
    items: [
      { href: "/portal/consultation", label: "Your sky",     icon: Compass },
      { href: "/portal/diagnostic",   label: "Adaptive intake", icon: Sparkles },
      { href: "/portal/homework",     label: "Homework",     icon: ClipboardList },
      { href: "/portal/lessons",      label: "Video lessons", icon: PlayCircle },
      { href: "/portal/mock-tests",   label: "Mock tests",   icon: Timer },
      { href: "/portal/materials",    label: "Materials",    icon: BookOpen },
    ],
  },
  {
    label: "Talk",
    items: [
      { href: "/portal/messages", label: "Messages", icon: MessageSquare, badgeKey: "messages" },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/portal/profile",  label: "Profile",  icon: User },
      { href: "/portal/billing",  label: "Billing",  icon: CreditCard },
      { href: "/portal/settings", label: "Settings", icon: SlidersHorizontal },
    ],
  },
];

const teacherNavGroups: NavGroup[] = [
  {
    label: "Tutoring",
    items: [
      { href: "/portal/teacher",              label: "My students",  icon: LayoutDashboard, exact: true },
      { href: "/portal/teacher/availability", label: "Availability", icon: CalendarPlus },
      { href: "/portal/teacher/forum",        label: "Tutor forum",  icon: MessageSquare },
      { href: "/portal/messages",             label: "Messages",     icon: MessageSquare, badgeKey: "messages" },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/portal/profile",  label: "Profile",  icon: User },
      { href: "/portal/billing",  label: "Payouts",  icon: CreditCard },
      { href: "/portal/settings", label: "Settings", icon: SlidersHorizontal },
    ],
  },
];

/** Drop nav items whose feature is gated off in this environment (and any now-empty groups). */
function gateGroups(groups: NavGroup[]): NavGroup[] {
  return groups
    .map((g) => ({
      ...g,
      items: g.items.filter((i) => i.href !== "/portal/lessons" || FEATURES.lessons),
    }))
    .filter((g) => g.items.length > 0);
}

function planLabel(plan: PlanType | null, role?: string | null): string {
  if (role === "teacher") return "Tutor";
  switch (plan) {
    case "session":    return "Session plan";
    case "monthly":    return "Scholar plan";
    case "counseling": return "Concierge plan";
    default:           return "Trial";
  }
}

interface PortalSidebarProps {
  profile: Profile | null;
  userEmail: string;
  unreadCount?: number;
}

function NavItem({ item, unreadCount, onClick }: { item: NavItemDef; unreadCount?: number; onClick?: () => void }) {
  const pathname = usePathname();
  const isActive = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/");
  const Icon = item.icon;
  const showBadge = item.badgeKey === "messages" && unreadCount && unreadCount > 0;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-3 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-colors",
        isActive
          ? "bg-[var(--surface-elevated)] text-[var(--text-1)]"
          : "text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-white/[0.03]",
      )}
    >
      {isActive && (
        <span aria-hidden className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r bg-[var(--accent)]" />
      )}
      <Icon size={15} className={cn("shrink-0 transition-colors", isActive ? "text-[var(--accent)]" : "text-[var(--text-3)] group-hover:text-[var(--text-2)]")} />
      <span className="flex-1 truncate">{item.label}</span>
      {showBadge ? (
        <span className="px-1.5 h-4 min-w-4 rounded-full bg-[var(--accent)] text-[var(--on-accent)] text-[9.5px] font-bold flex items-center justify-center">
          {unreadCount! > 9 ? "9+" : unreadCount}
        </span>
      ) : item.soon ? (
        <NavBadge variant="soon" />
      ) : null}
    </Link>
  );
}

function SidebarContent({
  profile,
  userEmail,
  unreadCount,
  onNavClick,
}: PortalSidebarProps & { onNavClick?: () => void }) {
  const router = useRouter();
  const role = profile?.role ?? null;
  const groups = gateGroups(role === "teacher" ? teacherNavGroups : studentNavGroups);

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) await supabase.auth.signOut();
    router.push("/portal/login");
    router.refresh();
  };

  const displayName = profile?.full_name || userEmail.split("@")[0];
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      {/* Brand */}
      <div className="px-5 h-[64px] flex items-center border-b border-[var(--border)] shrink-0">
        <Link href="/" aria-label="Nyx — home">
          <NyxLockup size="sm" />
        </Link>
      </div>

      {/* User chip */}
      <div className="px-3 pt-4 pb-3 shrink-0">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)]/40">
          <div className="w-8 h-8 rounded-full bg-[var(--accent-dim)] border border-[var(--border-accent)] flex items-center justify-center shrink-0">
            <span className="text-[11px] font-bold text-[var(--accent)]">{initials}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12.5px] font-semibold text-[var(--text-1)] truncate leading-tight">{displayName}</p>
            <p className="text-[10.5px] text-[var(--text-3)] truncate mt-0.5 uppercase tracking-wider">
              {planLabel(profile?.plan ?? null, role)}
            </p>
          </div>
          <NotificationsBell />
        </div>
      </div>

      {/* Grouped nav */}
      <nav className="flex-1 px-3 pb-4 space-y-5 overflow-y-auto" aria-label="Portal">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="px-2.5 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-3)]">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavItem key={item.href} item={item} unreadCount={unreadCount} onClick={onNavClick} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-3 border-t border-[var(--border)] shrink-0">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-2.5 py-2 w-full rounded-lg text-[13px] font-medium text-[var(--text-3)] hover:text-[var(--danger)] hover:bg-[var(--danger-soft)] transition-colors"
        >
          <LogOut size={14} className="shrink-0" />
          Sign out
        </button>
      </div>
    </>
  );
}

export function PortalSidebar(props: PortalSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <aside className="hidden md:flex flex-col w-60 min-h-screen bg-[var(--bg-2)]/85 backdrop-blur-sm border-r border-[var(--border)] shrink-0">
        <SidebarContent {...props} />
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[var(--bg-2)]/95 backdrop-blur-xl border-b border-[var(--border)] flex items-center justify-between px-4">
        <Link href="/portal" aria-label="Nyx portal">
          <NyxLockup size="sm" />
        </Link>
        <div className="flex items-center gap-2">
          <NotificationsBell />
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-white/[0.06] transition-colors"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-[var(--bg-2)] border-r border-[var(--border)] flex flex-col transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-white/[0.06] transition-colors"
        >
          <X size={16} />
        </button>
        <SidebarContent {...props} onNavClick={() => setMobileOpen(false)} />
      </aside>
    </>
  );
}
