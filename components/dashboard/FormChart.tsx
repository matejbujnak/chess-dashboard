"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import type { UnifiedGame } from "@/lib/unified/types"

interface Props {
  games: UnifiedGame[]
}

const WINDOWS = [10, 20, 50]

function buildFormData(games: UnifiedGame[], window: number) {
  const sorted = [...games].sort((a, b) => a.playedAt.getTime() - b.playedAt.getTime())

  return sorted
    .map((_, i) => {
      if (i < window - 1) return null
      const slice = sorted.slice(i - window + 1, i + 1)
      const wins = slice.filter((g) => g.result === "win").length
      const winRate = (wins / window) * 100
      return {
        game: i + 1,
        winRate: parseFloat(winRate.toFixed(1)),
        date: sorted[i].playedAt.toLocaleDateString("sk-SK", { day: "numeric", month: "short" }),
      }
    })
    .filter((d): d is NonNullable<typeof d> => d !== null)
}

export function FormChart({ games }: Props) {
  const [window, setWindow] = useState(20)

  const data = buildFormData(games, window)
  const lastWr = data.at(-1)?.winRate ?? 0
  const trend = data.length >= 2 ? lastWr - (data.at(-Math.min(10, data.length))?.winRate ?? lastWr) : 0

  if (games.length < 10) {
    return (
      <Card>
        <CardHeader><CardTitle>📊 Forma</CardTitle></CardHeader>
        <p className="text-center text-sm text-[#4a5568] py-8">Málo partií pre výpočet formy</p>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 Forma (rolling win rate)</CardTitle>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {WINDOWS.map((w) => (
              <button
                key={w}
                onClick={() => setWindow(w)}
                className="rounded px-2 py-0.5 text-xs transition-all"
                style={{
                  background: window === w ? "#3b82f620" : "transparent",
                  color: window === w ? "#3b82f6" : "#4a5568",
                  border: `1px solid ${window === w ? "#3b82f6" : "#2d3748"}`,
                }}
              >
                {w} hier
              </button>
            ))}
          </div>
          <span className="text-xs">
            <span className="text-[#a0aec0]">Aktuálne: </span>
            <span className="font-bold" style={{ color: lastWr >= 50 ? "#10b981" : "#ef4444" }}>
              {lastWr}%
            </span>
            {data.length >= 2 && (
              <span className="ml-1" style={{ color: trend >= 0 ? "#10b981" : "#ef4444" }}>
                {trend >= 0 ? "↑" : "↓"} {Math.abs(trend).toFixed(1)}%
              </span>
            )}
          </span>
        </div>
      </CardHeader>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
            <XAxis dataKey="date" tick={{ fill: "#4a5568", fontSize: 10 }} interval={Math.floor(data.length / 8)} />
            <YAxis domain={[0, 100]} tick={{ fill: "#4a5568", fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
            <ReferenceLine y={50} stroke="#4a5568" strokeDasharray="5 5" />
            <Tooltip
              contentStyle={{ background: "#1a1f2e", border: "1px solid #2d3748", borderRadius: 8 }}
              formatter={(v) => [`${v}%`, `Win rate (posl. ${window})`]}
              labelStyle={{ color: "#a0aec0" }}
            />
            <Line
              type="monotone"
              dataKey="winRate"
              stroke="#3b82f6"
              dot={false}
              strokeWidth={2.5}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
