import { NextRequest } from "next/server"
import { fetchChessComProfile, fetchChessComStats, fetchChessComGames, normalizeChessComProfile, normalizeChessComStats, normalizeChessComGames } from "@/lib/chesscom/normalizer"
import { processOpenings, processHeatmap, processBestWins, processStreaks, buildRatingHistoryFromGames } from "@/lib/unified/processors"

export const maxDuration = 30

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username")
  const months = parseInt(request.nextUrl.searchParams.get("months") ?? "3")

  if (!username) {
    return Response.json({ error: "username required" }, { status: 400 })
  }

  try {
    const [rawProfile, rawStats, rawGames] = await Promise.all([
      fetchChessComProfile(username),
      fetchChessComStats(username),
      fetchChessComGames(username, months),
    ])

    const player = normalizeChessComProfile(rawProfile)
    const ratings = normalizeChessComStats(rawStats)
    const games = normalizeChessComGames(rawGames, username)

    const data = {
      player,
      ratings,
      games,
      ratingHistory: buildRatingHistoryFromGames(games),
      openings: processOpenings(games),
      heatmap: processHeatmap(games),
      bestWins: processBestWins(games),
      streaks: processStreaks(games),
    }

    return Response.json(data, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return Response.json({ error: message }, { status: 500 })
  }
}
