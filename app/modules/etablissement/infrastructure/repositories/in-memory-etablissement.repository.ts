import { Etablissement } from '~/modules/etablissement/domain/entities/etablissement.entity';
import { EnTeteOfficiel } from '~/modules/etablissement/domain/entities/en-tete.entity';
import { Signataire } from '~/modules/etablissement/domain/entities/signataire.entity';
import { AuditEtablissementEntry } from '~/modules/etablissement/domain/entities/audit-etablissement.entity';
import type { EtablissementRepository, EtablissementFilters, PaginationParams, PaginatedResult } from '~/modules/etablissement/domain/repositories/etablissement.repository';
import { ETABLISSEMENT_SEED_DATA } from '~/modules/etablissement/infrastructure/mock-data/etablissement.seed-data';
import { LocalisationVO } from '~/modules/etablissement/domain/value-objects/localisation.vo';
import { ContactEtablissementVO } from '~/modules/etablissement/domain/value-objects/contact-etablissement.vo';

export class InMemoryEtablissementRepository implements EtablissementRepository {
  private etablissements: Map<string, Etablissement> = new Map();
  private enTetes: Map<string, EnTeteOfficiel> = new Map();
  private signataires: Map<string, Signataire[]> = new Map();
  private audits: Map<string, AuditEtablissementEntry[]> = new Map();

  constructor() {
    this.seed();
  }

  private seed(): void {
    for (const seed of ETABLISSEMENT_SEED_DATA) {
      const etb = Etablissement.reconstitute(
        {
          ...seed.props,
          localisation: LocalisationVO.create(seed.props.localisation),
          contacts: ContactEtablissementVO.create(seed.props.contacts),
        },
        { id: seed.id, tenantId: seed.tenantId, createdAt: new Date(), updatedAt: new Date() }
      );
      this.etablissements.set(seed.id, etb);

      const enTete = EnTeteOfficiel.create(seed.enTete, {
        id: `en-tete-${seed.id}`,
        tenantId: seed.tenantId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      this.enTetes.set(seed.id, enTete);

      const sigs = seed.signataires.map((s) => Signataire.create(s, {
        id: s.id,
        tenantId: seed.tenantId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      this.signataires.set(seed.id, sigs);
      this.audits.set(seed.id, []);
    }
  }

  public async findById(id: string): Promise<Etablissement | null> {
    return this.etablissements.get(id) || null;
  }

  public async findByTenantId(tenantId: string): Promise<Etablissement | null> {
    for (const etb of this.etablissements.values()) {
      if (etb.tenantId === tenantId) return etb;
    }
    return null;
  }

  public async findAll(filters?: EtablissementFilters, pagination?: PaginationParams): Promise<PaginatedResult<Etablissement>> {
    let result = Array.from(this.etablissements.values());

    if (filters) {
      if (filters.recherche) {
        const q = filters.recherche.toLowerCase();
        result = result.filter(e => 
          e.nomOfficiel.toLowerCase().includes(q) || 
          (e.sigle && e.sigle.toLowerCase().includes(q)) ||
          (e.codeOfficiel && e.codeOfficiel.toLowerCase().includes(q))
        );
      }
      if (filters.etat) {
        result = result.filter(e => e.etat === filters.etat);
      }
      if (filters.statutJuridique) {
        result = result.filter(e => e.statutJuridique === filters.statutJuridique);
      }
      if (filters.regionCode) {
        result = result.filter(e => e.localisation.regionCode === filters.regionCode);
      }
    }

    const total = result.length;
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const start = (page - 1) * limit;
    const data = result.slice(start, start + limit);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  public async existsByNomAndLocalisation(nomOfficiel: string, ville: string, arrondissementCode: string, excludeId?: string): Promise<boolean> {
    for (const etb of this.etablissements.values()) {
      if (excludeId && etb.id === excludeId) continue;
      if (
        etb.nomOfficiel.trim().toLowerCase() === nomOfficiel.trim().toLowerCase() &&
        etb.localisation.ville.trim().toLowerCase() === ville.trim().toLowerCase() &&
        etb.localisation.arrondissementCode.trim().toLowerCase() === arrondissementCode.trim().toLowerCase()
      ) {
        return true;
      }
    }
    return false;
  }

  public async save(etablissement: Etablissement): Promise<void> {
    this.etablissements.set(etablissement.id, etablissement);
  }

  public async findEnTeteByEtablissementId(etablissementId: string): Promise<EnTeteOfficiel | null> {
    return this.enTetes.get(etablissementId) || null;
  }

  public async saveEnTete(etablissementId: string, enTete: EnTeteOfficiel): Promise<void> {
    this.enTetes.set(etablissementId, enTete);
  }

  public async findSignatairesByEtablissementId(etablissementId: string): Promise<Signataire[]> {
    return this.signataires.get(etablissementId) || [];
  }

  public async findSignatairePrincipal(etablissementId: string): Promise<Signataire | null> {
    const sigs = this.signataires.get(etablissementId) || [];
    return sigs.find((s) => s.estPrincipal && s.estActif) || null;
  }

  public async saveSignataire(etablissementId: string, signataire: Signataire): Promise<void> {
    const list = this.signataires.get(etablissementId) || [];
    const index = list.findIndex((s) => s.id === signataire.id);
    if (index >= 0) {
      list[index] = signataire;
    } else {
      list.push(signataire);
    }
    this.signataires.set(etablissementId, list);
  }

  public async saveAuditEntry(etablissementId: string, entry: AuditEtablissementEntry): Promise<void> {
    const list = this.audits.get(etablissementId) || [];
    list.push(entry);
    this.audits.set(etablissementId, list);
  }

  public async findAuditEntriesByEtablissementId(etablissementId: string): Promise<AuditEtablissementEntry[]> {
    return this.audits.get(etablissementId) || [];
  }
}