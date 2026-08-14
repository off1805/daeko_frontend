import { Branche } from "~/modules/structure-pedagogique/domain/entities/branche.entity";
import type { AuditStructure } from "~/modules/structure-pedagogique/domain/entities/audit-structure.entity";
import type {
  BrancheRepository,
  CreateBrancheInput,
} from "~/modules/structure-pedagogique/domain/repositories/structure.repository";
import {
  BrancheDupliqueeError,
  ReferentielDeprecieError,
  RessourceIntrouvableError,
  TransitionInterditeError,
} from "~/modules/structure-pedagogique/domain/errors/structure.errors";
import type { EtatBranche } from "~/modules/structure-pedagogique/domain/shared/etats";
import { enregistrerAudit, nowIso } from "~/modules/structure-pedagogique/infrastructure/support";
// Exception documentée (ARCHITECTURE.md) : lecture cross-module directe du
// container référentiel pour valider le triplet à la création d'une branche.
import { referentielContainer } from "~/modules/referentiel/infrastructure/referentiel.container";

export function createInMemoryBrancheRepository(
  store: Branche[],
  auditStore: AuditStructure[],
): BrancheRepository {
  function requireBranche(id: string): Branche {
    const branche = store.find((b) => b.id === id);
    if (!branche) throw new RessourceIntrouvableError(id);
    return branche;
  }

  function replace(previous: Branche, next: Branche): void {
    store[store.indexOf(previous)] = next;
  }

  async function transitionner(
    id: string,
    autorisees: EtatBranche[],
    vers: EtatBranche,
    auteurId: string,
    operation: "ACTIVATION_ELEMENT" | "SUSPENSION" | "REACTIVATION" | "ARCHIVAGE",
    motif?: string,
  ): Promise<Branche> {
    const branche = requireBranche(id);
    if (!autorisees.includes(branche.etat)) {
      throw new TransitionInterditeError("branche", branche.etat, vers);
    }
    const now = nowIso();
    const updated = Branche.create(
      {
        ...branche.toProps(),
        etat: vers,
        motifArchivage: motif ?? branche.motifArchivage,
        dateModification: now,
        modifiePar: auteurId,
      },
      id,
    );
    replace(branche, updated);
    enregistrerAudit(auditStore, {
      operation,
      cibleType: "branche",
      cibleId: id,
      utilisateurId: auteurId,
      valeursAvant: { etat: branche.etat },
      valeursApres: { etat: vers },
      motif,
    });
    return updated;
  }

  return {
    async list() {
      return [...store];
    },

    async getById(id) {
      return store.find((b) => b.id === id) ?? null;
    },

    async create(input: CreateBrancheInput, auteurId: string) {
      const [sousSysteme, ordre, type] = await Promise.all([
        referentielContainer.sousSystemes.repository.getById(input.sousSystemeId),
        referentielContainer.ordresEnseignement.repository.getById(input.ordreEnseignementId),
        referentielContainer.typesEnseignement.repository.getById(input.typeEnseignementId),
      ]);
      if (sousSysteme?.etat === "DEPRECATED") throw new ReferentielDeprecieError("sous-système");
      if (ordre?.etat === "DEPRECATED") throw new ReferentielDeprecieError("ordre d'enseignement");
      if (type?.etat === "DEPRECATED") throw new ReferentielDeprecieError("type d'enseignement");

      const doublon = store.some(
        (b) =>
          b.sousSystemeId === input.sousSystemeId &&
          b.ordreEnseignementId === input.ordreEnseignementId &&
          b.typeEnseignementId === input.typeEnseignementId,
      );
      if (doublon) throw new BrancheDupliqueeError();

      const libelle =
        input.libelle?.trim() ||
        [sousSysteme?.libelle, ordre?.libelle, type?.libelle].filter(Boolean).join(" — ");

      const now = nowIso();
      const id = crypto.randomUUID();
      const branche = Branche.create(
        {
          sousSystemeId: input.sousSystemeId,
          ordreEnseignementId: input.ordreEnseignementId,
          typeEnseignementId: input.typeEnseignementId,
          libelle,
          etat: "EN_CONFIGURATION",
          dateCreation: now,
          dateModification: now,
          creePar: auteurId,
          modifiePar: auteurId,
        },
        id,
      );
      store.push(branche);
      enregistrerAudit(auditStore, {
        operation: "CREATION",
        cibleType: "branche",
        cibleId: id,
        utilisateurId: auteurId,
        valeursApres: { libelle, sousSystemeId: input.sousSystemeId },
      });
      return branche;
    },

    async modifierLibelle(id, libelle, auteurId) {
      const branche = requireBranche(id);
      const now = nowIso();
      const updated = Branche.create(
        { ...branche.toProps(), libelle, dateModification: now, modifiePar: auteurId },
        id,
      );
      replace(branche, updated);
      enregistrerAudit(auditStore, {
        operation: "MODIFICATION",
        cibleType: "branche",
        cibleId: id,
        utilisateurId: auteurId,
        valeursAvant: { libelle: branche.libelle },
        valeursApres: { libelle },
      });
      return updated;
    },

    async activer(id, auteurId) {
      return transitionner(
        id,
        ["EN_CONFIGURATION", "SUSPENDUE"],
        "ACTIVE",
        auteurId,
        "ACTIVATION_ELEMENT",
      );
    },

    async suspendre(id, auteurId) {
      return transitionner(id, ["ACTIVE"], "SUSPENDUE", auteurId, "SUSPENSION");
    },

    async reactiver(id, auteurId) {
      return transitionner(id, ["SUSPENDUE"], "ACTIVE", auteurId, "REACTIVATION");
    },

    async archiver(id, motif, auteurId) {
      return transitionner(
        id,
        ["ACTIVE", "SUSPENDUE"],
        "ARCHIVEE",
        auteurId,
        "ARCHIVAGE",
        motif,
      );
    },
  };
}
