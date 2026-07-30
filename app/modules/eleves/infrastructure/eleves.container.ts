import { UuidGenerator } from "~/shared/infrastructure/ports/uuid-generator";
import { SystemClock } from "~/shared/infrastructure/ports/system-clock";

import { InMemoryEleveRepository } from "./repositories/in-memory-eleve.repository";
import { InMemoryInscriptionRepository } from "./repositories/in-memory-inscription.repository";
import {
  InMemoryImportLotRepository,
  InMemoryImportLigneRepository,
} from "./repositories/in-memory-import.repository";
import { FakeStructurePedagogiqueQuery } from "./ports/fake-structure-pedagogique-query";
import { FakeFichierImportParser } from "./ports/fake-fichier-import-parser";

import { CreerEleveUseCase } from "../application/use-cases/creer-eleve.use-case";
import { ObtenirEleveUseCase } from "../application/use-cases/obtenir-eleve.use-case";
import { ModifierEleveUseCase } from "../application/use-cases/modifier-eleve.use-case";
import { AjouterTuteurUseCase } from "../application/use-cases/ajouter-tuteur.use-case";
import { ModifierTuteurUseCase } from "../application/use-cases/modifier-tuteur.use-case";
import { DefinirTuteurPrincipalUseCase } from "../application/use-cases/definir-tuteur-principal.use-case";
import { SupprimerTuteurUseCase } from "../application/use-cases/supprimer-tuteur.use-case";
import { ReactiverEleveUseCase } from "../application/use-cases/reactiver-eleve.use-case";
import { ArchiverEleveUseCase } from "../application/use-cases/archiver-eleve.use-case";
import { ListerElevesUseCase } from "../application/use-cases/lister-eleves.use-case";

import { InscrireEleveUseCase } from "../application/use-cases/inscrire-eleve.use-case";
import { MuterInscriptionUseCase } from "../application/use-cases/muter-inscription.use-case";
import { CloturerInscriptionUseCase } from "../application/use-cases/cloturer-inscription.use-case";
import { ReactiverInscriptionUseCase } from "../application/use-cases/reactiver-inscription.use-case";
import { ListerInscriptionsClasseUseCase } from "../application/use-cases/lister-inscriptions-classe.use-case";

import { TeleverserImportUseCase } from "../application/use-cases/televerser-import.use-case";
import { EnregistrerCorrespondanceImportUseCase } from "../application/use-cases/enregistrer-correspondance-import.use-case";
import { PrevisualiserImportUseCase } from "../application/use-cases/previsualiser-import.use-case";
import { ExecuterImportUseCase } from "../application/use-cases/executer-import.use-case";
import { ListerRejetsImportUseCase } from "../application/use-cases/lister-rejets-import.use-case";


class ElevesContainer {
  // --- Infrastructure ---------------------------------------------------
  readonly eleveRepository = new InMemoryEleveRepository();
  readonly inscriptionRepository = new InMemoryInscriptionRepository(this.eleveRepository);
  readonly importLotRepository = new InMemoryImportLotRepository();
  readonly importLigneRepository = new InMemoryImportLigneRepository();
  readonly structurePedagogiqueQuery = new FakeStructurePedagogiqueQuery();
  readonly fichierImportParser = new FakeFichierImportParser();
  readonly idGenerator = new UuidGenerator();
  readonly clock = new SystemClock();

  // --- Cas d'usage : Eleve + Tuteur --------------------------------------
  readonly creerEleveUseCase = new CreerEleveUseCase(
    this.eleveRepository,
    this.idGenerator,
    this.clock
  );
  readonly obtenirEleveUseCase = new ObtenirEleveUseCase(this.eleveRepository);
  readonly modifierEleveUseCase = new ModifierEleveUseCase(this.eleveRepository, this.clock);
  readonly ajouterTuteurUseCase = new AjouterTuteurUseCase(
    this.eleveRepository,
    this.idGenerator,
    this.clock
  );
  readonly modifierTuteurUseCase = new ModifierTuteurUseCase(this.eleveRepository, this.clock);
  readonly definirTuteurPrincipalUseCase = new DefinirTuteurPrincipalUseCase(
    this.eleveRepository,
    this.clock
  );
  readonly supprimerTuteurUseCase = new SupprimerTuteurUseCase(this.eleveRepository, this.clock);
  readonly reactiverEleveUseCase = new ReactiverEleveUseCase(this.eleveRepository, this.clock);
  readonly archiverEleveUseCase = new ArchiverEleveUseCase(
    this.eleveRepository,
    this.inscriptionRepository,
    this.clock
  );
  readonly listerElevesUseCase = new ListerElevesUseCase(this.eleveRepository);

  // --- Cas d'usage : Inscription + Mutation ------------------------------
  readonly inscrireEleveUseCase = new InscrireEleveUseCase(
    this.inscriptionRepository,
    this.eleveRepository,
    this.structurePedagogiqueQuery,
    this.idGenerator,
    this.clock
  );
  readonly muterInscriptionUseCase = new MuterInscriptionUseCase(
    this.inscriptionRepository,
    this.eleveRepository,
    this.structurePedagogiqueQuery,
    this.idGenerator,
    this.clock
  );
  readonly cloturerInscriptionUseCase = new CloturerInscriptionUseCase(
    this.inscriptionRepository,
    this.clock
  );
  readonly reactiverInscriptionUseCase = new ReactiverInscriptionUseCase(
    this.inscriptionRepository,
    this.eleveRepository,
    this.structurePedagogiqueQuery,
    this.clock
  );
  readonly listerInscriptionsClasseUseCase = new ListerInscriptionsClasseUseCase(
    this.inscriptionRepository
  );

  // --- Cas d'usage : ImportLot + ImportLigne ------------------------------
  readonly televerserImportUseCase = new TeleverserImportUseCase(
    this.importLotRepository,
    this.importLigneRepository,
    this.fichierImportParser,
    this.idGenerator,
    this.clock
  );
  readonly enregistrerCorrespondanceImportUseCase = new EnregistrerCorrespondanceImportUseCase(
    this.importLotRepository
  );
  readonly previsualiserImportUseCase = new PrevisualiserImportUseCase(
    this.importLotRepository,
    this.importLigneRepository
  );
  readonly executerImportUseCase = new ExecuterImportUseCase(
    this.importLotRepository,
    this.importLigneRepository,
    this.creerEleveUseCase,
    this.inscrireEleveUseCase
  );
  readonly listerRejetsImportUseCase = new ListerRejetsImportUseCase(this.importLigneRepository);
}

/**
 * Instance UNIQUE, partagée par toute l'application (mêmes données en
 * mémoire tant que le serveur tourne) — même pattern que le modèle
 * Référentiel.
 */
export const elevesContainer = new ElevesContainer();