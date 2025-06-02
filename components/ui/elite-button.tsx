"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const eliteButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-elevation-2 hover:shadow-elevation-3",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-elevation-2",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-elevation-1",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-elevation-1",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "gradient-primary text-white shadow-elevation-2 hover:shadow-elevation-3 border-0",
        glass: "glass text-foreground border-white/20 hover:bg-white/10",
        neumorphic: "neumorphic text-foreground hover:shadow-neumorphic-inset",
        glow: "bg-primary text-primary-foreground shadow-glow hover:shadow-glow-lg pulse-glow",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-xl px-8",
        xl: "h-14 rounded-2xl px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface EliteButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof eliteButtonVariants> {
  asChild?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
}

const EliteButton = React.forwardRef<HTMLButtonElement, EliteButtonProps>(
  ({ className, variant, size, asChild = false, loading, icon, iconPosition = "left", children, ...props }, ref) => {
    const Comp = asChild ? Slot : motion.button
    const motionProps = asChild
      ? {}
      : {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
          transition: { duration: 0.1, ease: "easeOut" },
        }

    return (
      <Comp
        className={cn(eliteButtonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading}
        {...motionProps}
        {...props}
      >
        {loading && (
          <motion.div
            className="absolute inset-0 bg-current opacity-20"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
        )}

        {icon && iconPosition === "left" && <span className={cn("mr-2", loading && "opacity-0")}>{icon}</span>}

        <span className={cn(loading && "opacity-0")}>{children}</span>

        {icon && iconPosition === "right" && <span className={cn("ml-2", loading && "opacity-0")}>{icon}</span>}

        {loading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
          </motion.div>
        )}
      </Comp>
    )
  },
)
EliteButton.displayName = "EliteButton"

export { EliteButton, eliteButtonVariants }
