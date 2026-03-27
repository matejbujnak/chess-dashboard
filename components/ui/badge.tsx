import { cn } from "@/lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "chesscom" | "lichess" | "success" | "warning" | "muted"
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variants = {
    default:  "bg-accent/20 text-accent border border-accent/30",
    chesscom: "bg-chesscom/20 text-chesscom border border-chesscom/30",
    lichess:  "bg-lichess/20 text-lichess border border-lichess/30",
    success:  "bg-success/20 text-success border border-success/30",
    warning:  "bg-warning/20 text-warning border border-warning/30",
    muted:    "bg-border text-muted border border-subtle",
  }

  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  )
}
