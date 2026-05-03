"use client";

import * as React from "react";

export type ThemeMode = "dark" | "light" | "system";
export type Density = "comfortable" | "compact";
export type Contrast = "normal" | "high";
export type Motion = "system" | "reduced";

export interface Preferences {
  theme: ThemeMode;
  density: Density;
  contrast: Contrast;
  motion: Motion;
}

interface PreferencesContextValue extends Preferences {
  /** Resolved theme — `system` is collapsed to `dark`/`light` based on the OS. */
  resolvedTheme: "dark" | "light";
  setTheme: (mode: ThemeMode) => void;
  setDensity: (d: Density) => void;
  setContrast: (c: Contrast) => void;
  setMotion: (m: Motion) => void;
}

const Context = React.createContext<PreferencesContextValue | null>(null);

const STORAGE_KEY = "nyx:prefs:v1";

const DEFAULTS: Preferences = {
  theme: "dark",
  density: "comfortable",
  contrast: "normal",
  motion: "system",
};

function readStorage(): Partial<Preferences> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<Preferences>) : {};
  } catch {
    return {};
  }
}

function writeStorage(prefs: Preferences) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* quota — ignore */
  }
}

function systemPrefersDark(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? true;
}

function applyToDocument(prefs: Preferences, resolvedTheme: "dark" | "light") {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.theme = resolvedTheme;
  root.dataset.density = prefs.density;
  root.dataset.contrast = prefs.contrast;
  if (prefs.motion === "reduced") root.dataset.motion = "reduced";
  else delete root.dataset.motion;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = React.useState<Preferences>(() => ({
    ...DEFAULTS,
    ...readStorage(),
  }));
  const [systemDark, setSystemDark] = React.useState<boolean>(() => systemPrefersDark());

  // Track OS-level dark/light changes only when in `system` mode.
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  const resolvedTheme: "dark" | "light" = React.useMemo(() => {
    if (prefs.theme === "system") return systemDark ? "dark" : "light";
    return prefs.theme;
  }, [prefs.theme, systemDark]);

  // Reflect into <html> attributes whenever anything changes.
  React.useEffect(() => {
    applyToDocument(prefs, resolvedTheme);
  }, [prefs, resolvedTheme]);

  // Persist on every change.
  React.useEffect(() => {
    writeStorage(prefs);
  }, [prefs]);

  const value = React.useMemo<PreferencesContextValue>(
    () => ({
      ...prefs,
      resolvedTheme,
      setTheme: (theme) => setPrefs((p) => ({ ...p, theme })),
      setDensity: (density) => setPrefs((p) => ({ ...p, density })),
      setContrast: (contrast) => setPrefs((p) => ({ ...p, contrast })),
      setMotion: (motion) => setPrefs((p) => ({ ...p, motion })),
    }),
    [prefs, resolvedTheme],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function usePreferences(): PreferencesContextValue {
  const ctx = React.useContext(Context);
  if (!ctx) {
    // Outside provider — hand back a no-op stub so server-rendered/preview
    // surfaces don't crash. Mutations are silently swallowed.
    return {
      ...DEFAULTS,
      resolvedTheme: "dark",
      setTheme: () => {},
      setDensity: () => {},
      setContrast: () => {},
      setMotion: () => {},
    };
  }
  return ctx;
}

/**
 * Hook for components that want to opt out of motion when the user has
 * asked us to reduce it. Subscribes to the OS-level media query via
 * useSyncExternalStore so we don't trip React 19's set-state-in-effect rule.
 */
const reducedMotionStore = (() => {
  const subscribe = (cb: () => void) => {
    if (typeof window === "undefined") return () => {};
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener?.("change", cb);
    return () => mq.removeEventListener?.("change", cb);
  };
  const getSnapshot = () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  };
  return { subscribe, getSnapshot, getServerSnapshot: () => false };
})();

export function useReducedMotion(): boolean {
  const { motion } = usePreferences();
  const systemReduced = React.useSyncExternalStore(
    reducedMotionStore.subscribe,
    reducedMotionStore.getSnapshot,
    reducedMotionStore.getServerSnapshot,
  );
  return motion === "reduced" || systemReduced;
}
