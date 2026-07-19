import { Badge } from "~/components/ui/badge"
import type { EtatReferentiel } from "~/modules/referentiel/domain/shared/etat-referentiel"

export function EtatBadge({ etat }: { etat: EtatReferentiel }) {
  return (
    <Badge variant={etat === "ACTIVE" ? "success" : "secondary"}>
      {etat === "ACTIVE" ? "Actif" : "Déprécié"}
    </Badge>
  )
}
