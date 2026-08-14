import type { AuditStructure } from "~/modules/structure-pedagogique/domain/entities/audit-structure.entity";
import type { AuditStructureRepository } from "~/modules/structure-pedagogique/domain/repositories/structure.repository";

export function createMockAuditStructureRepository(store: AuditStructure[]): AuditStructureRepository {
  return {
    async list(filters) {
      return store.filter((entry) => {
        if (filters?.cibleType && entry.cibleType !== filters.cibleType) return false;
        if (filters?.cibleId && entry.cibleId !== filters.cibleId) return false;
        if (filters?.operation && entry.operation !== filters.operation) return false;
        if (filters?.du && entry.horodatage < filters.du) return false;
        if (filters?.au && entry.horodatage > filters.au) return false;
        return true;
      });
    },
  };
}
