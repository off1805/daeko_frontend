"use client"

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Progress } from "~/components/ui/progress"
import { BrancheEtatBadge } from "~/modules/structure-pedagogique/presentation/components/shared/etat-badges"
import type { BrancheTableauDeBordDto } from "~/modules/structure-pedagogique/application/dto/structure-read.dto"
import { cn } from "~/lib/utils"

interface BranchCardProps {
  data: BrancheTableauDeBordDto
  /** Vision UX : "même carte, deux états" — un seul composant, un rendu piloté par le moment de l'année. */
  variant: "stable" | "progression"
  onOpen: () => void
}

function progressionPourcentage(progression: BrancheTableauDeBordDto["progression"]): number {
  if (!progression) return 0
  const etapes = [
    progression.filieresActivees > 0,
    progression.niveauxActives > 0,
    progression.seriesActives > 0 || progression.matieresActives > 0,
    progression.matieresActives > 0,
  ]
  return Math.round((etapes.filter(Boolean).length / etapes.length) * 100)
}

export function BranchCard({ data, variant, onOpen }: BranchCardProps) {
  const pourcentage = progressionPourcentage(data.progression)

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onOpen()
        }
      }}
      className={cn(
        "cursor-pointer border-border/50 bg-muted/25 shadow-none outline-none transition-colors hover:border-border hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-1">{data.branche.libelle}</CardTitle>
          <BrancheEtatBadge etat={data.branche.etat} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {variant === "stable" ? (
          <p className="text-xs text-muted-foreground">
            {data.progression
              ? `${data.progression.classesCreees} classe${data.progression.classesCreees > 1 ? "s" : ""} · ${data.progression.matieresActives} matière${data.progression.matieresActives > 1 ? "s" : ""} activée${data.progression.matieresActives > 1 ? "s" : ""}`
              : "Aucune configuration pour l'année en cours."}
          </p>
        ) : (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{pourcentage === 100 ? "Configuration prête" : pourcentage === 0 ? "Non configurée" : "En cours de configuration"}</span>
              <span className="tabular-nums">{pourcentage}%</span>
            </div>
            <Progress value={pourcentage} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
