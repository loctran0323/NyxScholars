"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
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
import type { Profile } from "@/types/portal";

const navItems = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/portal/schedule", label: "Schedule Session", icon: CalendarPlus, exact: false },
  { href: "/portal/sessions", label: "My Sessions", icon: Calendar, exact: false },
  { href: "/portal/materials", label: "Practice Materials", icon: BookOpen, exact: false },
  { href: "/portal/messages", label: "Messages", icon: MessageSquare, exact: false },
  { href: "/portal/profile", label: "Profile", icon: User, exact: false },
];

interface PortalSidebarProps {
  profile: Profile | null;
  userEmail: string;
  unreadCount?: number;
}

function NavItem({
  href,
  label,
  icon: Icon,
  exact,
  unreadCount,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  exact: boolean;
  unreadCount?: number;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all",
        isActive
          ? "bg-[#d4a853]/10 text-[#d4a853] border border-[#d4a853]/15"
          : "text-[#8d9ab0] hover:text-[#c8d0de] hover:bg-white/[0.04] border border-transparent"
      )}
    >
      <Icon size={16} className="shrink-0" />
      <span className="flex-1">{label}</span>
      {label === "Messages" && unreadCount && unreadCount > 0 ? (
        <span className="w-5 h-5 rounded-full bg-[#d4a853] text-black text-[10px] font-bold flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      ) : null}
      {isActive && <ChevronRight size={12} className="opacity-40" />}
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
      {/* Logo */}
      <div className="px-5 h-[68px] flex items-center border-b border-white/[0.06] shrink-0">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#d4a853] to-[#a07830]" />
            <span className="relative text-black font-black text-xs">N</span>
          </div>
          <span className="font-semibold text-[15px] text-[#f0ece3]">
            Nyx<span className="text-[#d4a853]"> Scholars</span>
          </span>
        </Link>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-3 px-2 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d4a853]/20 to-[#a07830]/10 border border-[#d4a853]/20 flex items-center justify-center shrink-0">
            <span className="text-[12px] font-bold text-[#d4a853]">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-[#f0ece3] truncate">{displayName}</p>
            <p className="text-[11px] text-[#4e5d72] truncate">
              {profile?.grade ? `Grade ${profile.grade}` : "Student"}
              {profile?.target_test ? ` · ${profile.target_test}` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            unreadCount={unreadCount}
            onClick={onNavClick}
          />
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-white/[0.06] space-y-1 shrink-0">
        <Link
          href="/apply"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#d4a853]/80 hover:text-[#d4a853] hover:bg-[#d4a853]/[0.05] transition-all border border-transparent"
        >
          <span className="text-[15px]">✦</span>
          Book a Session
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-[13.5px] font-medium text-[#8d9ab0] hover:text-red-400 hover:bg-red-500/[0.05] transition-all"
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
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen bg-[#0b0f1a] border-r border-white/[0.06] shrink-0">
        <SidebarContent {...props} />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#0b0f1a]/95 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-4">
        <Link href="/portal" className="flex items-center gap-2">
          <div className="relative w-6 h-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-md bg-gradient-to-br from-[#d4a853] to-[#a07830]" />
            <span className="relative text-black font-black text-[10px]">N</span>
          </div>
          <span className="font-semibold text-[14px] text-[#f0ece3]">
            Nyx<span className="text-[#d4a853]"> Scholars</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {props.unreadCount ? (
            <span className="w-5 h-5 rounded-full bg-[#d4a853] text-black text-[10px] font-bold flex items-center justify-center">
              {props.unreadCount > 9 ? "9+" : props.unreadCount}
            </span>
          ) : null}
          <button
            onClick={() => setMobileOpen(true)}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#8d9ab0] hover:text-[#f0ece3] hover:bg-white/[0.07] transition-colors"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#0b0f1a] border-r border-white/[0.06] flex flex-col transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-[#8d9ab0] hover:text-[#f0ece3] hover:bg-white/[0.07] transition-colors"
        >
          <X size={16} />
        </button>
        <SidebarContent {...props} onNavClick={() => setMobileOpen(false)} />
      </aside>
    </>
  );
}
