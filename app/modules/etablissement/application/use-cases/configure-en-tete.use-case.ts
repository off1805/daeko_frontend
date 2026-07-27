import { EnTeteOfficiel } from '~/modules/etablissement/domain/entities/en-tete.entity';
import type { EnTeteProps } from '~/modules/etablissement/domain/entities/en-tete.entity';
import { LigneEnTeteVO } from '~/modules/etablissement/domain/value-objects/en-tete-ligne.vo';
import type { ModeEnTete, LigneEnTeteProps } from '~/modules/etablissement/domain/value-objects/en-tete-ligne.vo';
import type { EtablissementRepository } from '~/modules/etablissement/domain/repositories/etablissement.repository';
import { EtablissementValidationError } from '~/modules/etablissement/domain/errors/etablissement.errors';

export interface ConfigureEnTeteCommand {
  etablissementId: string;
  mode: ModeEnTete;
  lignes: LigneEnTeteProps[];
  deviseSpecifique?: string;
  auteurId: string;
}

export class ConfigureEnTeteUseCase {
  constructor(private readonly etablissementRepo: EtablissementRepository) {}

  public async execute(command: ConfigureEnTeteCommand): Promise<void> {
    const etablissement = await this.etablissementRepo.findById(command.etablissementId);
    if (!etablissement) {
      throw new EtablissementValidationError(`Établissement introuvable (ID: ${command.etablissementId}).`);
    }

    // Construction des Value Objects de lignes avec application du mode (SIMPLE ou BILINGUE)
    const lignesVO = command.lignes.map((l) => LigneEnTeteVO.create(l, command.mode));

    const props: EnTeteProps = {
      mode: command.mode,
      lignes: lignesVO,
      deviseSpecifique: command.deviseSpecifique,
    };

    let enTete = await this.etablissementRepo.findEnTeteByEtablissementId(command.etablissementId);

    if (enTete) {
      enTete.basculerMode(command.mode, command.auteurId);
      enTete.modifierLignes(lignesVO, command.auteurId);
    } else {
      enTete = EnTeteOfficiel.create(props, {
        id: `en-tete-${command.etablissementId}`,
        tenantId: etablissement.tenantId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await this.etablissementRepo.saveEnTete(command.etablissementId, enTete);
  }
}