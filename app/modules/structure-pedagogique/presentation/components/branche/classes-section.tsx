"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet"
import { DataTableColumnHeader } from "~/shared/presentation/data-table/data-table-column-header"
import { ReferenceDataTable } from "~/shared/presentation/data-table/reference-data-table"
import type { DataTableFilterConfig } from "~/shared/presentation/data-table/data-table-types"
import { getErrorMessage } from "~/shared/presentation/forms/form-field"
import {
  useDesactiverClasse,
  useReactiverClasse,
} from "~/modules/structure-pedagogique/infrastructure/queries/structure.queries"
import { useReferentielLookup } from "~/modules/structure-pedagogique/presentation/hooks/use-referentiel-lookup"
import { CreerClasseSheet } from "~/modules/structure-pedagogique/presentation/components/branche/creer-classe-sheet"
import type {
  ClasseDto,
  ConfigurationDetailDto,
} from "~/modules/structure-pedagogique/application/dto/structure-read.dto"

interface ClassesSectionProps {
  detail: ConfigurationDetailDto
}

interface ClasseRow {
  id: string
  libelleComplet: string
  niveauLibelle: string
  serieLibelle: string
  effectifPrevu?: number
  salle: string
  etatLibelle: string
  classe: ClasseDto
}

function DesactiverClasseSheet({ classe }: { classe: ClasseDto }) {
  const [open, setOpen] = React.useState(false)
  const desactiver = useDesactiverClasse()

  return (
    <>
      <Button variant="outline" size="xs" onClick={() => setOpen(true)}>
        Désactiver
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="sm:max-w-md">
          <form
            key={open ? "open" : "closed"}
            onSubmit={(event) => {
              event.preventDefault()
              const motif = String(new FormData(event.currentTarget).get("motif") ?? "").trim()
              desactiver.mutate({ id: classe.id, motif }, { onSuccess: () => setOpen(false) })
            }}
            className="flex h-full flex-col"
          >
            <SheetHeader>
              <SheetTitle>Désactiver « {classe.libelleComplet} »</SheetTitle>
              <SheetDescription>
                La classe reste consultable dans l'historique. Cette action n'est pas une
                suppression.
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-1 flex-col gap-4 px-6">
              <textarea
                name="motif"
                required
                rows={3}
                placeholder="Motif de la désactivation"
                className="w-full rounded-md border border-input bg-input/20 px-2 py-1.5 text-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 dark:bg-input/30"
              />
              {desactiver.error ? (
                <div className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
                  {getErrorMessage(desactiver.error)}
                </div>
              ) : null}
            </div>
            <SheetFooter className="flex-row justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" variant="destructive" disabled={desactiver.isPending}>
                {desactiver.isPending ? "Désactivation…" : "Désactiver"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  )
}

function ReactiverButton({ classeId }: { classeId: string }) {
  const reactiver = useReactiverClasse()
  return (
    <Button variant="outline" size="xs" disabled={reactiver.isPending} onClick={() => reactiver.mutate(classeId)}>
      {reactiver.isPending ? "…" : "Réactiver"}
    </Button>
  )
}

const columns: ColumnDef<ClasseRow, any>[] = [
  {
    accessorKey: "libelleComplet",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Classe" />,
    cell: ({ row }) => <span className="font-medium">{row.original.libelleComplet}</span>,
    meta: { label: "Classe" },
  },
  {
    accessorKey: "niveauLibelle",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Niveau" />,
    filterFn: (row, _id, value) => row.original.niveauLibelle === value,
    meta: { label: "Niveau" },
  },
  {
    accessorKey: "serieLibelle",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Série" />,
    meta: { label: "Série" },
  },
  {
    accessorKey: "effectifPrevu",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Effectif prévu" />,
    cell: ({ row }) => row.original.effectifPrevu ?? "—",
    meta: { label: "Effectif prévu" },
  },
  {
    accessorKey: "salle",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Salle" />,
    cell: ({ row }) => row.original.salle || "—",
    meta: { label: "Salle" },
  },
  {
    accessorKey: "etatLibelle",
    header: ({ column }) => <DataTableColumnHeader column={column} title="État" />,
    cell: ({ row }) =>
      row.original.classe.actif ? (
        <Badge variant="outline">Active</Badge>
      ) : (
        <Badge variant="secondary">Désactivée</Badge>
      ),
    filterFn: (row, _id, value) => row.original.etatLibelle === value,
    meta: { label: "État" },
  },
  {
    id: "actions",
    header: "",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const classe = row.original.classe
      return (
        <div className="flex justify-end">
          {classe.actif ? <DesactiverClasseSheet classe={classe} /> : <ReactiverButton classeId={classe.id} />}
        </div>
      )
    },
  },
]

/** Classes présentées en tableau (tri, recherche, filtres par niveau/état) plutôt qu'en listes groupées. */
export function ClassesSection({ detail }: ClassesSectionProps) {
  const lookup = useReferentielLookup()
  const niveauActiveById = new Map(detail.niveauxActifs.map((na) => [na.id, na]))
  const serieActiveById = new Map(detail.seriesActives.map((sa) => [sa.id, sa]))

  const rows: ClasseRow[] = detail.classes.map((classe) => {
    const na = niveauActiveById.get(classe.niveauActiveId)
    const niveau = na ? lookup.niveauById.get(na.niveauId) : undefined
    const sa = classe.serieActiveId ? serieActiveById.get(classe.serieActiveId) : undefined
    const serie = sa ? lookup.serieById.get(sa.serieId) : undefined

    return {
      id: classe.id,
      libelleComplet: classe.libelleComplet,
      niveauLibelle: niveau?.libelleCourt ?? niveau?.libelle ?? classe.niveauActiveId,
      serieLibelle: serie?.libelleCourt ?? serie?.code ?? "Tronc commun",
      effectifPrevu: classe.effectifPrevu,
      salle: classe.salle ?? "",
      etatLibelle: classe.actif ? "Active" : "Désactivée",
      classe,
    }
  })

  const niveauOptions = Array.from(new Set(rows.map((r) => r.niveauLibelle))).map((label) => ({
    label,
    value: label,
  }))

  const filters: DataTableFilterConfig[] = [
    { columnId: "niveauLibelle", title: "Niveau", options: niveauOptions },
    {
      columnId: "etatLibelle",
      title: "État",
      options: [
        { label: "Active", value: "Active" },
        { label: "Désactivée", value: "Désactivée" },
      ],
    },
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3  p-3 ">
        <h2 className="text-sm font-medium text-foreground">Classes</h2>
        <CreerClasseSheet configurationId={detail.configuration.id} detail={detail} />
      </div>

      {detail.niveauxActifs.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-6 text-center text-sm text-muted-foreground">
          Activez au moins un niveau avant de créer des classes.
        </p>
      ) : (
        <ReferenceDataTable
          columns={columns}
          data={rows}
          searchPlaceholder="Rechercher une classe…"
          filters={filters}
          emptyMessage="Aucune classe créée pour le moment."
        />
      )}
    </div>
  )
}
