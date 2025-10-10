import {Ratelimit} from "@upstash/ratelimit";
import {Redis} from "@upstash/redis";

import {__PROD__} from "@/lib/env";

type DownloadLimiter = Ratelimit | null;
type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  pending: Promise<unknown>;
  reason?: string;
  deniedValue?: string;
};

let limiter: DownloadLimiter = null;

const ensureLimiter = (): DownloadLimiter => {
  if (!__PROD__) return null;
  if (!limiter) {
    limiter = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, "1 m"),
      prefix: "npm-downloads-download",
    });
  }

  return limiter;
};

export const limitDownloadRequest = async (
  identifier: string,
  options: {ip: string; userAgent: string},
): Promise<RateLimitResult | null> => {
  const activeLimiter = ensureLimiter();
  if (!activeLimiter) return null;
  const result = await activeLimiter.limit(identifier, options);
  result.pending.catch(() => {});

  return result;
};
