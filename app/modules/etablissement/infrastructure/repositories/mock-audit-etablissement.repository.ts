import { AuditEtablissementEntry } from '~/modules/etablissement/domain/entities/audit-etablissement.entity';

export class MockAuditEtablissementRepository {
  private audits: Map<string, AuditEtablissementEntry[]> = new Map();

  public async record(etablissementId: string, entry: AuditEtablissementEntry): Promise<void> {
    const list = this.audits.get(etablissementId) || [];
    list.push(entry);
    this.audits.set(etablissementId, list);
  }

  public async getByEtablissementId(etablissementId: string): Promise<AuditEtablissementEntry[]> {
    return this.audits.get(etablissementId) || [];
  }
}