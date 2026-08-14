// Doc section 3.1 — types énumérés du module. CLOTUREE / SCELLEE restent
// dans les types pour rester fidèles au dossier mais ne sont atteignables
// par aucun flux en v1 (clôture d'année hors périmètre, voir le plan).

export type EtatBranche =
  | "EN_CONFIGURATION"
  | "ACTIVE"
  | "SUSPENDUE"
  | "ARCHIVEE";

export type EtatAnnee = "EN_PREPARATION" | "EN_COURS" | "CLOTUREE";

export type EtatConfiguration = "OUVERTE" | "SCELLEE";

export type EtatElementLocal = "ACTIVE" | "DEPRECATED";

export type OperationAuditSp =
  | "CREATION"
  | "MODIFICATION"
  | "ACTIVATION_ELEMENT"
  | "RETRAIT_ELEMENT"
  | "SUSPENSION"
  | "REACTIVATION"
  | "ARCHIVAGE"
  | "DUPLICATION"
  | "DEMARRAGE_ANNEE"
  | "CLOTURE_ANNEE"
  | "DEVERROUILLAGE_COEFFICIENT"
  | "DESACTIVATION_CLASSE"
  | "DEPRECIATION_MATIERE_LOCALE";
