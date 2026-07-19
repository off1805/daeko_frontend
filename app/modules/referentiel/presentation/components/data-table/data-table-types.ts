import "@tanstack/react-table"

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    /** Libellé affiché dans le menu "Colonnes" (doc data-table shadcn/ui). */
    label?: string
  }
}

export interface DataTableFilterOption {
  label: string
  value: string
}

export interface DataTableFilterConfig {
  columnId: string
  title: string
  options: DataTableFilterOption[]
}
