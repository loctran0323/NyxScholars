/**
 * Lightweight i18n scaffold. English-only at launch; built so we can drop
 * in next-intl (or a static dictionary) when the second locale ships
 * without rewriting call sites.
 *
 *   import { t } from "@/lib/i18n";
 *   t("nav.dashboard");                // → "Dashboard"
 *   t("checkout.cta", { plan: "Scholar" }); // → "Choose Scholar"
 */

import en from "./i18n/en.json";

type Dictionary = Record<string, string>;

const DICTS: Record<string, Dictionary> = {
  en,
};

let activeLocale = "en";

export function setLocale(locale: string) {
  if (DICTS[locale]) activeLocale = locale;
}

export function t(key: string, vars?: Record<string, string | number>): string {
  const dict = DICTS[activeLocale] ?? DICTS.en;
  const template = dict[key] ?? key;
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? `{${name}}`));
}

/** Locale-aware date/time formatter. Wraps Intl.DateTimeFormat. */
export function fmtDate(d: Date, opts: Intl.DateTimeFormatOptions = {}): string {
  return new Intl.DateTimeFormat(activeLocale, opts).format(d);
}

/** Locale-aware currency formatter. */
export function fmtCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat(activeLocale, {
    style: "currency",
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

/** Locale-aware number formatter. */
export function fmtNumber(value: number, opts: Intl.NumberFormatOptions = {}): string {
  return new Intl.NumberFormat(activeLocale, opts).format(value);
}

export const SUPPORTED_LOCALES = Object.keys(DICTS) as readonly string[];
