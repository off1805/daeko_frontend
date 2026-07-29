import type {
  OrdreEnseignement,
  SousSysteme,
  TypeEnseignement,
} from "~/modules/referentiel/domain/entities/tables-racines.entity";


import type {
  Cycle,
  Niveau,
} from "~/modules/referentiel/domain/entities/chaine-temporelle.entity";


import type {
  Filiere,
  Serie,
} from "~/modules/referentiel/domain/entities/chaine-pedagogique.entity";


import type {
  MatiereReferentiel,
  MatiereReferentielNiveau,
} from "~/modules/referentiel/domain/entities/catalogue-matieres.entity";


import type { AuditEntry } from "~/modules/referentiel/domain/entities/audit-entry.entity";


import type {
  AuditEntryDto,
  CycleDto,
  FiliereDto,
  MatiereReferentielDto,
  MatiereReferentielNiveauDto,
  NiveauDto,
  OrdreEnseignementDto,
  ReferentielLifecycleDto,
  SerieDto,
  SousSystemeDto,
  TypeEnseignementDto,
} from "~/modules/referentiel/application/dto/referentiel-read.dto";

function toLifecycleDto(entity: {
  id: string;
  etat: ReferentielLifecycleDto["etat"];
  dateEntreeVigueur: string;
  dateDepreciation: string | null;
  motifDepreciation: string | null;
  dateCreation: string;
  dateModification: string;
  creePar: string;
  modifiePar: string;
}):

ReferentielLifecycleDto {
  return {
    id: entity.id,
    etat: entity.etat,
    dateEntreeVigueur: entity.dateEntreeVigueur,
    dateDepreciation: entity.dateDepreciation,
    motifDepreciation: entity.motifDepreciation,
    dateCreation: entity.dateCreation,
    dateModification: entity.dateModification,
    creePar: entity.creePar,
    modifiePar: entity.modifiePar,
  };
}

export function toSousSystemeDto(entity: SousSysteme): SousSystemeDto {
  return {
    ...toLifecycleDto(entity),
    code: entity.code,
    libelle: entity.libelle,
    libelleCourt: entity.libelleCourt,
    description: entity.description,
    languePrincipale: entity.languePrincipale,
  };
}

export function toOrdreEnseignementDto(
  entity: OrdreEnseignement,
): OrdreEnseignementDto {
  return {
    ...toLifecycleDto(entity),
    code: entity.code,
    libelle: entity.libelle,
    tutelleMinisterielle: entity.tutelleMinisterielle?.fr,
    tutelleMinisterielleEn: entity.tutelleMinisterielle?.en,
    rang: entity.rang,
    description: entity.description,
  };
}

export function toTypeEnseignementDto(
  entity: TypeEnseignement,
): TypeEnseignementDto {
  return {
    ...toLifecycleDto(entity),
    code: entity.code,
    libelle: entity.libelle,
    description: entity.description,
  };
}

export function toCycleDto(entity: Cycle): CycleDto {
  return {
    ...toLifecycleDto(entity),
    sousSystemeId: entity.sousSystemeId,
    ordreEnseignementId: entity.ordreEnseignementId,
    code: entity.code,
    libelle: entity.libelle.fr,
    libelleEn: entity.libelle.en,
    rang: entity.rang,
    dureeTheoriqueAnnees: entity.dureeTheoriqueAnnees,
    description: entity.description,
  };
}

export function toNiveauDto(entity: Niveau): NiveauDto {
  return {
    ...toLifecycleDto(entity),
    cycleId: entity.cycleId,
    code: entity.code,
    libelle: entity.libelle.fr,
    libelleCourt: entity.libelleCourt,
    libelleEn: entity.libelle.en,
    rangDansCycle: entity.rangDansCycle,
    ageTheoriqueDebut: entity.ageTheoriqueDebut,
    description: entity.description,
  };
}

export function toFiliereDto(entity: Filiere): FiliereDto {
  return {
    ...toLifecycleDto(entity),
    ordreEnseignementId: entity.ordreEnseignementId,
    typeEnseignementId: entity.typeEnseignementId,
    code: entity.code,
    libelle: entity.libelle.fr,
    libelleEn: entity.libelle.en,
    description: entity.description,
  };
}

export function toSerieDto(entity: Serie): SerieDto {
  return {
    ...toLifecycleDto(entity),
    filiereId: entity.filiereId,
    niveauApparitionId: entity.niveauApparitionId,
    code: entity.code,
    libelle: entity.libelle.fr,
    libelleCourt: entity.libelleCourt,
    libelleEn: entity.libelle.en,
    description: entity.description,
  };
}

export function toMatiereReferentielDto(
  entity: MatiereReferentiel,
): MatiereReferentielDto {
  return {
    ...toLifecycleDto(entity),
    sousSystemeId: entity.sousSystemeId,
    code: entity.code,
    libelle: entity.libelle.fr,
    libelleCourt: entity.libelleCourt,
    libelleEn: entity.libelle.en,
    domaine: entity.domaine,
    typeMatiere: entity.typeMatiere,
    baremeParDefaut: entity.baremeParDefaut,
    description: entity.description,
  };
}

export function toMatiereReferentielNiveauDto(
  entity: MatiereReferentielNiveau,
): MatiereReferentielNiveauDto {
  return {
    ...toLifecycleDto(entity),
    matiereReferentielId: entity.matiereReferentielId,
    niveauId: entity.niveauId,
    serieId: entity.serieId,
    estObligatoire: entity.estObligatoire,
    coefficientSuggere: entity.coefficientSuggere,
    sourceCoefficient: entity.sourceCoefficient,
    baremeSpecifique: entity.baremeSpecifique,
    description: entity.description,
  };
}

export function toAuditEntryDto(entity: AuditEntry): AuditEntryDto {
  return {
    id: entity.id,
    typeEntite: entity.typeEntite,
    entiteId: entity.entiteId,
    operation: entity.operation,
    utilisateurId: entity.utilisateurId,
    horodatage: entity.horodatage,
    valeursAvant: entity.valeursAvant,
    valeursApres: entity.valeursApres,
    motif: entity.motif,
  };
}
