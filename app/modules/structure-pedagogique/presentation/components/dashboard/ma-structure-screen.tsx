"use client"

import { HistoryIcon } from "lucide-react"

import { Skeleton } from "~/components/ui/skeleton"
import { useTableauDeBord } from "~/modules/structure-pedagogique/infrastructure/queries/structure.queries"
import { OnboardingView } from "~/modules/structure-pedagogique/presentation/components/dashboard/onboarding-view"
import { RentreeBanner } from "~/modules/structure-pedagogique/presentation/components/dashboard/rentree-banner"
import { BranchCard } from "~/modules/structure-pedagogique/presentation/components/dashboard/branch-card"
import { DeclarerBrancheBoutonDiscret } from "~/modules/structure-pedagogique/presentation/components/dashboard/declarer-branche-sheet"
import { QuickCoefficientCorrection } from "~/modules/structure-pedagogique/presentation/components/dashboard/quick-coefficient-correction"
import { CreerAnneeSheet } from "~/modules/structure-pedagogique/presentation/components/dashboard/creer-annee-sheet"
import { AnneesAcademiquesSheet } from "~/modules/structure-pedagogique/presentation/components/dashboard/annees-academiques-sheet"

interface MaStructureScreenProps {
  /** Ouvre l'écran "Historique" — entrée de navigation discrète, jamais au même niveau visuel que "Ma structure". */
  onOpenHistorique: () => void
  /** Ouvre l'espace dédié à une branche (nouvelle sidebar contextuelle, voir BrancheWorkspace). */
  onOpenBranche: (brancheId: string) => void
}

/**
 * Écran "Ma structure" : un seul composant, deux états pilotés par la
 * fréquence réelle d'usage (vision UX), pas un tableau de bord fixe avec
 * des onglets dessous. Le mode est calculé côté application
 * (ObtenirTableauDeBordUseCase), ce composant se contente de l'aiguiller.
 */
export function MaStructureScreen({ onOpenHistorique, onOpenBranche }: MaStructureScreenProps) {
  const { data, isLoading } = useTableauDeBord()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-xl" />
        ))}
      </div>
    )
  }

  if (!data || data.mode === "ONBOARDING") {
    return <OnboardingView />
  }

  const branchesVisibles = data.branches.filter((b) => b.branche.etat !== "ARCHIVEE")
  const anneeCourante = data.anneeCourante

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onOpenHistorique}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <HistoryIcon className="size-3.5" />
          Historique
        </button>
      </div>

      {data.mode === "RENTREE" && anneeCourante ? (
        <RentreeBanner
          anneeCourante={anneeCourante}
          anneePrecedente={data.anneePrecedente}
          branches={data.branches}
        />
      ) : (
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-lg font-semibold text-foreground">Ma structure</h1>
            {anneeCourante ? (
              <AnneesAcademiquesSheet
                trigger={(open) => (
                  <button
                    type="button"
                    onClick={open}
                    className="w-fit text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                  >
                    Année {anneeCourante.libelle}
                  </button>
                )}
              />
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {anneeCourante ? <QuickCoefficientCorrection anneeCourante={anneeCourante} /> : null}
          </div>
        </div>
      )}

      {branchesVisibles.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-6 text-center text-sm text-muted-foreground">
          Aucune branche active pour le moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {branchesVisibles.map((b) => (
            <BranchCard
              key={b.branche.id}
              data={b}
              variant={data.mode === "RENTREE" ? "progression" : "stable"}
              onOpen={() => onOpenBranche(b.branche.id)}
            />
          ))}
        </div>
      )}

      <div className="flex justify-end gap-2">
        {data.mode === "STABLE" ? <CreerAnneeSheet /> : null}
        <DeclarerBrancheBoutonDiscret />
      </div>
    </div>
  )
}
