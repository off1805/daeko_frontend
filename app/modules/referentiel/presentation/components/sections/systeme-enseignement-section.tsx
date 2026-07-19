"use client"

import * as React from "react"

import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"
import type {
  CreateOrdreEnseignementInput,
  CreateSousSystemeInput,
  CreateTypeEnseignementInput,
  UpdateOrdreEnseignementInput,
  UpdateSousSystemeInput,
  UpdateTypeEnseignementInput,
} from "~/modules/referentiel/domain/repositories/referentiel.repository"
import type { FormField } from "~/modules/referentiel/presentation/components/forms/form-field"
import { ResourceActions } from "~/modules/referentiel/presentation/components/forms/resource-actions"
import { ResourceCreateButton } from "~/modules/referentiel/presentation/components/forms/resource-create-button"
import {
  ReferenceCardGrid,
  type ReferenceCardItem,
} from "~/modules/referentiel/presentation/components/reference-card-grid"
import { ReferentielSectionHeader } from "~/modules/referentiel/presentation/components/referentiel-section-header"
import {
  ordreEnseignementQueries,
  sousSystemeQueries,
  typeEnseignementQueries,
} from "~/modules/referentiel/infrastructure/queries/referentiel.queries"

const sousSystemeFields: FormField[] = [
  { name: "code", label: "Code", type: "text", required: true, placeholder: "FR" },
  {
    name: "libelle",
    label: "Libellé",
    type: "text",
    required: true,
    placeholder: "Francophone",
  },
  { name: "libelleCourt", label: "Libellé court", type: "text", placeholder: "FR" },
  {
    name: "languePrincipale",
    label: "Langue principale",
    type: "text",
    required: true,
    placeholder: "fr",
    helpText: "Code ISO 639-1 (ex : fr, en).",
  },
  { name: "description", label: "Description", type: "textarea" },
]

const typeEnseignementFields: FormField[] = [
  { name: "code", label: "Code", type: "text", required: true, placeholder: "GENERAL" },
  {
    name: "libelle",
    label: "Libellé",
    type: "text",
    required: true,
    placeholder: "Enseignement général",
  },
  { name: "description", label: "Description", type: "textarea" },
]

const ordreEnseignementFields: FormField[] = [
  {
    name: "code",
    label: "Code",
    type: "text",
    required: true,
    placeholder: "SECONDAIRE",
  },
  { name: "libelle", label: "Libellé", type: "text", required: true },
  { name: "rang", label: "Rang", type: "number", required: true, step: 1 },
  { name: "tutelleMinisterielle", label: "Tutelle ministérielle", type: "text" },
  {
    name: "tutelleMinisterielleEn",
    label: "Tutelle ministérielle (EN)",
    type: "text",
  },
  { name: "description", label: "Description", type: "textarea" },
]

function SousSystemesPanel() {
  const { data, isLoading } = sousSystemeQueries.useList({
    etat: "TOUS",
    taille: 200,
  })

  const items: ReferenceCardItem[] = (data?.donnees ?? []).map((dto) => ({
    id: dto.id,
    code: dto.code,
    titre: dto.libelle,
    sousTitre: `Langue principale : ${dto.languePrincipale.toUpperCase()}`,
    description: dto.description,
    champs: [
      { label: "Libellé court", value: dto.libelleCourt },
      { label: "Langue principale", value: dto.languePrincipale.toUpperCase() },
    ],
    lifecycle: dto,
  }))

  const rawByid = new Map((data?.donnees ?? []).map((dto) => [dto.id, dto]))

  return (
    <ReferenceCardGrid
      items={items}
      isLoading={isLoading}
      emptyMessage="Aucun sous-système d'enseignement."
      renderActions={(item) => (
        <ResourceActions<UpdateSousSystemeInput, unknown>
          id={item.id}
          etat={item.lifecycle.etat}
          titre={item.titre}
          editFields={sousSystemeFields}
          initialValues={rawByid.get(item.id) ?? {}}
          useUpdate={sousSystemeQueries.useUpdate}
          useDeprecier={sousSystemeQueries.useDeprecier}
        />
      )}
    />
  )
}

function TypesEnseignementPanel() {
  const { data, isLoading } = typeEnseignementQueries.useList({
    etat: "TOUS",
    taille: 200,
  })

  const items: ReferenceCardItem[] = (data?.donnees ?? []).map((dto) => ({
    id: dto.id,
    code: dto.code,
    titre: dto.libelle,
    description: dto.description,
    champs: [],
    lifecycle: dto,
  }))

  const rawByid = new Map((data?.donnees ?? []).map((dto) => [dto.id, dto]))

  return (
    <ReferenceCardGrid
      items={items}
      isLoading={isLoading}
      emptyMessage="Aucun type d'enseignement."
      renderActions={(item) => (
        <ResourceActions<UpdateTypeEnseignementInput, unknown>
          id={item.id}
          etat={item.lifecycle.etat}
          titre={item.titre}
          editFields={typeEnseignementFields}
          initialValues={rawByid.get(item.id) ?? {}}
          useUpdate={typeEnseignementQueries.useUpdate}
          useDeprecier={typeEnseignementQueries.useDeprecier}
        />
      )}
    />
  )
}

function OrdresEnseignementPanel() {
  const { data, isLoading } = ordreEnseignementQueries.useList({
    etat: "TOUS",
    taille: 200,
  })

  const items: ReferenceCardItem[] = (data?.donnees ?? [])
    .slice()
    .sort((a, b) => a.rang - b.rang)
    .map((dto) => ({
      id: dto.id,
      code: dto.code,
      titre: dto.libelle,
      sousTitre: dto.tutelleMinisterielle
        ? `Tutelle : ${dto.tutelleMinisterielle}`
        : undefined,
      description: dto.description,
      champs: [
        { label: "Rang", value: dto.rang },
        { label: "Tutelle ministérielle", value: dto.tutelleMinisterielle },
        { label: "Tutelle (EN)", value: dto.tutelleMinisterielleEn },
      ],
      lifecycle: dto,
    }))

  const rawByid = new Map((data?.donnees ?? []).map((dto) => [dto.id, dto]))

  return (
    <ReferenceCardGrid
      items={items}
      isLoading={isLoading}
      emptyMessage="Aucun ordre d'enseignement."
      renderActions={(item) => (
        <ResourceActions<UpdateOrdreEnseignementInput, unknown>
          id={item.id}
          etat={item.lifecycle.etat}
          titre={item.titre}
          editFields={ordreEnseignementFields}
          initialValues={rawByid.get(item.id) ?? {}}
          useUpdate={ordreEnseignementQueries.useUpdate}
          useDeprecier={ordreEnseignementQueries.useDeprecier}
        />
      )}
    />
  )
}

type SystemeTab = "sous-systemes" | "types-enseignement" | "ordres-enseignement"

export function SystemeEnseignementSection() {
  const [tab, setTab] = React.useState<SystemeTab>("sous-systemes")

  const createAction =
    tab === "sous-systemes" ? (
      <ResourceCreateButton<CreateSousSystemeInput, unknown>
        sheetTitle="Ajouter un sous-système"
        fields={sousSystemeFields}
        useCreate={sousSystemeQueries.useCreate}
      />
    ) : tab === "types-enseignement" ? (
      <ResourceCreateButton<CreateTypeEnseignementInput, unknown>
        sheetTitle="Ajouter un type d'enseignement"
        fields={typeEnseignementFields}
        useCreate={typeEnseignementQueries.useCreate}
      />
    ) : (
      <ResourceCreateButton<CreateOrdreEnseignementInput, unknown>
        sheetTitle="Ajouter un ordre d'enseignement"
        fields={ordreEnseignementFields}
        useCreate={ordreEnseignementQueries.useCreate}
      />
    )

  return (
    <div className="flex flex-col gap-4">
      <ReferentielSectionHeader
        title="Système d'enseignement"
        description="Sous-systèmes, types et ordres d'enseignement — tables racines du référentiel (doc section 3.3)."
        action={createAction}
      />

      <Tabs value={tab} onValueChange={(value) => setTab(value as SystemeTab)}>
        <TabsList>
          <TabsTrigger value="sous-systemes">Sous-systèmes</TabsTrigger>
          <TabsTrigger value="types-enseignement">
            Types d'enseignement
          </TabsTrigger>
          <TabsTrigger value="ordres-enseignement">
            Ordres d'enseignement
          </TabsTrigger>
          <TabsIndicator />
        </TabsList>

        <TabsContent value="sous-systemes" className="pt-2">
          <SousSystemesPanel />
        </TabsContent>
        <TabsContent value="types-enseignement" className="pt-2">
          <TypesEnseignementPanel />
        </TabsContent>
        <TabsContent value="ordres-enseignement" className="pt-2">
          <OrdresEnseignementPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
