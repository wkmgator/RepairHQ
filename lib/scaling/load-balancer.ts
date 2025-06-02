export interface ServerRegion {
  name: string
  endpoint: string
  latency: number
  capacity: number
  currentLoad: number
  isHealthy: boolean
}

export class LoadBalancer {
  private regions: ServerRegion[] = [
    {
      name: "us-east-1",
      endpoint: "https://us-east.repairhq.io",
      latency: 50,
      capacity: 10000,
      currentLoad: 0,
      isHealthy: true,
    },
    {
      name: "us-west-2",
      endpoint: "https://us-west.repairhq.io",
      latency: 80,
      capacity: 8000,
      currentLoad: 0,
      isHealthy: true,
    },
    {
      name: "eu-west-1",
      endpoint: "https://eu.repairhq.io",
      latency: 120,
      capacity: 12000,
      currentLoad: 0,
      isHealthy: true,
    },
    {
      name: "ap-southeast-1",
      endpoint: "https://asia.repairhq.io",
      latency: 200,
      capacity: 6000,
      currentLoad: 0,
      isHealthy: true,
    },
  ]

  /**
   * Get the best region for a user based on location and load
   */
  getBestRegion(userLocation?: string): ServerRegion {
    const healthyRegions = this.regions.filter((region) => region.isHealthy)

    if (healthyRegions.length === 0) {
      throw new Error("No healthy regions available")
    }

    // Simple load balancing algorithm
    // In production, you'd use more sophisticated algorithms
    const availableRegions = healthyRegions.filter((region) => region.currentLoad < region.capacity * 0.8)

    if (availableRegions.length === 0) {
      // All regions are at capacity, return least loaded
      return healthyRegions.reduce((prev, current) =>
        prev.currentLoad / prev.capacity < current.currentLoad / current.capacity ? prev : current,
      )
    }

    // Return region with lowest latency that has capacity
    return availableRegions.reduce((prev, current) => (prev.latency < current.latency ? prev : current))
  }

  /**
   * Update region load
   */
  updateRegionLoad(regionName: string, load: number): void {
    const region = this.regions.find((r) => r.name === regionName)
    if (region) {
      region.currentLoad = load
    }
  }

  /**
   * Health check all regions
   */
  async healthCheckRegions(): Promise<void> {
    const healthChecks = this.regions.map(async (region) => {
      try {
        const response = await fetch(`${region.endpoint}/health`, {
          timeout: 5000,
        })

        region.isHealthy = response.ok

        // Update latency
        const start = Date.now()
        await fetch(`${region.endpoint}/ping`)
        region.latency = Date.now() - start
      } catch (error) {
        region.isHealthy = false
        console.error(`Health check failed for ${region.name}:`, error)
      }
    })

    await Promise.all(healthChecks)
  }

  /**
   * Get load balancing statistics
   */
  getStats(): Record<string, any> {
    return {
      totalRegions: this.regions.length,
      healthyRegions: this.regions.filter((r) => r.isHealthy).length,
      totalCapacity: this.regions.reduce((sum, r) => sum + r.capacity, 0),
      totalLoad: this.regions.reduce((sum, r) => sum + r.currentLoad, 0),
      averageLatency: this.regions.reduce((sum, r) => sum + r.latency, 0) / this.regions.length,
      regions: this.regions.map((r) => ({
        name: r.name,
        isHealthy: r.isHealthy,
        loadPercentage: (r.currentLoad / r.capacity) * 100,
        latency: r.latency,
      })),
    }
  }
}

export const loadBalancer = new LoadBalancer()
