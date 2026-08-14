"use client"

import * as React from "react"
import type { UseMutationResult } from "@tanstack/react-query"
import { ArchiveIcon, PencilIcon } from "lucide-react"

import { Button } from "~/components/ui/button"
import { DeprecierDialog } from "~/shared/presentation/forms/deprecier-dialog"
import {
  getErrorMessage,
  type FormField,
  type ParsedFormValues,
} from "~/shared/presentation/forms/form-field"
import { REFERENTIEL_AUTEUR_ID } from "~/modules/referentiel/presentation/components/forms/referentiel-actor"
import { ResourceFormSheet } from "~/shared/presentation/forms/resource-form-sheet"
import type { EtatReferentiel } from "~/modules/referentiel/domain/shared/etat-referentiel"

interface ResourceActionsProps<TUpdateInput, TDto> {
  id: string
  etat: EtatReferentiel
  titre: string
  editFields: FormField[]
  initialValues: object
  useUpdate: () => UseMutationResult<
    TDto,
    unknown,
    { id: string; data: TUpdateInput; auteurId: string }
  >
  useDeprecier: () => UseMutationResult<
    TDto,
    unknown,
    { id: string; motif: string; auteurId: string; dateEffet?: string }
  >
}

/** Modifier / Déprécier pour la vue détail d'une ressource du référentiel (doc section 4.3, 5.2 : PATCH puis POST .../deprecier). */
export function ResourceActions<TUpdateInput, TDto>({
  id,
  etat,
  titre,
  editFields,
  initialValues,
  useUpdate,
  useDeprecier,
}: ResourceActionsProps<TUpdateInput, TDto>) {
  const [editOpen, setEditOpen] = React.useState(false)
  const [deprecierOpen, setDeprecierOpen] = React.useState(false)
  const updateMutation = useUpdate()
  const deprecierMutation = useDeprecier()

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
        <PencilIcon />
        Modifier
      </Button>
      {etat === "ACTIVE" ? (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setDeprecierOpen(true)}
        >
          <ArchiveIcon />
          Déprécier
        </Button>
      ) : null}

      <ResourceFormSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        title={`Modifier « ${titre} »`}
        fields={editFields}
        initialValues={initialValues}
        submitLabel="Enregistrer les modifications"
        isSubmitting={updateMutation.isPending}
        error={updateMutation.error ? getErrorMessage(updateMutation.error) : null}
        onSubmit={(values: ParsedFormValues) => {
          updateMutation.mutate(
            { id, data: values as TUpdateInput, auteurId: REFERENTIEL_AUTEUR_ID },
            { onSuccess: () => setEditOpen(false) },
          )
        }}
      />

      <DeprecierDialog
        open={deprecierOpen}
        onOpenChange={setDeprecierOpen}
        title={titre}
        isSubmitting={deprecierMutation.isPending}
        error={
          deprecierMutation.error ? getErrorMessage(deprecierMutation.error) : null
        }
        onConfirm={(input) => {
          deprecierMutation.mutate(
            { id, auteurId: REFERENTIEL_AUTEUR_ID, ...input },
            { onSuccess: () => setDeprecierOpen(false) },
          )
        }}
      />
    </>
  )
}
