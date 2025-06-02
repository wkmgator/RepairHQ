"use client"

import { useState } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { useIsRtl } from "@/lib/rtl-utils"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Bell, Search, Settings, LogOut, User, Moon, Sun, HelpCircle, LayoutGrid, X } from "lucide-react" // Added X
import { useTheme } from "next-themes"

interface HeaderProps {
  user?: {
    name: string
    email: string
    image?: string
  }
  onToggleSidebar?: () => void
  isSidebarOpen?: boolean
}

export function Header({ user, onToggleSidebar, isSidebarOpen }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { setTheme, theme } = useTheme()
  const t = useTranslations("header")
  const isRtl = useIsRtl()

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:px-6 lg:px-8">
      {onToggleSidebar && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="lg:hidden" // Only show on mobile/tablet
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <LayoutGrid className="h-5 w-5" />}
        </Button>
      )}
      <div className={cn("flex flex-1 items-center", isRtl ? "flex-row-reverse" : "")}>
        <form className={cn("relative w-full max-w-md", isRtl ? "ml-auto" : "mr-auto")}>
          <Search
            className={cn(
              "absolute top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4",
              isRtl ? "right-3" : "left-3",
            )}
          />
          <Input
            type="search"
            placeholder={t("search") + "..."}
            className={cn(
              "h-10 w-full rounded-full bg-muted/60 pl-10 focus:bg-background",
              isRtl ? "pr-10 text-right" : "pl-10",
            )}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      <div className={cn("flex items-center gap-x-2 sm:gap-x-3", isRtl ? "flex-row-reverse" : "")}>
        <LanguageSwitcher />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isRtl ? "start" : "end"} className={cn("w-72", isRtl ? "text-right" : "")}>
            <DropdownMenuLabel className="font-semibold">{t("notifications")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {[
              { titleKey: "newTicket", descKey: "ticketCreated" },
              { titleKey: "lowStock", descKey: "stockAlert" },
              { titleKey: "paymentReceived", descKey: "invoicePaid" },
            ].map((item, index) => (
              <DropdownMenuItem key={index} className="flex flex-col items-start p-3 hover:bg-muted/50">
                <div className="font-medium text-sm">{t(item.titleKey)}</div>
                <div className="text-xs text-muted-foreground">{t(item.descKey)}</div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href="/notifications"
                className="w-full cursor-pointer flex items-center justify-center p-2 text-sm text-primary hover:bg-muted/50"
              >
                {t("viewAll")}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" aria-label="Help">
          <HelpCircle className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-x-2 px-2 py-1.5 h-auto rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user?.image || "/placeholder.svg?width=32&height=32&query=User+Avatar"}
                  alt={user?.name || "User"}
                />
                <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-sm font-medium">{user?.name || t("account")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isRtl ? "start" : "end"} className={cn("w-56", isRtl ? "text-right" : "")}>
            <DropdownMenuLabel>
              <div className="font-semibold">{user?.name || t("account")}</div>
              <div className="text-xs text-muted-foreground">{user?.email || ""}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className={cn("h-4 w-4", isRtl ? "ml-2" : "mr-2")} />
              {t("profile")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className={cn("h-4 w-4", isRtl ? "ml-2" : "mr-2")} />
              {t("settings")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className={cn("h-4 w-4", isRtl ? "ml-2" : "mr-2")} />
              {t("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
