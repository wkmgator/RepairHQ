export interface CacheConfig {
  ttl: number // Time to live in seconds
  regions: string[]
  compressionEnabled: boolean
  imageOptimization: boolean
}

export class CDNManager {
  private cacheConfigs: Record<string, CacheConfig> = {
    // Static assets - cache for 1 year
    static: {
      ttl: 31536000,
      regions: ["global"],
      compressionEnabled: true,
      imageOptimization: true,
    },
    // API responses - cache for 5 minutes
    api: {
      ttl: 300,
      regions: ["us-east-1", "eu-west-1", "ap-southeast-1"],
      compressionEnabled: true,
      imageOptimization: false,
    },
    // User data - cache for 1 minute
    user: {
      ttl: 60,
      regions: ["global"],
      compressionEnabled: true,
      imageOptimization: false,
    },
    // Real-time data - no cache
    realtime: {
      ttl: 0,
      regions: ["global"],
      compressionEnabled: false,
      imageOptimization: false,
    },
  }

  /**
   * Configure CDN caching for different content types
   */
  getCacheHeaders(contentType: string): Record<string, string> {
    const config = this.cacheConfigs[contentType] || this.cacheConfigs.api

    if (config.ttl === 0) {
      return {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      }
    }

    return {
      "Cache-Control": `public, max-age=${config.ttl}, s-maxage=${config.ttl}`,
      "CDN-Cache-Control": `public, max-age=${config.ttl}`,
      "Vercel-CDN-Cache-Control": `public, max-age=${config.ttl}`,
    }
  }

  /**
   * Purge cache for specific content
   */
  async purgeCache(paths: string[]): Promise<void> {
    // This would integrate with your CDN provider (Vercel, CloudFlare, etc.)
    console.log("🗑️ Purging cache for paths:", paths)

    // For Vercel, you'd use their API
    // For CloudFlare, you'd use their purge API
    // For AWS CloudFront, you'd create invalidations
  }

  /**
   * Optimize images for different devices
   */
  getOptimizedImageUrl(originalUrl: string, width: number, quality = 80): string {
    // For Vercel, use their image optimization
    if (process.env.VERCEL_URL) {
      return `/_next/image?url=${encodeURIComponent(originalUrl)}&w=${width}&q=${quality}`
    }

    // For other CDNs, implement similar logic
    return originalUrl
  }

  /**
   * Pre-warm cache for critical content
   */
  async preWarmCache(): Promise<void> {
    const criticalPaths = ["/", "/pricing", "/features", "/api/plans", "/api/features"]

    console.log("🔥 Pre-warming cache for critical paths...")

    for (const path of criticalPaths) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${path}`)
      } catch (error) {
        console.error(`Failed to pre-warm ${path}:`, error)
      }
    }
  }
}

export const cdnManager = new CDNManager()
