"use client"

import * as React from "react"
import { CalendarPlusIcon } from "lucide-react"

import { Button } from "~/components/ui/button"
import {
  getErrorMessage,
  type FormField,
  type ParsedFormValues,
} from "~/shared/presentation/forms/form-field"
import { ResourceFormSheet } from "~/shared/presentation/forms/resource-form-sheet"
import { useCreerAnnee } from "~/modules/structure-pedagogique/infrastructure/queries/structure.queries"
import type { CreateAnneeAcademiqueInput } from "~/modules/structure-pedagogique/domain/repositories/structure.repository"

const fields: FormField[] = [
  { name: "libelle", label: "Libellé", type: "text", required: true, placeholder: "2026-2027" },
  { name: "dateDebut", label: "Date de début", type: "text", required: true, placeholder: "2026-09-01" },
  { name: "dateFin", label: "Date de fin", type: "text", required: true, placeholder: "2027-07-31" },
]

/**
 * Geste rare qui déclenche la "fenêtre de rentrée" (vision UX) : c'est
 * cette création qui bascule l'écran Ma structure de l'état stable à
 * l'état rentrée, dès que l'année existe (EN_PREPARATION).
 */
export function CreerAnneeSheet() {
  const [open, setOpen] = React.useState(false)
  const creerAnnee = useCreerAnnee()

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <CalendarPlusIcon />
        Nouvelle année académique
      </Button>
      <ResourceFormSheet
        open={open}
        onOpenChange={setOpen}
        title="Créer une nouvelle année académique"
        description="Dates au format AAAA-MM-JJ. La création ouvre la fenêtre de rentrée sur Ma structure."
        fields={fields}
        submitLabel="Créer"
        isSubmitting={creerAnnee.isPending}
        error={creerAnnee.error ? getErrorMessage(creerAnnee.error) : null}
        onSubmit={(values: ParsedFormValues) => {
          creerAnnee.mutate(values as unknown as CreateAnneeAcademiqueInput, {
            onSuccess: () => setOpen(false),
          })
        }}
      />
    </>
  )
}
