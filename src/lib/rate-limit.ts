const buckets = new Map<string, number[]>();

/**
 * Sliding-window limiter, per server instance. It stops casual abuse of the paid
 * AI and voice APIs; it is not a hard global quota across instances.
 */
export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return { ok: false, retryAfter: Math.ceil((windowMs - (now - hits[0])) / 1000) };
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) buckets.delete(buckets.keys().next().value!);
  return { ok: true, retryAfter: 0 };
}

export function clientKey(request: Request, scope: string) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  return `${scope}:${ip}`;
}
