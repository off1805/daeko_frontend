import { Inscription } from "../../domain/entities/inscription.entity";
import type {
  InscriptionRepository,
  FiltresInscriptionsParClasse,
  PageResultat,
} from "../../domain/repositories/inscription.repository";
import type { InscriptionActivePourNumerotation } from "../../domain/services/numero-ordre.service";
import { inscriptionsSeed } from "../mock-data/eleves.seed-data";
import type { EleveRepository } from "../../domain/repositories/eleve.repository";

export class InMemoryInscriptionRepository implements InscriptionRepository {
  private inscriptions: Map<string, Inscription> = new Map(
    inscriptionsSeed.map((i) => [i.id, i])
  );

  
  constructor(private readonly eleveRepository: EleveRepository) {}

  async obtenirParId(id: string): Promise<Inscription | null> {
    return this.inscriptions.get(id) ?? null;
  }

  async listerParClasse(
    filtres: FiltresInscriptionsParClasse
  ): Promise<PageResultat<Inscription>> {
    let resultats = Array.from(this.inscriptions.values()).filter(
      (i) => i.classeId === filtres.classeId
    );

    if (!filtres.etat || filtres.etat !== "TOUTES") {
      resultats = resultats.filter((i) => i.etat === "ACTIVE");
    }

    resultats.sort((a, b) => a.numeroOrdre - b.numeroOrdre);

    const page = filtres.page ?? 1;
    const taille = filtres.taille ?? 50;
    const debut = (page - 1) * taille;
    const items = resultats.slice(debut, debut + taille);

    return { items, total: resultats.length, page, taille };
  }

  async obtenirInscriptionActive(
    eleveId: string,
    anneeAcademiqueId: string
  ): Promise<Inscription | null> {
    return (
      Array.from(this.inscriptions.values()).find(
        (i) =>
          i.eleveId === eleveId &&
          i.anneeAcademiqueId === anneeAcademiqueId &&
          i.estActive
      ) ?? null
    );
  }

  async listerActivesPourNumerotation(
    classeId: string
  ): Promise<InscriptionActivePourNumerotation[]> {
    const actives = Array.from(this.inscriptions.values()).filter(
      (i) => i.classeId === classeId && i.estActive
    );

    const resultats: InscriptionActivePourNumerotation[] = [];
    for (const inscription of actives) {
      const eleve = await this.eleveRepository.obtenirParId(
        inscription.eleveId,
        inscription.etablissementId
      );
      if (!eleve) continue; // ne devrait jamais arriver en pratique (intégrité référentielle)
      resultats.push({
        inscriptionId: inscription.id,
        numeroOrdreActuel: inscription.numeroOrdre,
        nomEleve: eleve.identite.nom,
        prenomsEleve: eleve.identite.prenoms,
      });
    }
    return resultats;
  }

  async listerMutations(inscriptionId: string): Promise<Inscription["mutations"]> {
    const inscription = this.inscriptions.get(inscriptionId);
    return inscription ? inscription.mutations : [];
  }

  async sauvegarder(inscription: Inscription): Promise<void> {
    this.inscriptions.set(inscription.id, inscription);
  }

  async cloturerToutesActivesPourAnnee(anneeAcademiqueId: string): Promise<void> {
    for (const [id, inscription] of this.inscriptions) {
      if (inscription.anneeAcademiqueId === anneeAcademiqueId && inscription.estActive) {
        this.inscriptions.set(id, inscription.cloturerParFinAnnee(new Date().toISOString()));
      }
    }
  }
}