"use client"

import useSWR from "swr"
import type { DashboardData } from "@/lib/unified/types"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }))
    throw new Error(err.error ?? "Failed to fetch")
  }
  const data = await res.json()
  // Deserialize Date strings back to Date objects
  return deserializeDates(data) as DashboardData
}

// JSON serialization turns Date → string, convert back
function deserializeDates(obj: unknown): unknown {
  if (typeof obj === "string" && /^\d{4}-\d{2}-\d{2}T/.test(obj)) {
    return new Date(obj)
  }
  if (Array.isArray(obj)) return obj.map(deserializeDates)
  if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, deserializeDates(v)])
    )
  }
  return obj
}

export function useDashboardData(platform: string, username: string) {
  const key =
    platform === "chesscom"
      ? `/api/chesscom?username=${encodeURIComponent(username)}&months=12`
      : platform === "lichess"
      ? `/api/lichess?username=${encodeURIComponent(username)}&max=300`
      : null

  const { data, error, isLoading } = useSWR<DashboardData>(key, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 3_600_000,
  })

  return { data, error, isLoading }
}

export function useBothDashboardData(chesscomUsername: string, lichessUsername: string) {
  const chesscom = useSWR<DashboardData>(
    `/api/chesscom?username=${encodeURIComponent(chesscomUsername)}&months=12`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 3_600_000 }
  )
  const lichess = useSWR<DashboardData>(
    `/api/lichess?username=${encodeURIComponent(lichessUsername)}&max=300`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 3_600_000 }
  )
  return { chesscom, lichess }
}
