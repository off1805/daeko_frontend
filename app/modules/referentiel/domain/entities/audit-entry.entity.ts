import { Entity } from "~/shared/domain/entity";

// Doc section 3.7 — table d'audit. Piste infalsifiable : pas de cycle de
// vie ACTIVE/DEPRECATED (n'étend donc pas ReferentielEntity), et surtout
// jamais de UPDATE/DELETE une fois écrite.

export type OperationAudit = "CREATION" | "MODIFICATION" | "DEPRECIATION";

interface AuditEntryProps {
  typeEntite: string;
  entiteId: string;
  operation: OperationAudit;
  utilisateurId: string;
  horodatage: string;
  valeursAvant: Record<string, unknown> | null;
  valeursApres: Record<string, unknown> | null;
  motif: string | null;
}

export class AuditEntry extends Entity<AuditEntryProps> {
  static create(props: AuditEntryProps, id: string): AuditEntry {
    return new AuditEntry(props, id);
  }

  get typeEntite(): string {
    return this.props.typeEntite;
  }
  get entiteId(): string {
    return this.props.entiteId;
  }
  get operation(): OperationAudit {
    return this.props.operation;
  }
  get utilisateurId(): string {
    return this.props.utilisateurId;
  }
  get horodatage(): string {
    return this.props.horodatage;
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
}
