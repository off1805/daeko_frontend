import type { Etablissement } from '~/modules/etablissement/domain/entities/etablissement.entity';
import type { EnTeteOfficiel } from '~/modules/etablissement/domain/entities/en-tete.entity';
import type { Signataire } from '~/modules/etablissement/domain/entities/signataire.entity';
import type { AuditEtablissementEntry } from '~/modules/etablissement/domain/entities/audit-etablissement.entity';
import type { EtatCompte } from '~/modules/etablissement/domain/shared/etat-compte';
import type { StatutJuridique } from '~/modules/etablissement/domain/shared/statut-juridique';

/**
 * Critères de recherche et de filtrage pour le portefeuille d'établissements (CU-01, F-01, F-02)[cite: 1].
 */
export interface EtablissementFilters {
  recherche?: string;               // Recherche textuelle sur le nom, le sigle ou le code officiel
  etat?: EtatCompte;                // Filtrage par état (EN_CREATION, ACTIF, etc.)
  statutJuridique?: StatutJuridique; // Public, Privé Laïc, etc.
  regionCode?: string;              // Code de la région
  departementCode?: string;         // Code du département
  arrondissementCode?: string;      // Code de l'arrondissement
}

/**
 * Options de pagination pour les requêtes de liste.
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * Structure de résultat paginé.
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Interface de contrat du dépôt principal pour le module Établissement (RM-01)[cite: 1].
 */
export interface EtablissementRepository {
  /**
   * Recherche un établissement par son identifiant unique.
   */
  findById(id: string): Promise<Etablissement | null>;

  /**
   * Récupère un établissement via son tenantId (isolation strict multi-tenant RM-01)[cite: 1].
   */
  findByTenantId(tenantId: string): Promise<Etablissement | null>;

  /**
   * Liste paginée des établissements selon des filtres (Vue portefeuille Super-Admin)[cite: 1].
   */
  findAll(
    filters?: EtablissementFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<Etablissement>>;

  /**
   * Vérifie l'existence d'un doublon par nom, ville et arrondissement (RM-03)[cite: 1].
   */
  existsByNomAndLocalisation(
    nomOfficiel: string,
    ville: string,
    arrondissementCode: string,
    excludeId?: string
  ): Promise<boolean>;

  /**
   * Sauvegarde ou met à jour une entité établissement.
   */
  save(etablissement: Etablissement): Promise<void>;

  // --- En-tête officiel ---
  findEnTeteByEtablissementId(etablissementId: string): Promise<EnTeteOfficiel | null>;
  saveEnTete(etablissementId: string, enTete: EnTeteOfficiel): Promise<void>;

  // --- Signataires ---
  findSignatairesByEtablissementId(etablissementId: string): Promise<Signataire[]>;
  findSignatairePrincipal(etablissementId: string): Promise<Signataire | null>;
  saveSignataire(etablissementId: string, signataire: Signataire): Promise<void>;

  // --- Audit ---
  saveAuditEntry(etablissementId: string, entry: AuditEtablissementEntry): Promise<void>;
  findAuditEntriesByEtablissementId(etablissementId: string): Promise<AuditEtablissementEntry[]>;
}