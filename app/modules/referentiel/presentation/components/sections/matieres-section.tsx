"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "~/modules/referentiel/presentation/components/data-table/data-table-column-header"
import { ReferenceDataTable } from "~/modules/referentiel/presentation/components/data-table/reference-data-table"
import type { DataTableFilterConfig } from "~/modules/referentiel/presentation/components/data-table/data-table-types"
import { EtatBadge } from "~/modules/referentiel/presentation/components/etat-badge"
import type {
  CreateMatiereReferentielInput,
  UpdateMatiereReferentielInput,
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
import type {
  DomaineMatiere,
  TypeMatiere,
} from "~/modules/referentiel/domain/entities/catalogue-matieres.entity"
import type { EtatReferentiel } from "~/modules/referentiel/domain/shared/etat-referentiel"
import {
  matiereReferentielQueries,
  sousSystemeQueries,
} from "~/modules/referentiel/infrastructure/queries/referentiel.queries"

const STRUCTURAL_FIELDS = ["sousSystemeId"]

function humaniser(valeur: string): string {
  return valeur
    .toLowerCase()
    .split("_")
    .map((mot) => mot.charAt(0).toUpperCase() + mot.slice(1))
    .join(" ")
}

const DOMAINES: DomaineMatiere[] = [
  "SCIENCES",
  "LETTRES",
  "LANGUES",
  "SCIENCES_HUMAINES",
  "ARTS",
  "SPORT",
  "TECHNIQUE",
  "TRANSVERSAL",
]

const TYPES_MATIERE: TypeMatiere[] = [
  "FONDAMENTALE",
  "SECONDAIRE",
  "OPTIONNELLE",
  "TRANSVERSALE",
]

interface MatiereRow {
  id: string
  code: string
  libelle: string
  sousSystemeId: string
  sousSystemeLibelle: string
  domaine: DomaineMatiere
  typeMatiere: TypeMatiere
  baremeParDefaut: number
  etat: EtatReferentiel
  detail: ReferenceCardItem
}

const columns: ColumnDef<MatiereRow, any>[] = [
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
    accessorKey: "domaine",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Domaine" />,
    cell: ({ row }) => humaniser(row.original.domaine),
    filterFn: (row, _id, value) => row.original.domaine === value,
    meta: { label: "Domaine" },
  },
  {
    accessorKey: "typeMatiere",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type de matière" />
    ),
    cell: ({ row }) => humaniser(row.original.typeMatiere),
    filterFn: (row, _id, value) => row.original.typeMatiere === value,
    meta: { label: "Type de matière" },
  },
  {
    accessorKey: "baremeParDefaut",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Barème" />,
    cell: ({ row }) => `/ ${row.original.baremeParDefaut}`,
    meta: { label: "Barème" },
  },
  {
    accessorKey: "etat",
    header: ({ column }) => <DataTableColumnHeader column={column} title="État" />,
    cell: ({ row }) => <EtatBadge etat={row.original.etat} />,
    filterFn: (row, _id, value) => row.original.etat === value,
    meta: { label: "État" },
  },
]

export function MatieresSection() {
  const [selected, setSelected] = React.useState<ReferenceCardItem | null>(null)
  const { data, isLoading } = matiereReferentielQueries.useList({
    etat: "TOUS",
    taille: 200,
  })
  const { data: sousSystemesData } = sousSystemeQueries.useList({
    etat: "TOUS",
    taille: 200,
  })

  const sousSystemeById = new Map(
    (sousSystemesData?.donnees ?? []).map((s) => [s.id, s]),
  )
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
    { name: "code", label: "Code", type: "text", required: true, placeholder: "MATH" },
    { name: "libelle", label: "Libellé", type: "text", required: true },
    { name: "libelleCourt", label: "Libellé court", type: "text" },
    { name: "libelleEn", label: "Libellé (EN)", type: "text" },
    {
      name: "domaine",
      label: "Domaine",
      type: "select",
      required: true,
      options: DOMAINES.map((domaine) => ({
        label: humaniser(domaine),
        value: domaine,
      })),
    },
    {
      name: "typeMatiere",
      label: "Type de matière",
      type: "select",
      required: true,
      options: TYPES_MATIERE.map((type) => ({
        label: humaniser(type),
        value: type,
      })),
    },
    {
      name: "baremeParDefaut",
      label: "Barème par défaut",
      type: "number",
      step: 1,
      placeholder: "20",
    },
    { name: "description", label: "Description", type: "textarea" },
  ]
  const editFields = updatableFields(createFields, STRUCTURAL_FIELDS)

  const rows: MatiereRow[] = (data?.donnees ?? []).map((dto) => {
    const sousSysteme = sousSystemeById.get(dto.sousSystemeId)
    return {
      id: dto.id,
      code: dto.code,
      libelle: dto.libelle,
      sousSystemeId: dto.sousSystemeId,
      sousSystemeLibelle: sousSysteme?.libelle ?? dto.sousSystemeId,
      domaine: dto.domaine,
      typeMatiere: dto.typeMatiere,
      baremeParDefaut: dto.baremeParDefaut,
      etat: dto.etat,
      detail: {
        id: dto.id,
        code: dto.code,
        titre: dto.libelle,
        sousTitre: [sousSysteme?.libelle, humaniser(dto.domaine)]
          .filter(Boolean)
          .join(" · "),
        description: dto.description,
        champs: [
          { label: "Sous-système", value: sousSysteme?.libelle ?? dto.sousSystemeId },
          { label: "Domaine", value: humaniser(dto.domaine) },
          { label: "Type de matière", value: humaniser(dto.typeMatiere) },
          { label: "Barème par défaut", value: `/ ${dto.baremeParDefaut}` },
          { label: "Libellé court", value: dto.libelleCourt },
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
      columnId: "domaine",
      title: "Domaine",
      options: DOMAINES.map((domaine) => ({
        label: humaniser(domaine),
        value: domaine,
      })),
    },
    {
      columnId: "typeMatiere",
      title: "Type",
      options: TYPES_MATIERE.map((type) => ({
        label: humaniser(type),
        value: type,
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
        title="Matières"
        description="Catalogue officiel des matières du référentiel (doc section 3.6)."
        action={
          <ResourceCreateButton<CreateMatiereReferentielInput, unknown>
            sheetTitle="Ajouter une matière"
            fields={createFields}
            useCreate={matiereReferentielQueries.useCreate}
          />
        }
      />
      {selected ? (
        <ReferenceDetailCard
          item={selected}
          onBack={() => setSelected(null)}
          backLabel="Retour au tableau"
          actions={
            <ResourceActions<UpdateMatiereReferentielInput, unknown>
              id={selected.id}
              etat={selected.lifecycle.etat}
              titre={selected.titre}
              editFields={editFields}
              initialValues={rawById.get(selected.id) ?? {}}
              useUpdate={matiereReferentielQueries.useUpdate}
              useDeprecier={matiereReferentielQueries.useDeprecier}
            />
          }
        />
      ) : (
        <ReferenceDataTable
          columns={columns}
          data={rows}
          isLoading={isLoading}
          searchPlaceholder="Rechercher une matière…"
          filters={filters}
          onRowClick={(row) => setSelected(row.detail)}
          emptyMessage="Aucune matière."
        />
      )}
    </div>
  )
}
