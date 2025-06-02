export interface EdgeLocation {
  id: string
  name: string
  region: string
  country: string
  city: string
  latency: number
  capacity: number
  currentLoad: number
  isHealthy: boolean
  features: string[]
}

export interface CacheStrategy {
  pattern: string
  ttl: number
  regions: string[]
  compressionEnabled: boolean
  imageOptimization: boolean
  minify: boolean
}

export class GlobalCDNManager {
  private edgeLocations: EdgeLocation[] = [
    {
      id: "us-east-1",
      name: "US East (N. Virginia)",
      region: "us-east",
      country: "US",
      city: "Ashburn",
      latency: 15,
      capacity: 50000,
      currentLoad: 0,
      isHealthy: true,
      features: ["compute", "storage", "cache"],
    },
    {
      id: "us-west-1",
      name: "US West (N. California)",
      region: "us-west",
      country: "US",
      city: "San Francisco",
      latency: 20,
      capacity: 40000,
      currentLoad: 0,
      isHealthy: true,
      features: ["compute", "storage", "cache"],
    },
    {
      id: "eu-west-1",
      name: "Europe (Ireland)",
      region: "eu-west",
      country: "IE",
      city: "Dublin",
      latency: 25,
      capacity: 45000,
      currentLoad: 0,
      isHealthy: true,
      features: ["compute", "storage", "cache"],
    },
    {
      id: "ap-southeast-1",
      name: "Asia Pacific (Singapore)",
      region: "ap-southeast",
      country: "SG",
      city: "Singapore",
      latency: 30,
      capacity: 35000,
      currentLoad: 0,
      isHealthy: true,
      features: ["compute", "storage", "cache"],
    },
    {
      id: "ap-northeast-1",
      name: "Asia Pacific (Tokyo)",
      region: "ap-northeast",
      country: "JP",
      city: "Tokyo",
      latency: 35,
      capacity: 30000,
      currentLoad: 0,
      isHealthy: true,
      features: ["compute", "storage", "cache"],
    },
  ]

  private cacheStrategies: CacheStrategy[] = [
    {
      pattern: "/static/*",
      ttl: 31536000, // 1 year
      regions: ["global"],
      compressionEnabled: true,
      imageOptimization: true,
      minify: true,
    },
    {
      pattern: "/api/public/*",
      ttl: 300, // 5 minutes
      regions: ["global"],
      compressionEnabled: true,
      imageOptimization: false,
      minify: false,
    },
    {
      pattern: "/api/user/*",
      ttl: 60, // 1 minute
      regions: ["regional"],
      compressionEnabled: true,
      imageOptimization: false,
      minify: false,
    },
    {
      pattern: "/api/realtime/*",
      ttl: 0, // No cache
      regions: ["origin"],
      compressionEnabled: false,
      imageOptimization: false,
      minify: false,
    },
  ]

  /**
   * Get the best edge location for a user
   */
  getBestEdgeLocation(userLocation?: { country?: string; region?: string }): EdgeLocation {
    const healthyLocations = this.edgeLocations.filter((location) => location.isHealthy)

    if (healthyLocations.length === 0) {
      throw new Error("No healthy edge locations available")
    }

    // If user location is provided, prioritize nearby locations
    if (userLocation?.country) {
      const sameCountry = healthyLocations.filter((location) => location.country === userLocation.country)
      if (sameCountry.length > 0) {
        return this.selectByLoad(sameCountry)
      }
    }

    if (userLocation?.region) {
      const sameRegion = healthyLocations.filter((location) => location.region === userLocation.region)
      if (sameRegion.length > 0) {
        return this.selectByLoad(sameRegion)
      }
    }

    // Default to lowest latency with available capacity
    return this.selectByLoad(healthyLocations)
  }

  /**
   * Select edge location by load balancing
   */
  private selectByLoad(locations: EdgeLocation[]): EdgeLocation {
    const availableLocations = locations.filter((location) => location.currentLoad < location.capacity * 0.9)

    if (availableLocations.length === 0) {
      // All locations are at capacity, return least loaded
      return locations.reduce((prev, current) =>
        prev.currentLoad / prev.capacity < current.currentLoad / current.capacity ? prev : current,
      )
    }

    // Return location with lowest latency that has capacity
    return availableLocations.reduce((prev, current) => (prev.latency < current.latency ? prev : current))
  }

  /**
   * Get cache strategy for a given path
   */
  getCacheStrategy(path: string): CacheStrategy {
    const strategy = this.cacheStrategies.find((strategy) => {
      const pattern = strategy.pattern.replace("*", ".*")
      return new RegExp(pattern).test(path)
    })

    return strategy || this.cacheStrategies[1] // Default to API cache strategy
  }

  /**
   * Generate cache headers for a response
   */
  getCacheHeaders(path: string): Record<string, string> {
    const strategy = this.getCacheStrategy(path)

    if (strategy.ttl === 0) {
      return {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      }
    }

    const headers: Record<string, string> = {
      "Cache-Control": `public, max-age=${strategy.ttl}, s-maxage=${strategy.ttl}`,
      "CDN-Cache-Control": `public, max-age=${strategy.ttl}`,
      "Vercel-CDN-Cache-Control": `public, max-age=${strategy.ttl}`,
    }

    if (strategy.compressionEnabled) {
      headers["Content-Encoding"] = "gzip"
    }

    return headers
  }

  /**
   * Optimize images for different devices and regions
   */
  getOptimizedImageUrl(
    originalUrl: string,
    options: { width?: number; height?: number; quality?: number; format?: string },
  ): string {
    const { width = 800, height, quality = 80, format = "webp" } = options

    // For Vercel, use their image optimization
    if (process.env.VERCEL_URL) {
      let url = `/_next/image?url=${encodeURIComponent(originalUrl)}&w=${width}&q=${quality}`
      if (height) url += `&h=${height}`
      return url
    }

    // For other CDNs, implement similar logic
    return originalUrl
  }

  /**
   * Pre-warm cache for critical content globally
   */
  async preWarmGlobalCache(): Promise<void> {
    const criticalPaths = ["/", "/pricing", "/features", "/phone-repair", "/auto-repair", "/api/plans", "/api/features"]

    console.log("🔥 Pre-warming global cache...")

    const warmupPromises = this.edgeLocations.map(async (location) => {
      for (const path of criticalPaths) {
        try {
          const url = `https://${location.region}.repairhq.io${path}`
          await fetch(url, { method: "HEAD" })
        } catch (error) {
          console.error(`Failed to pre-warm ${path} at ${location.name}:`, error)
        }
      }
    })

    await Promise.all(warmupPromises)
    console.log("✅ Global cache pre-warming complete")
  }

  /**
   * Purge cache globally
   */
  async purgeGlobalCache(paths: string[]): Promise<void> {
    console.log("🗑️ Purging global cache for paths:", paths)

    // This would integrate with your CDN provider's purge API
    // For Vercel, CloudFlare, AWS CloudFront, etc.

    const purgePromises = this.edgeLocations.map(async (location) => {
      // Simulate purge API call
      console.log(`Purging cache at ${location.name} for paths:`, paths)
    })

    await Promise.all(purgePromises)
    console.log("✅ Global cache purge complete")
  }

  /**
   * Monitor edge location health
   */
  async monitorEdgeHealth(): Promise<void> {
    const healthChecks = this.edgeLocations.map(async (location) => {
      try {
        const start = Date.now()
        const response = await fetch(`https://${location.region}.repairhq.io/health`, {
          timeout: 5000,
        })

        location.isHealthy = response.ok
        location.latency = Date.now() - start

        // Update load metrics
        const loadHeader = response.headers.get("x-current-load")
        if (loadHeader) {
          location.currentLoad = Number.parseInt(loadHeader)
        }
      } catch (error) {
        location.isHealthy = false
        console.error(`Health check failed for ${location.name}:`, error)
      }
    })

    await Promise.all(healthChecks)
  }

  /**
   * Get global CDN statistics
   */
  getGlobalStats(): Record<string, any> {
    const totalCapacity = this.edgeLocations.reduce((sum, location) => sum + location.capacity, 0)
    const totalLoad = this.edgeLocations.reduce((sum, location) => sum + location.currentLoad, 0)
    const healthyLocations = this.edgeLocations.filter((location) => location.isHealthy)

    return {
      totalLocations: this.edgeLocations.length,
      healthyLocations: healthyLocations.length,
      totalCapacity,
      totalLoad,
      globalLoadPercentage: (totalLoad / totalCapacity) * 100,
      averageLatency:
        this.edgeLocations.reduce((sum, location) => sum + location.latency, 0) / this.edgeLocations.length,
      regions: this.edgeLocations.map((location) => ({
        id: location.id,
        name: location.name,
        country: location.country,
        city: location.city,
        isHealthy: location.isHealthy,
        loadPercentage: (location.currentLoad / location.capacity) * 100,
        latency: location.latency,
      })),
    }
  }
}

export const globalCDNManager = new GlobalCDNManager()
