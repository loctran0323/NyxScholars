"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/sat-act", label: "SAT / ACT" },
  { href: "/college-admissions", label: "Admissions" },
  { href: "/tutors", label: "Tutors" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

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
          ? "bg-[#060912]/90 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#d4a853] to-[#a07830] shadow-lg shadow-[#d4a853]/30 group-hover:shadow-[#d4a853]/50 transition-shadow" />
            <span className="relative text-black font-black text-sm tracking-tight">N</span>
          </div>
          <span className="font-semibold tracking-tight text-[17px] text-[#f0ece3]">
            Nyx<span className="text-[#d4a853]"> Scholars</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-4 py-1.5 text-[13.5px] font-medium transition-colors duration-200",
                pathname === link.href
                  ? "text-[#f0ece3]"
                  : "text-[#8d9ab0] hover:text-[#c8d0de]"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-md bg-white/[0.07]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <Link
              href="/portal"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.07] border border-white/[0.1] text-[#c8d0de] text-[13px] font-medium hover:border-white/[0.18] hover:text-[#f0ece3] transition-all"
            >
              <LayoutDashboard size={14} />
              My Portal
            </Link>
          ) : (
            <Link
              href="/portal/login"
              className="px-4 py-2 rounded-lg text-[#8d9ab0] text-[13px] font-medium hover:text-[#f0ece3] transition-colors"
            >
              Sign In
            </Link>
          )}
          <Link
            href="/apply"
            className="px-4 py-2 rounded-lg bg-gradient-to-b from-[#e0b55c] to-[#c99438] text-black text-[13px] font-bold hover:from-[#eac068] hover:to-[#d4a045] transition-all shadow-lg shadow-[#d4a853]/20 hover:shadow-[#d4a853]/35"
          >
            Book Consultation
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={toggleMobile}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-[#8d9ab0] hover:text-[#f0ece3] hover:bg-white/[0.07] transition-colors"
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

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden overflow-hidden bg-[#060912]/98 backdrop-blur-xl border-b border-white/[0.06]"
          >
            <div className="px-5 py-5 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center px-3 py-3 rounded-xl text-[14px] font-medium transition-colors",
                    pathname === link.href
                      ? "text-[#f0ece3] bg-white/[0.07]"
                      : "text-[#8d9ab0] hover:text-[#f0ece3] hover:bg-white/[0.04]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 space-y-2">
                {isLoggedIn ? (
                  <Link
                    href="/portal"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/[0.07] border border-white/[0.1] text-[#c8d0de] text-[14px] font-medium"
                  >
                    <LayoutDashboard size={15} />
                    My Portal
                  </Link>
                ) : (
                  <Link
                    href="/portal/login"
                    className="flex items-center justify-center w-full py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-[#8d9ab0] text-[14px] font-medium"
                  >
                    Sign In
                  </Link>
                )}
                <Link
                  href="/apply"
                  className="flex items-center justify-center w-full py-3 rounded-xl bg-gradient-to-b from-[#e0b55c] to-[#c99438] text-black text-[14px] font-bold"
                >
                  Book Free Consultation
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
