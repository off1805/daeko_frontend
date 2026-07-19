"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "~/modules/referentiel/presentation/components/data-table/data-table-column-header"
import { ReferenceDataTable } from "~/modules/referentiel/presentation/components/data-table/reference-data-table"
import type { DataTableFilterConfig } from "~/modules/referentiel/presentation/components/data-table/data-table-types"
import { EtatBadge } from "~/modules/referentiel/presentation/components/etat-badge"
import type {
  CreateMatiereReferentielNiveauInput,
  UpdateMatiereReferentielNiveauInput,
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
  matiereReferentielNiveauQueries,
  matiereReferentielQueries,
  niveauQueries,
  serieQueries,
  useAllMatiereReferentielNiveauEntries,
} from "~/modules/referentiel/infrastructure/queries/referentiel.queries"

const STRUCTURAL_FIELDS = ["matiereReferentielId", "niveauId", "serieId"]

interface AffectationRow {
  id: string
  matiereId: string
  matiereLibelle: string
  matiereCode: string
  niveauId: string
  niveauLibelle: string
  serieId?: string
  serieLibelle: string
  estObligatoire: boolean
  coefficientSuggere?: number
  etat: EtatReferentiel
  detail: ReferenceCardItem
}

const columns: ColumnDef<AffectationRow, any>[] = [
  {
    accessorKey: "matiereLibelle",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Matière" />,
    filterFn: (row, _id, value) => row.original.matiereId === value,
    meta: { label: "Matière" },
  },
  {
    accessorKey: "niveauLibelle",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Niveau" />,
    filterFn: (row, _id, value) => row.original.niveauId === value,
    meta: { label: "Niveau" },
  },
  {
    accessorKey: "serieLibelle",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Série" />,
    filterFn: (row, _id, value) =>
      value === "__none__" ? !row.original.serieId : row.original.serieId === value,
    meta: { label: "Série" },
  },
  {
    accessorKey: "estObligatoire",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Obligatoire" />
    ),
    cell: ({ row }) => (row.original.estObligatoire ? "Oui" : "Non"),
    filterFn: (row, _id, value) => String(row.original.estObligatoire) === value,
    meta: { label: "Obligatoire" },
  },
  {
    accessorKey: "coefficientSuggere",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Coefficient" />
    ),
    cell: ({ row }) => row.original.coefficientSuggere ?? "—",
    meta: { label: "Coefficient" },
  },
  {
    accessorKey: "etat",
    header: ({ column }) => <DataTableColumnHeader column={column} title="État" />,
    cell: ({ row }) => <EtatBadge etat={row.original.etat} />,
    filterFn: (row, _id, value) => row.original.etat === value,
    meta: { label: "État" },
  },
]

export function AffectationsMatieresSection() {
  const [selected, setSelected] = React.useState<ReferenceCardItem | null>(null)
  const { data: matieresData } = matiereReferentielQueries.useList({
    etat: "TOUS",
    taille: 200,
  })
  const { data: niveauxData } = niveauQueries.useList({
    etat: "TOUS",
    taille: 200,
  })
  const { data: seriesData } = serieQueries.useList({
    etat: "TOUS",
    taille: 200,
  })
  const { donnees, isLoading } = useAllMatiereReferentielNiveauEntries()

  const matiereById = new Map((matieresData?.donnees ?? []).map((m) => [m.id, m]))
  const niveauById = new Map((niveauxData?.donnees ?? []).map((n) => [n.id, n]))
  const serieById = new Map((seriesData?.donnees ?? []).map((s) => [s.id, s]))
  const rawById = new Map(donnees.map((dto) => [dto.id, dto]))

  const createFields: FormField[] = [
    {
      name: "matiereReferentielId",
      label: "Matière",
      type: "select",
      required: true,
      options: (matieresData?.donnees ?? []).map((m) => ({
        label: m.libelle,
        value: m.id,
      })),
    },
    {
      name: "niveauId",
      label: "Niveau",
      type: "select",
      required: true,
      options: (niveauxData?.donnees ?? []).map((n) => ({
        label: n.libelle,
        value: n.id,
      })),
    },
    {
      name: "serieId",
      label: "Série",
      type: "select",
      options: [
        { label: "Toutes séries", value: "" },
        ...(seriesData?.donnees ?? []).map((s) => ({
          label: s.libelle,
          value: s.id,
        })),
      ],
      helpText: "Laisser sur « Toutes séries » pour une affectation non restreinte.",
    },
    {
      name: "estObligatoire",
      label: "Obligatoire",
      type: "switch",
      defaultChecked: true,
    },
    {
      name: "coefficientSuggere",
      label: "Coefficient suggéré",
      type: "number",
      step: 0.1,
    },
    { name: "sourceCoefficient", label: "Source du coefficient", type: "text" },
    { name: "baremeSpecifique", label: "Barème spécifique", type: "number", step: 1 },
    { name: "description", label: "Description", type: "textarea" },
  ]
  const editFields = updatableFields(createFields, STRUCTURAL_FIELDS)

  const rows: AffectationRow[] = donnees.map((dto) => {
    const matiere = matiereById.get(dto.matiereReferentielId)
    const niveau = niveauById.get(dto.niveauId)
    const serie = dto.serieId ? serieById.get(dto.serieId) : undefined

    return {
      id: dto.id,
      matiereId: dto.matiereReferentielId,
      matiereLibelle: matiere?.libelle ?? dto.matiereReferentielId,
      matiereCode: matiere?.code ?? "—",
      niveauId: dto.niveauId,
      niveauLibelle: niveau?.libelle ?? dto.niveauId,
      serieId: dto.serieId,
      serieLibelle: serie?.libelle ?? "Toutes séries",
      estObligatoire: dto.estObligatoire,
      coefficientSuggere: dto.coefficientSuggere,
      etat: dto.etat,
      detail: {
        id: dto.id,
        code: matiere?.code ?? "—",
        titre: matiere?.libelle ?? "Matière inconnue",
        sousTitre: [niveau?.libelle, serie?.libelle ?? "Toutes séries"]
          .filter(Boolean)
          .join(" · "),
        description: dto.description,
        champs: [
          { label: "Matière", value: matiere?.libelle ?? dto.matiereReferentielId },
          { label: "Niveau", value: niveau?.libelle ?? dto.niveauId },
          { label: "Série", value: serie?.libelle ?? "Toutes séries" },
          { label: "Obligatoire", value: dto.estObligatoire ? "Oui" : "Non" },
          { label: "Coefficient suggéré", value: dto.coefficientSuggere },
          { label: "Source du coefficient", value: dto.sourceCoefficient },
          { label: "Barème spécifique", value: dto.baremeSpecifique },
        ],
        lifecycle: dto,
      },
    }
  })

  const filters: DataTableFilterConfig[] = [
    {
      columnId: "matiereLibelle",
      title: "Matière",
      options: (matieresData?.donnees ?? []).map((m) => ({
        label: m.libelle,
        value: m.id,
      })),
    },
    {
      columnId: "niveauLibelle",
      title: "Niveau",
      options: (niveauxData?.donnees ?? []).map((n) => ({
        label: n.libelle,
        value: n.id,
      })),
    },
    {
      columnId: "serieLibelle",
      title: "Série",
      options: [
        { label: "Toutes séries", value: "__none__" },
        ...(seriesData?.donnees ?? []).map((s) => ({
          label: s.libelle,
          value: s.id,
        })),
      ],
    },
    {
      columnId: "estObligatoire",
      title: "Obligatoire",
      options: [
        { label: "Oui", value: "true" },
        { label: "Non", value: "false" },
      ],
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
        title="Affectations matières"
        description="Compatibilité matière × niveau × série et coefficient suggéré (doc section 3.6, matiere_referentiel_niveau)."
        action={
          <ResourceCreateButton<CreateMatiereReferentielNiveauInput, unknown>
            sheetTitle="Ajouter une affectation"
            fields={createFields}
            useCreate={matiereReferentielNiveauQueries.useCreate}
          />
        }
      />
      {selected ? (
        <ReferenceDetailCard
          item={selected}
          onBack={() => setSelected(null)}
          backLabel="Retour au tableau"
          actions={
            <ResourceActions<UpdateMatiereReferentielNiveauInput, unknown>
              id={selected.id}
              etat={selected.lifecycle.etat}
              titre={selected.titre}
              editFields={editFields}
              initialValues={rawById.get(selected.id) ?? {}}
              useUpdate={matiereReferentielNiveauQueries.useUpdate}
              useDeprecier={matiereReferentielNiveauQueries.useDeprecier}
            />
          }
        />
      ) : (
        <ReferenceDataTable
          columns={columns}
          data={rows}
          isLoading={isLoading}
          searchPlaceholder="Rechercher une affectation…"
          filters={filters}
          onRowClick={(row) => setSelected(row.detail)}
          emptyMessage="Aucune affectation de matière."
        />
      )}
    </div>
  )
}
