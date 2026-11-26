import * as React from "react"

import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-13 w-full rounded-md border border-input bg-white px-4 text-body text-caption transition-colors placeholder:text-fog hover:border-caption/55 focus-visible:border-emerald focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-emerald aria-invalid:border-error disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
