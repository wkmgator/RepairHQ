export interface SystemAuditReport {
  stripe: {
    status: "ready" | "needs_work" | "missing"
    issues: string[]
    recommendations: string[]
  }
  supabase: {
    status: "ready" | "needs_work" | "missing"
    issues: string[]
    recommendations: string[]
  }
  pos: {
    status: "ready" | "needs_work" | "missing"
    issues: string[]
    recommendations: string[]
  }
  seo: {
    status: "ready" | "needs_work" | "missing"
    issues: string[]
    recommendations: string[]
  }
  pdf: {
    status: "ready" | "needs_work" | "missing"
    issues: string[]
    recommendations: string[]
  }
  ai: {
    status: "ready" | "needs_work" | "missing"
    issues: string[]
    recommendations: string[]
  }
}

export const SYSTEM_AUDIT: SystemAuditReport = {
  stripe: {
    status: "ready",
    issues: [],
    recommendations: ["Test webhook endpoints in production"],
  },
  supabase: {
    status: "ready",
    issues: [],
    recommendations: ["Verify RLS policies are properly configured"],
  },
  pos: {
    status: "ready",
    issues: ["Receipt printing needs testing"],
    recommendations: ["Test thermal printer integration"],
  },
  seo: {
    status: "needs_work",
    issues: ["Missing robots.txt", "No dynamic sitemap", "Missing meta tags"],
    recommendations: ["Implement complete SEO package"],
  },
  pdf: {
    status: "needs_work",
    issues: ["PDF generation not fully implemented"],
    recommendations: ["Add react-pdf or puppeteer integration"],
  },
  ai: {
    status: "ready",
    issues: [],
    recommendations: ["Expand AI features for more verticals"],
  },
}
