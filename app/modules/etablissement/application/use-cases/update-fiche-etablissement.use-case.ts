import type { EtablissementRepository } from '~/modules/etablissement/domain/repositories/etablissement.repository';
import { LocalisationVO } from '~/modules/etablissement/domain/value-objects/localisation.vo';
import type { LocalisationProps } from '~/modules/etablissement/domain/value-objects/localisation.vo';
import { ContactEtablissementVO } from '~/modules/etablissement/domain/value-objects/contact-etablissement.vo';
import type { ContactEtablissementProps } from '~/modules/etablissement/domain/value-objects/contact-etablissement.vo';
import type { StatutJuridique } from '~/modules/etablissement/domain/shared/statut-juridique';
import { AuditEtablissementEntry } from '~/modules/etablissement/domain/entities/audit-etablissement.entity';
import type { AuditChangementDetail } from '~/modules/etablissement/domain/entities/audit-etablissement.entity';
import { EtablissementValidationError } from '~/modules/etablissement/domain/errors/etablissement.errors';

export interface UpdateFicheCommand {
  etablissementId: string;
  nomOfficiel?: string;
  sigle?: string;
  codeOfficiel?: string;
  agrement?: string;
  statutJuridique?: StatutJuridique;
  devisePropre?: string;
  localisation?: LocalisationProps;
  contacts?: ContactEtablissementProps;
  logoUrl?: string;
  auteurId: string;
  auteurNom: string;
}

export class UpdateFicheEtablissementUseCase {
  constructor(private readonly etablissementRepo: EtablissementRepository) {}

  public async execute(command: UpdateFicheCommand): Promise<void> {
    const etablissement = await this.etablissementRepo.findById(command.etablissementId);
    if (!etablissement) {
      throw new EtablissementValidationError(`Établissement introuvable (ID: ${command.etablissementId}).`);
    }

    const modifications: AuditChangementDetail[] = [];

    // Suivi des changements pour l'audit
    if (command.nomOfficiel && command.nomOfficiel !== etablissement.nomOfficiel) {
      modifications.push({ champ: 'nomOfficiel', valeurAncienne: etablissement.nomOfficiel, valeurNouvelle: command.nomOfficiel });
    }
    if (command.statutJuridique && command.statutJuridique !== etablissement.statutJuridique) {
      modifications.push({ champ: 'statutJuridique', valeurAncienne: etablissement.statutJuridique, valeurNouvelle: command.statutJuridique });
    }

    const localisationVO = command.localisation ? LocalisationVO.create(command.localisation) : undefined;
    const contactsVO = command.contacts ? ContactEtablissementVO.create(command.contacts) : undefined;

    // Mise à jour de l'entité
    etablissement.modifierFiche(
      {
        nomOfficiel: command.nomOfficiel,
        sigle: command.sigle,
        codeOfficiel: command.codeOfficiel,
        agrement: command.agrement,
        statutJuridique: command.statutJuridique,
        devisePropre: command.devisePropre,
      },
      localisationVO,
      contactsVO,
      command.auteurId
    );

    if (command.logoUrl) {
      etablissement.mettreAJourLogo(command.logoUrl, command.auteurId);
      modifications.push({ champ: 'logoUrl', valeurNouvelle: command.logoUrl });
    }

    // Enregistrement de l'audit si des modifications significatives ont eu lieu
    if (modifications.length > 0) {
      const auditEntry = AuditEtablissementEntry.create(
        {
          action: 'MODIFICATION_FICHE_ADMINISTRATIVE',
          auteurNom: command.auteurNom,
          modifications,
          date: new Date(),
        },
        {
          id: `audit-${Date.now()}`,
          tenantId: etablissement.tenantId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      );
      await this.etablissementRepo.saveAuditEntry(etablissement.id, auditEntry);
    }

    await this.etablissementRepo.save(etablissement);
  }
}