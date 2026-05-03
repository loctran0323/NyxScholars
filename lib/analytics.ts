/**
 * Lightweight analytics adapter.
 *
 *   • If NEXT_PUBLIC_POSTHOG_KEY is set, dynamically loads posthog-js and
 *     forwards events through it.
 *   • If NEXT_PUBLIC_GA_ID is set, also fires gtag('event', ...).
 *   • In dev (or when neither is set), events are logged with a `[track]`
 *     prefix so engineers can verify the funnel without a real backend.
 *
 * The funnel events are enumerated in `EVENTS` so that the entire site
 * shares the same names — call sites should never invent new strings.
 */

type EventProps = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    posthog?: {
      init: (key: string, options: Record<string, unknown>) => void;
      capture: (event: string, properties?: EventProps) => void;
      identify: (id: string, properties?: EventProps) => void;
      reset: () => void;
    };
    gtag?: (...args: unknown[]) => void;
    __nyxAnalytics?: { ready: boolean };
  }
}

export const EVENTS = {
  PAGE_VIEW:               "page.view",
  LEAD_SUBMITTED:          "lead.submitted",
  SIGNUP_STARTED:          "signup.started",
  SIGNUP_COMPLETED:        "signup.completed",
  LOGIN_COMPLETED:         "login.completed",
  CHECKOUT_INITIATED:      "checkout.initiated",
  CHECKOUT_COMPLETED:      "checkout.completed",
  DIAGNOSTIC_STARTED:      "diagnostic.started",
  DIAGNOSTIC_COMPLETED:    "diagnostic.completed",
  SESSION_BOOKED:          "session.booked",
  SESSION_RESCHEDULED:     "session.rescheduled",
  SESSION_CANCELLED:       "session.cancelled",
  MESSAGE_SENT:            "message.sent",
  ONBOARDING_STEP:         "onboarding.step",
  PREF_CHANGED:            "pref.changed",
  EXPERIMENT_VIEWED:       "experiment.viewed",
  NPS_SUBMITTED:           "nps.submitted",
  GIFT_CARD_PURCHASED:     "gift_card.purchased",
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS] | (string & {});

interface Analytics {
  identify(id: string, props?: EventProps): void;
  identifyAnonymous(): void;
  track(event: EventName, props?: EventProps): void;
  reset(): void;
}

let cached: Analytics | null = null;

export function getAnalytics(): Analytics {
  if (cached) return cached;

  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const isDev = process.env.NODE_ENV !== "production";

  cached = {
    identify(id, props) {
      if (typeof window === "undefined") return;
      window.posthog?.identify(id, props);
      if (gaId) window.gtag?.("set", { user_id: id });
      if (isDev) console.debug("[track] identify", id, props ?? {});
    },
    identifyAnonymous() {
      if (typeof window === "undefined") return;
      if (posthogKey && !window.posthog) {
        // Lazy-load posthog-js only when a key exists. Wrapped in a try
        // so the fetch failing never crashes the page. Dynamic import avoids
        // bundling posthog when it isn't configured, hence the typed-as-any.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        import(/* webpackIgnore: true */ "posthog-js" as any)
          .then((mod: { default: { init: (k: string, o: Record<string, unknown>) => void } & Window["posthog"] }) => {
            const ph = mod.default;
            window.posthog = ph as unknown as Window["posthog"];
            ph.init(posthogKey, {
              api_host: posthogHost,
              capture_pageview: false,
              persistence: "localStorage",
            });
            if (typeof window !== "undefined") window.__nyxAnalytics = { ready: true };
          })
          .catch(() => {
            /* swallow */
          });
      }
    },
    track(event, props) {
      if (typeof window === "undefined") return;
      window.posthog?.capture(event, props);
      if (gaId) window.gtag?.("event", event, props ?? {});
      if (isDev) console.debug("[track]", event, props ?? {});
    },
    reset() {
      if (typeof window === "undefined") return;
      window.posthog?.reset();
      if (isDev) console.debug("[track] reset");
    },
  };

  return cached;
}

export function trackPageView(path: string, props?: EventProps) {
  getAnalytics().track(EVENTS.PAGE_VIEW, { path, ...props });
}

export function track(event: EventName, props?: EventProps) {
  getAnalytics().track(event, props);
}
