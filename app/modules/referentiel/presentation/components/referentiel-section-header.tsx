import type * as React from "react"

interface ReferentielSectionHeaderProps {
  title: string
  description: string
  action?: React.ReactNode
}

export function ReferentielSectionHeader({
  title,
  description,
  action,
}: ReferentielSectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
