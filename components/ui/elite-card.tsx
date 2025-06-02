"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const EliteCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "glass" | "neumorphic" | "gradient"
    hover?: boolean
  }
>(({ className, variant = "default", hover = true, children, ...props }, ref) => {
  const variants = {
    default: "bg-card text-card-foreground border shadow-elevation-1",
    glass: "glass text-card-foreground border-white/20",
    neumorphic: "neumorphic text-card-foreground",
    gradient: "gradient-primary text-white border-0 shadow-elevation-2",
  }

  const Component = hover ? motion.div : "div"
  const motionProps = hover
    ? {
        whileHover: { scale: 1.02, y: -2 },
        transition: { duration: 0.2, ease: "easeOut" },
      }
    : {}

  return (
    <Component
      ref={ref}
      className={cn(
        "rounded-2xl p-6 transition-all duration-200",
        variants[variant],
        hover && "hover:shadow-elevation-3 cursor-pointer",
        className,
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  )
})
EliteCard.displayName = "EliteCard"

const EliteCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 pb-6", className)} {...props} />
  ),
)
EliteCardHeader.displayName = "EliteCardHeader"

const EliteCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-bold leading-none tracking-tight", className)} {...props} />
  ),
)
EliteCardTitle.displayName = "EliteCardTitle"

const EliteCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
)
EliteCardDescription.displayName = "EliteCardDescription"

const EliteCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("", className)} {...props} />,
)
EliteCardContent.displayName = "EliteCardContent"

const EliteCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex items-center pt-6", className)} {...props} />,
)
EliteCardFooter.displayName = "EliteCardFooter"

export { EliteCard, EliteCardHeader, EliteCardFooter, EliteCardTitle, EliteCardDescription, EliteCardContent }
