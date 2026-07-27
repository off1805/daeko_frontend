import { EnTeteOfficiel } from '~/modules/etablissement/domain/entities/en-tete.entity';
import type { EnTeteProps } from '~/modules/etablissement/domain/entities/en-tete.entity';
import { LigneEnTeteVO } from '~/modules/etablissement/domain/value-objects/en-tete-ligne.vo';
import { LocalisationVO } from '~/modules/etablissement/domain/value-objects/localisation.vo';
import type { EntityMetadataProps } from '~/modules/etablissement/domain/shared/etablissement-entity';

/**
 * Service de domaine responsable de la génération automatique de l'en-tête officiel (F-05)[cite: 1].
 */
export class EnTeteGeneratorService {
  /**
   * Génère les 6 lignes réglementaires de l'en-tête officiel camerounais selon la hiérarchie administrative.
   */
  public static genererParDefaut(
    localisation: LocalisationVO,
    nomEtablissement: string,
    sigleEtablissement?: string,
    metadata?: EntityMetadataProps
  ): EnTeteOfficiel {
    const nomAffichable = sigleEtablissement 
      ? `${nomEtablissement} (${sigleEtablissement})` 
      : nomEtablissement;

    const lignesData = [
      {
        ordre: 1,
        texteFr: 'REPUBLIQUE DU CAMEROUN',
        texteEn: 'REPUBLIC OF CAMEROON'
      },
      {
        ordre: 2,
        texteFr: 'Paix - Travail - Patrie',
        texteEn: 'Peace - Work - Fatherland'
      },
      {
        ordre: 3,
        texteFr: 'MINISTERE DES ENSEIGNEMENTS SECONDAIRES',
        texteEn: 'MINISTRY OF SECONDARY EDUCATION'
      },
      {
        ordre: 4,
        texteFr: `DELEGATION REGIONALE DE LA ${localisation.regionCode.toUpperCase()}`,
        texteEn: `${localisation.regionCode.toUpperCase()} REGIONAL DELEGATION`
      },
      {
        ordre: 5,
        texteFr: `DELEGATION DEPARTEMENTALE DU ${localisation.departementCode.toUpperCase()}`,
        texteEn: `${localisation.departementCode.toUpperCase()} DIVISIONAL DELEGATION`
      },
      {
        ordre: 6,
        texteFr: nomAffichable.toUpperCase(),
        texteEn: nomAffichable.toUpperCase()
      }
    ];

    const lignesVO = lignesData.map((l) => 
      LigneEnTeteVO.create(
        {
          ordre: l.ordre,
          texteFr: l.texteFr,
          texteEn: l.texteEn
        },
        'BILINGUE'
      )
    );

    const props: EnTeteProps = {
      mode: 'BILINGUE',
      lignes: lignesVO,
      deviseSpecifique: 'Paix - Travail - Patrie'
    };

    const defaultMetadata: EntityMetadataProps = metadata || {
      id: `en-tete-${Date.now()}`,
      tenantId: 'default-tenant',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return EnTeteOfficiel.create(props, defaultMetadata);
  }
}