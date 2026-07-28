
export type EtatAnneePourNumerotation = "EN_PREPARATION" | "EN_COURS" | "CLOTUREE";

export interface InscriptionActivePourNumerotation {
  inscriptionId: string;
  numeroOrdreActuel: number;
  nomEleve: string;
  prenomsEleve: string;
}

export interface RenumeroTation {
  inscriptionId: string;
  nouveauNumero: number;
}

export interface ResultatAttribution {
  /** Le numéro reçu par l'élève concerné (nouvelle inscription ou mutation entrante). */
  numeroAttribue: number;
  
  renumerotations: RenumeroTation[];
}


export class NumeroOrdreService {
  static attribuer(
    etatAnnee: EtatAnneePourNumerotation,
    inscriptionsActivesExistantesDeLaClasse: InscriptionActivePourNumerotation[],
    eleveEntrant: { nomEleve: string; prenomsEleve: string }
  ): ResultatAttribution {
    if (etatAnnee === "CLOTUREE") {
      throw new Error(
        "Impossible d'attribuer un numéro d'ordre sur une année clôturée (ELV-005)."
      );
    }

    if (etatAnnee === "EN_PREPARATION") {
      return NumeroOrdreService.renumeroterAlphabetiquement(
        inscriptionsActivesExistantesDeLaClasse,
        eleveEntrant
      );
    }

    // EN_COURS : jamais de renumérotation, l'arrivant prend le numéro suivant (RM-E-07, CU-06).
    const maxActuel = inscriptionsActivesExistantesDeLaClasse.reduce(
      (max, i) => Math.max(max, i.numeroOrdreActuel),
      0
    );
    return { numeroAttribue: maxActuel + 1, renumerotations: [] };
  }

  private static renumeroterAlphabetiquement(
    existants: InscriptionActivePourNumerotation[],
    entrant: { nomEleve: string; prenomsEleve: string }
  ): ResultatAttribution {
    const tousLesEleves = [
      ...existants.map((i) => ({
        inscriptionId: i.inscriptionId as string | null,
        nom: i.nomEleve,
        prenoms: i.prenomsEleve,
      })),
      { inscriptionId: null, nom: entrant.nomEleve, prenoms: entrant.prenomsEleve },
    ];

    tousLesEleves.sort(
      (a, b) => a.nom.localeCompare(b.nom) || a.prenoms.localeCompare(b.prenoms)
    );

    const renumerotations: RenumeroTation[] = [];
    let numeroAttribue = 0;

    tousLesEleves.forEach((eleve, index) => {
      const nouveauNumero = index + 1;
      if (eleve.inscriptionId === null) {
        numeroAttribue = nouveauNumero; // c'est l'entrant
      } else {
        renumerotations.push({ inscriptionId: eleve.inscriptionId, nouveauNumero });
      }
    });

    return { numeroAttribue, renumerotations };
  }
}