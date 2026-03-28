import { CompareClient } from "@/components/compare/CompareClient"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LanguageToggle } from "@/components/LanguageToggle"
import { CopyLinkButton } from "@/components/CopyLinkButton"
import { TimeControlFilter } from "@/components/TimeControlFilter"
import { MobileActionMenu } from "@/components/MobileActionMenu"
import { BackLink } from "@/components/BackLink"
import { Suspense } from "react"

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
          <BackLink />
          <span className="text-sm font-semibold text-foreground">
            {players.a.username} vs {players.b.username}
          </span>
          <div className="flex items-center gap-2">
            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-2">
              <Suspense fallback={<div className="w-24 h-8 bg-surface rounded-lg animate-pulse" />}>
                <TimeControlFilter />
              </Suspense>
              <CopyLinkButton />
              <ThemeToggle />
              <LanguageToggle />
            </div>

            {/* Mobile Menu */}
            <MobileActionMenu />
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
