"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface WebGLErrorBoundaryProps {
  fallback: React.ReactNode
  children: React.ReactNode
}

interface WebGLErrorBoundaryState {
  hasError: boolean
}

/** Catches a WebGL crash below it and shows the fallback instead of an empty box. */
export class WebGLErrorBoundary extends React.Component<WebGLErrorBoundaryProps, WebGLErrorBoundaryState> {
  state: WebGLErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): WebGLErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    if (typeof console !== "undefined") console.warn("AnimatedGradient: WebGL failed, showing the static fallback.", error)
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}

/** A still gradient for browsers without WebGL2. */
export function WebGLFallback({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      aria-hidden="true"
      className={cn(className)}
      style={{
        background:
          "radial-gradient(70% 60% at 70% 30%, rgba(242,92,158,.35), transparent 70%), radial-gradient(60% 70% at 20% 80%, rgba(138,31,85,.4), transparent 70%), #0e0c0f",
        ...style,
      }}
    />
  )
}
