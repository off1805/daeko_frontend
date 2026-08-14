"use client"

import * as React from "react"
import { EllipsisIcon } from "lucide-react"

import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet"
import { getErrorMessage } from "~/shared/presentation/forms/form-field"
import {
  useArchiverBranche,
  useReactiverBranche,
  useSuspendreBranche,
} from "~/modules/structure-pedagogique/infrastructure/queries/structure.queries"
import type { BrancheDto } from "~/modules/structure-pedagogique/application/dto/structure-read.dto"

interface BrancheActionsMenuProps {
  branche: BrancheDto
  onArchivee?: () => void
}

/**
 * Gestes rares (vision UX) : trouvables en deux clics via ce menu discret,
 * jamais mis en avant comme des actions courantes. Suspendre/réactiver
 * sont réversibles et directs ; archiver est terminal et exige un motif.
 */
export function BrancheActionsMenu({ branche, onArchivee }: BrancheActionsMenuProps) {
  const [archiverOuvert, setArchiverOuvert] = React.useState(false)
  const suspendre = useSuspendreBranche()
  const reactiver = useReactiverBranche()
  const archiver = useArchiverBranche()

  if (branche.etat === "ARCHIVEE" || branche.etat === "EN_CONFIGURATION") return null

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon-sm" aria-label="Actions de la branche" />}
        >
          <EllipsisIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {branche.etat === "ACTIVE" ? (
            <DropdownMenuItem onClick={() => suspendre.mutate(branche.id)}>
              Suspendre
            </DropdownMenuItem>
          ) : null}
          {branche.etat === "SUSPENDUE" ? (
            <DropdownMenuItem onClick={() => reactiver.mutate(branche.id)}>
              Réactiver
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem variant="destructive" onClick={() => setArchiverOuvert(true)}>
            Archiver
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet open={archiverOuvert} onOpenChange={setArchiverOuvert}>
        <SheetContent className="sm:max-w-md">
          <form
            key={archiverOuvert ? "open" : "closed"}
            onSubmit={(event) => {
              event.preventDefault()
              const motif = String(new FormData(event.currentTarget).get("motif") ?? "").trim()
              archiver.mutate(
                { id: branche.id, motif },
                {
                  onSuccess: () => {
                    setArchiverOuvert(false)
                    onArchivee?.()
                  },
                },
              )
            }}
            className="flex h-full flex-col"
          >
            <SheetHeader>
              <SheetTitle>Archiver « {branche.libelle} »</SheetTitle>
              <SheetDescription>
                Fermeture définitive. Les configurations passées restent consultables. Cette
                action est terminale — motif obligatoire.
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-1 flex-col gap-4 px-6">
              <textarea
                name="motif"
                required
                rows={3}
                placeholder="Motif de l'archivage"
                className="w-full rounded-md border border-input bg-input/20 px-2 py-1.5 text-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 dark:bg-input/30"
              />
              {archiver.error ? (
                <div className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
                  {getErrorMessage(archiver.error)}
                </div>
              ) : null}
            </div>
            <SheetFooter className="flex-row justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setArchiverOuvert(false)}>
                Annuler
              </Button>
              <Button type="submit" variant="destructive" disabled={archiver.isPending}>
                {archiver.isPending ? "Archivage…" : "Archiver"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  )
}
