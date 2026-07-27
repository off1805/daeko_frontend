import { Signataire } from '~/modules/etablissement/domain/entities/signataire.entity';
import type { EtablissementRepository } from '~/modules/etablissement/domain/repositories/etablissement.repository';
import { EtablissementValidationError } from '~/modules/etablissement/domain/errors/etablissement.errors';

export interface AjouterSignataireCommand {
  etablissementId: string;
  nom: string;
  prenom?: string;
  fonction: string;
  estPrincipal: boolean;
  signatureImageUrl?: string;
  auteurId: string;
}

export class ManageSignatairesUseCase {
  constructor(private readonly etablissementRepo: EtablissementRepository) {}

  public async ajouterSignataire(command: AjouterSignataireCommand): Promise<string> {
    const etablissement = await this.etablissementRepo.findById(command.etablissementId);
    if (!etablissement) {
      throw new EtablissementValidationError(`Établissement introuvable.`);
    }

    const signatairesExistants = await this.etablissementRepo.findSignatairesByEtablissementId(command.etablissementId);

    // Si le nouveau signataire est principal, on désactive l'ancien principal (RM-07 - Bascule automatique)[cite: 1]
    if (command.estPrincipal) {
      for (const s of signatairesExistants) {
        if (s.estPrincipal) {
          s.retirerPrincipal(command.auteurId);
          await this.etablissementRepo.saveSignataire(command.etablissementId, s);
        }
      }
    }

    const nouveauSignataire = Signataire.create(
      {
        nom: command.nom,
        prenom: command.prenom,
        fonction: command.fonction,
        estPrincipal: command.estPrincipal || signatairesExistants.length === 0, // Force principal si premier
        signatureImageUrl: command.signatureImageUrl,
        estActif: true,
      },
      {
        id: `sig-${Date.now()}`,
        tenantId: etablissement.tenantId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    );

    await this.etablissementRepo.saveSignataire(command.etablissementId, nouveauSignataire);
    return nouveauSignataire.id;
  }
}