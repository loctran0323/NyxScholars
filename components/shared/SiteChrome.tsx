"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * Renders the marketing-site Navbar + Footer on every route EXCEPT
 * full-screen app surfaces (the student/teacher portal and the admin
 * console). The portal layout is `fixed inset-0` and was visually
 * stacking on top of the Footer, leaving a sliver of marketing chrome
 * peeking out behind the dashboard.
 */
const FULLSCREEN_PREFIXES = ["/portal", "/admin"];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const isFullscreen = FULLSCREEN_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  if (isFullscreen) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
