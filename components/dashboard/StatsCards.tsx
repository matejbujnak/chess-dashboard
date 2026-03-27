import { Card } from "@/components/ui/card"
import { formatNumber } from "@/lib/utils"
import type { DashboardData } from "@/lib/unified/types"

interface Props {
  data: DashboardData
}

export function StatsCards({ data }: Props) {
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
    { label: "Celkovo partií", value: formatNumber(games.length), icon: "♟", color: "#3b82f6" },
    { label: "Výhry", value: formatNumber(wins), icon: "✅", color: "#10b981" },
    { label: "Prehry", value: formatNumber(losses), icon: "❌", color: "#ef4444" },
    { label: "Remízy", value: formatNumber(draws), icon: "🤝", color: "#a0aec0" },
    {
      label: "Win streak",
      value: streaks.currentWin > 0 ? `${streaks.currentWin}🔥` : "0",
      icon: "🏅",
      color: "#f59e0b",
    },
    {
      label: "Unbeaten streak",
      value: streaks.currentUnbeaten > 0 ? `${streaks.currentUnbeaten}⚡` : "0",
      icon: "🛡",
      color: "#8b5cf6",
    },
    ...(avgAccuracy !== null
      ? [{ label: "Priem. presnosť", value: `${avgAccuracy.toFixed(1)}%`, icon: "🎯", color: "#f59e0b" }]
      : []),
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      {cards.map((card) => (
        <Card key={card.label} className="flex flex-col items-center gap-1 p-4 text-center">
          <span className="text-2xl">{card.icon}</span>
          <div className="text-xl font-bold" style={{ color: card.color }}>
            {card.value}
          </div>
          <div className="text-xs text-[#4a5568]">{card.label}</div>
        </Card>
      ))}
    </div>
  )
}
