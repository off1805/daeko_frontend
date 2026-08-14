"use client"

import * as React from "react"
import { ArrowLeftIcon, XIcon } from "lucide-react"

import { Skeleton } from "~/components/ui/skeleton"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { useAuditStructure } from "~/modules/structure-pedagogique/infrastructure/queries/structure.queries"
import type { OperationAuditSp } from "~/modules/structure-pedagogique/domain/shared/etats"
import type { AuditStructureDto } from "~/modules/structure-pedagogique/application/dto/structure-read.dto"

const LIBELLES_OPERATION: Record<OperationAuditSp, string> = {
  CREATION: "Création",
  MODIFICATION: "Modification",
  ACTIVATION_ELEMENT: "Activation",
  RETRAIT_ELEMENT: "Retrait",
  SUSPENSION: "Suspension",
  REACTIVATION: "Réactivation",
  ARCHIVAGE: "Archivage",
  DUPLICATION: "Duplication",
  DEMARRAGE_ANNEE: "Démarrage d'année",
  CLOTURE_ANNEE: "Clôture d'année",
  DEVERROUILLAGE_COEFFICIENT: "Correction de coefficient",
  DESACTIVATION_CLASSE: "Désactivation de classe",
  DEPRECIATION_MATIERE_LOCALE: "Dépréciation de matière locale",
}

const LIBELLES_CIBLE: Record<string, string> = {
  branche: "Branche",
  matiere_locale: "Matière locale",
  annee_academique: "Année académique",
  configuration_branche_annee: "Configuration",
  niveau_actif: "Niveau actif",
  matiere_active: "Matière active",
  classe: "Classe",
}

function grouperParJour(entries: AuditStructureDto[]): [string, AuditStructureDto[]][] {
  const groupes = new Map<string, AuditStructureDto[]>()
  for (const entry of entries) {
    const jour = entry.horodatage.slice(0, 10)
    groupes.set(jour, [...(groupes.get(jour) ?? []), entry])
  }
  return Array.from(groupes.entries())
}

interface HistoriqueScreenProps {
  onBack: () => void
}

/**
 * Vision UX : entrée de navigation discrète, jamais au même niveau visuel
 * que "Ma structure". Filtres volontairement minimaux (type d'action,
 * période) — pas de recherche plein texte, ce journal reste un
 * outil de vérification ponctuelle, pas un tableau de bord.
 */
export function HistoriqueScreen({ onBack }: HistoriqueScreenProps) {
  const [operation, setOperation] = React.useState<OperationAuditSp>()
  const [du, setDu] = React.useState("")
  const [au, setAu] = React.useState("")

  const { data: entries, isLoading } = useAuditStructure({
    operation,
    du: du ? `${du}T00:00:00.000Z` : undefined,
    au: au ? `${au}T23:59:59.999Z` : undefined,
  })

  const filtresActifs = Boolean(operation || du || au)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={onBack} aria-label="Retour à Ma structure">
          <ArrowLeftIcon />
        </Button>
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold text-foreground">Historique</h1>
          <p className="text-sm text-muted-foreground">
            Journal des actions effectuées sur votre structure pédagogique — infalsifiable.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-2 rounded-lg border border-border/60 bg-muted/20 p-3">
        <div className="flex flex-col gap-1">
          <Label htmlFor="filtre-operation" className="text-[0.65rem] text-muted-foreground">
            Type d'action
          </Label>
          <Select
            value={operation ?? null}
            onValueChange={(value) => setOperation((value as OperationAuditSp) ?? undefined)}
          >
            <SelectTrigger id="filtre-operation" className="w-48">
              <SelectValue placeholder="Toutes">
                {(current: string | null) => (current ? LIBELLES_OPERATION[current as OperationAuditSp] : "Toutes")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(LIBELLES_OPERATION) as OperationAuditSp[]).map((op) => (
                <SelectItem key={op} value={op}>
                  {LIBELLES_OPERATION[op]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="filtre-du" className="text-[0.65rem] text-muted-foreground">
            Du
          </Label>
          <Input id="filtre-du" type="date" value={du} onChange={(event) => setDu(event.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="filtre-au" className="text-[0.65rem] text-muted-foreground">
            Au
          </Label>
          <Input id="filtre-au" type="date" value={au} onChange={(event) => setAu(event.target.value)} />
        </div>
        {filtresActifs ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setOperation(undefined)
              setDu("")
              setAu("")
            }}
          >
            Réinitialiser
            <XIcon />
          </Button>
        ) : null}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      ) : !entries || entries.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-6 text-center text-sm text-muted-foreground">
          {filtresActifs ? "Aucune action ne correspond à ces critères." : "Aucune action enregistrée pour le moment."}
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {grouperParJour(entries).map(([jour, entriesDuJour]) => (
            <div key={jour} className="flex flex-col gap-2">
              <h2 className="text-xs font-medium text-muted-foreground">
                {new Date(jour).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <div className="flex flex-col gap-1.5">
                {entriesDuJour.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border/50 bg-muted/20 px-3 py-2 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{LIBELLES_OPERATION[entry.operation]}</Badge>
                      <span className="text-muted-foreground">
                        {LIBELLES_CIBLE[entry.cibleType] ?? entry.cibleType}
                      </span>
                      {entry.motif ? <span className="italic text-muted-foreground">« {entry.motif} »</span> : null}
                    </div>
                    <span className="shrink-0 tabular-nums text-muted-foreground">
                      {new Date(entry.horodatage).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
