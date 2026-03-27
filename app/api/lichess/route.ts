import { NextRequest } from "next/server"
import { fetchLichessUser, fetchLichessRatingHistory, fetchLichessGames, normalizeLichessUser, normalizeLichessRatings, normalizeLichessRatingHistory, normalizeLichessGames } from "@/lib/lichess/normalizer"
import { processOpenings, processHeatmap, processBestWins, processStreaks } from "@/lib/unified/processors"

export const maxDuration = 30

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username")
  const max = parseInt(request.nextUrl.searchParams.get("max") ?? "300")

  if (!username) {
    return Response.json({ error: "username required" }, { status: 400 })
  }

  try {
    const [rawUser, rawHistory, rawGames] = await Promise.all([
      fetchLichessUser(username),
      fetchLichessRatingHistory(username),
      fetchLichessGames(username, max),
    ])

    const player = normalizeLichessUser(rawUser)
    const ratings = normalizeLichessRatings(rawUser)
    const ratingHistory = normalizeLichessRatingHistory(rawHistory)
    const games = normalizeLichessGames(rawGames, username)

    const data = {
      player,
      ratings,
      games,
      ratingHistory,
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
