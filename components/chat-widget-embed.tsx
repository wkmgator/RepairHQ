"use client"

import { useEffect, useState } from "react"
import { ChatWidget } from "./chat-widget"

interface ChatWidgetEmbedProps {
  apiKey?: string
  businessId?: string
  customization?: {
    primaryColor?: string
    position?: "bottom-right" | "bottom-left"
    theme?: "light" | "dark" | "auto"
    companyName?: string
    welcomeMessage?: string
  }
  triggers?: {
    timeDelay?: number // seconds
    scrollPercentage?: number // 0-100
    exitIntent?: boolean
    pageViews?: number
  }
  analytics?: {
    trackEvents?: boolean
    customEvents?: string[]
  }
}

export function ChatWidgetEmbed({
  apiKey,
  businessId,
  customization = {},
  triggers = {},
  analytics = {},
}: ChatWidgetEmbedProps) {
  const [shouldShow, setShouldShow] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)

  useEffect(() => {
    // Time delay trigger
    if (triggers.timeDelay && !hasTriggered) {
      const timer = setTimeout(() => {
        setShouldShow(true)
        setHasTriggered(true)
      }, triggers.timeDelay * 1000)

      return () => clearTimeout(timer)
    }

    // Scroll percentage trigger
    if (triggers.scrollPercentage && !hasTriggered) {
      const handleScroll = () => {
        const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        if (scrolled >= (triggers.scrollPercentage || 50)) {
          setShouldShow(true)
          setHasTriggered(true)
          window.removeEventListener("scroll", handleScroll)
        }
      }

      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    }

    // Exit intent trigger
    if (triggers.exitIntent && !hasTriggered) {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0) {
          setShouldShow(true)
          setHasTriggered(true)
        }
      }

      document.addEventListener("mouseleave", handleMouseLeave)
      return () => document.removeEventListener("mouseleave", handleMouseLeave)
    }

    // Show immediately if no triggers
    if (Object.keys(triggers).length === 0) {
      setShouldShow(true)
    }
  }, [triggers, hasTriggered])

  // Analytics tracking
  useEffect(() => {
    if (analytics.trackEvents && shouldShow) {
      // Track widget load
      if (typeof window !== "undefined" && (window as any).gtag) {
        ;(window as any).gtag("event", "chat_widget_loaded", {
          business_id: businessId,
          widget_version: "1.0.0",
        })
      }
    }
  }, [shouldShow, analytics.trackEvents, businessId])

  if (!shouldShow) return null

  return (
    <ChatWidget
      position={customization.position}
      theme={customization.theme}
      primaryColor={customization.primaryColor}
      companyName={customization.companyName}
      welcomeMessage={customization.welcomeMessage}
      isMinimized={true}
    />
  )
}
