"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "~/modules/referentiel/presentation/components/data-table/data-table-column-header"
import { ReferenceDataTable } from "~/modules/referentiel/presentation/components/data-table/reference-data-table"
import type { DataTableFilterConfig } from "~/modules/referentiel/presentation/components/data-table/data-table-types"
import { EtatBadge } from "~/modules/referentiel/presentation/components/etat-badge"
import type {
  CreateCycleInput,
  UpdateCycleInput,
} from "~/modules/referentiel/domain/repositories/referentiel.repository"
import {
  updatableFields,
  type FormField,
} from "~/modules/referentiel/presentation/components/forms/form-field"
import { ResourceActions } from "~/modules/referentiel/presentation/components/forms/resource-actions"
import { ResourceCreateButton } from "~/modules/referentiel/presentation/components/forms/resource-create-button"
import {
  ReferenceDetailCard,
  type ReferenceCardItem,
} from "~/modules/referentiel/presentation/components/reference-detail-card"
import { ReferentielSectionHeader } from "~/modules/referentiel/presentation/components/referentiel-section-header"
import type { EtatReferentiel } from "~/modules/referentiel/domain/shared/etat-referentiel"
import {
  cycleQueries,
  ordreEnseignementQueries,
  sousSystemeQueries,
} from "~/modules/referentiel/infrastructure/queries/referentiel.queries"

const STRUCTURAL_FIELDS = ["sousSystemeId", "ordreEnseignementId"]

interface CycleRow {
  id: string
  code: string
  libelle: string
  sousSystemeId: string
  sousSystemeLibelle: string
  ordreEnseignementId: string
  ordreEnseignementLibelle: string
  rang: number
  dureeTheoriqueAnnees: number
  etat: EtatReferentiel
  detail: ReferenceCardItem
}

const columns: ColumnDef<CycleRow, any>[] = [
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
    accessorKey: "sousSystemeLibelle",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sous-système" />
    ),
    filterFn: (row, _id, value) => row.original.sousSystemeId === value,
    meta: { label: "Sous-système" },
  },
  {
    accessorKey: "ordreEnseignementLibelle",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ordre d'enseignement" />
    ),
    filterFn: (row, _id, value) => row.original.ordreEnseignementId === value,
    meta: { label: "Ordre d'enseignement" },
  },
  {
    accessorKey: "rang",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Rang" />,
    meta: { label: "Rang" },
  },
  {
    accessorKey: "dureeTheoriqueAnnees",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Durée (ans)" />
    ),
    meta: { label: "Durée (ans)" },
  },
  {
    accessorKey: "etat",
    header: ({ column }) => <DataTableColumnHeader column={column} title="État" />,
    cell: ({ row }) => <EtatBadge etat={row.original.etat} />,
    filterFn: (row, _id, value) => row.original.etat === value,
    meta: { label: "État" },
  },
]

export function CyclesSection() {
  const [selected, setSelected] = React.useState<ReferenceCardItem | null>(null)
  const { data, isLoading } = cycleQueries.useList({ etat: "TOUS", taille: 200 })
  const { data: sousSystemesData } = sousSystemeQueries.useList({
    etat: "TOUS",
    taille: 200,
  })
  const { data: ordresData } = ordreEnseignementQueries.useList({
    etat: "TOUS",
    taille: 200,
  })

  const sousSystemeById = new Map(
    (sousSystemesData?.donnees ?? []).map((s) => [s.id, s]),
  )
  const ordreById = new Map((ordresData?.donnees ?? []).map((o) => [o.id, o]))
  const rawById = new Map((data?.donnees ?? []).map((dto) => [dto.id, dto]))

  const createFields: FormField[] = [
    {
      name: "sousSystemeId",
      label: "Sous-système",
      type: "select",
      required: true,
      options: (sousSystemesData?.donnees ?? []).map((s) => ({
        label: s.libelle,
        value: s.id,
      })),
    },
    {
      name: "ordreEnseignementId",
      label: "Ordre d'enseignement",
      type: "select",
      required: true,
      options: (ordresData?.donnees ?? []).map((o) => ({
        label: o.libelle,
        value: o.id,
      })),
    },
    { name: "code", label: "Code", type: "text", required: true, placeholder: "SEC_1" },
    { name: "libelle", label: "Libellé", type: "text", required: true },
    { name: "libelleEn", label: "Libellé (EN)", type: "text" },
    { name: "rang", label: "Rang", type: "number", required: true, step: 1 },
    {
      name: "dureeTheoriqueAnnees",
      label: "Durée théorique (années)",
      type: "number",
      required: true,
      step: 1,
      helpText: "Entre 1 et 8 ans.",
    },
    { name: "description", label: "Description", type: "textarea" },
  ]
  const editFields = updatableFields(createFields, STRUCTURAL_FIELDS)

  const rows: CycleRow[] = (data?.donnees ?? []).map((dto) => {
    const sousSysteme = sousSystemeById.get(dto.sousSystemeId)
    const ordre = ordreById.get(dto.ordreEnseignementId)
    return {
      id: dto.id,
      code: dto.code,
      libelle: dto.libelle,
      sousSystemeId: dto.sousSystemeId,
      sousSystemeLibelle: sousSysteme?.libelle ?? dto.sousSystemeId,
      ordreEnseignementId: dto.ordreEnseignementId,
      ordreEnseignementLibelle: ordre?.libelle ?? dto.ordreEnseignementId,
      rang: dto.rang,
      dureeTheoriqueAnnees: dto.dureeTheoriqueAnnees,
      etat: dto.etat,
      detail: {
        id: dto.id,
        code: dto.code,
        titre: dto.libelle,
        sousTitre: [sousSysteme?.libelle, ordre?.libelle]
          .filter(Boolean)
          .join(" · "),
        description: dto.description,
        champs: [
          { label: "Sous-système", value: sousSysteme?.libelle ?? dto.sousSystemeId },
          { label: "Ordre d'enseignement", value: ordre?.libelle ?? dto.ordreEnseignementId },
          { label: "Rang", value: dto.rang },
          { label: "Durée théorique", value: `${dto.dureeTheoriqueAnnees} an(s)` },
          { label: "Libellé (EN)", value: dto.libelleEn },
        ],
        lifecycle: dto,
      },
    }
  })

  const filters: DataTableFilterConfig[] = [
    {
      columnId: "sousSystemeLibelle",
      title: "Sous-système",
      options: (sousSystemesData?.donnees ?? []).map((s) => ({
        label: s.libelle,
        value: s.id,
      })),
    },
    {
      columnId: "ordreEnseignementLibelle",
      title: "Ordre",
      options: (ordresData?.donnees ?? []).map((o) => ({
        label: o.libelle,
        value: o.id,
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
        title="Cycles"
        description="Cycles rattachés à un sous-système et un ordre d'enseignement (doc section 3.4)."
        action={
          <ResourceCreateButton<CreateCycleInput, unknown>
            sheetTitle="Ajouter un cycle"
            fields={createFields}
            useCreate={cycleQueries.useCreate}
          />
        }
      />
      {selected ? (
        <ReferenceDetailCard
          item={selected}
          onBack={() => setSelected(null)}
          backLabel="Retour au tableau"
          actions={
            <ResourceActions<UpdateCycleInput, unknown>
              id={selected.id}
              etat={selected.lifecycle.etat}
              titre={selected.titre}
              editFields={editFields}
              initialValues={rawById.get(selected.id) ?? {}}
              useUpdate={cycleQueries.useUpdate}
              useDeprecier={cycleQueries.useDeprecier}
            />
          }
        />
      ) : (
        <ReferenceDataTable
          columns={columns}
          data={rows}
          isLoading={isLoading}
          searchPlaceholder="Rechercher un cycle…"
          filters={filters}
          onRowClick={(row) => setSelected(row.detail)}
          emptyMessage="Aucun cycle."
        />
      )}
    </div>
  )
}
