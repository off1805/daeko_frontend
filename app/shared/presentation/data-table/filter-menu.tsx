"use client"

import { FilterIcon } from "lucide-react"

import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import type { DataTableFilterOption } from "~/shared/presentation/data-table/data-table-types"

const ALL_VALUE = "__all__"

export interface FilterMenuEntry {
  key: string
  title: string
  value: string | undefined
  onChange: (value: string | undefined) => void
  options: DataTableFilterOption[]
  disabled?: boolean
}

/**
 * Un seul bouton "Filtres" : chaque dimension est une entrée de menu dont
 * le survol ouvre — sans jamais se superposer, Base UI positionne le
 * sous-menu à côté (side="right", cf. dropdown-menu.tsx) — la liste des
 * choix disponibles pour cette dimension.
 */
export function FilterMenu({
  entries,
  triggerLabel = "Filtres",
}: {
  entries: FilterMenuEntry[]
  triggerLabel?: string
}) {
  const activeCount = entries.filter((entry) => entry.value).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
        <FilterIcon />
        {triggerLabel}
        {activeCount > 0 ? (
          <Badge variant="secondary" className="px-1 text-[0.65rem]">
            {activeCount}
          </Badge>
        ) : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-56">
        {entries.map((entry) => {
          const currentLabel = entry.value
            ? entry.options.find((option) => option.value === entry.value)?.label
            : undefined
          return (
            <DropdownMenuSub key={entry.key}>
              <DropdownMenuSubTrigger disabled={entry.disabled}>
                <span className="flex-1">{entry.title}</span>
                {currentLabel ? (
                  <span className="max-w-28 truncate text-[0.65rem] text-muted-foreground">
                    {currentLabel}
                  </span>
                ) : null}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={entry.value ?? ALL_VALUE}
                  onValueChange={(value) =>
                    entry.onChange(value === ALL_VALUE ? undefined : (value as string))
                  }
                >
                  <DropdownMenuRadioItem value={ALL_VALUE}>Tous</DropdownMenuRadioItem>
                  {entry.options.map((option) => (
                    <DropdownMenuRadioItem key={option.value} value={option.value}>
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
