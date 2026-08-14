"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { cn } from "~/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { DataTablePagination } from "~/shared/presentation/data-table/data-table-pagination"
import { DataTableToolbar } from "~/shared/presentation/data-table/data-table-toolbar"
import type { DataTableFilterConfig } from "~/shared/presentation/data-table/data-table-types"

function globalRowFilter<TData>(
  row: Row<TData>,
  _columnId: string,
  filterValue: string,
): boolean {
  const search = filterValue.trim().toLowerCase()
  if (!search) return true
  return row.getAllCells().some((cell) => {
    const value = cell.getValue()
    return typeof value === "string" && value.toLowerCase().includes(search)
  })
}

interface ReferenceDataTableProps<TData> {
  columns: ColumnDef<TData, any>[]
  data: TData[]
  isLoading?: boolean
  searchPlaceholder?: string
  filters?: DataTableFilterConfig[]
  onRowClick?: (row: TData) => void
  emptyMessage?: string
}

/**
 * Tableau TanStack générique (tri, filtres facettés, recherche globale,
 * visibilité des colonnes, pagination) réutilisé par les ressources à
 * fort volume du référentiel — suit le pattern shadcn/ui data-table
 * (https://ui.shadcn.com/docs/components/data-table), adapté à Base UI.
 */
export function ReferenceDataTable<TData>({
  columns,
  data,
  isLoading,
  searchPlaceholder,
  filters,
  onRowClick,
  emptyMessage = "Aucun résultat.",
}: ReferenceDataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = React.useState("")

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, columnVisibility, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: globalRowFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  const rows = table.getRowModel().rows

  return (
    <div className="flex flex-col gap-3">
      <DataTableToolbar
        table={table}
        searchPlaceholder={searchPlaceholder}
        filters={filters}
      />

      <div className="overflow-hidden border-y border-border/60  h-full">
        <Table className="h-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="divide-x divide-border/40 bg-muted/40 hover:bg-muted/40"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="h-full">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index} className="hover:bg-transparent">
                  <TableCell colSpan={columns.length}>
                    <div className="h-4 w-full animate-pulse rounded bg-muted/50" />
                  </TableCell>
                </TableRow>
              ))
            ) : rows.length ? (
              rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={cn(
                    "divide-x divide-border/40",
                    index % 2 === 1 && "bg-muted/20",
                    onRowClick && "cursor-pointer",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="border-t border-border/60 bg-muted/20 px-3 py-2">
          <DataTablePagination table={table} />
        </div>
      </div>
    </div>
  )
}
