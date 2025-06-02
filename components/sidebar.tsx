"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { useIsRtl } from "@/lib/rtl-utils"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  Users,
  FileText,
  ShoppingCart,
  Settings,
  LifeBuoy,
  LogOut,
  Building,
  BarChart3,
  Briefcase,
  CalendarDays,
  Ticket,
  Wrench,
  UserCheck,
  Bell,
  MessageSquare,
  ShieldCheck,
  Palette,
  Database,
  GitBranch,
  Rocket,
  Printer,
  Languages,
  Bot,
  FileCog,
  FileBarChart,
  Users2,
  Store,
  HandCoins,
  X,
} from "lucide-react"
import Image from "next/image"

interface NavItem {
  href: string
  icon: React.ElementType
  labelKey: string
  disabled?: boolean
  children?: NavItem[]
  sectionTitleKey?: string
  isNew?: boolean
}

interface SidebarProps {
  className?: string
  defaultCollapsed?: boolean // For desktop persistent collapse state (optional)
  isMobileOpen?: boolean
  onCloseMobile?: () => void
}

const mainNavItems: NavItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, labelKey: "dashboard" },
  { href: "/appointments", icon: CalendarDays, labelKey: "appointments" },
  { href: "/tickets", icon: Ticket, labelKey: "tickets" },
  { href: "/work-orders", icon: Wrench, labelKey: "workOrders" },
  { href: "/customers", icon: Users, labelKey: "customers" },
  { href: "/invoices", icon: FileText, labelKey: "invoices" },
  { href: "/inventory", icon: ShoppingCart, labelKey: "inventory" },
  { href: "/pos", icon: Store, labelKey: "pos", isNew: true },
]

const businessNavItems: NavItem[] = [
  { sectionTitleKey: "businessGrowth", href: "", icon: Palette /* Placeholder */, labelKey: "" },
  { href: "/marketing", icon: BarChart3, labelKey: "marketing" },
  { href: "/reports", icon: FileBarChart, labelKey: "reports" },
  { href: "/analytics", icon: BarChart3, labelKey: "analytics", isNew: true },
  { href: "/multi-location", icon: Building, labelKey: "multiLocation", isNew: true },
  { href: "/reseller", icon: HandCoins, labelKey: "resellerProgram", isNew: true },
]

const settingsNavItems: NavItem[] = [
  { sectionTitleKey: "configuration", href: "", icon: Palette /* Placeholder */, labelKey: "" },
  { href: "/settings/business", icon: Briefcase, labelKey: "businessSettings" },
  { href: "/settings/team", icon: Users2, labelKey: "teamManagement" },
  { href: "/settings/integrations", icon: GitBranch, labelKey: "integrations" },
  { href: "/settings/printer", icon: Printer, labelKey: "printerSettings" },
  { href: "/settings/templates", icon: FileCog, labelKey: "serviceTemplates" },
  { href: "/settings/industry", icon: Wrench, labelKey: "industrySpecific" },
  { href: "/settings/vin-decoder", icon: Car, labelKey: "vinDecoder", isNew: true }, // Assuming Car icon exists or use a generic one
  { href: "/settings/database", icon: Database, labelKey: "databaseSettings" },
  { href: "/settings/language", icon: Languages, labelKey: "language" },
]

const advancedNavItems: NavItem[] = [
  { sectionTitleKey: "advancedFeatures", href: "", icon: Palette /* Placeholder */, labelKey: "" },
  { href: "/notifications", icon: Bell, labelKey: "notifications" },
  { href: "/support", icon: MessageSquare, labelKey: "customerSupport" },
  { href: "/ai-dashboard", icon: Bot, labelKey: "aiDashboard", isNew: true },
  { href: "/compliance/consent-management", icon: ShieldCheck, labelKey: "consentManagement" },
  { href: "/admin/launch-readiness", icon: Rocket, labelKey: "launchReadiness" },
]

const accountNavItems: NavItem[] = [
  { href: "/profile", icon: UserCheck, labelKey: "profile" },
  { href: "/settings", icon: Settings, labelKey: "accountSettings" },
  { href: "/help", icon: LifeBuoy, labelKey: "helpSupport" },
  { href: "/auth/signout", icon: LogOut, labelKey: "logout" }, // Assuming signout path
]

function NavLink({ item, isRtl, currentPath }: { item: NavItem; isRtl: boolean; currentPath: string }) {
  const t = useTranslations("sidebar")
  const isActive = currentPath === item.href || (item.href !== "/dashboard" && currentPath.startsWith(item.href))

  if (item.sectionTitleKey) {
    return (
      <h4
        className={cn(
          "px-4 pt-4 pb-1 text-xs font-semibold uppercase text-muted-foreground/80 tracking-wider",
          isRtl ? "text-right" : "text-left",
        )}
      >
        {t(item.sectionTitleKey)}
      </h4>
    )
  }

  return (
    <Link href={item.href} passHref legacyBehavior>
      <a
        className={cn(
          "group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-150 ease-in-out",
          "hover:bg-primary/10 hover:text-primary",
          isActive ? "bg-primary/10 text-primary font-semibold" : "text-foreground/70 hover:text-foreground",
          item.disabled && "cursor-not-allowed opacity-50",
          isRtl ? "flex-row-reverse" : "",
        )}
        aria-disabled={item.disabled}
        onClick={(e) => item.disabled && e.preventDefault()}
      >
        <item.icon className={cn("h-5 w-5 flex-shrink-0", isRtl ? "ml-3" : "mr-3", isActive ? "text-primary" : "")} />
        <span className="flex-grow">{t(item.labelKey)}</span>
        {item.isNew && (
          <span className="ml-auto text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">{t("new")}</span>
        )}
      </a>
    </Link>
  )
}

export function Sidebar({ className, isMobileOpen, onCloseMobile }: SidebarProps) {
  const currentPath = usePathname()
  const t = useTranslations("sidebar")
  const isRtl = useIsRtl()

  const navSections = [
    { items: mainNavItems },
    { items: businessNavItems },
    { items: settingsNavItems },
    { items: advancedNavItems },
  ]

  const sidebarContent = (
    <>
      <div className={cn("flex items-center justify-between h-16 px-4 border-b", isRtl ? "flex-row-reverse" : "")}>
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-lg">
          <Image
            src="/placeholder.svg?width=32&height=32"
            alt="RepairHQ Logo"
            width={32}
            height={32}
            className="rounded-sm"
          />
          <span>RepairHQ</span>
        </Link>
        {isMobileOpen && ( // Show close button only in mobile open state
          <Button variant="ghost" size="icon" onClick={onCloseMobile} className="lg:hidden">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="grid items-start gap-1">
          {navSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className={sectionIndex > 0 ? "mt-2 pt-2 border-t border-border/60" : ""}>
              {section.items.map((item, itemIndex) => (
                <NavLink key={itemIndex} item={item} isRtl={isRtl} currentPath={currentPath} />
              ))}
            </div>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto border-t p-2">
        <nav className="grid items-start gap-1">
          {accountNavItems.map((item, index) => (
            <NavLink key={index} item={item} isRtl={isRtl} currentPath={currentPath} />
          ))}
        </nav>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card text-card-foreground transition-transform duration-300 ease-in-out lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full", // Slide in/out on mobile
          className, // Allows passing 'hidden lg:flex' or other classes from layout
          isRtl &&
            (isMobileOpen
              ? "lg:left-auto lg:right-0 lg:translate-x-0"
              : "lg:left-auto lg:right-0 lg:-translate-x-full"), // RTL adjustments
          isRtl && (isMobileOpen ? "translate-x-0" : "translate-x-full"), // RTL mobile slide
          isRtl ? "lg:border-l lg:border-r-0" : "lg:border-r",
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}

// Placeholder Car icon if not available in lucide-react, or use a generic one like Wrench
const Car = Wrench
