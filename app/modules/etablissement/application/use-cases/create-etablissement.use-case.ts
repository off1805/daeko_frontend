import { Etablissement } from '~/modules/etablissement/domain/entities/etablissement.entity';
import { AuditEtablissementEntry } from '~/modules/etablissement/domain/entities/audit-etablissement.entity';
import type { EtablissementRepository } from '~/modules/etablissement/domain/repositories/etablissement.repository';
import { EnTeteGeneratorService } from '~/modules/etablissement/domain/services/en-tete-generator.service';
import { LocalisationVO } from '~/modules/etablissement/domain/value-objects/localisation.vo';
import type { LocalisationProps } from '~/modules/etablissement/domain/value-objects/localisation.vo';
import { ContactEtablissementVO } from '~/modules/etablissement/domain/value-objects/contact-etablissement.vo';
import type { ContactEtablissementProps } from '~/modules/etablissement/domain/value-objects/contact-etablissement.vo';
import type { StatutJuridique } from '~/modules/etablissement/domain/shared/statut-juridique';
import { EtablissementDoublonError } from '~/modules/etablissement/domain/errors/etablissement.errors';

export interface CreateEtablissementCommand {
  tenantId: string;
  nomOfficiel: string;
  sigle?: string;
  codeOfficiel?: string;
  agrement?: string;
  statutJuridique: StatutJuridique;
  devisePropre?: string;
  localisation: LocalisationProps;
  contacts: ContactEtablissementProps;
  auteurId: string;
  auteurNom: string;
}

export class CreateEtablissementUseCase {
  constructor(private readonly etablissementRepo: EtablissementRepository) {}

  public async execute(command: CreateEtablissementCommand): Promise<string> {
    // 1. Instanciation des Value Objects
    const localisationVO = LocalisationVO.create(command.localisation);
    const contactsVO = ContactEtablissementVO.create(command.contacts);

    // 2. Vérification des doublons (RM-03)
    const existeDeja = await this.etablissementRepo.existsByNomAndLocalisation(
      command.nomOfficiel,
      localisationVO.ville,
      localisationVO.arrondissementCode
    );

    if (existeDeja) {
      throw new EtablissementDoublonError(
        command.nomOfficiel,
        localisationVO.ville,
        localisationVO.arrondissementCode
      );
    }

    const etablissementId = `etb-${Date.now()}`;

    // 3. Création de l'entité Racine d'Agrégat
    const etablissement = Etablissement.create(
      {
        nomOfficiel: command.nomOfficiel,
        sigle: command.sigle,
        codeOfficiel: command.codeOfficiel,
        agrement: command.agrement,
        statutJuridique: command.statutJuridique,
        devisePropre: command.devisePropre,
        localisation: localisationVO,
        contacts: contactsVO,
      },
      {
        id: etablissementId,
        tenantId: command.tenantId,
        createdBy: command.auteurId,
        updatedBy: command.auteurId,
      }
    );

    // 4. Génération automatique de l'en-tête officiel par défaut (F-05)
    const enTeteDefaut = EnTeteGeneratorService.genererParDefaut(
      localisationVO,
      command.nomOfficiel,
      command.sigle,
      {
        id: `en-tete-${etablissementId}`,
        tenantId: command.tenantId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    );

    // 5. Création de l'entrée d'audit initiale (RM-12)
    const auditEntry = AuditEtablissementEntry.create(
      {
        action: 'CREATION_ETABLISSEMENT',
        auteurNom: command.auteurNom,
        modifications: [
          { champ: 'nomOfficiel', valeurNouvelle: command.nomOfficiel },
          { champ: 'statutJuridique', valeurNouvelle: command.statutJuridique },
        ],
        date: new Date(),
      },
      {
        id: `audit-${Date.now()}`,
        tenantId: command.tenantId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    );

    // 6. Persistance globale
    await this.etablissementRepo.save(etablissement);
    await this.etablissementRepo.saveEnTete(etablissementId, enTeteDefaut);
    await this.etablissementRepo.saveAuditEntry(etablissementId, auditEntry);

    return etablissementId;
  }
}