import { CheckCircle2, Eye, Hand, Scissors } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import * as PricingCard from "@/components/ui/pricing-card"
import { cn } from "@/lib/utils"

type Line = { name: string; price: string }

type Plan = {
  icon: LucideIcon
  title: string
  badge: string
  from?: boolean
  price: string
  about: string
  included: string[]
  moreLabel: string
  more: Line[]
}

// Every figure below is copied from the salon's price list.
const PLANS: Plan[] = [
  {
    icon: Scissors,
    title: "Стрижки и окрашивание",
    badge: "Женская стрижка",
    from: true,
    price: "1 500",
    about: "Итог зависит от длины и густоты волос.",
    included: ["Короткие волосы: 1 500 ₽", "Средние волосы: 1 800 – 2 000 ₽", "Длинные волосы: 3 500 – 4 000 ₽"],
    moreLabel: "Ещё для волос",
    more: [
      { name: "Окрашивание корней", price: "от 2 000 ₽" },
      { name: "Полное окрашивание", price: "от 3 000 ₽" },
      { name: "Мелирование", price: "от 3 800 ₽" },
    ],
  },
  {
    icon: Hand,
    title: "Ногтевой сервис",
    badge: "Снятие в подарок",
    price: "2 300",
    about: "Комплекс: маникюр и покрытие гель лак.",
    included: ["Маникюр", "Покрытие гель лак", "Снятие старого покрытия в подарок"],
    moreLabel: "Ещё для ногтей",
    more: [
      { name: "Наращивание + гель лак", price: "3 500 ₽" },
      { name: "Коррекция наращенных ногтей", price: "2 800 ₽" },
      { name: "Парафин", price: "500 ₽" },
    ],
  },
  {
    icon: Eye,
    title: "Ресницы и брови",
    badge: "Комплекс 2",
    price: "3 800",
    about: "Ламинирование ресниц и бровей с покраской и коррекцией.",
    included: ["Ламинирование ресниц", "Ламинирование бровей", "Покраска", "Коррекция бровей"],
    moreLabel: "По отдельности",
    more: [
      { name: "Ламинирование ресниц", price: "2 000 ₽" },
      { name: "Ламинирование бровей с коррекцией", price: "1 700 ₽" },
      { name: "Коррекция бровей", price: "600 ₽" },
    ],
  },
]

const surface = "bg-white/60 dark:bg-white/60"

export function SakuraPricing() {
  return (
    <div className="grid justify-items-center gap-5 md:grid-cols-3 md:items-start">
      {PLANS.map((p) => (
        <PricingCard.Card key={p.title} className={cn("max-w-sm text-foreground", surface)}>
          <PricingCard.Header className="bg-[#fbf3ef]/90 dark:bg-[#fbf3ef]/90">
            <PricingCard.Plan className="mb-6 gap-3">
              <PricingCard.PlanName className="text-foreground">
                <p.icon aria-hidden="true" className="text-[#b9806a]" />
                <span>{p.title}</span>
              </PricingCard.PlanName>
              <PricingCard.Badge className="shrink-0 border-[#b9806a]/45 text-[#b9806a]">{p.badge}</PricingCard.Badge>
            </PricingCard.Plan>
            <PricingCard.Price>
              {p.from && <PricingCard.Period className="pb-1.5">от</PricingCard.Period>}
              <PricingCard.MainPrice className="sk-price text-5xl text-[#b9806a]">
                {p.price}
              </PricingCard.MainPrice>
              <PricingCard.Period className="pb-1.5">₽</PricingCard.Period>
            </PricingCard.Price>
            <PricingCard.Description className="mb-4 text-sm">{p.about}</PricingCard.Description>
            <Button
              asChild
              className={cn(
                "h-11 w-full rounded-full font-semibold text-white",
                "bg-gradient-to-b from-[#d4a08a] to-[#b9806a] shadow-[0_10px_25px_rgba(185,128,106,0.3)] hover:opacity-90",
              )}
            >
              <a href="tel:+79526920505">Записаться</a>
            </Button>
          </PricingCard.Header>
          <PricingCard.Body>
            <PricingCard.List>
              {p.included.map((item) => (
                <PricingCard.ListItem key={item}>
                  <span className="mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-[#b9806a]" aria-hidden="true" />
                  </span>
                  <span>{item}</span>
                </PricingCard.ListItem>
              ))}
            </PricingCard.List>
            <PricingCard.Separator>{p.moreLabel}</PricingCard.Separator>
            <PricingCard.List>
              {p.more.map((l) => (
                <PricingCard.ListItem key={l.name} className="justify-between">
                  <span>{l.name}</span>
                  <span className="shrink-0 font-mono text-xs text-foreground/80">{l.price}</span>
                </PricingCard.ListItem>
              ))}
            </PricingCard.List>
          </PricingCard.Body>
        </PricingCard.Card>
      ))}
    </div>
  )
}
