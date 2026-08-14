"use client"

import * as React from "react"

import { cn } from "~/lib/utils"
import { FilieresPicker } from "~/modules/structure-pedagogique/presentation/components/branche/pickers/filieres-picker"
import { NiveauxPicker } from "~/modules/structure-pedagogique/presentation/components/branche/pickers/niveaux-picker"
import { SeriesPicker } from "~/modules/structure-pedagogique/presentation/components/branche/pickers/series-picker"
import { MatiereActiveEditor } from "~/modules/structure-pedagogique/presentation/components/branche/matiere-active-editor"
import { useReferentielLookup } from "~/modules/structure-pedagogique/presentation/hooks/use-referentiel-lookup"
import type { ConfigurationDetailDto } from "~/modules/structure-pedagogique/application/dto/structure-read.dto"
import type { BrancheDto } from "~/modules/structure-pedagogique/application/dto/structure-read.dto"

interface ConfigurationModeLibreProps {
  branche: BrancheDto
  detail: ConfigurationDetailDto
  disabled?: boolean
}

type ConfigTab = "filieres" | "niveaux" | "series" | "matieres"

const CONFIG_TABS: { key: ConfigTab; label: string }[] = [
  { key: "filieres", label: "Filières" },
  { key: "niveaux", label: "Niveaux" },
  { key: "series", label: "Séries" },
  { key: "matieres", label: "Matières" },
]

/**
 * Ajustements ponctuels (vision UX) : tout reste éditable en permanence,
 * un sous-onglet par configuration (Filières / Niveaux / Séries / Matières)
 * en colonne plutôt qu'empilé dans un accordéon — à l'opposé de l'assistant,
 * réservé à la configuration initiale et parcouru en étapes séquentielles.
 * Le contenu de l'onglet actif est centré, largeur plafonnée à 2xl, pour
 * rester lisible même sur un grand écran.
 */
export function ConfigurationModeLibre({ branche, detail, disabled }: ConfigurationModeLibreProps) {
  const [tab, setTab] = React.useState<ConfigTab>("filieres")
  const lookup = useReferentielLookup()
  const filiereIdsActives = detail.filieresActives.map((f) => f.filiereId)
  const aucunNiveauActif = detail.niveauxActifs.length === 0

  return (
    <div className="flex items-start gap-6">
      <nav className="sticky top-0 flex w-40 shrink-0 flex-col gap-1">
        {CONFIG_TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={cn(
              "rounded-md px-2.5 py-2 text-left text-xs font-medium transition-colors",
              tab === item.key
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="flex flex-1 justify-center">
        <div className="w-full max-w-2xl">
          {tab === "filieres" ? (
            <FilieresPicker
              configurationId={detail.configuration.id}
              brancheOrdreEnseignementId={branche.ordreEnseignementId}
              brancheTypeEnseignementId={branche.typeEnseignementId}
              filieresActives={detail.filieresActives}
              disabled={disabled}
            />
          ) : null}

          {tab === "niveaux" ? (
            <NiveauxPicker
              configurationId={detail.configuration.id}
              brancheSousSystemeId={branche.sousSystemeId}
              brancheOrdreEnseignementId={branche.ordreEnseignementId}
              niveauxActifs={detail.niveauxActifs}
              disabled={disabled}
            />
          ) : null}

          {tab === "series" ? (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-foreground">Séries</h3>
                <p className="text-xs text-muted-foreground">
                  Pour chaque niveau activé, choisis les séries dans lesquelles il se décline —
                  seules les séries des filières déjà activées apparaissent ici.
                </p>
              </div>

              {aucunNiveauActif ? (
                <p className="rounded-lg border border-dashed border-border/60 bg-muted/10 p-4 text-center text-xs text-muted-foreground">
                  Activez d'abord au moins un niveau dans l'onglet « Niveaux ».
                </p>
              ) : (
                <div className="flex flex-col gap-5">
                  {detail.niveauxActifs.map((na) => {
                    const niveau = lookup.niveauById.get(na.niveauId)
                    const seriesDuNiveau = detail.seriesActives.filter((s) => s.niveauActiveId === na.id)
                    return (
                      <div key={na.id} className="flex flex-col gap-2">
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
                  })}
                </div>
              )}
            </div>
          ) : null}

          {tab === "matieres" ? (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-foreground">Matières</h3>
                <p className="text-xs text-muted-foreground">
                  Ajoute les matières enseignées par niveau, ajuste leur coefficient et indique
                  si elles sont obligatoires.
                </p>
              </div>

              {aucunNiveauActif ? (
                <p className="rounded-lg border border-dashed border-border/60 bg-muted/10 p-4 text-center text-xs text-muted-foreground">
                  Activez d'abord au moins un niveau dans l'onglet « Niveaux ».
                </p>
              ) : (
                <div className="flex flex-col gap-5">
                  {detail.niveauxActifs.map((na) => {
                    const niveau = lookup.niveauById.get(na.niveauId)
                    const seriesDuNiveau = detail.seriesActives.filter((s) => s.niveauActiveId === na.id)
                    const matieresDuNiveau = detail.matieresActives.filter((m) => m.niveauActiveId === na.id)
                    return (
                      <div key={na.id} className="flex flex-col gap-2 rounded-lg border border-border/50 p-3">
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
                  })}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
