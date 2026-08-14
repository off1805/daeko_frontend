import { AuditStructure } from "~/modules/structure-pedagogique/domain/entities/audit-structure.entity";
import type { OperationAuditSp } from "~/modules/structure-pedagogique/domain/shared/etats";

export function nowIso(): string {
  return new Date().toISOString();
}

interface AuditEntryInput {
  operation: OperationAuditSp;
  cibleType: string;
  cibleId: string;
  utilisateurId: string;
  valeursAvant?: Record<string, unknown> | null;
  valeursApres?: Record<string, unknown> | null;
  motif?: string | null;
}

/** Journal d'audit partagé par tous les repositories en mémoire du module (doc 3.9 : infalsifiable, jamais modifié). */
export function enregistrerAudit(store: AuditStructure[], entry: AuditEntryInput): void {
  store.push(
    AuditStructure.create(
      {
        operation: entry.operation,
        cibleType: entry.cibleType,
        cibleId: entry.cibleId,
        utilisateurId: entry.utilisateurId,
        valeursAvant: entry.valeursAvant ?? null,
        valeursApres: entry.valeursApres ?? null,
        motif: entry.motif ?? null,
        horodatage: nowIso(),
      },
      crypto.randomUUID(),
    ),
  );
}
