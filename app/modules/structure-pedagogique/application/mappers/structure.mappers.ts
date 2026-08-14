import type { Branche } from "~/modules/structure-pedagogique/domain/entities/branche.entity";
import type { MatiereLocale } from "~/modules/structure-pedagogique/domain/entities/matiere-locale.entity";
import type { AnneeAcademique } from "~/modules/structure-pedagogique/domain/entities/annee-academique.entity";
import type { ConfigurationBrancheAnnee } from "~/modules/structure-pedagogique/domain/entities/configuration-branche-annee.entity";
import type {
  FiliereActive,
  NiveauActive,
  SerieActive,
} from "~/modules/structure-pedagogique/domain/entities/activation.entity";
import type { MatiereActive } from "~/modules/structure-pedagogique/domain/entities/matiere-active.entity";
import type { Classe } from "~/modules/structure-pedagogique/domain/entities/classe.entity";
import type { AuditStructure } from "~/modules/structure-pedagogique/domain/entities/audit-structure.entity";
import type {
  AuditStructureDto,
  BrancheDto,
  ClasseDto,
  ConfigurationBrancheAnneeDto,
  FiliereActiveDto,
  MatiereActiveDto,
  MatiereLocaleDto,
  NiveauActiveDto,
  SerieActiveDto,
  AnneeAcademiqueDto,
} from "~/modules/structure-pedagogique/application/dto/structure-read.dto";

export function toBrancheDto(entity: Branche): BrancheDto {
  return {
    id: entity.id,
    sousSystemeId: entity.sousSystemeId,
    ordreEnseignementId: entity.ordreEnseignementId,
    typeEnseignementId: entity.typeEnseignementId,
    libelle: entity.libelle,
    etat: entity.etat,
    motifArchivage: entity.motifArchivage,
    dateCreation: entity.dateCreation,
    dateModification: entity.dateModification,
  };
}

export function toMatiereLocaleDto(entity: MatiereLocale): MatiereLocaleDto {
  return {
    id: entity.id,
    brancheId: entity.brancheId,
    code: entity.code,
    libelle: entity.libelle,
    libelleCourt: entity.libelleCourt,
    libelleEn: entity.libelleEn,
    domaine: entity.domaine,
    typeMatiere: entity.typeMatiere,
    baremeParDefaut: entity.baremeParDefaut,
    etat: entity.etat,
    motifDepreciation: entity.motifDepreciation,
  };
}

export function toAnneeAcademiqueDto(entity: AnneeAcademique): AnneeAcademiqueDto {
  return {
    id: entity.id,
    libelle: entity.libelle,
    dateDebut: entity.dateDebut,
    dateFin: entity.dateFin,
    etat: entity.etat,
    dateDemarrage: entity.dateDemarrage,
    dateCloture: entity.dateCloture,
  };
}

export function toConfigurationDto(
  entity: ConfigurationBrancheAnnee,
): ConfigurationBrancheAnneeDto {
  return {
    id: entity.id,
    brancheId: entity.brancheId,
    anneeAcademiqueId: entity.anneeAcademiqueId,
    etat: entity.etat,
    dupliqueeDepuisId: entity.dupliqueeDepuisId,
  };
}

export function toFiliereActiveDto(entity: FiliereActive): FiliereActiveDto {
  return {
    id: entity.id,
    configurationId: entity.configurationId,
    filiereId: entity.filiereId,
  };
}

export function toNiveauActiveDto(entity: NiveauActive): NiveauActiveDto {
  return {
    id: entity.id,
    configurationId: entity.configurationId,
    niveauId: entity.niveauId,
  };
}

export function toSerieActiveDto(entity: SerieActive): SerieActiveDto {
  return {
    id: entity.id,
    niveauActiveId: entity.niveauActiveId,
    serieId: entity.serieId,
  };
}

export function toMatiereActiveDto(entity: MatiereActive): MatiereActiveDto {
  return {
    id: entity.id,
    niveauActiveId: entity.niveauActiveId,
    serieActiveId: entity.serieActiveId,
    matiereReferentielId: entity.matiereReferentielId,
    matiereLocaleId: entity.matiereLocaleId,
    coefficient: entity.coefficient,
    bareme: entity.bareme,
    estObligatoire: entity.estObligatoire,
  };
}

export function toClasseDto(entity: Classe): ClasseDto {
  return {
    id: entity.id,
    configurationId: entity.configurationId,
    niveauActiveId: entity.niveauActiveId,
    serieActiveId: entity.serieActiveId,
    suffixe: entity.suffixe,
    libelleComplet: entity.libelleComplet,
    effectifPrevu: entity.effectifPrevu,
    salle: entity.salle,
    enseignantPrincipalId: entity.enseignantPrincipalId,
    actif: entity.actif,
  };
}

export function toAuditStructureDto(entity: AuditStructure): AuditStructureDto {
  return {
    id: entity.id,
    operation: entity.operation,
    cibleType: entity.cibleType,
    cibleId: entity.cibleId,
    utilisateurId: entity.utilisateurId,
    horodatage: entity.horodatage,
    valeursAvant: entity.valeursAvant,
    valeursApres: entity.valeursApres,
    motif: entity.motif,
  };
}
