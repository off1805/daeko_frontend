"use client"

import type { Table } from "@tanstack/react-table"
import { SearchIcon, SlidersHorizontalIcon, XIcon } from "lucide-react"

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { FilterMenu } from "~/shared/presentation/data-table/filter-menu"
import type { DataTableFilterConfig } from "~/shared/presentation/data-table/data-table-types"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchPlaceholder?: string
  filters?: DataTableFilterConfig[]
}

/** Suit le pattern shadcn/ui data-table (toolbar : recherche, filtres facettés, vue des colonnes, réinitialisation). */
export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = "Rechercher…",
  filters = [],
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    Boolean(table.getState().globalFilter)

  return (
    <div className="flex flex-wrap items-center gap-2 px-3">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={(table.getState().globalFilter as string | undefined) ?? ""}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="h-8 w-56 pl-7"
        />
      </div>

      {filters.length > 0 ? (
        <FilterMenu
          entries={filters.flatMap((filter) => {
            const column = table.getColumn(filter.columnId)
            if (!column) return []
            return [
              {
                key: filter.columnId,
                title: filter.title,
                value: column.getFilterValue() as string | undefined,
                onChange: (next: string | undefined) => column.setFilterValue(next),
                options: filter.options,
              },
            ]
          })}
        />
      ) : null}

      {isFiltered ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            table.resetColumnFilters()
            table.setGlobalFilter("")
          }}
        >
          Réinitialiser
          <XIcon />
        </Button>
      ) : null}

      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="outline" size="sm" className="ml-auto" />}
        >
          <SlidersHorizontalIcon />
          Colonnes
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(checked) => column.toggleVisibility(checked)}
              >
                {column.columnDef.meta?.label ?? column.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
