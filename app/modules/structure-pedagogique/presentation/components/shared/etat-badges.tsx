import { Badge } from "~/components/ui/badge"
import type { EtatBranche, EtatAnnee, EtatConfiguration } from "~/modules/structure-pedagogique/domain/shared/etats"

const LIBELLES_BRANCHE: Record<EtatBranche, string> = {
  EN_CONFIGURATION: "En configuration",
  ACTIVE: "Active",
  SUSPENDUE: "Suspendue",
  ARCHIVEE: "Archivée",
}

export function BrancheEtatBadge({ etat }: { etat: EtatBranche }) {
  const variant = etat === "ACTIVE" ? "success" : etat === "ARCHIVEE" ? "secondary" : "outline"
  return <Badge variant={variant}>{LIBELLES_BRANCHE[etat]}</Badge>
}

const LIBELLES_ANNEE: Record<EtatAnnee, string> = {
  EN_PREPARATION: "En préparation",
  EN_COURS: "En cours",
  CLOTUREE: "Clôturée",
}

export function AnneeEtatBadge({ etat }: { etat: EtatAnnee }) {
  const variant = etat === "EN_COURS" ? "success" : etat === "CLOTUREE" ? "secondary" : "outline"
  return <Badge variant={variant}>{LIBELLES_ANNEE[etat]}</Badge>
}

const LIBELLES_CONFIGURATION: Record<EtatConfiguration, string> = {
  OUVERTE: "Ouverte",
  SCELLEE: "Scellée",
}

export function ConfigurationEtatBadge({ etat }: { etat: EtatConfiguration }) {
  return <Badge variant={etat === "OUVERTE" ? "outline" : "secondary"}>{LIBELLES_CONFIGURATION[etat]}</Badge>
}
