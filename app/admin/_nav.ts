import {
  LayoutDashboard,
  Users,
  GraduationCap,
  DollarSign,
  FileSearch,
  Wallet,
  Sparkles,
  Tag,
  Megaphone,
  Activity,
  Compass,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const ADMIN_NAV: AdminNavItem[] = [
  { href: "/admin",             label: "Overview",    icon: LayoutDashboard },
  { href: "/admin/tutors",      label: "Tutors",      icon: GraduationCap },
  { href: "/admin/match-queue", label: "Match queue", icon: Compass },
  { href: "/admin/students",    label: "Students",    icon: Users },
  { href: "/admin/questions",   label: "Questions",   icon: Sparkles },
  { href: "/admin/pricing",     label: "Pricing",     icon: Tag },
  { href: "/admin/broadcast",   label: "Broadcast",   icon: Megaphone },
  { href: "/admin/revenue",     label: "Revenue",     icon: DollarSign },
  { href: "/admin/payouts",     label: "Payouts",     icon: Wallet },
  { href: "/admin/audit",       label: "Audit",       icon: FileSearch },
  { href: "/admin/diagnostics", label: "Diagnostics", icon: Activity },
];
