"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useLocale } from "next-intl"
import { Check, ChevronDown, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { locales, localeMetadata } from "@/lib/i18n"
import { useIsRtl } from "@/lib/rtl-utils"

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const isRtl = useIsRtl()
  const [open, setOpen] = useState(false)

  // Get current locale metadata
  const currentLocale = localeMetadata[locale as keyof typeof localeMetadata]

  // Function to switch language
  const switchLanguage = (newLocale: string) => {
    // Extract the locale segment from the pathname
    const segments = pathname.split("/")
    segments[1] = newLocale // Replace the locale segment

    // Navigate to the new path
    router.push(segments.join("/"))
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
          <Globe className="h-4 w-4" />
          <span className="mx-1">
            {currentLocale?.flag} {currentLocale?.name}
          </span>
          <ChevronDown className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRtl ? "start" : "end"} className="w-[200px] max-h-[400px] overflow-y-auto">
        {locales.map((l) => {
          const meta = localeMetadata[l as keyof typeof localeMetadata]
          return (
            <DropdownMenuItem
              key={l}
              className={`flex items-center justify-between ${meta?.rtl ? "text-right" : "text-left"}`}
              onClick={() => switchLanguage(l)}
            >
              <div className="flex items-center gap-2">
                <span>{meta?.flag}</span>
                <span>{meta?.name}</span>
              </div>
              {locale === l && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
