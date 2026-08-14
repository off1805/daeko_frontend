import { Eleve } from "../../domain/entities/eleve.entity";
import type {
  EleveRepository,
  FiltresEleves,
  EleveResume,
  PageResultat,
} from "../../domain/repositories/eleve.repository";
import { elevesSeed } from "../mock-data/eleves.seed-data";


export class InMemoryEleveRepository implements EleveRepository {
  private eleves: Map<string, Eleve> = new Map(
    elevesSeed.map((e) => [e.id, e])
  );

  async lister(filtres: FiltresEleves): Promise<PageResultat<Eleve>> {
    let resultats = Array.from(this.eleves.values()).filter(
      (e) => e.etablissementId === filtres.etablissementId
    );

    if (filtres.etat && filtres.etat !== "TOUS") {
      resultats = resultats.filter((e) => e.etat === filtres.etat);
    }

    if (filtres.recherche?.trim()) {
      const recherche = this.normaliser(filtres.recherche);
      resultats = resultats.filter(
        (e) =>
          this.normaliser(e.identite.nomComplet).includes(recherche) ||
          this.normaliser(e.matricule).includes(recherche)
      );
    }

    const page = filtres.page ?? 1;
    const taille = filtres.taille ?? 20;
    const debut = (page - 1) * taille;
    const items = resultats.slice(debut, debut + taille);

    return { items, total: resultats.length, page, taille };
  }

  async obtenirParId(id: string, etablissementId: string): Promise<Eleve | null> {
    const eleve = this.eleves.get(id);
    if (!eleve || eleve.etablissementId !== etablissementId) return null;
    return eleve;
  }

  async obtenirParMatricule(
    matricule: string,
    etablissementId: string
  ): Promise<EleveResume | null> {
    const eleve = Array.from(this.eleves.values()).find(
      (e) => e.matricule === matricule && e.etablissementId === etablissementId
    );
    if (!eleve) return null;

    return {
      id: eleve.id,
      matricule: eleve.matricule,
      nomComplet: eleve.identite.nomComplet,
      classeLibelle: undefined, // nécessiterait de consulter Inscription — laissé vide en mémoire
    };
  }

  async sauvegarder(eleve: Eleve): Promise<void> {
    this.eleves.set(eleve.id, eleve);
  }

  async supprimer(id: string): Promise<void> {
    this.eleves.delete(id);
  }

  /** §8 : recherche insensible aux accents et à la casse. */
  private normaliser(texte: string): string {
    return texte
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }
}