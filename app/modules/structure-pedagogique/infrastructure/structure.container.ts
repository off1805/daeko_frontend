import { createInMemoryBrancheRepository } from "~/modules/structure-pedagogique/infrastructure/repositories/in-memory-branche.repository";
import { createInMemoryMatiereLocaleRepository } from "~/modules/structure-pedagogique/infrastructure/repositories/in-memory-matiere-locale.repository";
import { createInMemoryAnneeAcademiqueRepository } from "~/modules/structure-pedagogique/infrastructure/repositories/in-memory-annee-academique.repository";
import { createInMemoryConfigurationRepository } from "~/modules/structure-pedagogique/infrastructure/repositories/in-memory-configuration.repository";
import { createInMemoryClasseRepository } from "~/modules/structure-pedagogique/infrastructure/repositories/in-memory-classe.repository";
import { createMockAuditStructureRepository } from "~/modules/structure-pedagogique/infrastructure/repositories/mock-audit-structure.repository";
import {
  anneesSeed,
  auditSeed,
  branchesSeed,
  classesSeed,
  configurationsSeed,
  filieresActivesSeed,
  matieresActivesSeed,
  matieresLocalesSeed,
  niveauxActifsSeed,
  seriesActivesSeed,
} from "~/modules/structure-pedagogique/infrastructure/mock-data/structure.seed-data";
import { CreerBrancheUseCase, ListerBranchesUseCase } from "~/modules/structure-pedagogique/application/use-cases/branche/creer-branche.use-case";
import {
  ActiverBrancheUseCase,
  ArchiverBrancheUseCase,
  ModifierLibelleBrancheUseCase,
  ReactiverBrancheUseCase,
  SuspendreBrancheUseCase,
} from "~/modules/structure-pedagogique/application/use-cases/branche/branche-transitions.use-cases";
import {
  CreerMatiereLocaleUseCase,
  DeprecierMatiereLocaleUseCase,
  ListerMatieresLocalesUseCase,
} from "~/modules/structure-pedagogique/application/use-cases/matiere-locale/matiere-locale.use-cases";
import {
  CloturerAnneeAcademiqueUseCase,
  CreerAnneeAcademiqueUseCase,
  DemarrerAnneeAcademiqueUseCase,
  ListerAnneesAcademiquesUseCase,
} from "~/modules/structure-pedagogique/application/use-cases/annee/annee.use-cases";
import { CreerConfigurationUseCase } from "~/modules/structure-pedagogique/application/use-cases/configuration/creer-configuration.use-case";
import {
  ObtenirConfigurationDetailUseCase,
  ObtenirConfigurationParBrancheEtAnneeUseCase,
} from "~/modules/structure-pedagogique/application/use-cases/configuration/obtenir-configuration-detail.use-case";
import {
  MettreAJourFilieresActivesUseCase,
  MettreAJourMatieresActivesUseCase,
  MettreAJourNiveauxActifsUseCase,
  MettreAJourSeriesActivesUseCase,
} from "~/modules/structure-pedagogique/application/use-cases/configuration/mettre-a-jour-activations.use-cases";
import { CorrigerCoefficientUseCase } from "~/modules/structure-pedagogique/application/use-cases/configuration/corriger-coefficient.use-case";
import {
  CreerClasseUseCase,
  DesactiverClasseUseCase,
  ListerClassesUseCase,
  ModifierClasseUseCase,
  ReactiverClasseUseCase,
} from "~/modules/structure-pedagogique/application/use-cases/classe/classe.use-cases";
import { ObtenirTableauDeBordUseCase } from "~/modules/structure-pedagogique/application/use-cases/tableau-de-bord/obtenir-tableau-de-bord.use-case";
import { ListerAuditStructureUseCase } from "~/modules/structure-pedagogique/application/use-cases/audit/lister-audit-structure.use-case";

// Stores en mémoire partagés par référence entre repositories (jointures de
// lecture, cascades d'écriture) — même stratégie que referentiel.container.ts.
// Ne jamais réaffecter ces propriétés (`stores.x = ...`) : toujours muter en
// place (push/splice), voir le commentaire de `retirerOu` dans
// in-memory-configuration.repository.ts.
const stores = {
  branches: [...branchesSeed],
  matieresLocales: [...matieresLocalesSeed],
  annees: [...anneesSeed],
  configurations: [...configurationsSeed],
  filieresActives: [...filieresActivesSeed],
  niveauxActifs: [...niveauxActifsSeed],
  seriesActives: [...seriesActivesSeed],
  matieresActives: [...matieresActivesSeed],
  classes: [...classesSeed],
  audit: [...auditSeed],
};

const brancheRepository = createInMemoryBrancheRepository(stores.branches, stores.audit);
const matiereLocaleRepository = createInMemoryMatiereLocaleRepository(stores.matieresLocales, stores.audit);
const anneeAcademiqueRepository = createInMemoryAnneeAcademiqueRepository(
  stores.annees,
  stores.configurations,
  stores.audit,
);
const configurationRepository = createInMemoryConfigurationRepository(stores, stores.audit);
const classeRepository = createInMemoryClasseRepository(stores, stores.audit);
const auditRepository = createMockAuditStructureRepository(stores.audit);

const obtenirConfigurationDetailUseCase = new ObtenirConfigurationDetailUseCase(configurationRepository);

export const structureContainer = {
  branches: {
    repository: brancheRepository,
    listerUseCase: new ListerBranchesUseCase(brancheRepository),
    creerUseCase: new CreerBrancheUseCase(brancheRepository),
    modifierLibelleUseCase: new ModifierLibelleBrancheUseCase(brancheRepository),
    activerUseCase: new ActiverBrancheUseCase(brancheRepository),
    suspendreUseCase: new SuspendreBrancheUseCase(brancheRepository),
    reactiverUseCase: new ReactiverBrancheUseCase(brancheRepository),
    archiverUseCase: new ArchiverBrancheUseCase(brancheRepository),
  },
  matieresLocales: {
    repository: matiereLocaleRepository,
    listerUseCase: new ListerMatieresLocalesUseCase(matiereLocaleRepository),
    creerUseCase: new CreerMatiereLocaleUseCase(matiereLocaleRepository),
    deprecierUseCase: new DeprecierMatiereLocaleUseCase(matiereLocaleRepository),
  },
  annees: {
    repository: anneeAcademiqueRepository,
    listerUseCase: new ListerAnneesAcademiquesUseCase(anneeAcademiqueRepository),
    creerUseCase: new CreerAnneeAcademiqueUseCase(anneeAcademiqueRepository),
    demarrerUseCase: new DemarrerAnneeAcademiqueUseCase(anneeAcademiqueRepository),
    cloturerUseCase: new CloturerAnneeAcademiqueUseCase(anneeAcademiqueRepository),
  },
  configurations: {
    repository: configurationRepository,
    creerUseCase: new CreerConfigurationUseCase(configurationRepository),
    obtenirDetailUseCase: obtenirConfigurationDetailUseCase,
    obtenirParBrancheEtAnneeUseCase: new ObtenirConfigurationParBrancheEtAnneeUseCase(
      configurationRepository,
      obtenirConfigurationDetailUseCase,
    ),
    mettreAJourFilieresUseCase: new MettreAJourFilieresActivesUseCase(configurationRepository),
    mettreAJourNiveauxUseCase: new MettreAJourNiveauxActifsUseCase(configurationRepository),
    mettreAJourSeriesUseCase: new MettreAJourSeriesActivesUseCase(configurationRepository),
    mettreAJourMatieresUseCase: new MettreAJourMatieresActivesUseCase(configurationRepository),
    corrigerCoefficientUseCase: new CorrigerCoefficientUseCase(configurationRepository),
  },
  classes: {
    repository: classeRepository,
    listerUseCase: new ListerClassesUseCase(classeRepository),
    creerUseCase: new CreerClasseUseCase(classeRepository),
    modifierUseCase: new ModifierClasseUseCase(classeRepository),
    desactiverUseCase: new DesactiverClasseUseCase(classeRepository),
    reactiverUseCase: new ReactiverClasseUseCase(classeRepository),
  },
  tableauDeBord: {
    obtenirUseCase: new ObtenirTableauDeBordUseCase(brancheRepository, anneeAcademiqueRepository, configurationRepository),
  },
  audit: {
    repository: auditRepository,
    listerUseCase: new ListerAuditStructureUseCase(auditRepository),
  },
};
