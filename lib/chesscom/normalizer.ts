import type { ChessComProfile, ChessComStats, ChessComGame } from "./types"
import type { UnifiedPlayer, UnifiedRating, UnifiedGame, TimeControl } from "../unified/types"

const UA = "ChessDashboard/1.0"

export async function fetchChessComProfile(username: string): Promise<ChessComProfile> {
  const res = await fetch(`https://api.chess.com/pub/player/${username}`, {
    headers: { "User-Agent": UA },
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`Chess.com profile not found: ${username}`)
  return res.json()
}

export async function fetchChessComStats(username: string): Promise<ChessComStats> {
  const res = await fetch(`https://api.chess.com/pub/player/${username}/stats`, {
    headers: { "User-Agent": UA },
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`Chess.com stats not found: ${username}`)
  return res.json()
}

export async function fetchChessComGames(username: string, months = 3): Promise<ChessComGame[]> {
  const archRes = await fetch(`https://api.chess.com/pub/player/${username}/games/archives`, {
    headers: { "User-Agent": UA },
  })
  if (!archRes.ok) throw new Error(`Chess.com archives not found`)
  const { archives } = await archRes.json()
  const recent = (archives as string[]).slice(-months)

  const results = await Promise.allSettled(
    recent.map((url) =>
      fetch(url, { headers: { "User-Agent": UA } }).then((r) => r.json())
    )
  )

  return results
    .filter((r): r is PromiseFulfilledResult<{ games: ChessComGame[] }> => r.status === "fulfilled")
    .flatMap((r) => r.value.games ?? [])
}

function parseOpeningFromEco(ecoUrl?: string): { eco: string | null; name: string | null } {
  if (!ecoUrl) return { eco: null, name: null }
  const parts = ecoUrl.split("/")
  const slug = parts[parts.length - 1] ?? ""
  const ecoMatch = slug.match(/^([A-E]\d{2})/)
  const eco = ecoMatch ? ecoMatch[1] : null
  const name = slug
    .replace(/^[A-E]\d{2}-/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
  return { eco, name: name || null }
}

function getCountryCode(countryUrl: string): string | null {
  const parts = countryUrl.split("/")
  return parts[parts.length - 1] ?? null
}

export function normalizeChessComProfile(raw: ChessComProfile): UnifiedPlayer {
  return {
    username: raw.username,
    displayName: raw.name ?? raw.username,
    avatarUrl: raw.avatar ?? null,
    country: raw.country ? getCountryCode(raw.country) : null,
    joinedAt: raw.joined ? new Date(raw.joined * 1000) : null,
    lastOnlineAt: raw.last_online ? new Date(raw.last_online * 1000) : null,
    isOnline: raw.status === "online",
    title: raw.title ?? null,
    platform: "chesscom",
    profileUrl: raw.url,
    followers: raw.followers,
  }
}

const TIME_CONTROL_MAP: Record<string, { tc: TimeControl; label: string }> = {
  chess_bullet: { tc: "bullet", label: "Bullet" },
  chess_blitz: { tc: "blitz", label: "Blitz" },
  chess_rapid: { tc: "rapid", label: "Rapid" },
  chess_daily: { tc: "daily", label: "Daily" },
}

export function normalizeChessComStats(raw: ChessComStats): UnifiedRating[] {
  const ratings: UnifiedRating[] = []

  for (const [key, meta] of Object.entries(TIME_CONTROL_MAP)) {
    const stat = raw[key as keyof ChessComStats] as
      | { last: { rating: number }; best?: { rating: number }; record: { win: number; loss: number; draw: number } }
      | undefined
    if (!stat) continue
    const total = stat.record.win + stat.record.loss + stat.record.draw
    ratings.push({
      timeControl: meta.tc,
      label: meta.label,
      current: stat.last.rating,
      best: stat.best?.rating ?? null,
      wins: stat.record.win,
      losses: stat.record.loss,
      draws: stat.record.draw,
      total,
    })
  }

  if (raw.tactics?.highest) {
    ratings.push({
      timeControl: "puzzle",
      label: "Puzzles",
      current: raw.tactics.highest.rating,
      best: raw.tactics.highest.rating,
      wins: 0,
      losses: 0,
      draws: 0,
      total: 0,
    })
  }

  return ratings
}

export function normalizeChessComGames(games: ChessComGame[], username: string): UnifiedGame[] {
  const lowerUser = username.toLowerCase()

  return games.map((g) => {
    const isWhite = g.white.username.toLowerCase() === lowerUser
    const user = isWhite ? g.white : g.black
    const opponent = isWhite ? g.black : g.white
    const result =
      user.result === "win" ? "win" : user.result === "checkmated" || user.result === "timeout" || user.result === "resigned" || user.result === "abandoned" ? "loss" : "draw"

    const terminationMap: Record<string, string> = {
      win: "win", checkmated: "mat", resigned: "vzdanie", timeout: "čas",
      agreed: "remíza dohodou", stalemate: "pat", repetition: "opakovanie",
      insufficient: "nedostatočný materiál", "50move": "pravidlo 50 ťahov",
      timevsinsufficient: "čas vs mat. nedostatočný", abandoned: "opustená",
    }
    const termination = terminationMap[user.result] ?? user.result

    const { eco, name } = parseOpeningFromEco(g.eco)

    const tc = (g.time_class ?? "rapid") as TimeControl

    return {
      id: g.uuid,
      platform: "chesscom",
      playedAt: new Date(g.end_time * 1000),
      timeControl: g.time_control,
      timeClass: tc,
      userColor: isWhite ? "white" : "black",
      result,
      termination,
      opponentUsername: opponent.username,
      opponentRating: opponent.rating,
      userRating: user.rating,
      openingEco: eco,
      openingName: name,
      accuracy: g.accuracies ? (isWhite ? g.accuracies.white : g.accuracies.black) : null,
    }
  })
}
