import type { EtablissementRepository } from '~/modules/etablissement/domain/repositories/etablissement.repository';
import { EtablissementValidationService } from '~/modules/etablissement/domain/services/etablissement-validation.service';
import type { EtatCompte } from '~/modules/etablissement/domain/shared/etat-compte';
import { AuditEtablissementEntry } from '~/modules/etablissement/domain/entities/audit-etablissement.entity';
import { EtablissementValidationError } from '~/modules/etablissement/domain/errors/etablissement.errors';

export interface ChangerEtatCommand {
  etablissementId: string;
  nouvelEtat: EtatCompte;
  motif?: string;
  auteurId: string;
  auteurNom: string;
}

export class ChangerEtatCompteUseCase {
  constructor(private readonly etablissementRepo: EtablissementRepository) {}

  public async execute(command: ChangerEtatCommand): Promise<void> {
    const etablissement = await this.etablissementRepo.findById(command.etablissementId);
    if (!etablissement) {
      throw new EtablissementValidationError(`Établissement introuvable (ID: ${command.etablissementId}).`);
    }

    // Si on tente d'activer le compte, on vérifie la complétude globale de la fiche (RM-08)[cite: 1]
    if (command.nouvelEtat === 'ACTIF') {
      const enTete = await this.etablissementRepo.findEnTeteByEtablissementId(command.etablissementId);
      const signatairePrincipal = await this.etablissementRepo.findSignatairePrincipal(command.etablissementId);

      if (!enTete) {
        throw new EtablissementValidationError('Impossible d\'activer : l\'en-tête officiel est manquant.');
      }

      EtablissementValidationService.validerActivation(etablissement, enTete, signatairePrincipal || undefined);
    }

    const etatPrecedent = etablissement.etat;

    // Application du changement d'état via l'entité
    etablissement.changerEtat(command.nouvelEtat, command.motif, command.auteurId);

    // Traçabilité des modifications d'état dans l'audit (RM-12)[cite: 1]
    const auditEntry = AuditEtablissementEntry.create(
      {
        action: `CHANGEMENT_ETAT_${command.nouvelEtat}`,
        auteurNom: command.auteurNom,
        modifications: [
          { champ: 'etat', valeurAncienne: etatPrecedent, valeurNouvelle: command.nouvelEtat },
          ...(command.motif ? [{ champ: 'motifChangementEtat', valeurNouvelle: command.motif }] : []),
        ],
        date: new Date(),
      },
      {
        id: `audit-${Date.now()}`,
        tenantId: etablissement.tenantId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    );

    await this.etablissementRepo.save(etablissement);
    await this.etablissementRepo.saveAuditEntry(etablissement.id, auditEntry);
  }
}