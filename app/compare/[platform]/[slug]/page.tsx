import { CompareClient } from "@/components/compare/CompareClient"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LanguageToggle } from "@/components/LanguageToggle"
import Link from "next/link"

interface Props {
  params: Promise<{ platform: string; slug: string }>
}

/**
 * URL formats:
 *   /compare/chesscom/hikaru--magnuscarlsen   (both Chess.com)
 *   /compare/lichess/DrNyk--Chess_network     (both Lichess)
 *   /compare/mixed/chesscom:hikaru--lichess:Magnus  (cross-platform)
 */
function parsePlayers(platform: string, slug: string) {
  const parts = slug.split("--")
  if (parts.length !== 2) return null

  function parsePart(raw: string, defaultPlatform: string) {
    if (raw.includes(":")) {
      const [plat, user] = raw.split(":", 2)
      return { platform: plat, username: decodeURIComponent(user) }
    }
    return { platform: defaultPlatform, username: decodeURIComponent(raw) }
  }

  return {
    a: parsePart(parts[0], platform),
    b: parsePart(parts[1], platform),
  }
}

export default async function ComparePage({ params }: Props) {
  const { platform, slug } = await params
  const players = parsePlayers(platform, slug)

  if (!players) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted">Invalid compare URL</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            ← Back
          </Link>
          <span className="text-sm font-semibold text-foreground">
            {players.a.username} vs {players.b.username}
          </span>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <CompareClient
          platformA={players.a.platform}
          usernameA={players.a.username}
          platformB={players.b.platform}
          usernameB={players.b.username}
        />
      </main>
    </div>
  )
}
