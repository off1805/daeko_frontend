"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"

import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"
import { FilieresPicker } from "~/modules/structure-pedagogique/presentation/components/branche/pickers/filieres-picker"
import { NiveauxPicker } from "~/modules/structure-pedagogique/presentation/components/branche/pickers/niveaux-picker"
import { SeriesPicker } from "~/modules/structure-pedagogique/presentation/components/branche/pickers/series-picker"
import { MatiereActiveEditor } from "~/modules/structure-pedagogique/presentation/components/branche/matiere-active-editor"
import { useReferentielLookup } from "~/modules/structure-pedagogique/presentation/hooks/use-referentiel-lookup"
import type {
  BrancheDto,
  ConfigurationDetailDto,
} from "~/modules/structure-pedagogique/application/dto/structure-read.dto"

interface ConfigurationAssistantProps {
  branche: BrancheDto
  detail: ConfigurationDetailDto
  disabled?: boolean
}

const ETAPES = ["Filières", "Niveaux", "Séries", "Matières"] as const

/** Configuration en escalier (vision UX) : un chemin séquentiel pour la mise en place initiale d'une branche. */
export function ConfigurationAssistant({ branche, detail, disabled }: ConfigurationAssistantProps) {
  const [etape, setEtape] = React.useState(0)
  const lookup = useReferentielLookup()
  const filiereIdsActives = detail.filieresActives.map((f) => f.filiereId)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-1">
        {ETAPES.map((label, index) => (
          <React.Fragment key={label}>
            <button
              type="button"
              onClick={() => setEtape(index)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors",
                index === etape
                  ? "bg-primary text-primary-foreground"
                  : index < etape
                    ? "text-foreground hover:bg-muted"
                    : "text-muted-foreground hover:bg-muted",
              )}
            >
              {index < etape ? <CheckIcon className="size-3" /> : <span>{index + 1}</span>}
              {label}
            </button>
            {index < ETAPES.length - 1 ? <div className="h-px w-4 bg-border" /> : null}
          </React.Fragment>
        ))}
      </div>

      <div className="min-h-40">
        {etape === 0 ? (
          <FilieresPicker
            configurationId={detail.configuration.id}
            brancheOrdreEnseignementId={branche.ordreEnseignementId}
            brancheTypeEnseignementId={branche.typeEnseignementId}
            filieresActives={detail.filieresActives}
            disabled={disabled}
          />
        ) : null}

        {etape === 1 ? (
          <NiveauxPicker
            configurationId={detail.configuration.id}
            brancheSousSystemeId={branche.sousSystemeId}
            brancheOrdreEnseignementId={branche.ordreEnseignementId}
            niveauxActifs={detail.niveauxActifs}
            disabled={disabled}
          />
        ) : null}

        {etape === 2 ? (
          <div className="flex flex-col gap-4">
            {detail.niveauxActifs.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Activez d'abord au moins un niveau à l'étape précédente.
              </p>
            ) : (
              detail.niveauxActifs.map((na) => {
                const niveau = lookup.niveauById.get(na.niveauId)
                const seriesDuNiveau = detail.seriesActives.filter((s) => s.niveauActiveId === na.id)
                return (
                  <div key={na.id} className="flex flex-col gap-1.5">
                    <h4 className="text-xs font-medium text-foreground">
                      {niveau?.libelleCourt ?? niveau?.libelle ?? na.niveauId}
                    </h4>
                    <SeriesPicker
                      niveauActiveId={na.id}
                      filiereIdsActives={filiereIdsActives}
                      seriesActivesDuNiveau={seriesDuNiveau}
                      disabled={disabled}
                    />
                  </div>
                )
              })
            )}
          </div>
        ) : null}

        {etape === 3 ? (
          <div className="flex flex-col gap-4">
            {detail.niveauxActifs.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Activez d'abord au moins un niveau.
              </p>
            ) : (
              detail.niveauxActifs.map((na) => {
                const niveau = lookup.niveauById.get(na.niveauId)
                const seriesDuNiveau = detail.seriesActives.filter((s) => s.niveauActiveId === na.id)
                const matieresDuNiveau = detail.matieresActives.filter((m) => m.niveauActiveId === na.id)
                return (
                  <div key={na.id} className="flex flex-col gap-1.5 rounded-lg border border-border/50 p-3">
                    <h4 className="text-xs font-medium text-foreground">
                      {niveau?.libelleCourt ?? niveau?.libelle ?? na.niveauId}
                    </h4>
                    <MatiereActiveEditor
                      niveauActiveId={na.id}
                      niveauId={na.niveauId}
                      brancheId={branche.id}
                      seriesActives={seriesDuNiveau}
                      matieresActives={matieresDuNiveau}
                      disabled={disabled}
                    />
                  </div>
                )
              })
            )}
          </div>
        ) : null}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" size="sm" disabled={etape === 0} onClick={() => setEtape((e) => e - 1)}>
          Précédent
        </Button>
        <Button size="sm" disabled={etape === ETAPES.length - 1} onClick={() => setEtape((e) => e + 1)}>
          Suivant
        </Button>
      </div>
    </div>
  )
}
