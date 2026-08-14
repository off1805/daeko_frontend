"use client"

import * as React from "react"

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet"
import { getErrorMessage } from "~/shared/presentation/forms/form-field"
import { AnneeEtatBadge } from "~/modules/structure-pedagogique/presentation/components/shared/etat-badges"
import {
  useAnnees,
  useCloturerAnnee,
} from "~/modules/structure-pedagogique/infrastructure/queries/structure.queries"
import type { AnneeAcademiqueDto } from "~/modules/structure-pedagogique/application/dto/structure-read.dto"

function ConfirmationCloture({
  annee,
  onDone,
}: {
  annee: AnneeAcademiqueDto
  onDone: () => void
}) {
  const [confirmation, setConfirmation] = React.useState("")
  const cloturer = useCloturerAnnee()
  const correspond = confirmation.trim() === annee.libelle

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium text-foreground">
          Clôturer {annee.libelle} — irréversible
        </p>
        <p className="text-[0.7rem] text-muted-foreground">
          Toutes les configurations de cette année seront scellées. Les saisies seront
          verrouillées définitivement. Tapez « {annee.libelle} » pour confirmer.
        </p>
      </div>
      <Input
        value={confirmation}
        onChange={(event) => setConfirmation(event.target.value)}
        placeholder={annee.libelle}
      />
      {cloturer.error ? (
        <p className="text-xs text-destructive">{getErrorMessage(cloturer.error)}</p>
      ) : null}
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onDone} disabled={cloturer.isPending}>
          Annuler
        </Button>
        <Button
          variant="destructive"
          size="sm"
          disabled={!correspond || cloturer.isPending}
          onClick={() =>
            cloturer.mutate(
              { id: annee.id, confirmation },
              { onSuccess: onDone },
            )
          }
        >
          {cloturer.isPending ? "Clôture…" : "Clôturer définitivement"}
        </Button>
      </div>
    </div>
  )
}

/**
 * Vision UX : "bouton d'action sur la carte de l'année elle-même, pas un
 * onglet, pas un item de menu permanent — trouvable en deux clics quand on
 * la cherche, invisible pour qui ne la cherche pas". Ce panneau EST cette
 * "carte" : on y accède en cliquant le libellé de l'année sur Ma structure.
 */
export function AnneesAcademiquesSheet({ trigger }: { trigger: (open: () => void) => React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const [anneeEnClotureId, setAnneeEnClotureId] = React.useState<string | null>(null)
  const { data: annees } = useAnnees()

  const anneesTriees = (annees ?? []).slice().sort((a, b) => b.dateDebut.localeCompare(a.dateDebut))

  return (
    <>
      {trigger(() => setOpen(true))}
      <Sheet
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) setAnneeEnClotureId(null)
        }}
      >
        <SheetContent className="overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Années académiques</SheetTitle>
            <SheetDescription>
              La clôture scelle toutes les configurations de l'année et verrouille
              définitivement les saisies.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-1 flex-col gap-2 px-6">
            {anneesTriees.map((annee) =>
              anneeEnClotureId === annee.id ? (
                <ConfirmationCloture key={annee.id} annee={annee} onDone={() => setAnneeEnClotureId(null)} />
              ) : (
                <div
                  key={annee.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-2 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{annee.libelle}</span>
                    <AnneeEtatBadge etat={annee.etat} />
                  </div>
                  {annee.etat === "EN_COURS" ? (
                    <Button variant="outline" size="xs" onClick={() => setAnneeEnClotureId(annee.id)}>
                      Clôturer
                    </Button>
                  ) : null}
                </div>
              ),
            )}
          </div>
          <SheetFooter className="flex-row justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Fermer
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
