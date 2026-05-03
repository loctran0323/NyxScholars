"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { CTA } from "@/components/system";

const navLinks = [
  { href: "/#how", label: "How it works" },
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

  function isActive(href: string) {
    if (href.startsWith("/#")) return pathname === "/";
    return pathname === href || (href !== "/" && pathname.startsWith(href));
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "backdrop-blur-xl"
          : "bg-transparent"
      )}
      style={
        scrolled
          ? {
              background:
                "linear-gradient(180deg, rgba(5,8,22,0.92) 0%, rgba(5,8,22,0.78) 100%)",
            }
          : undefined
      }
    >
      <nav className="relative max-w-7xl mx-auto px-6 sm:px-10 h-[72px] flex items-center justify-between">

        {/* Brand mark — crescent only */}
        <Link href="/" className="shrink-0 group" aria-label="Nyx Scholars">
          <Image
            src="/design/crescent-alone.png"
            alt="Nyx Scholars"
            width={40}
            height={40}
            className="h-9 w-9 opacity-95 group-hover:opacity-100 transition-opacity"
            priority
          />
        </Link>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors duration-200",
                  active
                    ? "text-[var(--text-1)]"
                    : "text-[var(--text-2)] hover:text-[var(--text-1)]"
                )}
              >
                {link.label}
                {active ? (
                  <motion.span
                    layoutId="nav-star"
                    className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 block"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.45 }}
                  >
                    <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden>
                      <path
                        d="M 4 0.5 L 4.7 3.3 L 7.5 4 L 4.7 4.7 L 4 7.5 L 3.3 4.7 L 0.5 4 L 3.3 3.3 Z"
                        fill="#7dd3fc"
                      />
                    </svg>
                  </motion.span>
                ) : null}
              </Link>
            );
          })}
        </div>

        {/* Right cluster */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <Link
              href="/portal"
              className="flex items-center gap-2 px-3.5 py-2 rounded-md font-mono text-[11px] uppercase tracking-[0.2em] transition-all"
              style={{
                background: "rgba(125, 211, 252, 0.06)",
                border: "1px solid var(--border-accent)",
                color: "var(--text-1)",
              }}
            >
              <LayoutDashboard size={13} />
              Portal
            </Link>
          ) : (
            <Link
              href="/portal/login"
              className="px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors"
            >
              Sign in
            </Link>
          )}
          <CTA
            href="/match"
            size="default"
            trailingIcon={false}
            className="px-4 py-2 text-[12px] font-mono uppercase tracking-[0.2em]"
          >
            Get matched
          </CTA>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={toggleMobile}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-md text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors"
          aria-label="Toggle menu"
          style={{ background: "rgba(230, 233, 245, 0.04)" }}
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

        {/* Hairline horizon — visible only when scrolled, gradient like a horizon line */}
        {scrolled ? (
          <div
            aria-hidden
            className="absolute left-0 right-0 bottom-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(125,211,252,0.25) 50%, transparent 100%)",
            }}
          />
        ) : null}
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden overflow-hidden border-b border-[var(--border)]"
            style={{ background: "rgba(5, 8, 22, 0.96)", backdropFilter: "blur(16px)" }}
          >
            <div className="px-6 py-6 space-y-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-3.5 rounded-md font-mono text-[12px] uppercase tracking-[0.22em] transition-colors",
                      active
                        ? "text-[var(--text-1)]"
                        : "text-[var(--text-2)] hover:text-[var(--text-1)]"
                    )}
                  >
                    {link.label}
                    {active ? (
                      <svg width="9" height="9" viewBox="0 0 8 8" aria-hidden>
                        <path
                          d="M 4 0.5 L 4.7 3.3 L 7.5 4 L 4.7 4.7 L 4 7.5 L 3.3 4.7 L 0.5 4 L 3.3 3.3 Z"
                          fill="#bde9ff"
                        />
                      </svg>
                    ) : null}
                  </Link>
                );
              })}
              <div className="pt-4 mt-3 space-y-2.5" style={{ borderTop: "1px solid var(--border)" }}>
                {isLoggedIn ? (
                  <Link
                    href="/portal"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-md font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--text-1)]"
                    style={{ background: "rgba(125, 211, 252, 0.06)", border: "1px solid var(--border-accent)" }}
                  >
                    <LayoutDashboard size={14} />
                    Portal
                  </Link>
                ) : (
                  <Link
                    href="/portal/login"
                    className="flex items-center justify-center w-full py-3 rounded-md font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--text-2)]"
                    style={{ border: "1px solid var(--border)" }}
                  >
                    Sign in
                  </Link>
                )}
                <CTA href="/match" size="default" trailingIcon={false} className="w-full py-3 font-mono uppercase tracking-[0.2em] text-[12px]">
                  Get matched
                </CTA>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
