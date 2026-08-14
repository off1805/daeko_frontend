import type {
  StructurePedagogiqueQueryPort,
  ClasseResumePourInscription,
  EtatAnneeAcademique,
} from "../../application/ports/structure-pedagogique-query.port";
import { IDS_DEMO } from "../mock-data/eleves.seed-data";

/**
 * FAUSSE implémentation, en attendant que le module Structure
 * Pédagogique existe réellement. Renvoie des données fixes cohérentes
 * avec le jeu de données de démo (eleves.seed-data.ts) — juste assez
 * pour que InscrireEleveUseCase et MuterInscriptionUseCase fonctionnent
 * de bout en bout à l'écran.
 *
 * Le jour où Structure Pédagogique existe, on écrit une VRAIE
 * implémentation de ce même port (probablement HTTP ou via un vrai
 * repository), et on remplace juste le branchement dans
 * eleves.container.ts — rien d'autre à toucher dans tout le module.
 */
export class FakeStructurePedagogiqueQuery implements StructurePedagogiqueQueryPort {
  private readonly classesConnues: Record<string, ClasseResumePourInscription> = {
    [IDS_DEMO.classe3emeA]: {
      id: IDS_DEMO.classe3emeA,
      anneeAcademiqueId: IDS_DEMO.anneeAcademiqueId,
      estActive: true,
    },
    [IDS_DEMO.classe4emeB]: {
      id: IDS_DEMO.classe4emeB,
      anneeAcademiqueId: IDS_DEMO.anneeAcademiqueId,
      estActive: true,
    },
  };

  async obtenirClasse(classeId: string): Promise<ClasseResumePourInscription | null> {
    return this.classesConnues[classeId] ?? null;
  }

  async obtenirEtatAnnee(anneeAcademiqueId: string): Promise<EtatAnneeAcademique | null> {
    if (anneeAcademiqueId !== IDS_DEMO.anneeAcademiqueId) return null;
    return "EN_COURS"; // fixe pour la démo — change ici si tu veux tester EN_PREPARATION/CLOTUREE
  }
}