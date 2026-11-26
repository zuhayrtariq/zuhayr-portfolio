import * as React from "react"

import { cn } from "@/lib/utils"

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[9rem] w-full rounded-md border border-input bg-white px-4 py-3.5 text-body text-caption transition-colors placeholder:text-fog hover:border-caption/55 focus-visible:border-emerald focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-emerald aria-invalid:border-error disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
