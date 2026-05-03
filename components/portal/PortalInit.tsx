"use client";
import { useEffect } from "react";

// Prevents the body/html from scrolling so the portal's <main> is the
// only scroll container. Without this, macOS rubber-band scrolling fires
// on the body when the cursor is over the sidebar (which has no overflow),
// and the browser routes wheel events to the wrong target.
export function PortalInit() {
  useEffect(() => {
    const b = document.body;
    const h = document.documentElement;
    b.style.overflow = "hidden";
    h.style.overflow = "hidden";
    return () => {
      b.style.overflow = "";
      h.style.overflow = "";
    };
  }, []);
  return null;
}
