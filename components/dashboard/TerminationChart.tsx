"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import type { UnifiedGame } from "@/lib/unified/types"
import { useT } from "@/components/LanguageProvider"

interface Props {
  games: UnifiedGame[]
}

const COLORS = [
  "#10b981", "#3b82f6", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16",
]

export function TerminationChart({ games }: Props) {
  const { t } = useT()

  const counts = new Map<string, number>()

  for (const g of games) {
    const key = g.termination ?? "iné"
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  const data = Array.from(counts.entries())
    .sort(([, a], [, b]) => b - a)
    .map(([key, value]) => ({ name: t.terminations[key] ?? key, value }))

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>🏁 {t.howGamesEnd}</CardTitle></CardHeader>
        <p className="text-center text-sm text-[#4a5568] py-8">{t.noData}</p>
      </Card>
    )
  }

  const total = games.length

  return (
    <Card>
      <CardHeader>
        <CardTitle>🏁 {t.howGamesEnd}</CardTitle>
        <span className="text-xs text-[#4a5568]">{total} {t.games}</span>
      </CardHeader>
      <div className="flex items-center gap-2">
        <div className="h-52 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--foreground)" }}
                formatter={(value) => [`${value} (${((Number(value) / total) * 100).toFixed(1)}%)`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-1.5 pr-2 shrink-0 max-w-[140px]">
          {data.map((item, i) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
              <div className="min-w-0">
                <div className="truncate text-xs text-white capitalize">{item.name}</div>
                <div className="text-xs text-[#4a5568]">
                  {item.value} ({((item.value / total) * 100).toFixed(0)}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
