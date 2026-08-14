"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"

import { Button } from "~/components/ui/button"
import {
  getErrorMessage,
  type FormField,
  type ParsedFormValues,
} from "~/shared/presentation/forms/form-field"
import { ResourceFormSheet } from "~/shared/presentation/forms/resource-form-sheet"
import { useCreerMatiereLocale } from "~/modules/structure-pedagogique/infrastructure/queries/structure.queries"
import type { CreateMatiereLocaleInput } from "~/modules/structure-pedagogique/domain/repositories/structure.repository"

const fields: FormField[] = [
  { name: "code", label: "Code", type: "text", required: true, placeholder: "CATE" },
  { name: "libelle", label: "Libellé", type: "text", required: true, placeholder: "Catéchèse" },
  { name: "libelleCourt", label: "Libellé court", type: "text" },
  { name: "libelleEn", label: "Libellé (EN)", type: "text" },
  {
    name: "domaine",
    label: "Domaine",
    type: "select",
    required: true,
    options: [
      { value: "SCIENCES", label: "Sciences" },
      { value: "LETTRES", label: "Lettres" },
      { value: "LANGUES", label: "Langues" },
      { value: "SCIENCES_HUMAINES", label: "Sciences humaines" },
      { value: "ARTS", label: "Arts" },
      { value: "SPORT", label: "Sport" },
      { value: "TECHNIQUE", label: "Technique" },
      { value: "TRANSVERSAL", label: "Transversal" },
    ],
  },
  {
    name: "typeMatiere",
    label: "Type",
    type: "select",
    required: true,
    options: [
      { value: "FONDAMENTALE", label: "Fondamentale" },
      { value: "SECONDAIRE", label: "Secondaire" },
      { value: "OPTIONNELLE", label: "Optionnelle" },
      { value: "TRANSVERSALE", label: "Transversale" },
    ],
  },
  { name: "baremeParDefaut", label: "Barème par défaut", type: "number", step: 1, placeholder: "20" },
]

/**
 * Matières locales (doc 3.3) : extensions propres à l'école, invisibles
 * hors de l'établissement — catéchèse, langues locales... Point d'entrée
 * unique côté Configuration, réutilisé ensuite par l'éditeur de matières
 * actives (assistant et mode libre) une fois créées.
 */
export function CreerMatiereLocaleSheet({ brancheId }: { brancheId: string }) {
  const [open, setOpen] = React.useState(false)
  const creer = useCreerMatiereLocale()

  return (
    <>
      <Button variant="outline" size="xs" onClick={() => setOpen(true)}>
        <PlusIcon />
        Matière locale
      </Button>
      <ResourceFormSheet
        open={open}
        onOpenChange={setOpen}
        title="Créer une matière locale"
        description="Propre à cette branche, invisible hors de l'école — catéchèse, langue locale..."
        fields={fields}
        submitLabel="Créer"
        isSubmitting={creer.isPending}
        error={creer.error ? getErrorMessage(creer.error) : null}
        onSubmit={(values: ParsedFormValues) => {
          creer.mutate(
            { ...values, brancheId } as unknown as CreateMatiereLocaleInput,
            { onSuccess: () => setOpen(false) },
          )
        }}
      />
    </>
  )
}
