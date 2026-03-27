"use client"

import useSWR from "swr"
import type { DashboardData } from "@/lib/unified/types"
import { useT } from "@/components/LanguageProvider"
import { CompareProfileCards } from "./CompareProfileCards"
import { CompareRatingTable } from "./CompareRatingTable"
import { CompareRadarChart } from "./CompareRadarChart"
import { CompareRatingHistory } from "./CompareRatingHistory"
import { CompareWinLoss } from "./CompareWinLoss"
import { CompareOpenings } from "./CompareOpenings"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }))
    throw new Error(err.error ?? "Failed to fetch")
  }
  const data = await res.json()
  return deserializeDates(data) as DashboardData
}

function deserializeDates(obj: unknown): unknown {
  if (typeof obj === "string" && /^\d{4}-\d{2}-\d{2}T/.test(obj)) return new Date(obj)
  if (Array.isArray(obj)) return obj.map(deserializeDates)
  if (obj && typeof obj === "object")
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, deserializeDates(v)]))
  return obj
}

function apiUrl(platform: string, username: string) {
  if (platform === "chesscom") return `/api/chesscom?username=${encodeURIComponent(username)}&months=12`
  return `/api/lichess?username=${encodeURIComponent(username)}&max=1000`
}

interface Props {
  platformA: string
  usernameA: string
  platformB: string
  usernameB: string
}

function LoadingCard() {
  return (
    <div className="flex-1 rounded-xl border border-border bg-surface p-5 animate-pulse">
      <div className="mx-auto h-16 w-16 rounded-xl bg-surface-alt mb-3" />
      <div className="h-4 w-24 rounded bg-surface-alt mx-auto mb-2" />
      <div className="h-3 w-16 rounded bg-surface-alt mx-auto" />
    </div>
  )
}

export function CompareClient({ platformA, usernameA, platformB, usernameB }: Props) {
  const { t } = useT()

  const { data: dataA, error: errA } = useSWR<DashboardData>(
    apiUrl(platformA, usernameA),
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 3_600_000 }
  )
  const { data: dataB, error: errB } = useSWR<DashboardData>(
    apiUrl(platformB, usernameB),
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 3_600_000 }
  )

  const loadingA = !dataA && !errA
  const loadingB = !dataB && !errB

  if (errA || errB) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <p className="text-sm" style={{ color: "#ef4444" }}>
          {errA ? `${usernameA}: ${errA.message}` : `${usernameB}: ${errB!.message}`}
        </p>
      </div>
    )
  }

  if (loadingA || loadingB) {
    return (
      <div className="flex items-stretch gap-4">
        <LoadingCard />
        <div className="flex items-center justify-center">
          <span className="text-2xl font-bold text-subtle">{t.vsLabel}</span>
        </div>
        <LoadingCard />
      </div>
    )
  }

  if (!dataA || !dataB) return null

  const nameA = dataA.player.displayName
  const nameB = dataB.player.displayName

  return (
    <div className="space-y-6">
      <CompareProfileCards a={dataA} b={dataB} />
      <CompareRatingTable a={dataA} b={dataB} />
      <CompareRadarChart a={dataA} b={dataB} nameA={nameA} nameB={nameB} />
      <CompareRatingHistory a={dataA} b={dataB} nameA={nameA} nameB={nameB} />
      <CompareWinLoss a={dataA} b={dataB} nameA={nameA} nameB={nameB} />
      <CompareOpenings a={dataA} b={dataB} nameA={nameA} nameB={nameB} />
    </div>
  )
}
