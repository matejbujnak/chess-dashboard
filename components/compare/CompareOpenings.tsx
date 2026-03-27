"use client"

import { useT } from "@/components/LanguageProvider"
import type { DashboardData } from "@/lib/unified/types"

interface Props {
  a: DashboardData
  b: DashboardData
  nameA: string
  nameB: string
}

function OpeningList({
  data,
  color,
  name,
}: {
  data: DashboardData
  color: string
  name: string
}) {
  const top = data.openings.slice(0, 5)

  if (top.length === 0) {
    return (
      <div className="flex-1 rounded-xl border border-border bg-surface p-4">
        <div className="mb-3 text-sm font-semibold" style={{ color }}>{name}</div>
        <p className="text-xs text-subtle">—</p>
      </div>
    )
  }

  const maxGames = top[0].games

  return (
    <div className="flex-1 rounded-xl border border-border bg-surface p-4">
      <div className="mb-3 text-sm font-semibold" style={{ color }}>{name}</div>
      <div className="space-y-2">
        {top.map((o) => (
          <div key={o.eco}>
            <div className="flex items-center justify-between text-xs mb-0.5">
              <span className="text-foreground truncate max-w-[160px]" title={o.name}>{o.name}</span>
              <span className="ml-2 shrink-0 text-subtle">{o.games}g · {o.winRate.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-surface-alt overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(o.games / maxGames) * 100}%`,
                  background: color,
                  opacity: 0.7,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CompareOpenings({ a, b, nameA, nameB }: Props) {
  const { t } = useT()
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 font-semibold text-foreground">{t.openingsCompare}</h3>
      <div className="flex gap-3">
        <OpeningList data={a} color="#3b82f6" name={nameA} />
        <OpeningList data={b} color="#f59e0b" name={nameB} />
      </div>
    </div>
  )
}
