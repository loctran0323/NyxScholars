"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { CTA, NyxLockup } from "@/components/system";

const navLinks = [
  { href: "/tutors", label: "Tutors" },
  { href: "/sat-act", label: "How it works" },
  { href: "/services", label: "Services" },
  { href: "/college-admissions", label: "Admissions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    document.body.style.overflow = "";
  }, [pathname]);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) return;
    const auth = client.auth;
    void auth.getSession().then((res: { data: { session: unknown } }) => setIsLoggedIn(!!res.data.session));
    const { data: { subscription } } = auth.onAuthStateChange(
      (_event: unknown, session: unknown) => setIsLoggedIn(!!session)
    );
    return () => subscription.unsubscribe();
  }, []);

  const toggleMobile = () => {
    const next = !mobileOpen;
    setMobileOpen(next);
    document.body.style.overflow = next ? "hidden" : "";
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-[var(--bg)]/85 backdrop-blur-xl border-b border-[var(--border)]"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between">
        <Link href="/" className="shrink-0 group">
          <NyxLockup size="md" />
        </Link>

        <div className="hidden md:flex items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-4 py-1.5 text-[13.5px] font-medium transition-colors duration-200",
                pathname === link.href
                  ? "text-[var(--text-1)]"
                  : "text-[var(--text-2)] hover:text-[var(--text-1)]"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-md bg-white/[0.06]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <Link
              href="/portal"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.06] border border-[var(--border-2)] text-[var(--text-1)] text-[13px] font-medium hover:bg-white/[0.10] transition-all"
            >
              <LayoutDashboard size={14} />
              Portal
            </Link>
          ) : (
            <Link
              href="/portal/login"
              className="px-4 py-2 rounded-lg text-[var(--text-2)] text-[13px] font-medium hover:text-[var(--text-1)] transition-colors"
            >
              Sign In
            </Link>
          )}
          <CTA href="/match" size="default" trailingIcon={false} className="px-4 py-2 text-[13px]">
            Get Matched
          </CTA>
        </div>

        <button
          onClick={toggleMobile}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-white/[0.06] transition-colors"
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mobileOpen ? "close" : "open"}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.15 }}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </motion.div>
          </AnimatePresence>
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden overflow-hidden bg-[var(--bg)]/96 backdrop-blur-xl border-b border-[var(--border)]"
          >
            <div className="px-5 py-5 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center px-3 py-3 rounded-xl text-[14px] font-medium transition-colors",
                    pathname === link.href
                      ? "text-[var(--text-1)] bg-white/[0.06]"
                      : "text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-white/[0.04]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 space-y-2">
                {isLoggedIn ? (
                  <Link
                    href="/portal"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/[0.06] border border-[var(--border-2)] text-[var(--text-1)] text-[14px] font-medium"
                  >
                    <LayoutDashboard size={15} />
                    Portal
                  </Link>
                ) : (
                  <Link
                    href="/portal/login"
                    className="flex items-center justify-center w-full py-3 rounded-xl bg-white/[0.04] border border-[var(--border)] text-[var(--text-2)] text-[14px] font-medium"
                  >
                    Sign In
                  </Link>
                )}
                <CTA href="/match" size="default" trailingIcon={false} className="w-full py-3">
                  Get Matched
                </CTA>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
