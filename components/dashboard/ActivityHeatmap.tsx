"use client"

import { useTheme } from "next-themes"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import type { HeatmapCell } from "@/lib/unified/types"
import { useT } from "@/components/LanguageProvider"

interface Props {
  heatmap: HeatmapCell[]
}

const DARK_SCALE  = ["#1a1f2e", "#1d3557", "#1a5276", "#1565a0", "#1d6fa5", "#3b82f6"]
const LIGHT_SCALE = ["#e2e8f0", "#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6", "#1d4ed8"]

function getIntensity(count: number, max: number, isDark: boolean): string {
  const scale = isDark ? DARK_SCALE : LIGHT_SCALE
  if (count === 0) return scale[0]
  const ratio = count / max
  if (ratio < 0.2) return scale[1]
  if (ratio < 0.4) return scale[2]
  if (ratio < 0.6) return scale[3]
  if (ratio < 0.8) return scale[4]
  return scale[5]
}

export function ActivityHeatmap({ heatmap }: Props) {
  const { t } = useT()
  const { theme } = useTheme()
  const isDark = theme !== "light"
  const scale = isDark ? DARK_SCALE : LIGHT_SCALE
  const DAYS = t.days

  const max = Math.max(...heatmap.map((c) => c.count), 1)

  // Group by day
  const byDay: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0))
  for (const cell of heatmap) {
    byDay[cell.day][cell.hour] = cell.count
  }

  const totalGames = heatmap.reduce((s, c) => s + c.count, 0)

  if (totalGames === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>🔥 {t.activityTitle}</CardTitle></CardHeader>
        <p className="text-center text-sm text-subtle py-8">{t.noActivity}</p>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔥 {t.activityTitle}</CardTitle>
        <span className="text-xs text-subtle">{totalGames} {t.games}</span>
      </CardHeader>
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Hour labels */}
          <div className="mb-1 ml-8 grid gap-px" style={{ gridTemplateColumns: "repeat(24, 1fr)" }}>
            {Array.from({ length: 24 }, (_, i) => (
              <div key={i} className="text-center text-[9px] text-subtle">
                {i % 3 === 0 ? i : ""}
              </div>
            ))}
          </div>

          {/* Grid */}
          {DAYS.map((day, di) => (
            <div key={day} className="mb-px flex items-center gap-1">
              <div className="w-7 shrink-0 text-right text-[10px] text-muted">{day}</div>
              <div className="grid flex-1 gap-px" style={{ gridTemplateColumns: "repeat(24, 1fr)" }}>
                {byDay[di].map((count, hour) => (
                  <div
                    key={hour}
                    title={`${day} ${hour}:00 — ${count} ${t.games}`}
                    className="aspect-square rounded-[2px] cursor-default"
                    style={{ background: getIntensity(count, max, isDark) }}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="mt-3 flex items-center justify-end gap-1 text-[10px] text-subtle">
            <span>{t.less}</span>
            {scale.map((c) => (
              <div key={c} className="h-3 w-4 rounded-[2px]" style={{ background: c }} />
            ))}
            <span>{t.more}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
