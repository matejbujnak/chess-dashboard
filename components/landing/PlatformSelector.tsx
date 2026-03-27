"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

type Platform = "chesscom" | "lichess" | "both"

export function PlatformSelector() {
  const router = useRouter()
  const [platform, setPlatform] = useState<Platform>("chesscom")
  const [username, setUsername] = useState("")
  const [usernameChesscom, setUsernameChesscom] = useState("")
  const [usernameLichess, setUsernameLichess] = useState("")
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    if (platform === "both") {
      if (!usernameChesscom || !usernameLichess) return
      router.push(`/dashboard/both/${encodeURIComponent(usernameChesscom)}--${encodeURIComponent(usernameLichess)}`)
    } else {
      if (!username) return
      router.push(`/dashboard/${platform}/${encodeURIComponent(username)}`)
    }
  }

  const tabs: { id: Platform; label: string; color: string; icon: string }[] = [
    { id: "chesscom", label: "Chess.com", color: "#7fa650", icon: "♟" },
    { id: "lichess",  label: "Lichess",   color: "#b58863", icon: "♞" },
    { id: "both",     label: "Obe platformy", color: "#3b82f6", icon: "⚡" },
  ]

  const activeColor = tabs.find((t) => t.id === platform)?.color ?? "#3b82f6"

  return (
    <div className="w-full max-w-md">
      {/* Tab selector */}
      <div className="mb-6 flex rounded-xl border border-border bg-surface p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPlatform(tab.id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all",
              platform === tab.id ? "bg-background shadow-sm" : "text-muted hover:text-foreground"
            )}
            style={platform === tab.id ? { color: tab.color } : undefined}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {platform === "both" ? (
          <>
            <div>
              <label className="mb-1.5 block text-sm text-muted">Chess.com meno</label>
              <input
                type="text"
                value={usernameChesscom}
                onChange={(e) => setUsernameChesscom(e.target.value)}
                placeholder="napr. hikaru"
                className="w-full rounded-lg border border-border bg-surface-alt px-4 py-3 text-foreground placeholder-subtle outline-none focus:border-chesscom transition-colors"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-muted">Lichess meno</label>
              <input
                type="text"
                value={usernameLichess}
                onChange={(e) => setUsernameLichess(e.target.value)}
                placeholder="napr. DrNykterstein"
                className="w-full rounded-lg border border-border bg-surface-alt px-4 py-3 text-foreground placeholder-subtle outline-none focus:border-lichess transition-colors"
                required
              />
            </div>
          </>
        ) : (
          <div>
            <label className="mb-1.5 block text-sm text-muted">
              {platform === "chesscom" ? "Chess.com" : "Lichess"} meno
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={platform === "chesscom" ? "napr. hikaru" : "napr. DrNykterstein"}
              className="w-full rounded-lg border border-border bg-surface-alt px-4 py-3 text-foreground placeholder-subtle outline-none transition-colors"
              onFocus={(e) => (e.target.style.borderColor = activeColor)}
              onBlur={(e) => (e.target.style.borderColor = "")}
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg py-3 text-sm font-semibold text-white transition-all disabled:opacity-60 hover:opacity-90 active:scale-95"
          style={{ background: `linear-gradient(135deg, ${activeColor}, ${activeColor}bb)` }}
        >
          {loading ? "Načítavam..." : "Zobraziť dashboard →"}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-subtle">
        Verejné dáta, nevyžaduje prihlásenie
      </p>
    </div>
  )
}
