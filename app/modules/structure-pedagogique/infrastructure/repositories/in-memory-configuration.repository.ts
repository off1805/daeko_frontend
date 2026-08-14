import { ConfigurationBrancheAnnee } from "~/modules/structure-pedagogique/domain/entities/configuration-branche-annee.entity";
import {
  FiliereActive,
  NiveauActive,
  SerieActive,
} from "~/modules/structure-pedagogique/domain/entities/activation.entity";
import { MatiereActive } from "~/modules/structure-pedagogique/domain/entities/matiere-active.entity";
import { Classe } from "~/modules/structure-pedagogique/domain/entities/classe.entity";
import type { Branche } from "~/modules/structure-pedagogique/domain/entities/branche.entity";
import type { AnneeAcademique } from "~/modules/structure-pedagogique/domain/entities/annee-academique.entity";
import type { MatiereLocale } from "~/modules/structure-pedagogique/domain/entities/matiere-locale.entity";
import type { AuditStructure } from "~/modules/structure-pedagogique/domain/entities/audit-structure.entity";
import type {
  ConfigurationRepository,
  CreerConfigurationInput,
  MatiereActiveInput,
  RapportDuplication,
  RapportDuplicationElementIgnore,
  ResultatDifferentiel,
} from "~/modules/structure-pedagogique/domain/repositories/structure.repository";
import {
  BrancheNonActiveError,
  CoefficientInvalideError,
  CoefficientVerrouilleError,
  ConfigurationScelleeError,
  DoublonActivationError,
  DuplicationImpossibleError,
  MotifObligatoireError,
  PolymorphismeMatiereViolationError,
  RessourceIntrouvableError,
  RetraitInterditEnCoursError,
  TransitionInterditeError,
} from "~/modules/structure-pedagogique/domain/errors/structure.errors";
import {
  StructureValidationService,
  type PositionGlobale,
} from "~/modules/structure-pedagogique/domain/services/structure-validation.service";
import { enregistrerAudit, nowIso } from "~/modules/structure-pedagogique/infrastructure/support";
// Exception documentée (ARCHITECTURE.md) : lectures cross-module directes
// du container référentiel pour les validations croisées (SP-002…006, 020).
import { referentielContainer } from "~/modules/referentiel/infrastructure/referentiel.container";

export interface ConfigurationStores {
  configurations: ConfigurationBrancheAnnee[];
  filieresActives: FiliereActive[];
  niveauxActifs: NiveauActive[];
  seriesActives: SerieActive[];
  matieresActives: MatiereActive[];
  classes: Classe[];
  branches: Branche[];
  annees: AnneeAcademique[];
  matieresLocales: MatiereLocale[];
}

/**
 * Retrait en place (splice), jamais de réaffectation `store = store.filter(...)`
 * — plusieurs repositories du container partagent la même référence de
 * tableau (voir structure.container.ts) et une réaffectation romprait ce
 * partage pour les repositories déjà construits avec l'ancienne référence.
 */
function retirerOu<T>(store: T[], predicate: (item: T) => boolean): void {
  for (let i = store.length - 1; i >= 0; i -= 1) {
    if (predicate(store[i])) store.splice(i, 1);
  }
}

async function positionDuNiveau(niveauId: string): Promise<PositionGlobale | null> {
  const niveau = await referentielContainer.niveaux.repository.getById(niveauId);
  if (!niveau) return null;
  const cycle = await referentielContainer.cycles.repository.getById(niveau.cycleId);
  if (!cycle) return null;
  return { rangCycle: cycle.rang, rangDansCycle: niveau.rangDansCycle };
}

export function createInMemoryConfigurationRepository(
  stores: ConfigurationStores,
  auditStore: AuditStructure[],
): ConfigurationRepository {
  function requireConfig(id: string): ConfigurationBrancheAnnee {
    const config = stores.configurations.find((c) => c.id === id);
    if (!config) throw new RessourceIntrouvableError(id);
    return config;
  }

  function requireBranche(id: string): Branche {
    const branche = stores.branches.find((b) => b.id === id);
    if (!branche) throw new RessourceIntrouvableError(id);
    return branche;
  }

  function requireNiveauActive(id: string): NiveauActive {
    const na = stores.niveauxActifs.find((n) => n.id === id);
    if (!na) throw new RessourceIntrouvableError(id);
    return na;
  }

  /**
   * Porte d'entrée de toute écriture sur une configuration (doc 4.6) :
   * une configuration SCELLEE refuse tout ; sinon, `enCours` indique si
   * l'année est EN_COURS pour que l'appelant applique la règle "ajout
   * seulement" (filières/niveaux/séries/matières) et le verrouillage du
   * coefficient (SP-022, sauf via corrigerCoefficient).
   */
  function garantirEcriture(configurationId: string): { config: ConfigurationBrancheAnnee; enCours: boolean } {
    const config = requireConfig(configurationId);
    if (config.etat === "SCELLEE") throw new ConfigurationScelleeError();
    const annee = stores.annees.find((a) => a.id === config.anneeAcademiqueId);
    return { config, enCours: annee?.etat === "EN_COURS" };
  }

  async function copierArbre(
    sourceConfigId: string,
    cibleConfigId: string,
    auteurId: string,
  ): Promise<RapportDuplication> {
    const elementsIgnores: RapportDuplicationElementIgnore[] = [];
    const now = nowIso();

    const filieresSource = stores.filieresActives.filter((fa) => fa.configurationId === sourceConfigId);
    let filieresCopiees = 0;
    for (const fa of filieresSource) {
      const filiere = await referentielContainer.filieres.repository.getById(fa.filiereId);
      if (!filiere || filiere.etat === "DEPRECATED") {
        elementsIgnores.push({ type: "filiere", code: filiere?.code ?? fa.filiereId, raison: "dépréciée dans le référentiel" });
        continue;
      }
      stores.filieresActives.push(
        FiliereActive.create(
          { configurationId: cibleConfigId, filiereId: fa.filiereId, dateCreation: now, creePar: auteurId },
          crypto.randomUUID(),
        ),
      );
      filieresCopiees += 1;
    }

    const niveauxSource = stores.niveauxActifs.filter((na) => na.configurationId === sourceConfigId);
    let niveauxCopies = 0;
    let seriesCopiees = 0;
    let matieresCopiees = 0;
    const mapNiveauActive = new Map<string, string>();
    const mapSerieActive = new Map<string, string>();

    for (const na of niveauxSource) {
      const niveau = await referentielContainer.niveaux.repository.getById(na.niveauId);
      if (!niveau || niveau.etat === "DEPRECATED") {
        elementsIgnores.push({ type: "niveau", code: niveau?.code ?? na.niveauId, raison: "déprécié dans le référentiel" });
        continue;
      }
      const naCibleId = crypto.randomUUID();
      stores.niveauxActifs.push(
        NiveauActive.create(
          { configurationId: cibleConfigId, niveauId: na.niveauId, dateCreation: now, creePar: auteurId },
          naCibleId,
        ),
      );
      mapNiveauActive.set(na.id, naCibleId);
      niveauxCopies += 1;

      const seriesSource = stores.seriesActives.filter((sa) => sa.niveauActiveId === na.id);
      for (const sa of seriesSource) {
        const serie = await referentielContainer.series.repository.getById(sa.serieId);
        if (!serie || serie.etat === "DEPRECATED") {
          elementsIgnores.push({ type: "serie", code: serie?.code ?? sa.serieId, raison: "dépréciée dans le référentiel" });
          continue;
        }
        const saCibleId = crypto.randomUUID();
        stores.seriesActives.push(
          SerieActive.create(
            { niveauActiveId: naCibleId, serieId: sa.serieId, dateCreation: now, creePar: auteurId },
            saCibleId,
          ),
        );
        mapSerieActive.set(sa.id, saCibleId);
        seriesCopiees += 1;
      }

      const matieresSource = stores.matieresActives.filter((ma) => ma.niveauActiveId === na.id);
      for (const ma of matieresSource) {
        if (ma.matiereReferentielId) {
          const matiere = await referentielContainer.matieresReferentiel.repository.getById(ma.matiereReferentielId);
          if (!matiere || matiere.etat === "DEPRECATED") {
            elementsIgnores.push({ type: "matiere", code: matiere?.code ?? ma.matiereReferentielId, raison: "dépréciée dans le référentiel" });
            continue;
          }
        } else if (ma.matiereLocaleId) {
          const matiereLocale = stores.matieresLocales.find((m) => m.id === ma.matiereLocaleId);
          if (!matiereLocale || matiereLocale.etat === "DEPRECATED") {
            elementsIgnores.push({ type: "matiere", code: matiereLocale?.code ?? ma.matiereLocaleId, raison: "matière locale dépréciée" });
            continue;
          }
        }
        stores.matieresActives.push(
          MatiereActive.create(
            {
              niveauActiveId: naCibleId,
              serieActiveId: ma.serieActiveId ? mapSerieActive.get(ma.serieActiveId) : undefined,
              matiereReferentielId: ma.matiereReferentielId,
              matiereLocaleId: ma.matiereLocaleId,
              coefficient: ma.coefficient,
              bareme: ma.bareme,
              estObligatoire: ma.estObligatoire,
              dateCreation: now,
              dateModification: now,
              creePar: auteurId,
              modifiePar: auteurId,
            },
            crypto.randomUUID(),
          ),
        );
        matieresCopiees += 1;
      }
    }

    return {
      filieresCopiees,
      niveauxCopies,
      seriesCopiees,
      matieresCopiees,
      classesCopiees: 0,
      elementsIgnores,
    };
  }

  function copierClasses(sourceConfigId: string, cibleConfigId: string, auteurId: string): number {
    // Les niveaux/séries actifs de la cible viennent d'être créés par
    // copierArbre juste avant : on les retrouve par niveauId/serieId
    // référentiel plutôt que par id (les id source ont changé).
    const naCibleParNiveauId = new Map(
      stores.niveauxActifs.filter((na) => na.configurationId === cibleConfigId).map((na) => [na.niveauId, na]),
    );
    let copiees = 0;
    const now = nowIso();
    for (const classe of stores.classes.filter((c) => c.configurationId === sourceConfigId && c.actif)) {
      const naSource = stores.niveauxActifs.find((na) => na.id === classe.niveauActiveId);
      if (!naSource) continue;
      const naCible = naCibleParNiveauId.get(naSource.niveauId);
      if (!naCible) continue;
      let saCibleId: string | undefined;
      if (classe.serieActiveId) {
        const saSource = stores.seriesActives.find((sa) => sa.id === classe.serieActiveId);
        const saCible = saSource
          ? stores.seriesActives.find(
              (sa) => sa.niveauActiveId === naCible.id && sa.serieId === saSource.serieId,
            )
          : undefined;
        if (!saCible) continue;
        saCibleId = saCible.id;
      }
      stores.classes.push(
        Classe.create(
          {
            configurationId: cibleConfigId,
            niveauActiveId: naCible.id,
            serieActiveId: saCibleId,
            suffixe: classe.suffixe,
            libelleComplet: classe.libelleComplet,
            effectifPrevu: classe.effectifPrevu,
            salle: classe.salle,
            enseignantPrincipalId: undefined,
            actif: true,
            dateCreation: now,
            dateModification: now,
            creePar: auteurId,
            modifiePar: auteurId,
          },
          crypto.randomUUID(),
        ),
      );
      copiees += 1;
    }
    return copiees;
  }

  return {
    async getByBrancheEtAnnee(brancheId, anneeAcademiqueId) {
      return (
        stores.configurations.find(
          (c) => c.brancheId === brancheId && c.anneeAcademiqueId === anneeAcademiqueId,
        ) ?? null
      );
    },

    async listByBranche(brancheId) {
      return stores.configurations.filter((c) => c.brancheId === brancheId);
    },

    async getDetail(id) {
      const configuration = stores.configurations.find((c) => c.id === id);
      if (!configuration) return null;
      const niveauxActifs = stores.niveauxActifs.filter((na) => na.configurationId === id);
      const niveauxIds = new Set(niveauxActifs.map((na) => na.id));
      return {
        configuration,
        filieresActives: stores.filieresActives.filter((fa) => fa.configurationId === id),
        niveauxActifs,
        seriesActives: stores.seriesActives.filter((sa) => niveauxIds.has(sa.niveauActiveId)),
        matieresActives: stores.matieresActives.filter((ma) => niveauxIds.has(ma.niveauActiveId)),
        classes: stores.classes.filter((c) => c.configurationId === id),
      };
    },

    async creer(input: CreerConfigurationInput, auteurId: string) {
      const branche = requireBranche(input.brancheId);
      if (branche.etat !== "ACTIVE") throw new BrancheNonActiveError();

      const anneeCible = stores.annees.find((a) => a.id === input.anneeAcademiqueId);
      if (!anneeCible) throw new RessourceIntrouvableError(input.anneeAcademiqueId);
      if (anneeCible.etat !== "EN_PREPARATION") {
        throw new TransitionInterditeError("configuration (création)", anneeCible.etat, "OUVERTE");
      }

      const existante = stores.configurations.find(
        (c) => c.brancheId === input.brancheId && c.anneeAcademiqueId === input.anneeAcademiqueId,
      );
      if (existante) throw new DoublonActivationError();

      let source: ConfigurationBrancheAnnee | null = null;
      if (input.dupliquerDepuisPrecedente) {
        const candidates = stores.configurations
          .filter((c) => c.brancheId === input.brancheId)
          .map((c) => ({ config: c, annee: stores.annees.find((a) => a.id === c.anneeAcademiqueId) }))
          .filter((c): c is { config: ConfigurationBrancheAnnee; annee: AnneeAcademique } =>
            Boolean(c.annee && c.annee.dateDebut < anneeCible.dateDebut),
          )
          .sort((a, b) => b.annee.dateDebut.localeCompare(a.annee.dateDebut));
        source = candidates[0]?.config ?? null;
        if (!source) throw new DuplicationImpossibleError();
      }

      const now = nowIso();
      const id = crypto.randomUUID();
      const configuration = ConfigurationBrancheAnnee.create(
        {
          brancheId: input.brancheId,
          anneeAcademiqueId: input.anneeAcademiqueId,
          etat: "OUVERTE",
          dupliqueeDepuisId: source?.id ?? null,
          dateScellement: null,
          dateCreation: now,
          dateModification: now,
          creePar: auteurId,
          modifiePar: auteurId,
        },
        id,
      );
      stores.configurations.push(configuration);

      let rapport: RapportDuplication | null = null;
      if (source) {
        rapport = await copierArbre(source.id, id, auteurId);
        if (input.copierClasses) {
          rapport.classesCopiees = copierClasses(source.id, id, auteurId);
        }
        enregistrerAudit(auditStore, {
          operation: "DUPLICATION",
          cibleType: "configuration_branche_annee",
          cibleId: id,
          utilisateurId: auteurId,
          valeursApres: rapport as unknown as Record<string, unknown>,
        });
      } else {
        enregistrerAudit(auditStore, {
          operation: "CREATION",
          cibleType: "configuration_branche_annee",
          cibleId: id,
          utilisateurId: auteurId,
        });
      }

      return { configuration, rapport };
    },

    async mettreAJourFilieres(configurationId, filiereIds, auteurId) {
      const { config, enCours } = garantirEcriture(configurationId);
      const branche = requireBranche(config.brancheId);
      const existants = stores.filieresActives.filter((fa) => fa.configurationId === configurationId);
      const existantIds = existants.map((fa) => fa.filiereId);
      const aAjouter = filiereIds.filter((id) => !existantIds.includes(id));
      const aRetirer = existants.filter((fa) => !filiereIds.includes(fa.filiereId));
      if (enCours && aRetirer.length > 0) throw new RetraitInterditEnCoursError();
      const now = nowIso();

      for (const filiereId of aAjouter) {
        const filiere = await referentielContainer.filieres.repository.getById(filiereId);
        if (!filiere) throw new RessourceIntrouvableError(filiereId);
        StructureValidationService.validerFiliereActive({
          filiereEstDepreciee: filiere.etat === "DEPRECATED",
          filiereOrdreEnseignementId: filiere.ordreEnseignementId,
          filiereTypeEnseignementId: filiere.typeEnseignementId,
          brancheOrdreEnseignementId: branche.ordreEnseignementId,
          brancheTypeEnseignementId: branche.typeEnseignementId,
        });
        stores.filieresActives.push(
          FiliereActive.create(
            { configurationId, filiereId, dateCreation: now, creePar: auteurId },
            crypto.randomUUID(),
          ),
        );
      }

      for (const fa of aRetirer) {
        stores.filieresActives.splice(stores.filieresActives.indexOf(fa), 1);
      }

      const resultat: ResultatDifferentiel = {
        ajoutees: aAjouter.length,
        modifiees: 0,
        inchangees: existants.length - aRetirer.length,
        retirees: aRetirer.length,
      };
      if (resultat.ajoutees || resultat.retirees) {
        enregistrerAudit(auditStore, {
          operation: resultat.ajoutees ? "ACTIVATION_ELEMENT" : "RETRAIT_ELEMENT",
          cibleType: "configuration_branche_annee",
          cibleId: configurationId,
          utilisateurId: auteurId,
          valeursApres: resultat as unknown as Record<string, unknown>,
        });
      }
      return resultat;
    },

    async mettreAJourNiveaux(configurationId, niveauIds, auteurId) {
      const { config, enCours } = garantirEcriture(configurationId);
      const branche = requireBranche(config.brancheId);
      const existants = stores.niveauxActifs.filter((na) => na.configurationId === configurationId);
      const existantIds = existants.map((na) => na.niveauId);
      const aAjouter = niveauIds.filter((id) => !existantIds.includes(id));
      const aRetirer = existants.filter((na) => !niveauIds.includes(na.niveauId));
      if (enCours && aRetirer.length > 0) throw new RetraitInterditEnCoursError();
      const now = nowIso();

      for (const niveauId of aAjouter) {
        const niveau = await referentielContainer.niveaux.repository.getById(niveauId);
        if (!niveau) throw new RessourceIntrouvableError(niveauId);
        const cycle = await referentielContainer.cycles.repository.getById(niveau.cycleId);
        if (!cycle) throw new RessourceIntrouvableError(niveau.cycleId);
        StructureValidationService.validerNiveauActive({
          niveauEstDeprecie: niveau.etat === "DEPRECATED",
          cycleSousSystemeId: cycle.sousSystemeId,
          cycleOrdreEnseignementId: cycle.ordreEnseignementId,
          brancheSousSystemeId: branche.sousSystemeId,
          brancheOrdreEnseignementId: branche.ordreEnseignementId,
        });
        stores.niveauxActifs.push(
          NiveauActive.create(
            { configurationId, niveauId, dateCreation: now, creePar: auteurId },
            crypto.randomUUID(),
          ),
        );
      }

      for (const na of aRetirer) {
        // Cascade : une désactivation de niveau retire ses séries, matières et classes.
        const seriesLiees = stores.seriesActives.filter((sa) => sa.niveauActiveId === na.id);
        for (const sa of seriesLiees) {
          stores.seriesActives.splice(stores.seriesActives.indexOf(sa), 1);
        }
        retirerOu(stores.matieresActives, (ma) => ma.niveauActiveId === na.id);
        retirerOu(stores.classes, (c) => c.niveauActiveId === na.id);
        stores.niveauxActifs.splice(stores.niveauxActifs.indexOf(na), 1);
      }

      const resultat: ResultatDifferentiel = {
        ajoutees: aAjouter.length,
        modifiees: 0,
        inchangees: existants.length - aRetirer.length,
        retirees: aRetirer.length,
      };
      if (resultat.ajoutees || resultat.retirees) {
        enregistrerAudit(auditStore, {
          operation: resultat.ajoutees ? "ACTIVATION_ELEMENT" : "RETRAIT_ELEMENT",
          cibleType: "configuration_branche_annee",
          cibleId: configurationId,
          utilisateurId: auteurId,
          valeursApres: resultat as unknown as Record<string, unknown>,
        });
      }
      return resultat;
    },

    async mettreAJourSeries(niveauActiveId, serieIds, auteurId) {
      const na = requireNiveauActive(niveauActiveId);
      const { enCours } = garantirEcriture(na.configurationId);
      const filieresActivesIds = stores.filieresActives
        .filter((fa) => fa.configurationId === na.configurationId)
        .map((fa) => fa.filiereId);
      const existants = stores.seriesActives.filter((sa) => sa.niveauActiveId === niveauActiveId);
      const existantIds = existants.map((sa) => sa.serieId);
      const aAjouter = serieIds.filter((id) => !existantIds.includes(id));
      const aRetirer = existants.filter((sa) => !serieIds.includes(sa.serieId));
      if (enCours && aRetirer.length > 0) throw new RetraitInterditEnCoursError();
      const now = nowIso();

      const positionCible = await positionDuNiveau(na.niveauId);
      if (!positionCible) throw new RessourceIntrouvableError(na.niveauId);

      for (const serieId of aAjouter) {
        const serie = await referentielContainer.series.repository.getById(serieId);
        if (!serie) throw new RessourceIntrouvableError(serieId);
        const positionApparition = await positionDuNiveau(serie.niveauApparitionId);
        if (!positionApparition) throw new RessourceIntrouvableError(serie.niveauApparitionId);
        StructureValidationService.validerSerieActive({
          serieEstDepreciee: serie.etat === "DEPRECATED",
          serieFiliereId: serie.filiereId,
          filieresActivesIds,
          positionNiveauCible: positionCible,
          positionNiveauApparition: positionApparition,
        });
        stores.seriesActives.push(
          SerieActive.create(
            { niveauActiveId, serieId, dateCreation: now, creePar: auteurId },
            crypto.randomUUID(),
          ),
        );
      }

      for (const sa of aRetirer) {
        retirerOu(stores.matieresActives, (ma) => ma.serieActiveId === sa.id);
        retirerOu(stores.classes, (c) => c.serieActiveId === sa.id);
        stores.seriesActives.splice(stores.seriesActives.indexOf(sa), 1);
      }

      const resultat: ResultatDifferentiel = {
        ajoutees: aAjouter.length,
        modifiees: 0,
        inchangees: existants.length - aRetirer.length,
        retirees: aRetirer.length,
      };
      if (resultat.ajoutees || resultat.retirees) {
        enregistrerAudit(auditStore, {
          operation: resultat.ajoutees ? "ACTIVATION_ELEMENT" : "RETRAIT_ELEMENT",
          cibleType: "niveau_actif",
          cibleId: niveauActiveId,
          utilisateurId: auteurId,
          valeursApres: resultat as unknown as Record<string, unknown>,
        });
      }
      return resultat;
    },

    async mettreAJourMatieres(niveauActiveId, matieres: MatiereActiveInput[], auteurId) {
      const na = requireNiveauActive(niveauActiveId);
      const { enCours } = garantirEcriture(na.configurationId);
      const branche = requireBranche(requireConfig(na.configurationId).brancheId);
      const existants = stores.matieresActives.filter((ma) => ma.niveauActiveId === niveauActiveId);
      const idsInput = new Set(matieres.filter((m) => m.id).map((m) => m.id));
      const aRetirer = existants.filter((ma) => !idsInput.has(ma.id));
      if (enCours && aRetirer.length > 0) throw new RetraitInterditEnCoursError();

      // Doc 4.6 : en EN_COURS, seule l'arrivée tardive d'une matière est
      // permise — pas la modification d'une ligne existante (SP-022, sauf
      // via corrigerCoefficient). Vérifié en amont, avant toute mutation,
      // pour ne jamais laisser une écriture partielle derrière une erreur.
      if (enCours) {
        for (const m of matieres) {
          if (!m.id) continue;
          const existing = existants.find((ma) => ma.id === m.id);
          if (!existing) continue;
          const estObligatoire = m.estObligatoire ?? existing.estObligatoire;
          const inchangee =
            existing.coefficient === m.coefficient &&
            existing.bareme === m.bareme &&
            existing.estObligatoire === estObligatoire &&
            existing.serieActiveId === m.serieActiveId;
          if (!inchangee) throw new CoefficientVerrouilleError();
        }
      }

      const now = nowIso();

      let ajoutees = 0;
      let modifiees = 0;
      let inchangees = 0;

      for (const m of matieres) {
        const sourcesRenseignees = [m.matiereReferentielId, m.matiereLocaleId].filter(Boolean).length;
        if (sourcesRenseignees !== 1) throw new PolymorphismeMatiereViolationError();

        const serieActiveIdRattacheeAuNiveau =
          !m.serieActiveId ||
          stores.seriesActives.some((sa) => sa.id === m.serieActiveId && sa.niveauActiveId === niveauActiveId);

        if (m.matiereReferentielId) {
          const matiereRef = await referentielContainer.matieresReferentiel.repository.getById(m.matiereReferentielId);
          if (!matiereRef) throw new RessourceIntrouvableError(m.matiereReferentielId);
          StructureValidationService.validerMatiereActive({
            serieActiveIdRattacheeAuNiveau,
            coefficient: m.coefficient,
            source: {
              type: "referentiel",
              estDepreciee: matiereRef.etat === "DEPRECATED",
              sousSystemeId: matiereRef.sousSystemeId,
              brancheSousSystemeId: branche.sousSystemeId,
            },
          });
        } else {
          const matiereLocale = stores.matieresLocales.find((ml) => ml.id === m.matiereLocaleId);
          if (!matiereLocale) throw new RessourceIntrouvableError(m.matiereLocaleId!);
          StructureValidationService.validerMatiereActive({
            serieActiveIdRattacheeAuNiveau,
            coefficient: m.coefficient,
            source: {
              type: "locale",
              estDepreciee: matiereLocale.etat === "DEPRECATED",
              brancheId: matiereLocale.brancheId,
              brancheIdCible: branche.id,
            },
          });
        }

        if (m.id) {
          const existing = existants.find((ma) => ma.id === m.id);
          if (!existing) throw new RessourceIntrouvableError(m.id);
          const estObligatoire = m.estObligatoire ?? existing.estObligatoire;
          const inchangee =
            existing.coefficient === m.coefficient &&
            existing.bareme === m.bareme &&
            existing.estObligatoire === estObligatoire &&
            existing.serieActiveId === m.serieActiveId;
          if (inchangee) {
            inchangees += 1;
            continue;
          }
          const updated = MatiereActive.create(
            {
              ...existing.toProps(),
              serieActiveId: m.serieActiveId,
              coefficient: m.coefficient,
              bareme: m.bareme,
              estObligatoire,
              dateModification: now,
              modifiePar: auteurId,
            },
            m.id,
          );
          stores.matieresActives[stores.matieresActives.indexOf(existing)] = updated;
          modifiees += 1;
        } else {
          const doublon = existants
            .filter((ma) => !aRetirer.includes(ma))
            .some(
              (ma) =>
                ma.serieActiveId === m.serieActiveId &&
                ma.matiereReferentielId === m.matiereReferentielId &&
                ma.matiereLocaleId === m.matiereLocaleId,
            );
          if (doublon) throw new DoublonActivationError();
          stores.matieresActives.push(
            MatiereActive.create(
              {
                niveauActiveId,
                serieActiveId: m.serieActiveId,
                matiereReferentielId: m.matiereReferentielId,
                matiereLocaleId: m.matiereLocaleId,
                coefficient: m.coefficient,
                bareme: m.bareme,
                estObligatoire: m.estObligatoire ?? true,
                dateCreation: now,
                dateModification: now,
                creePar: auteurId,
                modifiePar: auteurId,
              },
              crypto.randomUUID(),
            ),
          );
          ajoutees += 1;
        }
      }

      for (const ma of aRetirer) {
        stores.matieresActives.splice(stores.matieresActives.indexOf(ma), 1);
      }

      const resultat: ResultatDifferentiel = { ajoutees, modifiees, inchangees, retirees: aRetirer.length };
      if (resultat.ajoutees || resultat.modifiees || resultat.retirees) {
        enregistrerAudit(auditStore, {
          operation: resultat.ajoutees
            ? "ACTIVATION_ELEMENT"
            : resultat.retirees
              ? "RETRAIT_ELEMENT"
              : "MODIFICATION",
          cibleType: "niveau_actif",
          cibleId: niveauActiveId,
          utilisateurId: auteurId,
          valeursApres: resultat as unknown as Record<string, unknown>,
        });
      }
      return resultat;
    },

    async corrigerCoefficient(matiereActiveId, input, auteurId) {
      if (!input.motif.trim()) throw new MotifObligatoireError();
      const ma = stores.matieresActives.find((m) => m.id === matiereActiveId);
      if (!ma) throw new RessourceIntrouvableError(matiereActiveId);
      if (!(input.nouveauCoefficient > 0)) {
        throw new CoefficientInvalideError();
      }
      // Seule ConfigurationScelleeError bloque ce flux : c'est justement le
      // chemin d'exception qui reste ouvert quand l'année est EN_COURS
      // (doc "Modifier un coefficient existant... sauf flux de
      // déverrouillage dédié").
      const na = requireNiveauActive(ma.niveauActiveId);
      garantirEcriture(na.configurationId);
      const now = nowIso();
      const updated = MatiereActive.create(
        { ...ma.toProps(), coefficient: input.nouveauCoefficient, dateModification: now, modifiePar: auteurId },
        matiereActiveId,
      );
      stores.matieresActives[stores.matieresActives.indexOf(ma)] = updated;
      enregistrerAudit(auditStore, {
        operation: "DEVERROUILLAGE_COEFFICIENT",
        cibleType: "matiere_active",
        cibleId: matiereActiveId,
        utilisateurId: auteurId,
        valeursAvant: { coefficient: ma.coefficient },
        valeursApres: { coefficient: input.nouveauCoefficient },
        motif: input.motif,
      });
      return updated;
    },
  };
}
