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

interface DeprecierDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  isSubmitting?: boolean
  error?: string | null
  onConfirm: (input: { motif: string; dateEffet?: string }) => void
}

/** Dépréciation (doc REF-005/BF-04) : motif obligatoire, date d'effet optionnelle (défaut aujourd'hui côté repository). */
export function DeprecierDialog({
  open,
  onOpenChange,
  title,
  isSubmitting,
  error,
  onConfirm,
}: DeprecierDialogProps) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const motif = String(formData.get("motif") ?? "").trim()
    const dateEffet = String(formData.get("dateEffet") ?? "").trim()
    onConfirm({ motif, dateEffet: dateEffet || undefined })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <form
          key={open ? "open" : "closed"}
          onSubmit={handleSubmit}
          className="flex h-full flex-col"
        >
          <SheetHeader>
            <SheetTitle>Déprécier "{title}"</SheetTitle>
            <SheetDescription>
              L'entrée reste utilisable par les configurations existantes
              mais ne pourra plus être choisie pour une nouvelle
              configuration (doc section 1.1). Cette action n'est pas une
              suppression.
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-1 flex-col gap-4 px-6">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="motif">
                Motif<span className="text-destructive">*</span>
              </Label>
              <textarea
                id="motif"
                name="motif"
                required
                rows={3}
                placeholder="Ex : Série supprimée par l'arrêté n°…"
                className="w-full rounded-md border border-input bg-input/20 px-2 py-1.5 text-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 dark:bg-input/30"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dateEffet">Date d'effet</Label>
              <Input id="dateEffet" name="dateEffet" type="date" />
              <span className="text-[0.7rem] text-muted-foreground">
                Par défaut : aujourd'hui.
              </span>
            </div>

            {error ? (
              <div className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
                {error}
              </div>
            ) : null}
          </div>

          <SheetFooter className="flex-row justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" variant="destructive" disabled={isSubmitting}>
              {isSubmitting ? "Dépréciation…" : "Déprécier"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
