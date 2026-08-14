"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "~/shared/presentation/data-table/data-table-column-header"
import { ReferenceDataTable } from "~/shared/presentation/data-table/reference-data-table"
import type { DataTableFilterConfig } from "~/shared/presentation/data-table/data-table-types"
import { EtatBadge } from "~/modules/referentiel/presentation/components/etat-badge"
import type {
  CreateSerieInput,
  UpdateSerieInput,
} from "~/modules/referentiel/domain/repositories/referentiel.repository"
import {
  updatableFields,
  type FormField,
} from "~/shared/presentation/forms/form-field"
import { ResourceActions } from "~/modules/referentiel/presentation/components/forms/resource-actions"
import { ResourceCreateButton } from "~/modules/referentiel/presentation/components/forms/resource-create-button"
import {
  ReferenceDetailCard,
  type ReferenceCardItem,
} from "~/modules/referentiel/presentation/components/reference-detail-card"
import { ReferentielSectionHeader } from "~/modules/referentiel/presentation/components/referentiel-section-header"
import type { EtatReferentiel } from "~/modules/referentiel/domain/shared/etat-referentiel"
import {
  filiereQueries,
  niveauQueries,
  serieQueries,
} from "~/modules/referentiel/infrastructure/queries/referentiel.queries"

const STRUCTURAL_FIELDS = ["filiereId", "niveauApparitionId"]

interface SerieRow {
  id: string
  code: string
  libelle: string
  filiereId: string
  filiereLibelle: string
  niveauApparitionId: string
  niveauApparitionLibelle: string
  etat: EtatReferentiel
  detail: ReferenceCardItem
}

const columns: ColumnDef<SerieRow, any>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
    meta: { label: "Code" },
  },
  {
    accessorKey: "libelle",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Libellé" />,
    meta: { label: "Libellé" },
  },
  {
    accessorKey: "filiereLibelle",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Filière" />,
    filterFn: (row, _id, value) => row.original.filiereId === value,
    meta: { label: "Filière" },
  },
  {
    accessorKey: "niveauApparitionLibelle",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Niveau d'apparition" />
    ),
    filterFn: (row, _id, value) => row.original.niveauApparitionId === value,
    meta: { label: "Niveau d'apparition" },
  },
  {
    accessorKey: "etat",
    header: ({ column }) => <DataTableColumnHeader column={column} title="État" />,
    cell: ({ row }) => <EtatBadge etat={row.original.etat} />,
    filterFn: (row, _id, value) => row.original.etat === value,
    meta: { label: "État" },
  },
]

export function SeriesSection() {
  const [selected, setSelected] = React.useState<ReferenceCardItem | null>(null)
  const { data, isLoading } = serieQueries.useList({ etat: "TOUS", taille: 200 })
  const { data: filieresData } = filiereQueries.useList({
    etat: "TOUS",
    taille: 200,
  })
  const { data: niveauxData } = niveauQueries.useList({
    etat: "TOUS",
    taille: 200,
  })

  const filiereById = new Map((filieresData?.donnees ?? []).map((f) => [f.id, f]))
  const niveauById = new Map((niveauxData?.donnees ?? []).map((n) => [n.id, n]))
  const rawById = new Map((data?.donnees ?? []).map((dto) => [dto.id, dto]))

  const createFields: FormField[] = [
    {
      name: "filiereId",
      label: "Filière",
      type: "select",
      required: true,
      options: (filieresData?.donnees ?? []).map((f) => ({
        label: f.libelle,
        value: f.id,
      })),
    },
    {
      name: "niveauApparitionId",
      label: "Niveau d'apparition",
      type: "select",
      required: true,
      options: (niveauxData?.donnees ?? []).map((n) => ({
        label: n.libelle,
        value: n.id,
      })),
      helpText:
        "Le niveau à partir duquel la série peut être choisie (doc REF-011).",
    },
    { name: "code", label: "Code", type: "text", required: true, placeholder: "C" },
    { name: "libelle", label: "Libellé", type: "text", required: true },
    { name: "libelleCourt", label: "Libellé court", type: "text" },
    { name: "libelleEn", label: "Libellé (EN)", type: "text" },
    { name: "description", label: "Description", type: "textarea" },
  ]
  const editFields = updatableFields(createFields, STRUCTURAL_FIELDS)

  const rows: SerieRow[] = (data?.donnees ?? []).map((dto) => {
    const filiere = filiereById.get(dto.filiereId)
    const niveauApparition = niveauById.get(dto.niveauApparitionId)
    return {
      id: dto.id,
      code: dto.code,
      libelle: dto.libelle,
      filiereId: dto.filiereId,
      filiereLibelle: filiere?.libelle ?? dto.filiereId,
      niveauApparitionId: dto.niveauApparitionId,
      niveauApparitionLibelle: niveauApparition?.libelle ?? dto.niveauApparitionId,
      etat: dto.etat,
      detail: {
        id: dto.id,
        code: dto.code,
        titre: dto.libelle,
        sousTitre: filiere ? `Filière : ${filiere.libelle}` : undefined,
        description: dto.description,
        champs: [
          { label: "Filière", value: filiere?.libelle ?? dto.filiereId },
          { label: "Niveau d'apparition", value: niveauApparition?.libelle ?? dto.niveauApparitionId },
          { label: "Libellé court", value: dto.libelleCourt },
          { label: "Libellé (EN)", value: dto.libelleEn },
        ],
        lifecycle: dto,
      },
    }
  })

  const filters: DataTableFilterConfig[] = [
    {
      columnId: "filiereLibelle",
      title: "Filière",
      options: (filieresData?.donnees ?? []).map((f) => ({
        label: f.libelle,
        value: f.id,
      })),
    },
    {
      columnId: "niveauApparitionLibelle",
      title: "Niveau d'apparition",
      options: (niveauxData?.donnees ?? []).map((n) => ({
        label: n.libelle,
        value: n.id,
      })),
    },
    {
      columnId: "etat",
      title: "État",
      options: [
        { label: "Actif", value: "ACTIVE" },
        { label: "Déprécié", value: "DEPRECATED" },
      ],
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <ReferentielSectionHeader
        title="Séries"
        description="Séries rattachées à une filière, à partir d'un niveau d'apparition (doc section 3.5)."
        action={
          <ResourceCreateButton<CreateSerieInput, unknown>
            sheetTitle="Ajouter une série"
            fields={createFields}
            useCreate={serieQueries.useCreate}
          />
        }
      />
      {selected ? (
        <ReferenceDetailCard
          item={selected}
          onBack={() => setSelected(null)}
          backLabel="Retour au tableau"
          actions={
            <ResourceActions<UpdateSerieInput, unknown>
              id={selected.id}
              etat={selected.lifecycle.etat}
              titre={selected.titre}
              editFields={editFields}
              initialValues={rawById.get(selected.id) ?? {}}
              useUpdate={serieQueries.useUpdate}
              useDeprecier={serieQueries.useDeprecier}
            />
          }
        />
      ) : (
        <ReferenceDataTable
          columns={columns}
          data={rows}
          isLoading={isLoading}
          searchPlaceholder="Rechercher une série…"
          filters={filters}
          onRowClick={(row) => setSelected(row.detail)}
          emptyMessage="Aucune série."
        />
      )}
    </div>
  )
}
