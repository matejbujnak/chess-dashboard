import type { LichessUser, LichessRatingHistoryEntry, LichessGame } from "./types"
import type { UnifiedPlayer, UnifiedRating, UnifiedGame, UnifiedRatingPoint, TimeControl } from "../unified/types"

export async function fetchLichessUser(username: string): Promise<LichessUser> {
  const res = await fetch(`https://lichess.org/api/user/${username}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error(`Lichess user not found: ${username}`)
  return res.json()
}

export async function fetchLichessRatingHistory(username: string): Promise<LichessRatingHistoryEntry[]> {
  const res = await fetch(`https://lichess.org/api/user/${username}/rating-history`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error(`Lichess rating history not found`)
  return res.json()
}

export async function fetchLichessGames(username: string, max = 300): Promise<LichessGame[]> {
  const res = await fetch(
    `https://lichess.org/api/games/user/${username}?max=${max}&opening=true&moves=false&clocks=false&evals=false`,
    {
      headers: { Accept: "application/x-ndjson" },
      signal: AbortSignal.timeout(15000),
    }
  )
  if (!res.ok) throw new Error(`Lichess games not found`)
  const text = await res.text()
  return text
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      try {
        return JSON.parse(line) as LichessGame
      } catch {
        return null
      }
    })
    .filter((g): g is LichessGame => g !== null)
}

export function normalizeLichessUser(raw: LichessUser): UnifiedPlayer {
  const name = [raw.profile?.firstName, raw.profile?.lastName].filter(Boolean).join(" ")
  return {
    username: raw.username,
    displayName: name || raw.username,
    avatarUrl: null, // Lichess has no avatars
    country: raw.profile?.country ?? null,
    joinedAt: raw.createdAt ? new Date(raw.createdAt) : null,
    lastOnlineAt: raw.seenAt ? new Date(raw.seenAt) : null,
    isOnline: raw.online ?? false,
    title: raw.title ?? null,
    platform: "lichess",
    profileUrl: `https://lichess.org/@/${raw.username}`,
    followers: raw.nbFollowers,
  }
}

const PERF_MAP: Record<string, { tc: TimeControl; label: string }> = {
  ultraBullet: { tc: "bullet", label: "Ultrabullet" },
  bullet: { tc: "bullet", label: "Bullet" },
  blitz: { tc: "blitz", label: "Blitz" },
  rapid: { tc: "rapid", label: "Rapid" },
  classical: { tc: "classical", label: "Classical" },
  correspondence: { tc: "correspondence", label: "Correspondence" },
  puzzle: { tc: "puzzle", label: "Puzzles" },
}

export function normalizeLichessRatings(raw: LichessUser): UnifiedRating[] {
  return Object.entries(PERF_MAP)
    .filter(([key]) => raw.perfs[key as keyof typeof raw.perfs])
    .map(([key, meta]) => {
      const perf = raw.perfs[key as keyof typeof raw.perfs]!
      return {
        timeControl: meta.tc,
        label: meta.label,
        current: perf.rating,
        best: null,
        wins: 0,
        losses: 0,
        draws: 0,
        total: perf.games,
      }
    })
    .filter((r) => r.total > 0 || r.timeControl === "puzzle")
}

export function normalizeLichessRatingHistory(data: LichessRatingHistoryEntry[]): UnifiedRatingPoint[] {
  const points: UnifiedRatingPoint[] = []
  const wanted = new Set(["Bullet", "Blitz", "Rapid", "Classical"])

  for (const entry of data) {
    if (!wanted.has(entry.name)) continue
    const tc = entry.name.toLowerCase() as TimeControl
    for (const [year, month, day, rating] of entry.points) {
      points.push({ date: new Date(year, month, day), rating, timeControl: tc })
    }
  }

  return points.sort((a, b) => a.date.getTime() - b.date.getTime())
}

export function normalizeLichessGames(games: LichessGame[], username: string): UnifiedGame[] {
  const lowerId = username.toLowerCase()

  return games
    .filter((g) => g.players.white.user || g.players.black.user)
    .map((g) => {
      const isWhite = g.players.white.user?.id?.toLowerCase() === lowerId || g.players.white.user?.name?.toLowerCase() === lowerId
      const user = isWhite ? g.players.white : g.players.black
      const opponent = isWhite ? g.players.black : g.players.white

      let result: "win" | "loss" | "draw"
      if (!g.winner) result = "draw"
      else if ((g.winner === "white") === isWhite) result = "win"
      else result = "loss"

      const speedToTc: Record<string, TimeControl> = {
        ultraBullet: "bullet",
        bullet: "bullet",
        blitz: "blitz",
        rapid: "rapid",
        classical: "classical",
        correspondence: "correspondence",
      }

      const tc: string = g.clock ? `${g.clock.initial}+${g.clock.increment}` : g.speed

      const lichessTermMap: Record<string, string> = {
        mate: "checkmate", resign: "resignation", outoftime: "timeout", draw: "draw",
        stalemate: "stalemate", aborted: "aborted", cheat: "cheat",
        noStart: "abandoned", variantEnd: "stalemate",
      }
      const termination = lichessTermMap[g.status] ?? g.status ?? null

      return {
        id: g.id,
        platform: "lichess" as const,
        playedAt: new Date(g.createdAt),
        timeControl: tc,
        timeClass: speedToTc[g.speed] ?? "rapid",
        userColor: isWhite ? ("white" as const) : ("black" as const),
        result,
        termination,
        opponentUsername: opponent.user?.name ?? opponent.user?.id ?? "AI",
        opponentRating: opponent.rating ?? 0,
        userRating: user.rating ?? 0,
        openingEco: g.opening?.eco ?? null,
        openingName: g.opening?.name ?? null,
        accuracy: null,
      }
    })
}
