"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { Menu, X } from "lucide-react"
import { useT } from "@/components/LanguageProvider"
import { TimeControlFilter } from "@/components/TimeControlFilter"
import { CopyLinkButton } from "@/components/CopyLinkButton"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LanguageToggle } from "@/components/LanguageToggle"

export function MobileActionMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { t } = useT()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative sm:hidden" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-colors hover:text-foreground hover:border-muted"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-border bg-surface p-3 shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted">{t.menuFilter ?? "Filter"}</span>
              <Suspense fallback={<div className="w-24 h-8 bg-surface rounded-lg animate-pulse" />}>
                <TimeControlFilter />
              </Suspense>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted">{t.menuShare ?? "Share"}</span>
              <CopyLinkButton />
            </div>
            <div className="flex items-center justify-between mt-1 pt-3 border-t border-border">
              <span className="text-sm font-medium text-muted">{t.menuTheme ?? "Theme"}</span>
              <ThemeToggle />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted">{t.menuLanguage ?? "Language"}</span>
              <LanguageToggle />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
