"use client"

import { Card } from "@/components/ui/card"
import { formatNumber } from "@/lib/utils"
import type { DashboardData } from "@/lib/unified/types"
import { useT } from "@/components/LanguageProvider"

interface Props {
  data: DashboardData
}

export function StatsCards({ data }: Props) {
  const { t } = useT()
  const { games, streaks } = data
  const wins = games.filter((g) => g.result === "win").length
  const losses = games.filter((g) => g.result === "loss").length
  const draws = games.filter((g) => g.result === "draw").length
  const withAccuracy = games.filter((g) => g.accuracy !== null)
  const avgAccuracy =
    withAccuracy.length > 0
      ? withAccuracy.reduce((s, g) => s + (g.accuracy ?? 0), 0) / withAccuracy.length
      : null

  const cards = [
    { label: t.totalGames, value: formatNumber(games.length), icon: "♟", color: "text-accent" },
    { label: t.wins, value: formatNumber(wins), icon: "✅", color: "text-success" },
    { label: t.losses, value: formatNumber(losses), icon: "❌", color: "text-danger" },
    { label: t.draws, value: formatNumber(draws), icon: "🤝", color: "text-muted" },
    {
      label: t.winStreak,
      value: streaks.currentWin > 0 ? `${streaks.currentWin}🔥` : "0",
      icon: "🏅",
      color: "text-warning",
    },
    {
      label: t.unbeatenStreak,
      value: streaks.currentUnbeaten > 0 ? `${streaks.currentUnbeaten}⚡` : "0",
      icon: "🛡",
      color: "text-accent",
    },
    ...(avgAccuracy !== null
      ? [{ label: t.avgAccuracy, value: `${avgAccuracy.toFixed(1)}%`, icon: "🎯", color: "text-warning" }]
      : []),
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      {cards.map((card) => (
        <Card key={card.label} className="flex flex-col items-center gap-1 p-4 text-center">
          <span className="text-2xl">{card.icon}</span>
          <div className={`text-xl font-bold ${card.color}`}>
            {card.value}
          </div>
          <div className="text-xs text-subtle">{card.label}</div>
        </Card>
      ))}
    </div>
  )
}
