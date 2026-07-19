import type { AxiosError } from "axios";
import {
  DepreciationSansMotifError,
  EntreeIntrouvableError,
  IncoherenceCreationSerieError,
  IncoherenceOrdreEnseignementError,
  IncoherenceSousSystemeError,
  ModificationReferenceStructurelleInterditeError,
  ReferenceParentDeprecieError,
  RoleInsuffisantError,
  SerieAppliqueeTropTotError,
  SuppressionPhysiqueInterditeError,
  ViolationUniciteError,
} from "~/modules/referentiel/domain/errors/referentiel.errors";

/**
 * Convertit l'enveloppe d'erreur uniforme de l'API
 * ({ code, message, details }, doc section 2) en DomainError typée,
 * pour que la présentation puisse réagir par code plutôt que par statut
 * HTTP brut. Prêt pour le futur Http*Repository — non utilisé par les
 * repositories mockés actuels.
 */

interface ReferentielApiErrorPayload {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export function mapReferentielApiError(
  error: AxiosError<ReferentielApiErrorPayload>,
): Error {
  const payload = error.response?.data;
  if (!payload?.code) {
    return error;
  }

  const details = payload.details;
  switch (payload.code) {
    case "REF-001":
      return new ViolationUniciteError(
        String(details?.champ ?? "code"),
        String(details?.valeur ?? payload.message),
      );
    case "REF-002":
      return new IncoherenceSousSystemeError(details);
    case "REF-003":
      return new SerieAppliqueeTropTotError(details);
    case "REF-004":
      return new IncoherenceOrdreEnseignementError(details);
    case "REF-005":
      return new DepreciationSansMotifError();
    case "REF-006":
      return new ReferenceParentDeprecieError(
        String(details?.parent ?? "parent"),
      );
    case "REF-007":
      return new SuppressionPhysiqueInterditeError();
    case "REF-008":
      return new ModificationReferenceStructurelleInterditeError(
        String(details?.champ ?? "champ structurel"),
      );
    case "REF-009":
      return new RoleInsuffisantError();
    case "REF-010":
      return new EntreeIntrouvableError(String(details?.id ?? "?"));
    case "REF-011":
      return new IncoherenceCreationSerieError(details);
    default:
      return error;
  }
}
