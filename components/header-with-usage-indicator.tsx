"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { UsageWarningIndicator } from "@/components/usage-warning-indicator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Menu, Settings, User, LogOut } from "lucide-react"

interface HeaderProps {
  onMenuClick: () => void
}

export function HeaderWithUsageIndicator({ onMenuClick }: HeaderProps) {
  const { user, userProfile, signOut } = useAuth()
  const pathname = usePathname()
  const [initials, setInitials] = useState("")

  useEffect(() => {
    if (userProfile) {
      const firstInitial = userProfile.first_name ? userProfile.first_name[0] : ""
      const lastInitial = userProfile.last_name ? userProfile.last_name[0] : ""
      setInitials((firstInitial + lastInitial).toUpperCase())
    }
  }, [userProfile])

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-bold text-xl">RepairHQ</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <UsageWarningIndicator />

            <Link href="/notifications">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url || ""} alt={userProfile?.first_name || ""} />
                    <AvatarFallback>{initials || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {userProfile?.first_name ? `${userProfile.first_name} ${userProfile.last_name || ""}` : user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings/usage">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Usage & Plan</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
