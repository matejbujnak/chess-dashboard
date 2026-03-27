import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("sk-SK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n)
}

export function winRate(wins: number, losses: number, draws: number): string {
  const total = wins + losses + draws
  if (total === 0) return "0%"
  return ((wins / total) * 100).toFixed(1) + "%"
}

export function parseTimeControl(tc: string): "bullet" | "blitz" | "rapid" | "classical" | "daily" {
  if (!tc || tc === "-") return "classical"
  const parts = tc.split("+")
  const base = parseInt(parts[0])
  const increment = parseInt(parts[1] ?? "0")
  const totalSeconds = base + increment * 40
  if (totalSeconds < 180) return "bullet"
  if (totalSeconds < 600) return "blitz"
  if (totalSeconds < 1800) return "rapid"
  return "classical"
}
