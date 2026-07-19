import type { AuditEntry } from "~/modules/referentiel/domain/entities/audit-entry.entity";
import type { AuditRepository } from "~/modules/referentiel/domain/repositories/referentiel.repository";

export function createMockAuditRepository(store: AuditEntry[]): AuditRepository {
  return {
    async list(filters) {
      const filtered = store.filter((entry) => {
        if (filters.typeEntite && entry.typeEntite !== filters.typeEntite) {
          return false;
        }
        if (filters.entiteId && entry.entiteId !== filters.entiteId) {
          return false;
        }
        if (
          filters.utilisateurId &&
          entry.utilisateurId !== filters.utilisateurId
        ) {
          return false;
        }
        if (filters.du && entry.horodatage < filters.du) {
          return false;
        }
        if (filters.au && entry.horodatage > filters.au) {
          return false;
        }
        return true;
      });

      const page = filters.page ?? 1;
      const taille = Math.min(filters.taille ?? 50, 200);
      const debut = (page - 1) * taille;
      return {
        donnees: filtered.slice(debut, debut + taille),
        page,
        taille,
        total: filtered.length,
      };
    },
  };
}
