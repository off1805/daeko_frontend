import { Etablissement } from '~/modules/etablissement/domain/entities/etablissement.entity';
import { EnTeteOfficiel } from '~/modules/etablissement/domain/entities/en-tete.entity';
import { Signataire } from '~/modules/etablissement/domain/entities/signataire.entity';
import { IncompletPourActivationError } from '~/modules/etablissement/domain/errors/etablissement.errors';

/**
 * Service domaine pour valider l'intégrité et l'éligibilité d'un établissement (RM-08, F-07).
 */
export class EtablissementValidationService {
  /**
   * Valide si l'établissement réunit l'ensemble des conditions requises pour passer à l'état ACTIF.
   */
  public static validerActivation(
    etablissement: Etablissement,
    enTete: EnTeteOfficiel,
    signatairePrincipal?: Signataire
  ): void {
    const evaluation = etablissement.evaluerCompletude(enTete, signatairePrincipal);
    
    if (!evaluation.estComplet) {
      throw new IncompletPourActivationError(evaluation.elementsManquants);
    }
  }

  /**
   * Vérifie la cohérence générale des données administratives et de contact.
   */
  public static verifierDonneesAdministratives(etablissement: Etablissement): boolean {
    const contacts = etablissement.contacts;
    const localisation = etablissement.localisation;

    if (!localisation || !localisation.regionCode || !localisation.departementCode || !localisation.arrondissementCode) {
      return false;
    }

    if (!contacts.email) {
      return false;
    }

    return true;
  }
}