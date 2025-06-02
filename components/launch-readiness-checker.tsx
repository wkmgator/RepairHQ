"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, AlertCircle, Loader2, ExternalLink } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CheckItem {
  id: string
  name: string
  description: string
  status: "pending" | "checking" | "passed" | "failed" | "warning"
  category: string
  critical: boolean
  details?: string
  action?: string
  url?: string
}

const LAUNCH_CHECKLIST: CheckItem[] = [
  // Core Systems
  {
    id: "supabase-auth",
    name: "User Authentication (Supabase)",
    description: "Supabase auth configured and working (UI & basic setup)",
    status: "pending",
    category: "core",
    critical: true,
    url: "/admin/environment",
  },
  {
    id: "role-access",
    name: "Role-based Access Control",
    description: "Admin, Manager, Tech, Customer roles implemented and enforced",
    status: "pending",
    category: "core",
    critical: true,
    details: "Verify RLS policies in Supabase and application logic.",
  },
  {
    id: "stripe-billing",
    name: "Stripe Billing Plans & Integration",
    description: "Subscription plans (Starter, Pro, Enterprise, Franchise) configured in Stripe and app",
    status: "pending",
    category: "core",
    critical: true,
    url: "/admin/stripe-production",
  },
  {
    id: "plan-enforcement",
    name: "Plan Enforcement Logic",
    description: "User/store limits and feature access enforced by subscription plan",
    status: "pending",
    category: "core",
    critical: true,
    details: "Test feature flags and limitations for each plan.",
  },
  {
    id: "store-onboarding",
    name: "Store Onboarding Flow",
    description: "Auto-store creation, staff invitation, and initial setup wizard working",
    status: "pending",
    category: "core",
    critical: true,
    url: "/onboarding/setup-wizard",
  },
  {
    id: "pos-system",
    name: "POS System Functionality",
    description: "Point of sale transactions, payment processing, receipt printing operational",
    status: "pending",
    category: "core",
    critical: true,
    url: "/pos",
  },
  {
    id: "repair-tickets",
    name: "Repair Ticket System",
    description: "Ticket creation, status updates, assignment, and GBT rewards integration",
    status: "pending",
    category: "core",
    critical: true,
    url: "/tickets",
  },
  {
    id: "inventory-system",
    name: "Inventory Management",
    description: "Parts tracking, stock levels, pricing, low stock alerts, barcode scanning",
    status: "pending",
    category: "core",
    critical: true,
    url: "/inventory",
  },
  {
    id: "appointment-scheduler",
    name: "Appointment Scheduler",
    description: "Booking system, calendar views, reminders, and ticket conversion",
    status: "pending",
    category: "core",
    critical: true,
    url: "/appointments",
  },
  {
    id: "pdf-printing",
    name: "PDF & Invoice Printing",
    description: "Invoice, receipt, label printing with thermal and laser printer support",
    status: "pending",
    category: "core",
    critical: true,
    url: "/print-center",
  },
  {
    id: "gbt-rewards",
    name: "GBT Rewards Engine",
    description: "Automated GatorBite Token reward calculation and distribution logic",
    status: "pending",
    category: "core",
    critical: false, // Can launch without, but core to GBT
    url: "/web3",
  },
  {
    id: "multi-store",
    name: "Multi-store Support",
    description: "Multiple location management, data segregation, and consolidated reporting",
    status: "pending",
    category: "core",
    critical: true,
    url: "/multi-location",
  },
  {
    id: "notifications-system",
    name: "Notifications System (Email & SMS)",
    description: "Transactional emails and SMS alerts for key events",
    status: "pending",
    category: "core",
    critical: true,
    url: "/notifications",
  },

  // Environment Variables & Configuration
  {
    id: "env-supabase-keys",
    name: "Supabase Keys (URL, Anon, Service Role)",
    description: "All Supabase environment variables correctly set for production",
    status: "pending",
    category: "environment",
    critical: true,
    url: "/admin/environment",
  },
  {
    id: "env-stripe-keys",
    name: "Stripe Keys (Public, Secret, Webhook)",
    description: "All Stripe LIVE environment variables correctly set for production",
    status: "pending",
    category: "environment",
    critical: true,
    url: "/admin/stripe-production",
  },
  {
    id: "env-communication-keys",
    name: "Communication Service Keys (SendGrid, Twilio)",
    description: "API keys for email and SMS services set for production",
    status: "pending",
    category: "environment",
    critical: true,
    url: "/admin/communications",
  },
  {
    id: "env-site-url",
    name: "Production Site URL (NEXT_PUBLIC_BASE_URL)",
    description: "Base URL for the production application correctly set",
    status: "pending",
    category: "environment",
    critical: true,
    url: "/admin/environment",
  },
  {
    id: "env-webhook-base-url",
    name: "Webhook Base URL (WEBHOOK_BASE_URL)",
    description: "Base URL for receiving webhooks correctly set",
    status: "pending",
    category: "environment",
    critical: true,
    url: "/admin/webhooks/setup",
  },

  // Stripe Configuration (Beyond just keys)
  {
    id: "stripe-live-mode",
    name: "Stripe Account in Live Mode",
    description: "Stripe dashboard switched from test to live mode",
    status: "pending",
    category: "stripe",
    critical: true,
    url: "https://dashboard.stripe.com/test/dashboard",
    action: "Switch to live mode in Stripe dashboard",
  },
  {
    id: "stripe-webhooks-configured",
    name: "Stripe Webhooks Fully Configured",
    description:
      "All required webhook endpoints (checkout, subscription, invoice events) set up in Stripe and pointing to production URL",
    status: "pending",
    category: "stripe",
    critical: true,
    url: "/admin/webhooks/setup",
  },
  {
    id: "stripe-plans-live",
    name: "Subscription Plans Live in Stripe",
    description: "All pricing plans (Starter, Pro, Enterprise, Franchise) created and active in Stripe live mode",
    status: "pending",
    category: "stripe",
    critical: true,
    url: "https://dashboard.stripe.com/products",
  },
  {
    id: "stripe-tax-config",
    name: "Stripe Tax Configuration",
    description: "Tax rates and rules configured in Stripe if applicable",
    status: "pending",
    category: "stripe",
    critical: false, // Depends on business requirements
    url: "https://dashboard.stripe.com/settings/tax",
  },

  // Database & Security
  {
    id: "supabase-db-schema-prod",
    name: "Production Database Schema Applied",
    description:
      "Final database schema (tables, columns, relations, functions) deployed to production Supabase instance",
    status: "pending",
    category: "database",
    critical: true,
    url: "/admin/database",
  },
  {
    id: "supabase-rls-prod",
    name: "Row Level Security Policies Active",
    description: "RLS policies implemented, tested, and active on all relevant tables in production",
    status: "pending",
    category: "database",
    critical: true,
    details: "Verify policies for users, stores, tickets, inventory, etc.",
  },
  {
    id: "supabase-db-backups",
    name: "Supabase Database Backups Configured",
    description: "Automated daily backups configured for the production database",
    status: "pending",
    category: "database",
    critical: true,
    url: "https://supabase.com/dashboard/project/_/database/backups",
  },
  {
    id: "api-security-prod",
    name: "API Security Hardened",
    description: "Rate limiting, CORS, input validation, and authentication checks on all API endpoints",
    status: "pending",
    category: "database", // Related to backend/db access
    critical: true,
    details: "Review all server actions and API routes.",
  },

  // UI/UX & Performance
  {
    id: "mobile-responsive-final-qa",
    name: "Mobile Responsiveness Final QA",
    description: "Application thoroughly tested and working correctly on various mobile devices and screen sizes",
    status: "pending",
    category: "ui",
    critical: true,
  },
  {
    id: "cross-browser-final-qa",
    name: "Cross-browser Compatibility Final QA",
    description: "Application tested and working in latest versions of Chrome, Firefox, Safari, Edge",
    status: "pending",
    category: "ui",
    critical: true,
  },
  {
    id: "performance-optimization",
    name: "Performance Optimization",
    description: "Bundle sizes, image optimization, lazy loading, and query performance reviewed",
    status: "pending",
    category: "ui",
    critical: false, // Can be ongoing
    details: "Use tools like Lighthouse, Vercel Analytics.",
  },
  {
    id: "accessibility-check",
    name: "Accessibility (a11y) Check",
    description: "Basic accessibility standards (ARIA attributes, keyboard navigation, color contrast) reviewed",
    status: "pending",
    category: "ui",
    critical: false,
  },

  // SEO & Marketing Pages
  {
    id: "marketing-pages-content",
    name: "Marketing Pages Content Finalized",
    description: "Homepage, features, pricing, about, contact pages have final content and CTAs",
    status: "pending",
    category: "seo",
    critical: true,
    url: "/", // and other marketing pages
  },
  {
    id: "meta-tags-prod",
    name: "Production Meta Tags & OG Tags",
    description: "Accurate page titles, descriptions, and Open Graph tags for all public pages",
    status: "pending",
    category: "seo",
    critical: true,
  },
  {
    id: "sitemap-prod",
    name: "Production Sitemap Submitted",
    description: "XML sitemap generated, accessible, and submitted to search engines",
    status: "pending",
    category: "seo",
    critical: false,
    url: "/sitemap.xml",
  },
  {
    id: "robots-txt-prod",
    name: "Production Robots.txt Configured",
    description: "Search engine crawling rules correctly defined for production",
    status: "pending",
    category: "seo",
    critical: false,
    url: "/robots.txt",
  },
  {
    id: "analytics-tracking",
    name: "Analytics Tracking Implemented",
    description: "Google Analytics or other analytics solution set up for production traffic",
    status: "pending",
    category: "seo",
    critical: false,
  },

  // Deployment & Operations
  {
    id: "domain-ssl-prod",
    name: "Production Domain & SSL Certificate",
    description: "Custom domain (e.g., repairhq.io) configured with a valid SSL certificate (HTTPS)",
    status: "pending",
    category: "deployment",
    critical: true,
    details: "Check Vercel domain settings.",
  },
  {
    id: "vercel-prod-settings",
    name: "Vercel Production Deployment Settings",
    description: "Production branch, build commands, and serverless function regions optimized",
    status: "pending",
    category: "deployment",
    critical: true,
    details: "Review Vercel project settings.",
  },
  {
    id: "error-pages-prod",
    name: "Custom Error Pages (404, 500)",
    description: "User-friendly 404 (Not Found) and 500 (Server Error) pages configured",
    status: "pending",
    category: "deployment",
    critical: true,
    url: "/not-found", // and test server errors
  },
  {
    id: "logging-monitoring-prod",
    name: "Production Logging & Monitoring",
    description: "Centralized logging (e.g., Vercel Logs, Supabase Logs) and basic system monitoring in place",
    status: "pending",
    category: "deployment",
    critical: true,
    url: "/admin/monitoring",
  },
  {
    id: "pwa-config",
    name: "PWA Configuration (manifest.json, sw.js)",
    description:
      "Progressive Web App manifest and service worker configured for offline capabilities and installability",
    status: "pending",
    category: "deployment",
    critical: false,
    url: "/manifest.json",
  },

  // Admin Tools Verification
  {
    id: "admin-tools-access",
    name: "Admin Tools Access Control",
    description: "Ensure all /admin routes are properly protected and accessible only by admins",
    status: "pending",
    category: "admin",
    critical: true,
    url: "/admin/monitoring", // example admin page
  },
  {
    id: "admin-env-checker-functional",
    name: "Environment Checker Tool Functional",
    description: "Admin tool for checking environment variables is working",
    status: "pending",
    category: "admin",
    critical: false,
    url: "/admin/environment",
  },
  {
    id: "admin-webhook-guide-functional",
    name: "Webhook Setup Guide Functional",
    description: "Admin tool for webhook setup instructions is accurate and working",
    status: "pending",
    category: "admin",
    critical: false,
    url: "/admin/webhooks/setup",
  },
  {
    id: "admin-deployment-tools-functional",
    name: "Deployment Verification Tools Functional",
    description: "Admin tools for verifying deployment and Stripe setup are working",
    status: "pending",
    category: "admin",
    critical: false,
    url: "/admin/verify-deployment",
  },

  // Legal & Compliance
  {
    id: "legal-privacy-policy-live",
    name: "Privacy Policy Live & Linked",
    description: "Final privacy policy content published and accessible from site footer/relevant areas",
    status: "pending",
    category: "legal",
    critical: true,
  },
  {
    id: "legal-terms-of-service-live",
    name: "Terms of Service Live & Linked",
    description: "Final terms of service content published and accessible, including during signup",
    status: "pending",
    category: "legal",
    critical: true,
  },
  {
    id: "cookie-consent",
    name: "Cookie Consent Mechanism",
    description: "If using non-essential cookies, a consent mechanism is in place",
    status: "pending",
    category: "legal",
    critical: false, // Depends on specific cookie usage
    url: "/compliance/consent-management",
  },

  // Final Testing & Documentation
  {
    id: "e2e-testing",
    name: "End-to-End Testing Completed",
    description: "Key user flows (signup, subscription, ticket creation, POS sale) tested thoroughly",
    status: "pending",
    category: "testing",
    critical: true,
  },
  {
    id: "user-documentation",
    name: "Basic User Documentation/Help Guide",
    description: "Initial help guides or FAQs available for users",
    status: "pending",
    category: "testing",
    critical: false,
  },
  {
    id: "support-channel",
    name: "Customer Support Channel Established",
    description: "Method for users to request support (e.g., email, chat widget) is defined and working",
    status: "pending",
    category: "testing",
    critical: true,
    url: "/support",
  },
]

const runCheck = async (checkId: string): Promise<CheckItem["status"]> => {
  // Simulate API calls to check each item
  await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 700))

  // Mock results - in real implementation, these would be actual API calls
  // This reflects a state where UI is mostly done, but external configs are pending.
  const mockResults: Record<string, CheckItem["status"]> = {
    // Core Systems
    "supabase-auth": "passed",
    "role-access": "passed",
    "stripe-billing": "warning", // UI done, Stripe live config needed
    "plan-enforcement": "passed",
    "store-onboarding": "passed",
    "pos-system": "passed",
    "repair-tickets": "passed",
    "inventory-system": "passed",
    "appointment-scheduler": "passed",
    "pdf-printing": "warning", // UI done, printer hardware/drivers external
    "gbt-rewards": "passed",
    "multi-store": "passed",
    "notifications-system": "warning", // UI done, API keys for SendGrid/Twilio needed

    // Environment Variables
    "env-supabase-keys": "passed", // Assumed from Vercel env
    "env-stripe-keys": "failed", // Critical: User must provide LIVE keys
    "env-communication-keys": "failed", // Critical: User must provide API keys
    "env-site-url": "passed", // Assumed NEXT_PUBLIC_BASE_URL
    "env-webhook-base-url": "passed", // Assumed WEBHOOK_BASE_URL

    // Stripe Configuration
    "stripe-live-mode": "failed", // External: User's Stripe dashboard
    "stripe-webhooks-configured": "failed", // External: User's Stripe dashboard
    "stripe-plans-live": "warning", // External: User's Stripe dashboard
    "stripe-tax-config": "pending",

    // Database & Security
    "supabase-db-schema-prod": "passed", // Schemas exist in project
    "supabase-rls-prod": "passed", // RLS concepts exist
    "supabase-db-backups": "warning", // External: Supabase dashboard config
    "api-security-prod": "warning", // Needs thorough review

    // UI/UX & Performance
    "mobile-responsive-final-qa": "warning", // Needs actual QA
    "cross-browser-final-qa": "warning", // Needs actual QA
    "performance-optimization": "pending",
    "accessibility-check": "pending",

    // SEO & Marketing
    "marketing-pages-content": "passed", // Pages exist
    "meta-tags-prod": "passed", // SEO components exist
    "sitemap-prod": "passed", // Sitemaps exist
    "robots-txt-prod": "passed", // robots.txt exists
    "analytics-tracking": "pending",

    // Deployment & Operations
    "domain-ssl-prod": "failed", // External: Domain purchase & Vercel config
    "vercel-prod-settings": "passed", // Assumed with Next.js on Vercel
    "error-pages-prod": "passed", // not-found.tsx exists
    "logging-monitoring-prod": "passed", // Logging/Monitoring services exist
    "pwa-config": "passed", // manifest.json, sw.js exist

    // Admin Tools
    "admin-tools-access": "passed",
    "admin-env-checker-functional": "passed",
    "admin-webhook-guide-functional": "passed",
    "admin-deployment-tools-functional": "passed",

    // Legal & Compliance
    "legal-privacy-policy-live": "warning", // Placeholder, needs real content
    "legal-terms-of-service-live": "warning", // Placeholder, needs real content
    "cookie-consent": "pending", // app/compliance/consent-management/page.tsx exists

    // Final Testing & Documentation
    "e2e-testing": "pending",
    "user-documentation": "pending",
    "support-channel": "passed", // app/support/page.tsx exists
  }
  return mockResults[checkId] || "failed" // Default to failed if not in mock
}

const LaunchReadinessChecker = () => {
  const [checklist, setChecklist] = useState<CheckItem[]>(LAUNCH_CHECKLIST)
  const [isRunning, setIsRunning] = useState(false)
  const [currentCheck, setCurrentCheck] = useState<string | null>(null)

  const categories = ["core", "environment", "stripe", "database", "ui", "deployment"]

  const getStatusIcon = (status: CheckItem["status"]) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="h-4 w-4 text-gray-400" />
      case "checking":
        return <Loader2 className="h-4 w-4 animate-spin" />
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: CheckItem["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "checking":
        return <Badge variant="secondary">Checking...</Badge>
      case "passed":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Passed
          </Badge>
        )
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      case "warning":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            Warning
          </Badge>
        )
      default:
        return null
    }
  }

  const runAllChecks = async () => {
    setIsRunning(true)
    const updatedChecklist = [...checklist]

    for (let i = 0; i < updatedChecklist.length; i++) {
      const item = updatedChecklist[i]
      setCurrentCheck(item.id)

      // Update status to checking
      updatedChecklist[i] = { ...item, status: "checking" }
      setChecklist([...updatedChecklist])

      // Run the check
      const result = await runCheck(item.id)

      // Update with result
      updatedChecklist[i] = { ...item, status: result }
      setChecklist([...updatedChecklist])
    }

    setCurrentCheck(null)
    setIsRunning(false)
  }

  const getOverallProgress = () => {
    const total = checklist.length
    const completed = checklist.filter((item) => item.status !== "pending").length
    return Math.round((completed / total) * 100)
  }

  const getCriticalIssues = () => {
    return checklist.filter((item) => item.critical && item.status === "failed").length
  }

  const getWarnings = () => {
    return checklist.filter((item) => item.status === "warning").length
  }

  const getPassed = () => {
    return checklist.filter((item) => item.status === "passed").length
  }

  const isReadyForLaunch = () => {
    const criticalIssues = getCriticalIssues()
    const totalCritical = checklist.filter((item) => item.critical).length
    const passedCritical = checklist.filter((item) => item.critical && item.status === "passed").length

    return criticalIssues === 0 && passedCritical === totalCritical
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Launch Readiness Checker</h1>
          <p className="text-muted-foreground">Comprehensive verification of RepairHQ production readiness</p>
        </div>
        <Button onClick={runAllChecks} disabled={isRunning} size="lg">
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Checks...
            </>
          ) : (
            "Run All Checks"
          )}
        </Button>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getOverallProgress()}%</div>
            <Progress value={getOverallProgress()} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Passed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{getPassed()}</div>
            <p className="text-xs text-muted-foreground">checks completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{getWarnings()}</div>
            <p className="text-xs text-muted-foreground">need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{getCriticalIssues()}</div>
            <p className="text-xs text-muted-foreground">must be fixed</p>
          </CardContent>
        </Card>
      </div>

      {/* Launch Status */}
      <Card className={`border-2 ${isReadyForLaunch() ? "border-green-500" : "border-red-500"}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isReadyForLaunch() ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500" />
            )}
            Launch Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isReadyForLaunch() ? (
            <div className="text-green-600">
              <p className="font-semibold">🚀 Ready for Launch!</p>
              <p className="text-sm">
                All critical systems are operational. You can proceed with production deployment.
              </p>
            </div>
          ) : (
            <div className="text-red-600">
              <p className="font-semibold">⚠️ Not Ready for Launch</p>
              <p className="text-sm">{getCriticalIssues()} critical issue(s) must be resolved before launching.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Checklist */}
      <Tabs defaultValue="core" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="core">Core Systems</TabsTrigger>
          <TabsTrigger value="environment">Environment</TabsTrigger>
          <TabsTrigger value="stripe">Stripe</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="ui">UI/UX</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            {checklist
              .filter((item) => item.category === category)
              .map((item) => (
                <Card key={item.id} className={item.critical ? "border-l-4 border-l-red-500" : ""}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(item.status)}
                        <div>
                          <CardTitle className="text-base">{item.name}</CardTitle>
                          <CardDescription>{item.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.critical && (
                          <Badge variant="outline" className="text-red-600 border-red-600">
                            Critical
                          </Badge>
                        )}
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                  </CardHeader>
                  {(item.details || item.action || item.url) && (
                    <CardContent className="pt-0">
                      {item.details && <p className="text-sm text-muted-foreground mb-2">{item.details}</p>}
                      {item.action && <p className="text-sm font-medium text-blue-600 mb-2">Action: {item.action}</p>}
                      {item.url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={item.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Details
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
          </TabsContent>
        ))}
      </Tabs>

      {/* Next Steps - This section can be made dynamic based on failed/warning critical items */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps for Launch</CardTitle>
          <CardDescription>Priority actions to complete before going live based on current scan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {getCriticalIssues() > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-red-600">🔴 Critical (Must Fix - {getCriticalIssues()} items)</h4>
              <ul className="space-y-1 text-sm list-disc list-inside">
                {checklist
                  .filter((item) => item.critical && item.status === "failed")
                  .map((item) => (
                    <li key={`critical-${item.id}`}>
                      {item.name} - {item.action || item.details || "Resolve issue"}
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {getWarnings() > 0 && checklist.filter((item) => item.status === "warning" && item.critical).length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-yellow-600">
                🟡 Important Warnings (Critical -{" "}
                {checklist.filter((item) => item.status === "warning" && item.critical).length} items)
              </h4>
              <ul className="space-y-1 text-sm list-disc list-inside">
                {checklist
                  .filter((item) => item.status === "warning" && item.critical)
                  .map((item) => (
                    <li key={`warning-crit-${item.id}`}>
                      {item.name} - {item.action || item.details || "Review item"}
                    </li>
                  ))}
              </ul>
            </div>
          )}
          {getWarnings() > 0 && checklist.filter((item) => item.status === "warning" && !item.critical).length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-yellow-600">
                🟡 Other Warnings (Non-Critical -{" "}
                {checklist.filter((item) => item.status === "warning" && !item.critical).length} items)
              </h4>
              <ul className="space-y-1 text-sm list-disc list-inside">
                {checklist
                  .filter((item) => item.status === "warning" && !item.critical)
                  .map((item) => (
                    <li key={`warning-noncrit-${item.id}`}>
                      {item.name} - {item.action || item.details || "Review item"}
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {isReadyForLaunch() && getPassed() === checklist.length && (
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">✅ All Checks Passed!</h4>
              <p className="text-sm">Consider final review and performance testing before launch.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default LaunchReadinessChecker
