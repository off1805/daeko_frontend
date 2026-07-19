"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "~/modules/referentiel/presentation/components/data-table/data-table-column-header"
import { ReferenceDataTable } from "~/modules/referentiel/presentation/components/data-table/reference-data-table"
import type { DataTableFilterConfig } from "~/modules/referentiel/presentation/components/data-table/data-table-types"
import { EtatBadge } from "~/modules/referentiel/presentation/components/etat-badge"
import type {
  CreateFiliereInput,
  UpdateFiliereInput,
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
  filiereQueries,
  ordreEnseignementQueries,
  typeEnseignementQueries,
} from "~/modules/referentiel/infrastructure/queries/referentiel.queries"

const STRUCTURAL_FIELDS = ["ordreEnseignementId", "typeEnseignementId"]

interface FiliereRow {
  id: string
  code: string
  libelle: string
  ordreEnseignementId: string
  ordreEnseignementLibelle: string
  typeEnseignementId: string
  typeEnseignementLibelle: string
  etat: EtatReferentiel
  detail: ReferenceCardItem
}

const columns: ColumnDef<FiliereRow, any>[] = [
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
    accessorKey: "ordreEnseignementLibelle",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ordre d'enseignement" />
    ),
    filterFn: (row, _id, value) => row.original.ordreEnseignementId === value,
    meta: { label: "Ordre d'enseignement" },
  },
  {
    accessorKey: "typeEnseignementLibelle",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type d'enseignement" />
    ),
    filterFn: (row, _id, value) => row.original.typeEnseignementId === value,
    meta: { label: "Type d'enseignement" },
  },
  {
    accessorKey: "etat",
    header: ({ column }) => <DataTableColumnHeader column={column} title="État" />,
    cell: ({ row }) => <EtatBadge etat={row.original.etat} />,
    filterFn: (row, _id, value) => row.original.etat === value,
    meta: { label: "État" },
  },
]

export function FilieresSection() {
  const [selected, setSelected] = React.useState<ReferenceCardItem | null>(null)
  const { data, isLoading } = filiereQueries.useList({
    etat: "TOUS",
    taille: 200,
  })
  const { data: ordresData } = ordreEnseignementQueries.useList({
    etat: "TOUS",
    taille: 200,
  })
  const { data: typesData } = typeEnseignementQueries.useList({
    etat: "TOUS",
    taille: 200,
  })

  const ordreById = new Map((ordresData?.donnees ?? []).map((o) => [o.id, o]))
  const typeById = new Map((typesData?.donnees ?? []).map((t) => [t.id, t]))
  const rawById = new Map((data?.donnees ?? []).map((dto) => [dto.id, dto]))

  const createFields: FormField[] = [
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
    {
      name: "typeEnseignementId",
      label: "Type d'enseignement",
      type: "select",
      required: true,
      options: (typesData?.donnees ?? []).map((t) => ({
        label: t.libelle,
        value: t.id,
      })),
    },
    { name: "code", label: "Code", type: "text", required: true, placeholder: "GEN" },
    { name: "libelle", label: "Libellé", type: "text", required: true },
    { name: "libelleEn", label: "Libellé (EN)", type: "text" },
    { name: "description", label: "Description", type: "textarea" },
  ]
  const editFields = updatableFields(createFields, STRUCTURAL_FIELDS)

  const rows: FiliereRow[] = (data?.donnees ?? []).map((dto) => {
    const ordre = ordreById.get(dto.ordreEnseignementId)
    const type = typeById.get(dto.typeEnseignementId)
    return {
      id: dto.id,
      code: dto.code,
      libelle: dto.libelle,
      ordreEnseignementId: dto.ordreEnseignementId,
      ordreEnseignementLibelle: ordre?.libelle ?? dto.ordreEnseignementId,
      typeEnseignementId: dto.typeEnseignementId,
      typeEnseignementLibelle: type?.libelle ?? dto.typeEnseignementId,
      etat: dto.etat,
      detail: {
        id: dto.id,
        code: dto.code,
        titre: dto.libelle,
        sousTitre: [ordre?.libelle, type?.libelle].filter(Boolean).join(" · "),
        description: dto.description,
        champs: [
          { label: "Ordre d'enseignement", value: ordre?.libelle ?? dto.ordreEnseignementId },
          { label: "Type d'enseignement", value: type?.libelle ?? dto.typeEnseignementId },
          { label: "Libellé (EN)", value: dto.libelleEn },
        ],
        lifecycle: dto,
      },
    }
  })

  const filters: DataTableFilterConfig[] = [
    {
      columnId: "ordreEnseignementLibelle",
      title: "Ordre",
      options: (ordresData?.donnees ?? []).map((o) => ({
        label: o.libelle,
        value: o.id,
      })),
    },
    {
      columnId: "typeEnseignementLibelle",
      title: "Type",
      options: (typesData?.donnees ?? []).map((t) => ({
        label: t.libelle,
        value: t.id,
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
        title="Filières"
        description="Filières par ordre et type d'enseignement (doc section 3.5)."
        action={
          <ResourceCreateButton<CreateFiliereInput, unknown>
            sheetTitle="Ajouter une filière"
            fields={createFields}
            useCreate={filiereQueries.useCreate}
          />
        }
      />
      {selected ? (
        <ReferenceDetailCard
          item={selected}
          onBack={() => setSelected(null)}
          backLabel="Retour au tableau"
          actions={
            <ResourceActions<UpdateFiliereInput, unknown>
              id={selected.id}
              etat={selected.lifecycle.etat}
              titre={selected.titre}
              editFields={editFields}
              initialValues={rawById.get(selected.id) ?? {}}
              useUpdate={filiereQueries.useUpdate}
              useDeprecier={filiereQueries.useDeprecier}
            />
          }
        />
      ) : (
        <ReferenceDataTable
          columns={columns}
          data={rows}
          isLoading={isLoading}
          searchPlaceholder="Rechercher une filière…"
          filters={filters}
          onRowClick={(row) => setSelected(row.detail)}
          emptyMessage="Aucune filière."
        />
      )}
    </div>
  )
}
