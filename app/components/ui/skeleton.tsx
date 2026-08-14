import { cn } from "~/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-shimmer motion-reduce:animate-none rounded-md bg-[length:200%_100%] bg-[linear-gradient(110deg,var(--muted)_8%,color-mix(in_oklch,var(--muted),var(--foreground)_8%)_18%,var(--muted)_33%)]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
