"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { useT } from "@/components/LanguageProvider"
import type { DashboardData } from "@/lib/unified/types"

interface Props {
  a: DashboardData
  b: DashboardData
  nameA: string
  nameB: string
}

export function CompareWinLoss({ a, b, nameA, nameB }: Props) {
  const { t } = useT()

  function stats(data: DashboardData) {
    const total = data.games.length
    const wins = data.games.filter((g) => g.result === "win").length
    const losses = data.games.filter((g) => g.result === "loss").length
    const draws = data.games.filter((g) => g.result === "draw").length
    return {
      wr: total > 0 ? +((wins / total) * 100).toFixed(1) : 0,
      lr: total > 0 ? +((losses / total) * 100).toFixed(1) : 0,
      dr: total > 0 ? +((draws / total) * 100).toFixed(1) : 0,
    }
  }

  const sA = stats(a)
  const sB = stats(b)

  const chartData = [
    { name: t.wins,   a: sA.wr, b: sB.wr },
    { name: t.losses, a: sA.lr, b: sB.lr },
    { name: t.draws,  a: sA.dr, b: sB.dr },
  ]

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 font-semibold text-foreground">{t.winLossCompare}</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fill: "var(--muted)", fontSize: 11 }} />
            <YAxis
              tick={{ fill: "var(--muted)", fontSize: 10 }}
              width={32}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "var(--foreground)",
              }}
              formatter={(v) => [`${v}%`]}
            />
            <Bar dataKey="a" name={nameA} fill="#3b82f6" radius={[3, 3, 0, 0]} />
            <Bar dataKey="b" name={nameB} fill="#f59e0b" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Summary row */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        {[
          { name: nameA, s: sA, color: "#3b82f6" },
          { name: nameB, s: sB, color: "#f59e0b" },
        ].map(({ name, s, color }) => (
          <div key={name} className="rounded-lg bg-surface-alt p-3">
            <div className="mb-1 font-semibold" style={{ color }}>{name}</div>
            <div className="flex justify-between text-subtle">
              <span>{t.wins}</span><span className="text-success">{s.wr}%</span>
            </div>
            <div className="flex justify-between text-subtle">
              <span>{t.losses}</span><span style={{ color: "#ef4444" }}>{s.lr}%</span>
            </div>
            <div className="flex justify-between text-subtle">
              <span>{t.draws}</span><span>{s.dr}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
