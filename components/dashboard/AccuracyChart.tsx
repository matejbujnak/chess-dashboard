"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import type { UnifiedGame } from "@/lib/unified/types"
import { format } from "date-fns"
import { useT } from "@/components/LanguageProvider"

interface Props {
  games: UnifiedGame[]
}

export function AccuracyChart({ games }: Props) {
  const { t } = useT()

  const withAccuracy = games
    .filter((g) => g.accuracy !== null)
    .sort((a, b) => a.playedAt.getTime() - b.playedAt.getTime())
    .slice(-100) // last 100

  if (withAccuracy.length < 5) {
    return (
      <Card>
        <CardHeader><CardTitle>🎯 {t.moveAccuracy}</CardTitle></CardHeader>
        <p className="text-center text-sm text-[#4a5568] py-8">
          {t.accuracyChesscomOnly}
        </p>
      </Card>
    )
  }

  const avg = withAccuracy.reduce((s, g) => s + (g.accuracy ?? 0), 0) / withAccuracy.length

  const data = withAccuracy.map((g) => ({
    date: format(g.playedAt, "d MMM"),
    accuracy: parseFloat((g.accuracy ?? 0).toFixed(1)),
    result: g.result,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>🎯 {t.moveAccuracy}</CardTitle>
        <span className="text-sm text-[#a0aec0]">
          {t.average}: <span className="text-[#3b82f6] font-semibold">{avg.toFixed(1)}%</span>
        </span>
      </CardHeader>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" tick={{ fill: "var(--subtle)", fontSize: 10 }} interval="preserveStartEnd" />
            <YAxis domain={[0, 100]} tick={{ fill: "var(--subtle)", fontSize: 11 }} />
            <ReferenceLine y={avg} stroke="#3b82f6" strokeDasharray="5 5" strokeWidth={1} />
            <Tooltip
              contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--foreground)" }}
              formatter={(v) => [`${v}%`, t.moveAccuracy]}
            />
            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="#f59e0b"
              dot={{ r: 2, fill: "#f59e0b" }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
