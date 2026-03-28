import type { UnifiedGame, OpeningStat, HeatmapCell, BestWin, UnifiedRatingPoint, ActivityCalendarCell } from "./types"

export function processOpenings(games: UnifiedGame[]): OpeningStat[] {
  const map = new Map<string, OpeningStat>()

  for (const game of games) {
    if (!game.openingName) continue
    const key = game.openingEco ?? game.openingName
    const existing = map.get(key) ?? {
      eco: game.openingEco ?? "",
      name: game.openingName,
      games: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      winRate: 0,
    }
    existing.games++
    if (game.result === "win") existing.wins++
    else if (game.result === "loss") existing.losses++
    else existing.draws++
    map.set(key, existing)
  }

  return Array.from(map.values())
    .map((s) => ({ ...s, winRate: s.games > 0 ? (s.wins / s.games) * 100 : 0 }))
    .sort((a, b) => b.games - a.games)
    .slice(0, 15)
}

export function processHeatmap(games: UnifiedGame[]): HeatmapCell[] {
  const matrix: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0))

  for (const game of games) {
    const d = game.playedAt
    const day = (d.getDay() + 6) % 7 // 0=Mon
    const hour = d.getHours()
    matrix[day][hour]++
  }

  const cells: HeatmapCell[] = []
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      cells.push({ day, hour, count: matrix[day][hour] })
    }
  }
  return cells
}

export function processActivityCalendar(games: UnifiedGame[]): ActivityCalendarCell[] {
  const map = new Map<string, number>()
  
  // Only look at games from the last 365 days approximately, or we can just process all
  // and let the component slice/filter. Here we process them all to be safe.
  for (const game of games) {
    const yyyy = game.playedAt.getFullYear()
    const mm = String(game.playedAt.getMonth() + 1).padStart(2, '0')
    const dd = String(game.playedAt.getDate()).padStart(2, '0')
    const dateStr = `${yyyy}-${mm}-${dd}`
    map.set(dateStr, (map.get(dateStr) ?? 0) + 1)
  }

  const cells: ActivityCalendarCell[] = []
  for (const [date, count] of map.entries()) {
    cells.push({ date, count })
  }
  // Sort from oldest to newest
  cells.sort((a, b) => a.date.localeCompare(b.date))
  
  return cells
}

export function processBestWins(games: UnifiedGame[]): BestWin[] {
  return games
    .filter((g) => g.result === "win" && g.opponentRating > 0)
    .sort((a, b) => b.opponentRating - a.opponentRating)
    .slice(0, 10)
    .map((g) => ({
      opponentUsername: g.opponentUsername,
      opponentRating: g.opponentRating,
      result: "win" as const,
      timeClass: g.timeClass,
      playedAt: g.playedAt,
      platform: g.platform,
      gameId: g.id,
    }))
}

export function processStreaks(games: UnifiedGame[]): { currentWin: number; currentUnbeaten: number } {
  const sorted = [...games].sort((a, b) => b.playedAt.getTime() - a.playedAt.getTime())
  let currentWin = 0
  let currentUnbeaten = 0

  for (const game of sorted) {
    if (game.result === "win") {
      currentWin++
      currentUnbeaten++
    } else if (game.result === "draw") {
      currentWin = 0
      currentUnbeaten++
    } else {
      break
    }
  }

  // Re-calculate unbeaten from start
  currentUnbeaten = 0
  for (const game of sorted) {
    if (game.result !== "loss") currentUnbeaten++
    else break
  }

  return { currentWin, currentUnbeaten }
}

export function buildRatingHistoryFromGames(games: UnifiedGame[]): UnifiedRatingPoint[] {
  const sorted = [...games].sort((a, b) => a.playedAt.getTime() - b.playedAt.getTime())
  return sorted.map((g) => ({
    date: g.playedAt,
    rating: g.userRating,
    timeControl: g.timeClass,
  }))
}
