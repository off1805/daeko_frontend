"use client"

import * as React from "react"

import { Button } from "~/components/ui/button"
import { PlusIcon } from "lucide-react"
import {
  getErrorMessage,
  type FormField,
  type ParsedFormValues,
} from "~/shared/presentation/forms/form-field"
import { ResourceFormSheet } from "~/shared/presentation/forms/resource-form-sheet"
import {
  ordreEnseignementQueries,
  sousSystemeQueries,
  typeEnseignementQueries,
} from "~/modules/referentiel/presentation"
import {
  useActiverBranche,
  useCreerBranche,
} from "~/modules/structure-pedagogique/infrastructure/queries/structure.queries"
import type { CreateBrancheInput } from "~/modules/structure-pedagogique/domain/repositories/structure.repository"

interface DeclarerBrancheSheetProps {
  /** Geste rare, presque cérémonieux (vision UX) : le déclencheur (bouton, carte
   * d'onboarding...) est fourni par l'appelant, ce composant ne rend que le panneau. */
  trigger: (open: () => void) => React.ReactNode
  onCreated?: (brancheId: string) => void
}

export function DeclarerBrancheSheet({ trigger, onCreated }: DeclarerBrancheSheetProps) {
  const [open, setOpen] = React.useState(false)
  const creerBranche = useCreerBranche()
  const activerBranche = useActiverBranche()

  const { data: sousSystemes } = sousSystemeQueries.useList({ taille: 200 })
  const { data: ordres } = ordreEnseignementQueries.useList({ taille: 200 })
  const { data: types } = typeEnseignementQueries.useList({ taille: 200 })

  const fields: FormField[] = [
    {
      name: "sousSystemeId",
      label: "Sous-système d'enseignement",
      type: "select",
      required: true,
      options: (sousSystemes?.donnees ?? []).map((s) => ({ value: s.id, label: s.libelle })),
    },
    {
      name: "ordreEnseignementId",
      label: "Ordre d'enseignement",
      type: "select",
      required: true,
      options: (ordres?.donnees ?? []).map((o) => ({ value: o.id, label: o.libelle })),
    },
    {
      name: "typeEnseignementId",
      label: "Type d'enseignement",
      type: "select",
      required: true,
      options: (types?.donnees ?? []).map((t) => ({ value: t.id, label: t.libelle })),
    },
    {
      name: "libelle",
      label: "Libellé",
      type: "text",
      placeholder: "Laisser vide pour un libellé auto-généré",
      helpText: "Ex : « Francophone — Secondaire — Général ».",
    },
  ]

  return (
    <>
      {trigger(() => setOpen(true))}
      <ResourceFormSheet
        open={open}
        onOpenChange={setOpen}
        title="Déclarer une branche"
        description="Une branche est permanente : elle traverse les années. Le triplet sous-système × ordre × type ne pourra plus être modifié après création."
        fields={fields}
        submitLabel="Déclarer"
        isSubmitting={creerBranche.isPending}
        error={creerBranche.error ? getErrorMessage(creerBranche.error) : null}
        onSubmit={(values: ParsedFormValues) => {
          creerBranche.mutate(values as unknown as CreateBrancheInput, {
            onSuccess: (dto) => {
              // Une branche fraîchement déclarée est immédiatement activée :
              // l'état EN_CONFIGURATION (doc 4.5) existe côté domaine mais
              // l'activation manuelle n'apporte rien à l'expérience — la
              // vision UX ne distingue pas ces deux gestes.
              activerBranche.mutate(dto.id, {
                onSettled: () => {
                  setOpen(false)
                  onCreated?.(dto.id)
                },
              })
            },
          })
        }}
      />
    </>
  )
}

export function DeclarerBrancheBoutonDiscret({ onCreated }: { onCreated?: (id: string) => void }) {
  return (
    <DeclarerBrancheSheet
      onCreated={onCreated}
      trigger={(open) => (
        <Button variant="outline" size="sm" onClick={open}>
          <PlusIcon />
          Ajouter une branche
        </Button>
      )}
    />
  )
}
