/**
 * Mock Supabase client for the local **preview fallback** (demo mode).
 *
 * Activated ONLY when Supabase env vars are absent (see `server.ts`/`browser.ts`).
 * It implements the slice of the supabase-js surface the app actually uses — a
 * chainable + thenable query builder over an in-memory seed (`MOCK_DB`) plus a
 * cookie-driven auth shim — so the entire portal renders and is interactive with
 * zero backend setup. Production with real keys never reaches this code.
 *
 * Robustness: any query-builder method we didn't implement falls through to a
 * chainable no-op via a Proxy, so an unforeseen query degrades to "no filter"
 * rather than throwing.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { MOCK_DB, DEMO_USER } from "@/lib/mock/portalSeed";

export const DEMO_COOKIE = "nyx_demo";

type Row = Record<string, unknown>;
type Resolved = { data: unknown; error: { message: string } | null; count: number | null };

interface Filter {
  kind: "eq" | "neq" | "in" | "is" | "not_is" | "gt" | "gte" | "lt" | "lte";
  col: string;
  val: unknown;
}

function genId(): string {
  // deterministic-enough unique id without Math.random dependence concerns
  uidCounter += 1;
  const n = (Date.now() + uidCounter).toString(16).padStart(12, "0").slice(-12);
  return `00000000-0000-4000-8000-${n}`;
}
let uidCounter = 0;

function compare(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0;
}

function matches(row: Row, f: Filter): boolean {
  const v = row[f.col];
  switch (f.kind) {
    case "eq":
      return v === f.val || String(v) === String(f.val);
    case "neq":
      return !(v === f.val || String(v) === String(f.val));
    case "in":
      return Array.isArray(f.val) && f.val.some((x) => x === v || String(x) === String(v));
    case "is":
      return f.val === null ? v == null : v === f.val;
    case "not_is":
      return f.val === null ? v != null : v !== f.val;
    case "gt":
      return compare(v, f.val) > 0;
    case "gte":
      return compare(v, f.val) >= 0;
    case "lt":
      return compare(v, f.val) < 0;
    case "lte":
      return compare(v, f.val) <= 0;
    default:
      return true;
  }
}

class MockQuery implements PromiseLike<Resolved> {
  private filters: Filter[] = [];
  private _order: { col: string; asc: boolean } | null = null;
  private _limit: number | null = null;
  private _rangeFrom: number | null = null;
  private _rangeTo: number | null = null;
  private _single = false;
  private _maybeSingle = false;
  private _head = false;
  private _count = false;
  private _op: "select" | "insert" | "update" | "upsert" | "delete" = "select";
  private _payload: Row | Row[] | null = null;

  constructor(private table: string) {}

  private rows(): Row[] {
    if (!MOCK_DB[this.table]) MOCK_DB[this.table] = [];
    return MOCK_DB[this.table];
  }

  // ── filters ──────────────────────────────────────────────────────────────
  eq(col: string, val: unknown) { this.filters.push({ kind: "eq", col, val }); return this; }
  neq(col: string, val: unknown) { this.filters.push({ kind: "neq", col, val }); return this; }
  in(col: string, val: unknown[]) { this.filters.push({ kind: "in", col, val }); return this; }
  is(col: string, val: unknown) { this.filters.push({ kind: "is", col, val }); return this; }
  gt(col: string, val: unknown) { this.filters.push({ kind: "gt", col, val }); return this; }
  gte(col: string, val: unknown) { this.filters.push({ kind: "gte", col, val }); return this; }
  lt(col: string, val: unknown) { this.filters.push({ kind: "lt", col, val }); return this; }
  lte(col: string, val: unknown) { this.filters.push({ kind: "lte", col, val }); return this; }
  not(col: string, op: string, val: unknown) {
    if (op === "is") this.filters.push({ kind: "not_is", col, val });
    // other negations: best-effort no-op (won't over-filter the demo)
    return this;
  }
  match(obj: Record<string, unknown>) {
    for (const [col, val] of Object.entries(obj)) this.filters.push({ kind: "eq", col, val });
    return this;
  }
  or() { return this; }        // best-effort no-op (demo seeds only the demo user)
  filter() { return this; }
  like() { return this; }
  ilike() { return this; }
  contains() { return this; }
  overlaps() { return this; }
  textSearch() { return this; }

  // ── shaping ──────────────────────────────────────────────────────────────
  select(_cols?: string, opts?: { count?: string; head?: boolean }) {
    if (opts?.count) this._count = true;
    if (opts?.head) this._head = true;
    return this;
  }
  order(col: string, opts?: { ascending?: boolean }) {
    this._order = { col, asc: opts?.ascending ?? true };
    return this;
  }
  limit(n: number) { this._limit = n; return this; }
  range(from: number, to: number) { this._rangeFrom = from; this._rangeTo = to; return this; }
  single() { this._single = true; return this; }
  maybeSingle() { this._maybeSingle = true; return this; }

  // ── mutations ────────────────────────────────────────────────────────────
  insert(payload: Row | Row[]) { this._op = "insert"; this._payload = payload; return this; }
  update(payload: Row) { this._op = "update"; this._payload = payload; return this; }
  upsert(payload: Row | Row[]) { this._op = "upsert"; this._payload = payload; return this; }
  delete() { this._op = "delete"; return this; }

  private applyFilters(rows: Row[]): Row[] {
    return rows.filter((r) => this.filters.every((f) => matches(r, f)));
  }

  private shape(data: unknown, count: number | null): Resolved {
    return { data, error: null, count };
  }

  private resolve(): Resolved {
    const all = this.rows();

    if (this._op === "insert" || this._op === "upsert") {
      const arr = (Array.isArray(this._payload) ? this._payload : [this._payload]).filter(Boolean) as Row[];
      const created = arr.map((p) => ({
        id: (p.id as string) ?? genId(),
        created_at: (p.created_at as string) ?? new Date().toISOString(),
        ...p,
      }));
      MOCK_DB[this.table] = [...all, ...created];
      const data = this._single || this._maybeSingle ? created[0] ?? null : created;
      return this.shape(data, created.length);
    }

    if (this._op === "update") {
      const matched = this.applyFilters(all);
      for (const m of matched) Object.assign(m, this._payload);
      const data = this._single || this._maybeSingle ? matched[0] ?? null : matched;
      return this.shape(data, matched.length);
    }

    if (this._op === "delete") {
      const matched = new Set(this.applyFilters(all));
      MOCK_DB[this.table] = all.filter((r) => !matched.has(r));
      return this.shape(null, matched.size);
    }

    // select
    const filtered = this.applyFilters(all);
    if (this._head) return this.shape(null, filtered.length);

    let out = filtered;
    if (this._order) {
      const { col, asc } = this._order;
      out = [...out].sort((a, b) => compare(a[col], b[col]) * (asc ? 1 : -1));
    }
    if (this._rangeFrom != null) out = out.slice(this._rangeFrom, (this._rangeTo ?? out.length - 1) + 1);
    if (this._limit != null) out = out.slice(0, this._limit);

    if (this._single || this._maybeSingle) return this.shape(out[0] ?? null, this._count ? filtered.length : null);
    return this.shape(out, this._count ? filtered.length : null);
  }

  then<TResult1 = Resolved, TResult2 = never>(
    onfulfilled?: ((value: Resolved) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return Promise.resolve(this.resolve()).then(onfulfilled, onrejected);
  }
}

/** Wrap a builder so unknown chained methods become chainable no-ops. */
function builder(table: string): MockQuery {
  const q = new MockQuery(table);
  return new Proxy(q, {
    get(target, prop, receiver) {
      if (prop in target || typeof prop === "symbol") {
        return Reflect.get(target, prop, receiver);
      }
      // Unknown method → chainable no-op returning the proxy itself.
      return () => receiver;
    },
  }) as MockQuery;
}

// ── auth shims ───────────────────────────────────────────────────────────────

const session = (email: string = DEMO_USER.email) => ({
  access_token: "demo-access-token",
  refresh_token: "demo-refresh-token",
  expires_in: 3600,
  token_type: "bearer",
  user: { ...DEMO_USER, email },
});

interface CookieStore {
  get(name: string): { value: string } | undefined;
  set?: (name: string, value: string, options?: Record<string, unknown>) => void;
}

function serverAuth(cookieStore: CookieStore) {
  const authed = () => cookieStore.get(DEMO_COOKIE)?.value === "1";
  const setCookie = (value: string, maxAge: number) => {
    try {
      cookieStore.set?.(DEMO_COOKIE, value, { path: "/", maxAge, sameSite: "lax" });
    } catch {
      /* server components can't set cookies; harmless */
    }
  };
  return {
    async getUser() {
      return { data: { user: authed() ? DEMO_USER : null }, error: null };
    },
    async getSession() {
      return { data: { session: authed() ? session() : null }, error: null };
    },
    async signInWithPassword({ email }: { email?: string } = {}) {
      setCookie("1", 60 * 60 * 24 * 30);
      return { data: { user: { ...DEMO_USER, email: email ?? DEMO_USER.email }, session: session(email) }, error: null };
    },
    async signUp({ email }: { email?: string } = {}) {
      setCookie("1", 60 * 60 * 24 * 30);
      return { data: { user: { ...DEMO_USER, email: email ?? DEMO_USER.email }, session: session(email) }, error: null };
    },
    async signOut() {
      setCookie("", 0);
      return { error: null };
    },
    async resetPasswordForEmail() { return { data: {}, error: null }; },
    async updateUser() { return { data: { user: DEMO_USER }, error: null }; },
    onAuthStateChange() { return { data: { subscription: { unsubscribe() {} } } }; },
    admin: {
      async listUsers() { return { data: { users: [DEMO_USER] }, error: null }; },
      async getUserById() { return { data: { user: DEMO_USER }, error: null }; },
      async deleteUser() { return { data: {}, error: null }; },
    },
  };
}

function browserAuth() {
  const hasCookie = () =>
    typeof document !== "undefined" && document.cookie.split("; ").some((c) => c === `${DEMO_COOKIE}=1`);
  const write = (value: string, maxAge: number) => {
    if (typeof document !== "undefined") {
      document.cookie = `${DEMO_COOKIE}=${value}; path=/; max-age=${maxAge}; samesite=lax`;
    }
  };
  return {
    async getUser() {
      return { data: { user: hasCookie() ? DEMO_USER : null }, error: null };
    },
    async getSession() {
      return { data: { session: hasCookie() ? session() : null }, error: null };
    },
    async signInWithPassword({ email }: { email?: string } = {}) {
      write("1", 60 * 60 * 24 * 30);
      return { data: { user: { ...DEMO_USER, email: email ?? DEMO_USER.email }, session: session(email) }, error: null };
    },
    async signUp({ email }: { email?: string } = {}) {
      write("1", 60 * 60 * 24 * 30);
      return { data: { user: { ...DEMO_USER, email: email ?? DEMO_USER.email }, session: session(email) }, error: null };
    },
    async signOut() {
      write("", 0);
      return { error: null };
    },
    async resetPasswordForEmail() { return { data: {}, error: null }; },
    async updateUser() { return { data: { user: DEMO_USER }, error: null }; },
    onAuthStateChange() { return { data: { subscription: { unsubscribe() {} } } }; },
  };
}

function baseClient(auth: unknown) {
  return {
    auth,
    from(table: string) { return builder(table); },
    rpc() { return builder("__rpc"); },
    // storage / channel stubs in case a component reaches for them
    channel() { return { on() { return this; }, subscribe() { return this; }, unsubscribe() {} }; },
    removeChannel() {},
  };
}

/** Server-side mock client (auth state read from cookies). */
export function createMockServerClient(cookieStore: CookieStore): SupabaseClient {
  return baseClient(serverAuth(cookieStore)) as unknown as SupabaseClient;
}

/** Browser-side mock client (auth state stored in a readable cookie). */
export function createMockBrowserClient(): SupabaseClient {
  return baseClient(browserAuth()) as unknown as SupabaseClient;
}
