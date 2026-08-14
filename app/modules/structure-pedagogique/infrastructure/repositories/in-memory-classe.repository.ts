import { Classe } from "~/modules/structure-pedagogique/domain/entities/classe.entity";
import type { NiveauActive, SerieActive } from "~/modules/structure-pedagogique/domain/entities/activation.entity";
import type { ConfigurationBrancheAnnee } from "~/modules/structure-pedagogique/domain/entities/configuration-branche-annee.entity";
import type { AuditStructure } from "~/modules/structure-pedagogique/domain/entities/audit-structure.entity";
import type {
  ClasseFilters,
  ClasseRepository,
  CreerClasseInput,
  ModifierClasseInput,
} from "~/modules/structure-pedagogique/domain/repositories/structure.repository";
import {
  ClasseDupliqueeError,
  ClasseIncoherenteError,
  ConfigurationScelleeError,
  MotifObligatoireError,
  RessourceIntrouvableError,
} from "~/modules/structure-pedagogique/domain/errors/structure.errors";
import { enregistrerAudit, nowIso } from "~/modules/structure-pedagogique/infrastructure/support";
// Exception documentée (ARCHITECTURE.md) : résolution des libellés niveau/série pour générer libelleComplet.
import { referentielContainer } from "~/modules/referentiel/infrastructure/referentiel.container";

export interface ClasseStores {
  classes: Classe[];
  niveauxActifs: NiveauActive[];
  seriesActives: SerieActive[];
  configurations: ConfigurationBrancheAnnee[];
}

export function createInMemoryClasseRepository(
  stores: ClasseStores,
  auditStore: AuditStructure[],
): ClasseRepository {
  function requireClasse(id: string): Classe {
    const classe = stores.classes.find((c) => c.id === id);
    if (!classe) throw new RessourceIntrouvableError(id);
    return classe;
  }

  /** Doc 4.6 : toute écriture sur les classes est refusée une fois la configuration SCELLEE. */
  function garantirEcriture(configurationId: string): void {
    const config = stores.configurations.find((c) => c.id === configurationId);
    if (!config) throw new RessourceIntrouvableError(configurationId);
    if (config.etat === "SCELLEE") throw new ConfigurationScelleeError();
  }

  async function genererLibelleComplet(
    na: NiveauActive,
    sa: SerieActive | undefined,
    suffixe: string,
  ): Promise<string> {
    const niveau = await referentielContainer.niveaux.repository.getById(na.niveauId);
    const niveauLibelle = niveau?.libelleCourt ?? niveau?.libelle.fr ?? "Niveau";
    if (!sa) return `${niveauLibelle} ${suffixe}`.trim();
    const serie = await referentielContainer.series.repository.getById(sa.serieId);
    const serieCode = serie?.libelleCourt ?? serie?.code ?? "";
    return `${niveauLibelle} ${serieCode} ${suffixe}`.replace(/\s+/g, " ").trim();
  }

  return {
    async list(configurationId, filters) {
      return stores.classes.filter((c) => {
        if (c.configurationId !== configurationId) return false;
        if (filters?.niveauActiveId && c.niveauActiveId !== filters.niveauActiveId) return false;
        if (filters?.serieActiveId && c.serieActiveId !== filters.serieActiveId) return false;
        if (filters?.actif !== undefined && c.actif !== filters.actif) return false;
        return true;
      });
    },

    async creer(configurationId, input: CreerClasseInput, auteurId: string) {
      garantirEcriture(configurationId);
      const na = stores.niveauxActifs.find(
        (n) => n.id === input.niveauActiveId && n.configurationId === configurationId,
      );
      if (!na) throw new RessourceIntrouvableError(input.niveauActiveId);

      let sa: SerieActive | undefined;
      if (input.serieActiveId) {
        sa = stores.seriesActives.find((s) => s.id === input.serieActiveId && s.niveauActiveId === na.id);
        if (!sa) {
          throw new ClasseIncoherenteError("La série n'est pas activée pour ce niveau.");
        }
      } else {
        const seriesDuNiveau = stores.seriesActives.some((s) => s.niveauActiveId === na.id);
        if (seriesDuNiveau) {
          throw new ClasseIncoherenteError(
            "Des séries sont activées sur ce niveau : une série est requise pour créer une classe.",
          );
        }
      }

      const suffixes = input.suffixes && input.suffixes.length > 0 ? input.suffixes : input.suffixe ? [input.suffixe] : [];
      if (suffixes.length === 0) {
        throw new ClasseIncoherenteError("Au moins un suffixe est requis.");
      }

      const now = nowIso();
      const creees: Classe[] = [];
      for (const suffixe of suffixes) {
        const doublon = stores.classes.some(
          (c) =>
            c.configurationId === configurationId &&
            c.niveauActiveId === na.id &&
            c.serieActiveId === input.serieActiveId &&
            c.suffixe === suffixe,
        );
        if (doublon) throw new ClasseDupliqueeError(suffixe);

        const libelleComplet = await genererLibelleComplet(na, sa, suffixe);
        const classe = Classe.create(
          {
            configurationId,
            niveauActiveId: na.id,
            serieActiveId: sa?.id,
            suffixe,
            libelleComplet,
            effectifPrevu: input.effectifPrevu,
            salle: input.salle,
            enseignantPrincipalId: undefined,
            actif: true,
            dateCreation: now,
            dateModification: now,
            creePar: auteurId,
            modifiePar: auteurId,
          },
          crypto.randomUUID(),
        );
        stores.classes.push(classe);
        creees.push(classe);
      }

      enregistrerAudit(auditStore, {
        operation: "CREATION",
        cibleType: "classe",
        cibleId: configurationId,
        utilisateurId: auteurId,
        valeursApres: { suffixes, count: creees.length },
      });
      return creees;
    },

    async modifier(id, input: ModifierClasseInput, auteurId: string) {
      const classe = requireClasse(id);
      garantirEcriture(classe.configurationId);
      if (input.suffixe && input.suffixe !== classe.suffixe) {
        const doublon = stores.classes.some(
          (c) =>
            c.id !== id &&
            c.configurationId === classe.configurationId &&
            c.niveauActiveId === classe.niveauActiveId &&
            c.serieActiveId === classe.serieActiveId &&
            c.suffixe === input.suffixe,
        );
        if (doublon) throw new ClasseDupliqueeError(input.suffixe);
      }
      const now = nowIso();
      const updated = Classe.create(
        {
          ...classe.toProps(),
          suffixe: input.suffixe ?? classe.suffixe,
          effectifPrevu: input.effectifPrevu ?? classe.effectifPrevu,
          salle: input.salle ?? classe.salle,
          enseignantPrincipalId: input.enseignantPrincipalId ?? classe.enseignantPrincipalId,
          dateModification: now,
          modifiePar: auteurId,
        },
        id,
      );
      stores.classes[stores.classes.indexOf(classe)] = updated;
      enregistrerAudit(auditStore, {
        operation: "MODIFICATION",
        cibleType: "classe",
        cibleId: id,
        utilisateurId: auteurId,
        valeursApres: input as unknown as Record<string, unknown>,
      });
      return updated;
    },

    async desactiver(id, motif, auteurId) {
      if (!motif.trim()) throw new MotifObligatoireError();
      const classe = requireClasse(id);
      garantirEcriture(classe.configurationId);
      // Vérification croisée Personnes stubbée (doc 9.7 : "zéro inscription"
      // tant que ce module n'existe pas).
      const now = nowIso();
      const updated = Classe.create(
        { ...classe.toProps(), actif: false, dateModification: now, modifiePar: auteurId },
        id,
      );
      stores.classes[stores.classes.indexOf(classe)] = updated;
      enregistrerAudit(auditStore, {
        operation: "DESACTIVATION_CLASSE",
        cibleType: "classe",
        cibleId: id,
        utilisateurId: auteurId,
        motif,
      });
      return updated;
    },

    async reactiver(id, auteurId) {
      const classe = requireClasse(id);
      garantirEcriture(classe.configurationId);
      const now = nowIso();
      const updated = Classe.create(
        { ...classe.toProps(), actif: true, dateModification: now, modifiePar: auteurId },
        id,
      );
      stores.classes[stores.classes.indexOf(classe)] = updated;
      enregistrerAudit(auditStore, {
        operation: "REACTIVATION",
        cibleType: "classe",
        cibleId: id,
        utilisateurId: auteurId,
      });
      return updated;
    },
  };
}
