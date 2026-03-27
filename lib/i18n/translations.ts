export const translations = {
  sk: {
    // Landing
    tagline: "Analyzuj svoju šachovú históriu z Chess.com alebo Lichess. Grafy, štatistiky, otvárania — všetko na jednom mieste.",
    featureRating: "Rating história",
    featureOpenings: "Otvárania",
    featureHeatmap: "Aktivity mapa",

    // Platform selector
    bothPlatforms: "Obe platformy",
    chesscomUsername: "Chess.com meno",
    lichessUsername: "Lichess meno",
    placeholderChesscom: "napr. hikaru",
    placeholderLichess: "napr. DrNykterstein",
    loading: "Načítavam...",
    showDashboard: "Zobraziť dashboard →",
    publicData: "Verejné dáta, nevyžaduje prihlásenie",

    // Header / platform labels
    platformChesscom: "Chess.com",
    platformLichess: "Lichess",
    platformBoth: "Chess.com & Lichess",

    // Profile card
    memberSince: "Člen od",
    followers: "sledovateľov",
    lastOnline: "Naposledy online",
    online: "Online",
    profileLink: "Profil →",

    // Ratings overview
    ratingsOverview: "Rating prehľad",
    games: "Partií",
    bestRating: "Najlepší",

    // Stats cards
    totalGames: "Celkovo partií",
    wins: "Výhry",
    losses: "Prehry",
    draws: "Remízy",
    winStreak: "Win streak",
    unbeatenStreak: "Unbeaten streak",
    avgAccuracy: "Priem. presnosť",

    // Rating history
    ratingHistory: "Rating história",
    rangeAll: "Všetko",
    rangeYear: "1R",
    notEnoughData: "Málo dát pre zvolené obdobie",

    // Win/Loss chart
    gameResults: "Výsledky partií",

    // Color stats
    whiteVsBlack: "Biely vs Čierny",
    white: "Biely ♔",
    black: "Čierny ♚",

    // Time control
    resultsByTimeControl: "Výsledky podľa tempa",

    // Accuracy
    moveAccuracy: "Presnosť ťahov",
    average: "Priemer",
    accuracyChesscomOnly: "Dáta presnosti dostupné len pre Chess.com",

    // Form chart
    formTitle: "Forma (rolling win rate)",
    formGames: "hier",
    formCurrent: "Aktuálne",
    notEnoughGames: "Málo partií pre výpočet formy",
    winRateLast: "Win rate (posl.",

    // Games per month
    gamesPerMonth: "Hry za mesiac",
    mostActive: "Najaktívnejší",

    // Openings
    topOpenings: "Top otvárania",
    count: "Počet",
    noOpeningData: "Žiadne dáta o otváraniach",

    // Activity heatmap
    activityTitle: "Aktivita (deň × hodina)",
    less: "Menej",
    more: "Viac",
    days: ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"],

    // Best wins
    bestWins: "Najlepšie výhry",
    byOpponentRating: "Podľa ratingu súpera",
    noWins: "Žiadne výhry",

    // Termination chart
    howGamesEnd: "Ako sa partie končia",

    // Opponent ratings
    opponentRatings: "Úroveň súperov",
    myAverage: "Môj priemer",
    opponentsAverage: "Súperi priemer",

    // Compare
    compare: "Porovnanie ⚔️",
    compareTitle: "Porovnanie hráčov",
    player1: "Hráč 1",
    player2: "Hráč 2",
    showComparison: "Porovnať →",
    vsLabel: "vs",
    radarTitle: "Celkové porovnanie",
    ratingCompareTitle: "Ratingy podľa tempa",
    ratingHistoryCompare: "Rating história — porovnanie",
    winLossCompare: "Výsledky",
    openingsCompare: "Top otvárania",
    winRate: "Win rate",
    drawRate: "Remízy %",
    accuracy: "Presnosť",
    activity: "Aktivita",
    gamesPlayed: "Partií",
    noRating: "—",
    advantage: "Výhoda",

    // Error / loading
    playerNotFound: "Hráč nenájdený",
    back: "← Späť",
    noData: "Žiadne dáta",
    noGames: "Žiadne partii",
    noActivity: "Žiadna aktivita",

    // Termination types
    terminations: {
      checkmate: "Mat",
      resignation: "Vzdanie",
      timeout: "Čas",
      draw: "Remíza",
      stalemate: "Pat",
      repetition: "Opakovanie",
      "insufficient material": "Nedostatočný materiál",
      "50-move rule": "Pravidlo 50 ťahov",
      abandoned: "Opustená",
      aborted: "Zrušená",
      cheat: "Podvod",
    } as Record<string, string>,
  },

  en: {
    // Landing
    tagline: "Analyze your chess history from Chess.com or Lichess. Charts, statistics, openings — all in one place.",
    featureRating: "Rating History",
    featureOpenings: "Openings",
    featureHeatmap: "Activity Map",

    // Platform selector
    bothPlatforms: "Both Platforms",
    chesscomUsername: "Chess.com username",
    lichessUsername: "Lichess username",
    placeholderChesscom: "e.g. hikaru",
    placeholderLichess: "e.g. DrNykterstein",
    loading: "Loading...",
    showDashboard: "Show dashboard →",
    publicData: "Public data, no login required",

    // Header / platform labels
    platformChesscom: "Chess.com",
    platformLichess: "Lichess",
    platformBoth: "Chess.com & Lichess",

    // Profile card
    memberSince: "Member since",
    followers: "followers",
    lastOnline: "Last online",
    online: "Online",
    profileLink: "Profile →",

    // Ratings overview
    ratingsOverview: "Rating Overview",
    games: "Games",
    bestRating: "Best",

    // Stats cards
    totalGames: "Total games",
    wins: "Wins",
    losses: "Losses",
    draws: "Draws",
    winStreak: "Win streak",
    unbeatenStreak: "Unbeaten streak",
    avgAccuracy: "Avg. accuracy",

    // Rating history
    ratingHistory: "Rating History",
    rangeAll: "All",
    rangeYear: "1Y",
    notEnoughData: "Not enough data for selected period",

    // Win/Loss chart
    gameResults: "Game Results",

    // Color stats
    whiteVsBlack: "White vs Black",
    white: "White ♔",
    black: "Black ♚",

    // Time control
    resultsByTimeControl: "Results by Time Control",

    // Accuracy
    moveAccuracy: "Move Accuracy",
    average: "Average",
    accuracyChesscomOnly: "Accuracy data available for Chess.com only",

    // Form chart
    formTitle: "Form (rolling win rate)",
    formGames: "games",
    formCurrent: "Current",
    notEnoughGames: "Not enough games to calculate form",
    winRateLast: "Win rate (last",

    // Games per month
    gamesPerMonth: "Games per Month",
    mostActive: "Most active",

    // Openings
    topOpenings: "Top Openings",
    count: "Count",
    noOpeningData: "No opening data available",

    // Activity heatmap
    activityTitle: "Activity (day × hour)",
    less: "Less",
    more: "More",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],

    // Best wins
    bestWins: "Best Wins",
    byOpponentRating: "By opponent rating",
    noWins: "No wins found",

    // Termination chart
    howGamesEnd: "How Games End",

    // Opponent ratings
    opponentRatings: "Opponent Ratings",
    myAverage: "My average",
    opponentsAverage: "Opponents average",

    // Compare
    compare: "Compare ⚔️",
    compareTitle: "Player Comparison",
    player1: "Player 1",
    player2: "Player 2",
    showComparison: "Compare →",
    vsLabel: "vs",
    radarTitle: "Overall Comparison",
    ratingCompareTitle: "Ratings by Time Control",
    ratingHistoryCompare: "Rating History — Comparison",
    winLossCompare: "Results",
    openingsCompare: "Top Openings",
    winRate: "Win rate",
    drawRate: "Draw %",
    accuracy: "Accuracy",
    activity: "Activity",
    gamesPlayed: "Games",
    noRating: "—",
    advantage: "Advantage",

    // Error / loading
    playerNotFound: "Player not found",
    back: "← Back",
    noData: "No data",
    noGames: "No games",
    noActivity: "No activity",

    // Termination types
    terminations: {
      checkmate: "Checkmate",
      resignation: "Resignation",
      timeout: "Timeout",
      draw: "Draw",
      stalemate: "Stalemate",
      repetition: "Repetition",
      "insufficient material": "Insufficient material",
      "50-move rule": "50-move rule",
      abandoned: "Abandoned",
      aborted: "Aborted",
      cheat: "Cheating",
    } as Record<string, string>,
  },
  de: {
    // Landing
    tagline: "Analysiere deine Schachhistorie von Chess.com oder Lichess. Diagramme, Statistiken, Eröffnungen — alles an einem Ort.",
    featureRating: "Ratingverlauf",
    featureOpenings: "Eröffnungen",
    featureHeatmap: "Aktivitätskarte",

    // Platform selector
    bothPlatforms: "Beide Plattformen",
    chesscomUsername: "Chess.com Benutzername",
    lichessUsername: "Lichess Benutzername",
    placeholderChesscom: "z. B. hikaru",
    placeholderLichess: "z. B. DrNykterstein",
    loading: "Lädt...",
    showDashboard: "Dashboard anzeigen →",
    publicData: "Öffentliche Daten, keine Anmeldung erforderlich",

    // Header / platform labels
    platformChesscom: "Chess.com",
    platformLichess: "Lichess",
    platformBoth: "Chess.com & Lichess",

    // Profile card
    memberSince: "Mitglied seit",
    followers: "Follower",
    lastOnline: "Zuletzt online",
    online: "Online",
    profileLink: "Profil →",

    // Ratings overview
    ratingsOverview: "Rating-Übersicht",
    games: "Partien",
    bestRating: "Bestes",

    // Stats cards
    totalGames: "Partien gesamt",
    wins: "Siege",
    losses: "Niederlagen",
    draws: "Remisen",
    winStreak: "Siegesserie",
    unbeatenStreak: "Ungeschlagen-Serie",
    avgAccuracy: "Ø Genauigkeit",

    // Rating history
    ratingHistory: "Ratingverlauf",
    rangeAll: "Alle",
    rangeYear: "1J",
    notEnoughData: "Nicht genug Daten für den gewählten Zeitraum",

    // Win/Loss chart
    gameResults: "Partieergebnisse",

    // Color stats
    whiteVsBlack: "Weiß vs. Schwarz",
    white: "Weiß ♔",
    black: "Schwarz ♚",

    // Time control
    resultsByTimeControl: "Ergebnisse nach Zeitkontrolle",

    // Accuracy
    moveAccuracy: "Zuggenauigkeit",
    average: "Durchschnitt",
    accuracyChesscomOnly: "Genauigkeitsdaten nur für Chess.com verfügbar",

    // Form chart
    formTitle: "Form (gleitende Gewinnrate)",
    formGames: "Partien",
    formCurrent: "Aktuell",
    notEnoughGames: "Nicht genug Partien zur Formberechnung",
    winRateLast: "Gewinnrate (letzte",

    // Games per month
    gamesPerMonth: "Partien pro Monat",
    mostActive: "Am aktivsten",

    // Openings
    topOpenings: "Top-Eröffnungen",
    count: "Anzahl",
    noOpeningData: "Keine Eröffnungsdaten verfügbar",

    // Activity heatmap
    activityTitle: "Aktivität (Tag × Stunde)",
    less: "Weniger",
    more: "Mehr",
    days: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],

    // Best wins
    bestWins: "Beste Siege",
    byOpponentRating: "Nach Gegner-Rating",
    noWins: "Keine Siege gefunden",

    // Termination chart
    howGamesEnd: "Wie Partien enden",

    // Opponent ratings
    opponentRatings: "Gegner-Ratings",
    myAverage: "Mein Durchschnitt",
    opponentsAverage: "Gegner-Durchschnitt",

    // Compare
    compare: "Vergleich ⚔️",
    compareTitle: "Spielervergleich",
    player1: "Spieler 1",
    player2: "Spieler 2",
    showComparison: "Vergleichen →",
    vsLabel: "vs",
    radarTitle: "Gesamtvergleich",
    ratingCompareTitle: "Ratings nach Zeitkontrolle",
    ratingHistoryCompare: "Ratingverlauf — Vergleich",
    winLossCompare: "Ergebnisse",
    openingsCompare: "Top-Eröffnungen",
    winRate: "Gewinnrate",
    drawRate: "Remis %",
    accuracy: "Genauigkeit",
    activity: "Aktivität",
    gamesPlayed: "Partien",
    noRating: "—",
    advantage: "Vorteil",

    // Error / loading
    playerNotFound: "Spieler nicht gefunden",
    back: "← Zurück",
    noData: "Keine Daten",
    noGames: "Keine Partien",
    noActivity: "Keine Aktivität",

    // Termination types
    terminations: {
      checkmate: "Schachmatt",
      resignation: "Aufgabe",
      timeout: "Zeit",
      draw: "Remis",
      stalemate: "Patt",
      repetition: "Stellungswiederholung",
      "insufficient material": "Unzureichendes Material",
      "50-move rule": "50-Züge-Regel",
      abandoned: "Abgebrochen",
      aborted: "Annulliert",
      cheat: "Schummeln",
    } as Record<string, string>,
  },
} as const

export type Lang = keyof typeof translations
// Widened type so both sk and en are assignable
export type Translations = {
  [K in keyof typeof translations.sk]: (typeof translations.sk)[K] extends Record<string, string>
    ? Record<string, string>
    : (typeof translations.sk)[K] extends readonly string[]
    ? string[]
    : string
}
