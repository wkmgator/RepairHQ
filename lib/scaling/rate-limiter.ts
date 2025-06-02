import { Redis } from "ioredis"

export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

export class RateLimiter {
  private redis: Redis

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379")
  }

  /**
   * Check if request is within rate limit
   */
  async checkRateLimit(
    identifier: string,
    config: RateLimitConfig,
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = `rate_limit:${identifier}`
    const now = Date.now()
    const windowStart = now - config.windowMs

    // Remove old entries
    await this.redis.zremrangebyscore(key, 0, windowStart)

    // Count current requests
    const currentRequests = await this.redis.zcard(key)

    if (currentRequests >= config.maxRequests) {
      const resetTime = await this.redis.zrange(key, 0, 0, "WITHSCORES")
      const oldestRequest = resetTime[1] ? Number.parseInt(resetTime[1]) : now

      return {
        allowed: false,
        remaining: 0,
        resetTime: oldestRequest + config.windowMs,
      }
    }

    // Add current request
    await this.redis.zadd(key, now, `${now}-${Math.random()}`)
    await this.redis.expire(key, Math.ceil(config.windowMs / 1000))

    return {
      allowed: true,
      remaining: config.maxRequests - currentRequests - 1,
      resetTime: now + config.windowMs,
    }
  }

  /**
   * Get rate limit configurations for different endpoints
   */
  getRateLimitConfig(endpoint: string): RateLimitConfig {
    const configs: Record<string, RateLimitConfig> = {
      // Authentication endpoints - strict limits
      "/api/auth": {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 5,
      },

      // API endpoints - moderate limits
      "/api": {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 100,
      },

      // Public endpoints - generous limits
      "/": {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 1000,
      },

      // File uploads - very strict
      "/api/upload": {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 10,
      },
    }

    // Find the most specific matching config
    const matchingKey = Object.keys(configs)
      .filter((key) => endpoint.startsWith(key))
      .sort((a, b) => b.length - a.length)[0]

    return configs[matchingKey] || configs["/api"]
  }
}

export const rateLimiter = new RateLimiter()
