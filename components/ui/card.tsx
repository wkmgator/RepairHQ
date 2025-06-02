import * as React from "react"

import { cn } from "@/lib/utils"
import { useIsRtl } from "@/lib/rtl-utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  const isRtl = useIsRtl()

  return (
    <div
      ref={ref}
      className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", isRtl ? "text-right" : "", className)}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const isRtl = useIsRtl()

    return (
      <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", isRtl ? "text-right" : "", className)} {...props} />
    )
  },
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    const isRtl = useIsRtl()

    return (
      <h3
        ref={ref}
        className={cn("text-2xl font-semibold leading-none tracking-tight", isRtl ? "text-right" : "", className)}
        {...props}
      />
    )
  },
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    const isRtl = useIsRtl()

    return (
      <p ref={ref} className={cn("text-sm text-muted-foreground", isRtl ? "text-right" : "", className)} {...props} />
    )
  },
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const isRtl = useIsRtl()

    return <div ref={ref} className={cn("p-6 pt-0", isRtl ? "text-right" : "", className)} {...props} />
  },
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const isRtl = useIsRtl()

    return (
      <div ref={ref} className={cn("flex items-center p-6 pt-0", isRtl ? "text-right" : "", className)} {...props} />
    )
  },
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
