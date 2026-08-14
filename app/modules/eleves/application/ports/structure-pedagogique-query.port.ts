
export interface ClasseResumePourInscription {
  id: string;
  anneeAcademiqueId: string;
  estActive: boolean;
}

export type EtatAnneeAcademique = "EN_PREPARATION" | "EN_COURS" | "CLOTUREE";

export interface StructurePedagogiqueQueryPort {
  /** ELV-004 : la classe existe-t-elle, est-elle active, dans le bon établissement/année ? */
  obtenirClasse(classeId: string): Promise<ClasseResumePourInscription | null>;

  /** ELV-005, RM-E-07 : nécessaire pour NumeroOrdreService.attribuer(). */
  obtenirEtatAnnee(anneeAcademiqueId: string): Promise<EtatAnneeAcademique | null>;
}