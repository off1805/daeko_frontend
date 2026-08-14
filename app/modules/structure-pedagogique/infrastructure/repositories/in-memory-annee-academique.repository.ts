import { AnneeAcademique } from "~/modules/structure-pedagogique/domain/entities/annee-academique.entity";
import { ConfigurationBrancheAnnee } from "~/modules/structure-pedagogique/domain/entities/configuration-branche-annee.entity";
import type { AuditStructure } from "~/modules/structure-pedagogique/domain/entities/audit-structure.entity";
import type {
  AnneeAcademiqueRepository,
  CreateAnneeAcademiqueInput,
} from "~/modules/structure-pedagogique/domain/repositories/structure.repository";
import {
  CycleAnneeInvalideError,
  RessourceIntrouvableError,
  TransitionInterditeError,
} from "~/modules/structure-pedagogique/domain/errors/structure.errors";
import { enregistrerAudit, nowIso } from "~/modules/structure-pedagogique/infrastructure/support";

function seChevauchent(
  a: { dateDebut: string; dateFin: string },
  b: { dateDebut: string; dateFin: string },
): boolean {
  return a.dateDebut < b.dateFin && a.dateFin > b.dateDebut;
}

export function createInMemoryAnneeAcademiqueRepository(
  store: AnneeAcademique[],
  configurations: ConfigurationBrancheAnnee[],
  auditStore: AuditStructure[],
): AnneeAcademiqueRepository {
  return {
    async list() {
      return [...store];
    },

    async getById(id) {
      return store.find((a) => a.id === id) ?? null;
    },

    async create(input: CreateAnneeAcademiqueInput, auteurId: string) {
      if (!(input.dateFin > input.dateDebut)) {
        throw new CycleAnneeInvalideError("La date de fin doit être postérieure à la date de début.");
      }
      if (store.some((a) => a.libelle === input.libelle)) {
        throw new CycleAnneeInvalideError(`Le libellé "${input.libelle}" est déjà utilisé.`, {
          libelle: input.libelle,
        });
      }
      const chevauchement = store.find((a) => seChevauchent(a, input));
      if (chevauchement) {
        throw new CycleAnneeInvalideError(
          `Les dates chevauchent l'année "${chevauchement.libelle}".`,
          { anneeExistante: chevauchement.libelle },
        );
      }

      const now = nowIso();
      const id = crypto.randomUUID();
      const annee = AnneeAcademique.create(
        {
          libelle: input.libelle,
          dateDebut: input.dateDebut,
          dateFin: input.dateFin,
          etat: "EN_PREPARATION",
          dateDemarrage: null,
          dateCloture: null,
          dateCreation: now,
          dateModification: now,
          creePar: auteurId,
          modifiePar: auteurId,
        },
        id,
      );
      store.push(annee);
      enregistrerAudit(auditStore, {
        operation: "CREATION",
        cibleType: "annee_academique",
        cibleId: id,
        utilisateurId: auteurId,
        valeursApres: { libelle: input.libelle },
      });
      return annee;
    },

    async demarrer(id, auteurId) {
      const annee = store.find((a) => a.id === id);
      if (!annee) throw new RessourceIntrouvableError(id);
      if (annee.etat !== "EN_PREPARATION") {
        throw new TransitionInterditeError("année académique", annee.etat, "EN_COURS");
      }
      if (store.some((a) => a.etat === "EN_COURS")) {
        throw new CycleAnneeInvalideError("Une autre année est déjà EN_COURS.");
      }
      const now = nowIso();
      const updated = AnneeAcademique.create(
        { ...annee.toProps(), etat: "EN_COURS", dateDemarrage: now, dateModification: now, modifiePar: auteurId },
        id,
      );
      store[store.indexOf(annee)] = updated;
      enregistrerAudit(auditStore, {
        operation: "DEMARRAGE_ANNEE",
        cibleType: "annee_academique",
        cibleId: id,
        utilisateurId: auteurId,
        valeursApres: { etat: "EN_COURS" },
      });
      return updated;
    },

    async cloturer(id, confirmation, auteurId) {
      const annee = store.find((a) => a.id === id);
      if (!annee) throw new RessourceIntrouvableError(id);
      // Cas limite "année abandonnée" (EN_PREPARATION -> CLOTUREE, doc 4.4)
      // hors périmètre de cette itération : seule la transition normale
      // EN_COURS -> CLOTUREE est couverte ici.
      if (annee.etat !== "EN_COURS") {
        throw new TransitionInterditeError("année académique", annee.etat, "CLOTUREE");
      }
      if (confirmation.trim() !== annee.libelle) {
        throw new CycleAnneeInvalideError(
          "La confirmation ne correspond pas au libellé de l'année.",
          { attendu: annee.libelle },
        );
      }

      const now = nowIso();
      const configurationsScellees: string[] = [];
      for (const config of configurations) {
        if (config.anneeAcademiqueId !== id || config.etat === "SCELLEE") continue;
        const index = configurations.indexOf(config);
        configurations[index] = ConfigurationBrancheAnnee.create(
          {
            ...config.toProps(),
            etat: "SCELLEE",
            dateScellement: now,
            dateModification: now,
            modifiePar: auteurId,
          },
          config.id,
        );
        configurationsScellees.push(config.id);
      }

      const updated = AnneeAcademique.create(
        { ...annee.toProps(), etat: "CLOTUREE", dateCloture: now, dateModification: now, modifiePar: auteurId },
        id,
      );
      store[store.indexOf(annee)] = updated;
      enregistrerAudit(auditStore, {
        operation: "CLOTURE_ANNEE",
        cibleType: "annee_academique",
        cibleId: id,
        utilisateurId: auteurId,
        valeursApres: { etat: "CLOTUREE", configurationsScellees },
      });
      return updated;
    },
  };
}
