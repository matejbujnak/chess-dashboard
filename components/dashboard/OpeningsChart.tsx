"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import type { OpeningStat, UnifiedGame } from "@/lib/unified/types"
import { useT } from "@/components/LanguageProvider"
import { OpeningDetail } from "./OpeningDetail"

interface Props {
  openings: OpeningStat[]
  games: UnifiedGame[]
}

interface SelectedOpening {
  eco: string
  name: string
}

export function OpeningsChart({ openings, games }: Props) {
  const { t } = useT()
  const [view, setView] = useState<"games" | "winrate">("games")
  const [selected, setSelected] = useState<SelectedOpening | null>(null)

  const top10 = openings.slice(0, 10)

  const data = top10.map((o) => ({
    name: o.name.length > 20 ? o.name.slice(0, 20) + "…" : o.name,
    fullName: o.name,
    games: o.games,
    winRate: parseFloat(o.winRate.toFixed(1)),
    wins: o.wins,
    losses: o.losses,
    draws: o.draws,
    eco: o.eco,
  }))

  if (openings.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>♟ {t.topOpenings}</CardTitle></CardHeader>
        <p className="text-center text-sm text-[#4a5568] py-8">{t.noOpeningData}</p>
      </Card>
    )
  }

  function handleBarClick(entry: typeof data[number]) {
    if (selected?.eco === entry.eco && selected?.name === entry.fullName) {
      setSelected(null) // toggle off
    } else {
      setSelected({ eco: entry.eco, name: entry.fullName })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>♟ {t.topOpenings}</CardTitle>
        <div className="flex gap-2">
          {(["games", "winrate"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="rounded-full px-2.5 py-0.5 text-xs transition-all"
              style={{
                background: view === v ? "#3b82f620" : "transparent",
                color: view === v ? "#3b82f6" : "#4a5568",
                border: `1px solid ${view === v ? "#3b82f6" : "#2d3748"}`,
              }}
            >
              {v === "games" ? t.count : "Win%"}
            </button>
          ))}
        </div>
      </CardHeader>

      <p className="px-4 pb-1 text-xs text-muted italic">{t.clickOpening}</p>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 0, right: 20, top: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: "var(--subtle)", fontSize: 11 }}
              domain={view === "winrate" ? [0, 100] : undefined}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "var(--muted)", fontSize: 10 }}
              width={130}
            />
            <Tooltip
              contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--foreground)" }}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ""}
              formatter={(value, name) =>
                view === "winrate" ? [`${value}%`, "Win rate"] : [value, t.count]
              }
            />
            <Bar
              dataKey={view === "games" ? "games" : "winRate"}
              radius={[0, 4, 4, 0]}
              cursor="pointer"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={(rectItem: any) => handleBarClick(rectItem as typeof data[number])}
            >
              {data.map((entry, i) => {
                const isSelected = selected?.eco === entry.eco && selected?.name === entry.fullName
                return (
                  <Cell
                    key={i}
                    fill={
                      view === "winrate"
                        ? entry.winRate > 55
                          ? "#10b981"
                          : entry.winRate > 45
                          ? "#f59e0b"
                          : "#ef4444"
                        : "#3b82f6"
                    }
                    opacity={selected && !isSelected ? 0.4 : 1}
                    stroke={isSelected ? "var(--foreground)" : "transparent"}
                    strokeWidth={isSelected ? 1.5 : 0}
                  />
                )
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="px-4 pb-4">
          <OpeningDetail
            eco={selected.eco}
            name={selected.name}
            games={games}
            onClose={() => setSelected(null)}
          />
        </div>
      )}
    </Card>
  )
}
