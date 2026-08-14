import { MatiereLocale } from "~/modules/structure-pedagogique/domain/entities/matiere-locale.entity";
import type { AuditStructure } from "~/modules/structure-pedagogique/domain/entities/audit-structure.entity";
import type {
  CreateMatiereLocaleInput,
  MatiereLocaleRepository,
} from "~/modules/structure-pedagogique/domain/repositories/structure.repository";
import { RessourceIntrouvableError } from "~/modules/structure-pedagogique/domain/errors/structure.errors";
import { enregistrerAudit, nowIso } from "~/modules/structure-pedagogique/infrastructure/support";

export function createInMemoryMatiereLocaleRepository(
  store: MatiereLocale[],
  auditStore: AuditStructure[],
): MatiereLocaleRepository {
  return {
    async listByBranche(brancheId, options) {
      const etatFiltre = options?.etat ?? "ACTIVE";
      return store.filter(
        (m) => m.brancheId === brancheId && (etatFiltre === "TOUS" || m.etat === etatFiltre),
      );
    },

    async getById(id) {
      return store.find((m) => m.id === id) ?? null;
    },

    async create(input: CreateMatiereLocaleInput, auteurId: string) {
      const now = nowIso();
      const id = crypto.randomUUID();
      const matiere = MatiereLocale.create(
        {
          brancheId: input.brancheId,
          code: input.code,
          libelle: input.libelle,
          libelleCourt: input.libelleCourt,
          libelleEn: input.libelleEn,
          domaine: input.domaine,
          typeMatiere: input.typeMatiere,
          baremeParDefaut: input.baremeParDefaut ?? 20,
          etat: "ACTIVE",
          motifDepreciation: null,
          dateCreation: now,
          dateModification: now,
          creePar: auteurId,
          modifiePar: auteurId,
        },
        id,
      );
      store.push(matiere);
      enregistrerAudit(auditStore, {
        operation: "CREATION",
        cibleType: "matiere_locale",
        cibleId: id,
        utilisateurId: auteurId,
        valeursApres: { code: input.code, libelle: input.libelle },
      });
      return matiere;
    },

    async deprecier(id, motif, auteurId) {
      const matiere = store.find((m) => m.id === id);
      if (!matiere) throw new RessourceIntrouvableError(id);
      if (matiere.etat === "DEPRECATED") return matiere;
      const now = nowIso();
      const updated = MatiereLocale.create(
        {
          ...matiere.toProps(),
          etat: "DEPRECATED",
          motifDepreciation: motif,
          dateModification: now,
          modifiePar: auteurId,
        },
        id,
      );
      store[store.indexOf(matiere)] = updated;
      enregistrerAudit(auditStore, {
        operation: "DEPRECIATION_MATIERE_LOCALE",
        cibleType: "matiere_locale",
        cibleId: id,
        utilisateurId: auteurId,
        motif,
      });
      return updated;
    },
  };
}
