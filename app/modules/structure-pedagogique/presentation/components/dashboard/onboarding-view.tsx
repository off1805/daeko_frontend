"use client"

import { LandmarkIcon } from "lucide-react"
import { DeclarerBrancheSheet } from "~/modules/structure-pedagogique/presentation/components/dashboard/declarer-branche-sheet"
import { Button } from "~/components/ui/button"

/**
 * Vision UX : la déclaration de branche est un geste rare, presque
 * cérémonieux — mais reste le SEUL chemin possible tant qu'aucune branche
 * n'existe. Un unique CTA, pas de tableau de bord vide avec dix options.
 */
export function OnboardingView() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border/60 bg-muted/10 p-12 text-center">
      <LandmarkIcon className="size-8 text-muted-foreground" />
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-medium text-foreground">Aucune branche déclarée</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Une branche matérialise ce que votre école ouvre réellement — un sous-système, un
          ordre et un type d'enseignement. Déclarez-en une pour commencer à configurer votre
          structure pédagogique.
        </p>
      </div>
      <DeclarerBrancheSheet
        trigger={(open) => <Button onClick={open}>Déclarer votre première branche</Button>}
      />
    </div>
  )
}
