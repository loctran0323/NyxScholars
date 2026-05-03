/**
 * Nyx Scholars — minimal service worker.
 *
 *   • Pre-caches the app shell (manifest, fonts, marketing fallback).
 *   • Network-first for HTML — so users always get fresh content when
 *     online, but a friendly offline fallback when not.
 *   • Cache-first for static assets (anything under /_next/static and
 *     /design + /ivy).
 *
 * Registered from components/system/PwaRegister.tsx on first paint.
 */

const VERSION = "nyx-v1";
const SHELL = [
  "/",
  "/manifest.webmanifest",
  "/offline",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(SHELL)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Static assets — cache-first.
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/design/") || url.pathname.startsWith("/ivy/")) {
    event.respondWith(
      caches.open(VERSION).then(async (cache) => {
        const cached = await cache.match(req);
        if (cached) return cached;
        const res = await fetch(req).catch(() => null);
        if (res && res.ok) cache.put(req, res.clone());
        return res ?? cached ?? new Response("", { status: 504 });
      }),
    );
    return;
  }

  // HTML — network-first, fall back to cache, then offline shell.
  if (req.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy));
          return res;
        })
        .catch(async () => (await caches.match(req)) ?? caches.match("/offline") ?? new Response("Offline", { status: 503 })),
    );
  }
});
