import * as React from "react"
import { createRoot } from "react-dom/client"

import { AnimatedGradient } from "@/components/ui/animated-gradient"
import AnimatedText from "@/components/ui/animated-text"
import { MotionConfig } from "motion/react"
import { SakuraPricing } from "./sakura-pricing"

// One shared, slowly flowing backdrop behind the whole page. Still for reduced-motion visitors.
function SiteBackground() {
  const still = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  return (
    <AnimatedGradient
      config={{
        preset: "custom",
        color1: "#f8f0ea",
        color2: "#f1dcd6",
        color3: "#e6b9c0",
        rotation: -45,
        proportion: 60,
        scale: 0.6,
        speed: still ? 0 : 10,
        distortion: 40,
        swirl: 80,
        swirlIterations: 10,
        softness: 100,
        offset: 200,
        shape: "Edge",
        shapeSize: 50,
      }}
      noise={{ opacity: 0.12 }}
    />
  )
}

const mount = (id: string, node: React.ReactNode) => {
  const el = document.getElementById(id)
  if (el) createRoot(el).render(<React.StrictMode>{node}</React.StrictMode>)
}

mount("bg-root", <SiteBackground />)
mount("popular-root", <SakuraPricing />)

// Section headings: when one scrolls into view, its caps line rises letter by letter
// and its italic echo follows word by word. Phones get words for both, so no word breaks mid-way.
function animateHeadings() {
  const narrow = window.matchMedia("(max-width: 720px)").matches
  const heads = Array.from(document.querySelectorAll<HTMLElement>("main section:not(.hero) h2:not(.dcf-sr), .hero h1"))
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        io.unobserve(e.target)
        const h = e.target as HTMLElement
        const em = h.querySelector("em")
        const echo = em?.textContent?.trim() ?? ""
        const main = Array.from(h.childNodes)
          .filter((n) => n.nodeType === Node.TEXT_NODE)
          .map((n) => n.textContent ?? "")
          .join("")
          .trim()
        h.setAttribute("aria-label", echo ? main + " " + echo : main)
        h.textContent = ""
        const lead = document.createElement("span")
        lead.setAttribute("aria-hidden", "true")
        lead.className = "at-lead"
        h.appendChild(lead)
        let tail: HTMLElement | null = null
        if (echo) {
          tail = document.createElement("em")
          tail.setAttribute("aria-hidden", "true")
          h.appendChild(tail)
        }
        h.style.opacity = ""
        // letters rise one by one, but each word stays one unbreakable box, so lines only wrap between words
        const words = main.split(/\s+/).filter(Boolean)
        const step = narrow ? 0.08 : 0.04
        let before = 0
        createRoot(lead).render(
          <MotionConfig reducedMotion="user">
            {narrow ? (
              <AnimatedText text={main} className="" animationType="words" staggerDelay={step} duration={0.6} initialY={18} />
            ) : (
              words.map((w, i) => {
                const delay = before * step
                before += w.length
                return (
                  <React.Fragment key={i}>
                    <span className="inline-block whitespace-nowrap">
                      <AnimatedText text={w} className="inline-block" animationType="letters" delay={delay} staggerDelay={step} duration={0.6} initialY={18} />
                    </span>
                    {i < words.length - 1 ? " " : null}
                  </React.Fragment>
                )
              })
            )}
          </MotionConfig>,
        )
        if (tail)
          createRoot(tail).render(
            <MotionConfig reducedMotion="user">
              <AnimatedText text={echo} className="" animationType="words" delay={main.length * (narrow ? 0.02 : 0.04)} staggerDelay={0.09} duration={0.7} initialY={12} />
            </MotionConfig>,
          )
      }
    },
    { threshold: 0.35 },
  )
  for (const h of heads) {
    h.classList.remove("rv")
    h.style.opacity = "0"
    io.observe(h)
  }
}

animateHeadings()
