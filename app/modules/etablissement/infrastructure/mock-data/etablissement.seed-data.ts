import type { EtablissementProps } from '~/modules/etablissement/domain/entities/etablissement.entity';
import type { EnTeteProps } from '~/modules/etablissement/domain/entities/en-tete.entity';
import type { SignataireProps } from '~/modules/etablissement/domain/entities/signataire.entity';
import { LocalisationVO } from '~/modules/etablissement/domain/value-objects/localisation.vo';
import { ContactEtablissementVO } from '~/modules/etablissement/domain/value-objects/contact-etablissement.vo';
import { LigneEnTeteVO } from '~/modules/etablissement/domain/value-objects/en-tete-ligne.vo';

export interface EtablissementSeed {
  id: string;
  tenantId: string;
  props: EtablissementProps;
  enTete: EnTeteProps;
  signataires: (SignataireProps & { id: string })[];
}

export const ETABLISSEMENT_SEED_DATA: EtablissementSeed[] = [
  {
    id: 'etb-1',
    tenantId: 'tenant-lycee-bilingue',
    props: {
      nomOfficiel: 'LYCEE BILINGUE DE YAOUNDE',
      sigle: 'LBBY',
      codeOfficiel: 'ES-01-2026',
      agrement: 'AG-2026-001',
      statutJuridique: 'PUBLIC',
      etat: 'ACTIF',
      devisePropre: 'Paix - Travail - Patrie',
      localisation: LocalisationVO.create({
        regionCode: 'CENTRE',
        departementCode: 'MFOUNDI',
        arrondissementCode: 'YAOUNDE 2',
        ville: 'Yaoundé',
      }),
      contacts: ContactEtablissementVO.create({
        email: 'contact@lbby.cm',
        telephone: '+237222000000',
        adressePostale: 'BP 123 Yaoundé',
        siteWeb: 'https://lbby.cm',
      }),
    },
    enTete: {
      mode: 'BILINGUE',
      deviseSpecifique: 'Paix - Travail - Patrie',
      lignes: [
        LigneEnTeteVO.create({ ordre: 1, texteFr: 'REPUBLIQUE DU CAMEROUN', texteEn: 'REPUBLIC OF CAMEROON' }, 'BILINGUE'),
        LigneEnTeteVO.create({ ordre: 2, texteFr: 'Paix - Travail - Patrie', texteEn: 'Peace - Work - Fatherland' }, 'BILINGUE'),
        LigneEnTeteVO.create({ ordre: 3, texteFr: 'MINISTERE DES ENSEIGNEMENTS SECONDAIRES', texteEn: 'MINISTRY OF SECONDARY EDUCATION' }, 'BILINGUE'),
        LigneEnTeteVO.create({ ordre: 4, texteFr: 'DELEGATION REGIONALE DU CENTRE', texteEn: 'CENTRE REGIONAL DELEGATION' }, 'BILINGUE'),
        LigneEnTeteVO.create({ ordre: 5, texteFr: 'DELEGATION DEPARTEMENTALE DU MFOUNDI', texteEn: 'MFOUNDI DIVISIONAL DELEGATION' }, 'BILINGUE'),
        LigneEnTeteVO.create({ ordre: 6, texteFr: 'LYCEE BILINGUE DE YAOUNDE (LBBY)', texteEn: 'BILINGUAL HIGH SCHOOL YAOUNDE (LBBY)' }, 'BILINGUE'),
      ],
    },
    signataires: [
      {
        id: 'sig-1',
        nom: 'MBarga',
        prenom: 'Jean Pierre',
        fonction: 'Proviseur',
        estPrincipal: true,
        estActif: true,
      },
    ],
  },
];