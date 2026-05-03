/**
 * Rate limiter with two backends.
 *
 *   • Default: in-memory token bucket. Process-local; fine for single-region
 *     dev and a low-traffic prod. Lost on cold start.
 *   • Optional: Upstash Redis. Activates when both UPSTASH_REDIS_REST_URL
 *     and UPSTASH_REDIS_REST_TOKEN are set. Distributed and persistent.
 *
 * Usage:
 *
 *   const result = await rateLimit({ key: `lead:${ip}`, max: 5, windowMs: 60_000 });
 *   if (!result.allowed) return new Response("Too many", { status: 429 });
 */

interface RateLimitInput {
  key: string;
  max: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

const memory: Map<string, Bucket> = new Map();

function memoryLimit({ key, max, windowMs }: RateLimitInput): RateLimitResult {
  const now = Date.now();
  const bucket = memory.get(key);
  if (!bucket || bucket.resetAt < now) {
    const resetAt = now + windowMs;
    memory.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: max - 1, resetAt };
  }
  bucket.count += 1;
  const allowed = bucket.count <= max;
  return {
    allowed,
    remaining: Math.max(0, max - bucket.count),
    resetAt: bucket.resetAt,
  };
}

async function upstashLimit({ key, max, windowMs }: RateLimitInput): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return memoryLimit({ key, max, windowMs });

  const windowSec = Math.max(1, Math.floor(windowMs / 1000));
  const namespacedKey = `nyx:rl:${key}`;
  try {
    // Pipelined INCR + EXPIRE-once in a single round trip.
    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", namespacedKey],
        ["EXPIRE", namespacedKey, String(windowSec), "NX"],
        ["TTL", namespacedKey],
      ]),
    });
    if (!res.ok) return memoryLimit({ key, max, windowMs });
    const data = (await res.json()) as Array<{ result: number }>;
    const count = data[0]?.result ?? 1;
    const ttl = data[2]?.result ?? windowSec;
    return {
      allowed: count <= max,
      remaining: Math.max(0, max - count),
      resetAt: Date.now() + Math.max(0, ttl) * 1000,
    };
  } catch {
    return memoryLimit({ key, max, windowMs });
  }
}

export function rateLimit(input: RateLimitInput): Promise<RateLimitResult> {
  const upstash = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;
  return upstash ? upstashLimit(input) : Promise.resolve(memoryLimit(input));
}

/**
 * Helper: best-effort client IP extraction from common edge headers.
 * Falls back to a synthetic key so the limiter still buckets requests.
 */
export function clientKey(req: Request, fallback = "anon"): string {
  const headers = req.headers;
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    fallback
  );
}
