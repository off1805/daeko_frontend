import { Entity } from "~/shared/domain/entity";
import type { OperationAuditSp } from "~/modules/structure-pedagogique/domain/shared/etats";

// Doc section 3.9 — journal d'audit du module : infalsifiable, jamais
// modifié ni supprimé une fois écrit (pas de cycle de vie propre, sur le
// modèle d'AuditEntry côté référentiel).

interface AuditStructureProps {
  operation: OperationAuditSp;
  cibleType: string;
  cibleId: string;
  utilisateurId: string;
  valeursAvant: Record<string, unknown> | null;
  valeursApres: Record<string, unknown> | null;
  motif: string | null;
  horodatage: string;
}

export class AuditStructure extends Entity<AuditStructureProps> {
  static create(props: AuditStructureProps, id: string): AuditStructure {
    return new AuditStructure(props, id);
  }

  get operation(): OperationAuditSp {
    return this.props.operation;
  }
  get cibleType(): string {
    return this.props.cibleType;
  }
  get cibleId(): string {
    return this.props.cibleId;
  }
  get utilisateurId(): string {
    return this.props.utilisateurId;
  }
  get valeursAvant(): Record<string, unknown> | null {
    return this.props.valeursAvant;
  }
  get valeursApres(): Record<string, unknown> | null {
    return this.props.valeursApres;
  }
  get motif(): string | null {
    return this.props.motif;
  }
  get horodatage(): string {
    return this.props.horodatage;
  }
}
