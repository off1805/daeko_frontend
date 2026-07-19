"use client"

import * as React from "react"
import type { UseMutationResult } from "@tanstack/react-query"
import { PlusIcon } from "lucide-react"

import { Button } from "~/components/ui/button"
import {
  getErrorMessage,
  type FormField,
  type ParsedFormValues,
} from "~/modules/referentiel/presentation/components/forms/form-field"
import { REFERENTIEL_AUTEUR_ID } from "~/modules/referentiel/presentation/components/forms/referentiel-actor"
import { ResourceFormSheet } from "~/modules/referentiel/presentation/components/forms/resource-form-sheet"

interface ResourceCreateButtonProps<TCreateInput, TDto> {
  label?: string
  sheetTitle: string
  sheetDescription?: string
  fields: FormField[]
  useCreate: () => UseMutationResult<
    TDto,
    unknown,
    { data: TCreateInput; auteurId: string }
  >
}

/** Bouton "Ajouter" placé dans l'en-tête de section (doc section 5.2 : POST /{ressource}). */
export function ResourceCreateButton<TCreateInput, TDto>({
  label = "Ajouter",
  sheetTitle,
  sheetDescription,
  fields,
  useCreate,
}: ResourceCreateButtonProps<TCreateInput, TDto>) {
  const [open, setOpen] = React.useState(false)
  const createMutation = useCreate()

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <PlusIcon />
        {label}
      </Button>

      <ResourceFormSheet
        open={open}
        onOpenChange={setOpen}
        title={sheetTitle}
        description={sheetDescription}
        fields={fields}
        submitLabel="Créer"
        isSubmitting={createMutation.isPending}
        error={createMutation.error ? getErrorMessage(createMutation.error) : null}
        onSubmit={(values: ParsedFormValues) => {
          createMutation.mutate(
            { data: values as TCreateInput, auteurId: REFERENTIEL_AUTEUR_ID },
            { onSuccess: () => setOpen(false) },
          )
        }}
      />
    </>
  )
}
