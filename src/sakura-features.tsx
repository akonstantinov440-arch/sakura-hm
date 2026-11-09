import { Gem, HeartHandshake, Scissors } from "lucide-react"

import { cn } from "@/lib/utils"

// The salon's three promises from its price list, laid out like FeatureVelocity's cards:
// icon tile, mono label, heavy caps title, and a tinted wash that rises on hover.
const CARDS = [
  {
    title: "Мастера",
    label: "Профессиональные",
    text: "Стрижки, окрашивание, маникюр, ресницы и брови делают мастера салона.",
    color: "from-[#f6b4d2]/25",
    icon: Scissors,
  },
  {
    title: "Материалы",
    label: "Качественные",
    text: "Краски, гель-лаки и всё остальное, что остаётся на ваших волосах и ногтях.",
    color: "from-[#e8457f]/25",
    icon: Gem,
  },
  {
    title: "Забота",
    label: "О вашей красоте",
    text: "Итоговая цена зависит от длины и густоты волос и от сложности работы. Это сказано в прайсе, а не в мелком шрифте.",
    color: "from-[#ffd0e4]/20",
    icon: HeartHandshake,
  },
]

export function SakuraFeatures() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {CARDS.map((card) => (
        <div
          key={card.title}
          className="group relative overflow-hidden rounded-2xl border border-[#b9806a]/20 bg-white/60 p-8 backdrop-blur-md transition-all duration-500 hover:border-[#b9806a]/45 md:p-10 lg:p-12"
        >
          <div
            className={cn(
              "absolute inset-0 bg-linear-to-br to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100",
              card.color,
            )}
          />
          <div className="relative z-10 flex flex-col gap-12 lg:gap-16">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-[#f3e2dc]">
              <card.icon className="size-6 text-[#b9806a]" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-mono text-[10px] tracking-[0.3em] text-[#8a6f66] uppercase">{card.label}</span>
              <h3 className="text-3xl font-black tracking-tighter text-[#4a3530] uppercase" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#8a6f66]">{card.text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
