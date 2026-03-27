"use client"

import Link from "next/link"
import { useT } from "@/components/LanguageProvider"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LanguageToggle } from "@/components/LanguageToggle"

export default function NotFound() {
  const { t } = useT()

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-foreground transition-opacity hover:opacity-80">
            <span className="text-xl">♔</span>
            <span className="font-semibold">Chess Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center p-4 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-surface-alt text-5xl border border-border">
          🤷‍♂️
        </div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t.stalemateTitle}
        </h1>
        <p className="mb-8 max-w-[500px] text-muted sm:text-lg">
          {t.pageNotFound}
        </p>
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-lg bg-foreground px-8 font-medium text-background transition-colors hover:bg-foreground/90 active:scale-95"
        >
          {t.backHome}
        </Link>
      </main>
    </div>
  )
}
