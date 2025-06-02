import {
  Home,
  Users,
  FileText,
  Package,
  Calendar,
  Settings,
  ShoppingCart,
  Ticket,
  BarChart2,
  Bell,
  Wrench,
  Building,
  Printer,
  CreditCard,
  MessageSquare,
  Brain,
  Zap,
  Tag,
  Clock,
  Share2,
  ShieldCheck,
  DollarSign,
  Gift,
  Factory,
} from "lucide-react"

export const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Tickets",
    href: "/tickets",
    icon: Ticket,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: Package,
  },
  {
    title: "Invoices",
    href: "/invoices",
    icon: FileText,
  },
  {
    title: "Appointments",
    href: "/appointments",
    icon: Calendar,
  },
  {
    title: "POS",
    href: "/pos",
    icon: ShoppingCart,
  },
]

export const reportingNavItems = [
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart2,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart2,
  },
]

export const aiNavItems = [
  {
    title: "AI Dashboard",
    href: "/ai-dashboard",
    icon: Brain,
    highlight: true,
  },
  {
    title: "AI Diagnostics",
    href: "/ai-diagnostics",
    icon: Zap,
  },
  {
    title: "AI Chatbot",
    href: "/support",
    icon: MessageSquare,
  },
  {
    title: "Dynamic Pricing",
    href: "/dynamic-pricing",
    icon: Tag,
  },
  {
    title: "Repair Time AI",
    href: "/repair-time",
    icon: Clock,
  },
]

export const managementNavItems = [
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
  {
    title: "Multi-Location",
    href: "/multi-location",
    icon: Building,
  },
  {
    title: "Print Center",
    href: "/print-center",
    icon: Printer,
  },
  {
    title: "Marketing",
    href: "/marketing",
    icon: CreditCard,
  },
  {
    title: "Reseller Program",
    href: "/reseller/dashboard",
    icon: Share2,
    highlight: true,
  },
  {
    title: "Industrial Repair",
    href: "/repairs/industrial", // Link to the new landing page
    icon: Factory, // Use the imported Factory icon
    highlight: true, // Optional: if you want to highlight it
  },
]

export const settingsNavItems = [
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Business Enhancement",
    href: "/business-enhancement",
    icon: Wrench,
  },
]

export const adminNavItems = [
  {
    title: "Verify Deployment",
    href: "/admin/verify-deployment",
    icon: ShieldCheck,
  },
  {
    title: "Launch Readiness",
    href: "/admin/launch-readiness",
    icon: ShieldCheck,
  },
  {
    title: "Stripe Setup",
    href: "/admin/stripe-setup",
    icon: CreditCard,
  },
  {
    title: "Manage Commissions",
    href: "/admin/commissions",
    icon: DollarSign,
  },
  {
    title: "Process Payouts",
    href: "/admin/payouts",
    icon: Gift,
  },
]
