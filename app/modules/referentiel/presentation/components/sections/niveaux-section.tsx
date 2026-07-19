"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { XIcon } from "lucide-react"

import { Button } from "~/components/ui/button"
import { DataTableColumnHeader } from "~/modules/referentiel/presentation/components/data-table/data-table-column-header"
import { FilterMenu } from "~/modules/referentiel/presentation/components/data-table/filter-menu"
import { ReferenceDataTable } from "~/modules/referentiel/presentation/components/data-table/reference-data-table"
import { EtatBadge } from "~/modules/referentiel/presentation/components/etat-badge"
import type {
  CreateNiveauInput,
  UpdateNiveauInput,
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
  niveauQueries,
  ordreEnseignementQueries,
  sousSystemeQueries,
} from "~/modules/referentiel/infrastructure/queries/referentiel.queries"

const STRUCTURAL_FIELDS = ["cycleId"]

interface NiveauRow {
  id: string
  code: string
  libelle: string
  sousSystemeId: string
  sousSystemeLibelle: string
  ordreEnseignementId: string
  ordreEnseignementLibelle: string
  cycleId: string
  cycleLibelle: string
  rangDansCycle: number
  ageTheoriqueDebut?: number
  etat: EtatReferentiel
  detail: ReferenceCardItem
}

const columns: ColumnDef<NiveauRow, any>[] = [
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
    meta: { label: "Sous-système" },
  },
  {
    accessorKey: "ordreEnseignementLibelle",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ordre d'enseignement" />
    ),
    meta: { label: "Ordre d'enseignement" },
  },
  {
    accessorKey: "cycleLibelle",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cycle" />,
    meta: { label: "Cycle" },
  },
  {
    accessorKey: "rangDansCycle",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rang dans le cycle" />
    ),
    meta: { label: "Rang dans le cycle" },
  },
  {
    accessorKey: "ageTheoriqueDebut",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Âge théorique" />
    ),
    cell: ({ row }) => row.original.ageTheoriqueDebut ?? "—",
    meta: { label: "Âge théorique" },
  },
  {
    accessorKey: "etat",
    header: ({ column }) => <DataTableColumnHeader column={column} title="État" />,
    cell: ({ row }) => <EtatBadge etat={row.original.etat} />,
    meta: { label: "État" },
  },
]

export function NiveauxSection() {
  const [selected, setSelected] = React.useState<ReferenceCardItem | null>(null)
  const [sousSystemeId, setSousSystemeId] = React.useState<string>()
  const [ordreEnseignementId, setOrdreEnseignementId] = React.useState<string>()
  const [cycleId, setCycleId] = React.useState<string>()
  const [etatFiltre, setEtatFiltre] = React.useState<string>()

  const { data, isLoading } = niveauQueries.useList({ etat: "TOUS", taille: 200 })
  const { data: cyclesData } = cycleQueries.useList({ etat: "TOUS", taille: 200 })
  const { data: sousSystemesData } = sousSystemeQueries.useList({
    etat: "TOUS",
    taille: 200,
  })
  const { data: ordresData } = ordreEnseignementQueries.useList({
    etat: "TOUS",
    taille: 200,
  })

  const cycles = cyclesData?.donnees ?? []
  const sousSystemeById = new Map(
    (sousSystemesData?.donnees ?? []).map((s) => [s.id, s]),
  )
  const ordreById = new Map((ordresData?.donnees ?? []).map((o) => [o.id, o]))
  const cycleById = new Map(cycles.map((c) => [c.id, c]))
  const rawById = new Map((data?.donnees ?? []).map((dto) => [dto.id, dto]))

  // Les libellés de cycle se répètent d'un sous-système à l'autre (ex :
  // "Premier cycle" en FR et en EN) — d'où la qualification systématique
  // par sous-système/ordre, même problème que celui résolu pour le tableau.
  const createFields: FormField[] = [
    {
      name: "cycleId",
      label: "Cycle",
      type: "select",
      required: true,
      options: cycles.map((c) => ({
        value: c.id,
        label: `${c.libelle} (${sousSystemeById.get(c.sousSystemeId)?.libelle ?? "?"} · ${
          ordreById.get(c.ordreEnseignementId)?.libelle ?? "?"
        })`,
      })),
    },
    { name: "code", label: "Code", type: "text", required: true, placeholder: "6EME" },
    { name: "libelle", label: "Libellé", type: "text", required: true },
    { name: "libelleCourt", label: "Libellé court", type: "text" },
    { name: "libelleEn", label: "Libellé (EN)", type: "text" },
    {
      name: "rangDansCycle",
      label: "Rang dans le cycle",
      type: "number",
      required: true,
      step: 1,
    },
    { name: "ageTheoriqueDebut", label: "Âge théorique de début", type: "number", step: 1 },
    { name: "description", label: "Description", type: "textarea" },
  ]
  const editFields = updatableFields(createFields, STRUCTURAL_FIELDS)

  const rows: NiveauRow[] = (data?.donnees ?? []).map((dto) => {
    const cycle = cycleById.get(dto.cycleId)
    const sousSysteme = cycle ? sousSystemeById.get(cycle.sousSystemeId) : undefined
    const ordre = cycle ? ordreById.get(cycle.ordreEnseignementId) : undefined
    return {
      id: dto.id,
      code: dto.code,
      libelle: dto.libelle,
      sousSystemeId: cycle?.sousSystemeId ?? "",
      sousSystemeLibelle: sousSysteme?.libelle ?? "—",
      ordreEnseignementId: cycle?.ordreEnseignementId ?? "",
      ordreEnseignementLibelle: ordre?.libelle ?? "—",
      cycleId: dto.cycleId,
      cycleLibelle: cycle?.libelle ?? dto.cycleId,
      rangDansCycle: dto.rangDansCycle,
      ageTheoriqueDebut: dto.ageTheoriqueDebut,
      etat: dto.etat,
      detail: {
        id: dto.id,
        code: dto.code,
        titre: dto.libelle,
        sousTitre: [sousSysteme?.libelle, ordre?.libelle, cycle?.libelle]
          .filter(Boolean)
          .join(" · "),
        description: dto.description,
        champs: [
          { label: "Sous-système", value: sousSysteme?.libelle },
          { label: "Ordre d'enseignement", value: ordre?.libelle },
          { label: "Cycle", value: cycle?.libelle ?? dto.cycleId },
          { label: "Rang dans le cycle", value: dto.rangDansCycle },
          { label: "Libellé court", value: dto.libelleCourt },
          { label: "Âge théorique de début", value: dto.ageTheoriqueDebut },
          { label: "Libellé (EN)", value: dto.libelleEn },
        ],
        lifecycle: dto,
      },
    }
  })

  // Options en cascade : les combinaisons possibles sont dérivées des
  // cycles réellement rattachés (sous_systeme_id, ordre_enseignement_id),
  // pas d'une relation statique — un sous-système choisi ne propose donc
  // que les ordres qui ont au moins un cycle sous ce sous-système.
  const sousSystemeOptions = Array.from(
    new Map(
      cycles.map((c) => [
        c.sousSystemeId,
        sousSystemeById.get(c.sousSystemeId)?.libelle ?? c.sousSystemeId,
      ]),
    ),
  ).map(([value, label]) => ({ value, label }))

  const ordresDisponibles = cycles.filter(
    (c) => !sousSystemeId || c.sousSystemeId === sousSystemeId,
  )
  const ordreOptions = Array.from(
    new Map(
      ordresDisponibles.map((c) => [
        c.ordreEnseignementId,
        ordreById.get(c.ordreEnseignementId)?.libelle ?? c.ordreEnseignementId,
      ]),
    ),
  ).map(([value, label]) => ({ value, label }))

  const cyclesDisponibles = ordresDisponibles.filter(
    (c) => !ordreEnseignementId || c.ordreEnseignementId === ordreEnseignementId,
  )
  const cycleOptions = cyclesDisponibles.map((c) => ({
    value: c.id,
    label: c.libelle,
  }))

  const hasActiveFilter = Boolean(
    sousSystemeId || ordreEnseignementId || cycleId || etatFiltre,
  )

  const filteredRows = rows.filter((row) => {
    if (sousSystemeId && row.sousSystemeId !== sousSystemeId) return false
    if (ordreEnseignementId && row.ordreEnseignementId !== ordreEnseignementId)
      return false
    if (cycleId && row.cycleId !== cycleId) return false
    if (etatFiltre && row.etat !== etatFiltre) return false
    return true
  })

  return (
    <div className="flex flex-col gap-4">
      <ReferentielSectionHeader
        title="Niveaux"
        description="Niveaux rattachés à un cycle (doc section 3.4)."
        action={
          <ResourceCreateButton<CreateNiveauInput, unknown>
            sheetTitle="Ajouter un niveau"
            fields={createFields}
            useCreate={niveauQueries.useCreate}
          />
        }
      />

      {!selected ? (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/60 bg-muted/20 p-3">
          <span className="text-xs font-medium text-muted-foreground">
            Filtrer par :
          </span>
          <FilterMenu
            entries={[
              {
                key: "sousSysteme",
                title: "Sous-système",
                value: sousSystemeId,
                onChange: (value) => {
                  setSousSystemeId(value)
                  setOrdreEnseignementId(undefined)
                  setCycleId(undefined)
                },
                options: sousSystemeOptions,
              },
              {
                key: "ordre",
                title: "Ordre d'enseignement",
                value: ordreEnseignementId,
                onChange: (value) => {
                  setOrdreEnseignementId(value)
                  setCycleId(undefined)
                },
                options: ordreOptions,
              },
              {
                key: "cycle",
                title: "Cycle",
                value: cycleId,
                onChange: setCycleId,
                options: cycleOptions,
              },
              {
                key: "etat",
                title: "État",
                value: etatFiltre,
                onChange: setEtatFiltre,
                options: [
                  { label: "Actif", value: "ACTIVE" },
                  { label: "Déprécié", value: "DEPRECATED" },
                ],
              },
            ]}
          />
          {hasActiveFilter ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSousSystemeId(undefined)
                setOrdreEnseignementId(undefined)
                setCycleId(undefined)
                setEtatFiltre(undefined)
              }}
            >
              Réinitialiser
              <XIcon />
            </Button>
          ) : null}
        </div>
      ) : null}

      {selected ? (
        <ReferenceDetailCard
          item={selected}
          onBack={() => setSelected(null)}
          backLabel="Retour au tableau"
          actions={
            <ResourceActions<UpdateNiveauInput, unknown>
              id={selected.id}
              etat={selected.lifecycle.etat}
              titre={selected.titre}
              editFields={editFields}
              initialValues={rawById.get(selected.id) ?? {}}
              useUpdate={niveauQueries.useUpdate}
              useDeprecier={niveauQueries.useDeprecier}
            />
          }
        />
      ) : (
        <ReferenceDataTable
          columns={columns}
          data={filteredRows}
          isLoading={isLoading}
          searchPlaceholder="Rechercher un niveau…"
          onRowClick={(row) => setSelected(row.detail)}
          emptyMessage="Aucun niveau ne correspond à ces critères."
        />
      )}
    </div>
  )
}
