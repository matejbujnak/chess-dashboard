"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import type { UnifiedGame } from "@/lib/unified/types"
import { useT } from "@/components/LanguageProvider"

interface Props {
  games: UnifiedGame[]
}

export function WinLossChart({ games }: Props) {
  const { t } = useT()

  const wins = games.filter((g) => g.result === "win").length
  const losses = games.filter((g) => g.result === "loss").length
  const draws = games.filter((g) => g.result === "draw").length
  const total = games.length

  const data = [
    { name: t.wins, value: wins, color: "#10b981" },
    { name: t.losses, value: losses, color: "#ef4444" },
    { name: t.draws, value: draws, color: "#a0aec0" },
  ].filter((d) => d.value > 0)

  if (total === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>🏆 {t.gameResults}</CardTitle></CardHeader>
        <p className="text-center text-sm text-subtle py-8">{t.noGames}</p>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🏆 {t.gameResults}</CardTitle>
        <span className="text-xs text-subtle">{total} {t.games}</span>
      </CardHeader>
      <div className="flex items-center gap-4">
        <div className="h-48 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--foreground)" }}
                formatter={(value, name) => [
                  `${value} (${((Number(value) / total) * 100).toFixed(1)}%)`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3 pr-2">
          {[
            { label: t.wins, value: wins, color: "#10b981" },
            { label: t.losses, value: losses, color: "#ef4444" },
            { label: t.draws, value: draws, color: "#a0aec0" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ background: item.color }} />
              <div>
                <div className="text-sm font-semibold text-foreground">{item.value}</div>
                <div className="text-xs text-muted">
                  {item.label} ({((item.value / total) * 100).toFixed(0)}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
