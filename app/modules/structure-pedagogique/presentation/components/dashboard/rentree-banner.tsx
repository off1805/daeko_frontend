"use client"

import * as React from "react"
import { SparklesIcon } from "lucide-react"

import { Button } from "~/components/ui/button"
import { getErrorMessage } from "~/shared/presentation/forms/form-field"
import {
  useCreerConfiguration,
  useDemarrerAnnee,
} from "~/modules/structure-pedagogique/infrastructure/queries/structure.queries"
import type {
  AnneeAcademiqueDto,
  BrancheTableauDeBordDto,
} from "~/modules/structure-pedagogique/application/dto/structure-read.dto"

interface RentreeBannerProps {
  anneeCourante: AnneeAcademiqueDto
  anneePrecedente: AnneeAcademiqueDto | null
  branches: BrancheTableauDeBordDto[]
}

/**
 * Bandeau unique, non-ignorable (vision UX) : un seul chemin mis en avant
 * — "préparer la rentrée" duplique en une fois toutes les branches
 * éligibles, plutôt que dix options égales à choisir une par une.
 */
export function RentreeBanner({ anneeCourante, anneePrecedente, branches }: RentreeBannerProps) {
  const creerConfiguration = useCreerConfiguration()
  const demarrerAnnee = useDemarrerAnnee()
  const [enCours, setEnCours] = React.useState(false)

  const branchesAPreparer = branches.filter(
    (b) => !b.configuration && b.branche.etat === "ACTIVE",
  )

  async function preparerLaRentree() {
    setEnCours(true)
    try {
      for (const branche of branchesAPreparer) {
        await creerConfiguration.mutateAsync({
          brancheId: branche.branche.id,
          anneeAcademiqueId: anneeCourante.id,
          dupliquerDepuisPrecedente: branche.aUneConfigurationAnneePrecedente,
          copierClasses: true,
        })
      }
    } finally {
      setEnCours(false)
    }
  }

  // Rien de plus à préparer : la fenêtre de rentrée se referme sur le
  // seul geste qui la clôt — démarrer l'année (retour à l'état stable).
  if (branchesAPreparer.length === 0) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-primary/30 bg-primary/5 p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SparklesIcon className="size-5 shrink-0 text-primary" />
            <p className="text-sm font-medium text-foreground">
              Toutes les branches sont prêtes pour {anneeCourante.libelle}.
            </p>
          </div>
          <Button onClick={() => demarrerAnnee.mutate(anneeCourante.id)} disabled={demarrerAnnee.isPending}>
            {demarrerAnnee.isPending ? "Démarrage…" : `Démarrer l'année ${anneeCourante.libelle}`}
          </Button>
        </div>
        {demarrerAnnee.error ? (
          <p className="text-xs text-destructive">{getErrorMessage(demarrerAnnee.error)}</p>
        ) : null}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-primary/30 bg-primary/5 p-4">
      <div className="flex items-center gap-3">
        <SparklesIcon className="size-5 shrink-0 text-primary" />
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-medium text-foreground">
            Préparer la rentrée {anneeCourante.libelle}
            {anneePrecedente ? ` à partir de ${anneePrecedente.libelle}` : ""}
          </p>
          <p className="text-xs text-muted-foreground">
            {branchesAPreparer.length} branche{branchesAPreparer.length > 1 ? "s" : ""} à
            configurer pour cette nouvelle année.
          </p>
        </div>
      </div>
      <Button onClick={preparerLaRentree} disabled={enCours}>
        {enCours ? "Préparation…" : "Préparer la rentrée"}
      </Button>
    </div>
  )
}
