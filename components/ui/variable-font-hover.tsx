"use client"

import * as React from "react"
import { stagger, useAnimate, type AnimationOptions } from "motion/react"

import { cn } from "@/lib/utils"

type StaggerFrom = "first" | "last" | "center" | number

export interface VariableFontHoverProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** The text, split into letters that animate one after another. */
  label: string
  /** font-variation-settings at rest, e.g. "'wght' 100, 'slnt' 0". */
  fromFontVariationSettings: string
  /** font-variation-settings while hovered. Same axes, same order as `from`. */
  toFontVariationSettings: string
  /** Seconds between neighbouring letters. */
  staggerDuration?: number
  /** Which letter moves first. */
  staggerFrom?: StaggerFrom
  transition?: AnimationOptions
}

/**
 * A headline whose letters glide between two variable-font settings on hover,
 * one after another. Needs a variable font that has the axes you animate.
 */
export function VariableFontHover({
  label,
  fromFontVariationSettings,
  toFontVariationSettings,
  staggerDuration = 0.03,
  staggerFrom = "first",
  transition = { type: "spring", duration: 0.7 },
  className,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: VariableFontHoverProps) {
  const [scope, animate] = useAnimate<HTMLSpanElement>()
  const letters = React.useMemo(() => Array.from(label), [label])

  const run = (settings: string) => {
    if (!scope.current) return
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    animate(
      scope.current.querySelectorAll("[data-vfh-letter]"),
      { fontVariationSettings: settings },
      reduce ? { duration: 0 } : { ...transition, delay: stagger(staggerDuration, { from: staggerFrom }) },
    )
  }

  return (
    <span
      ref={scope}
      className={cn("inline-block", className)}
      onPointerEnter={(e) => {
        run(toFontVariationSettings)
        onPointerEnter?.(e)
      }}
      onPointerLeave={(e) => {
        run(fromFontVariationSettings)
        onPointerLeave?.(e)
      }}
      onFocus={(e) => {
        run(toFontVariationSettings)
        onFocus?.(e)
      }}
      onBlur={(e) => {
        run(fromFontVariationSettings)
        onBlur?.(e)
      }}
      {...props}
    >
      <span className="sr-only">{label}</span>
      {letters.map((ch, i) => (
        <span
          key={i}
          aria-hidden="true"
          data-vfh-letter=""
          className="inline-block whitespace-pre"
          style={{ fontVariationSettings: fromFontVariationSettings }}
        >
          {ch}
        </span>
      ))}
    </span>
  )
}

export default VariableFontHover
