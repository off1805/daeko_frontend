import { BaseDomainEntity } from '~/modules/etablissement/domain/shared/etablissement-entity';
import type { EntityMetadataProps } from '~/modules/etablissement/domain/shared/etablissement-entity';
import type { EtatCompte } from '~/modules/etablissement/domain/shared/etat-compte';
import { estTransitionValide } from '~/modules/etablissement/domain/shared/etat-compte';
import type { StatutJuridique } from '~/modules/etablissement/domain/shared/statut-juridique';
import { estStatutPrive } from '~/modules/etablissement/domain/shared/statut-juridique';
import { LocalisationVO } from '~/modules/etablissement/domain/value-objects/localisation.vo';
import { ContactEtablissementVO } from '~/modules/etablissement/domain/value-objects/contact-etablissement.vo';
import { EnTeteOfficiel } from '~/modules/etablissement/domain/entities/en-tete.entity';
import { Signataire } from '~/modules/etablissement/domain/entities/signataire.entity';
import { 
  IncompletPourActivationError, 
  MotifObligatoireError, 
  EtablissementValidationError 
} from '~/modules/etablissement/domain/errors/etablissement.errors';

export interface EtablissementProps {
  nomOfficiel: string;
  sigle?: string;
  codeOfficiel?: string;
  agrement?: string;
  statutJuridique: StatutJuridique;
  etat: EtatCompte;
  motifChangementEtat?: string;
  dateDebutEssai?: Date;
  dateFinEssai?: Date;
  logoUrl?: string;
  devisePropre?: string;
  localisation: LocalisationVO;
  contacts: ContactEtablissementVO;
}

export class Etablissement extends BaseDomainEntity<EtablissementProps> {

  private constructor(props: EtablissementProps, metadata: EntityMetadataProps) {
    super(props, metadata);
    this.validerInvariants();
  }

  public static create(
    props: Omit<EtablissementProps, 'etat'>,
    metadata: Omit<EntityMetadataProps, 'createdAt' | 'updatedAt'>
  ): Etablissement {
    const fullProps: EtablissementProps = {
      ...props,
      etat: 'EN_CREATION'
    };

    const fullMetadata: EntityMetadataProps = {
      ...metadata,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return new Etablissement(fullProps, fullMetadata);
  }

  public static reconstitute(props: EtablissementProps, metadata: EntityMetadataProps): Etablissement {
    return new Etablissement(props, metadata);
  }

  private validerInvariants(): void {
    if (!this.props.nomOfficiel || this.props.nomOfficiel.trim() === '') {
      throw new EtablissementValidationError('Le nom officiel de l\'établissement est obligatoire.');
    }

    if (estStatutPrive(this.props.statutJuridique) && this.props.etat === 'ACTIF' && !this.props.agrement) {
      throw new EtablissementValidationError('Le numéro d\'agrément est obligatoire pour les établissements privés actifs.');
    }
  }

  // Getters
  get nomOfficiel(): string { return this.props.nomOfficiel; }
  get sigle(): string | undefined { return this.props.sigle; }
  get codeOfficiel(): string | undefined { return this.props.codeOfficiel; }
  get agrement(): string | undefined { return this.props.agrement; }
  get statutJuridique(): StatutJuridique { return this.props.statutJuridique; }
  get etat(): EtatCompte { return this.props.etat; }
  get motifChangementEtat(): string | undefined { return this.props.motifChangementEtat; }
  get dateDebutEssai(): Date | undefined { return this.props.dateDebutEssai; }
  get dateFinEssai(): Date | undefined { return this.props.dateFinEssai; }
  get logoUrl(): string | undefined { return this.props.logoUrl; }
  get devisePropre(): string | undefined { return this.props.devisePropre; }
  get localisation(): LocalisationVO { return this.props.localisation; }
  get contacts(): ContactEtablissementVO { return this.props.contacts; }

  // Actions métier
  public changerEtat(nouvelEtat: EtatCompte, motif: string | undefined, auteurId: string): void {
    if (!estTransitionValide(this.props.etat, nouvelEtat)) {
      throw new EtablissementValidationError(`Transition d'état invalide : de ${this.props.etat} vers ${nouvelEtat}.`);
    }

    if ((nouvelEtat === 'SUSPENDU' || nouvelEtat === 'ARCHIVE') && (!motif || motif.trim() === '')) {
      throw new MotifObligatoireError(nouvelEtat);
    }

    this.props.etat = nouvelEtat;
    this.props.motifChangementEtat = motif;
    this.touch(auteurId);
  }

  public modifierFiche(
    props: Partial<Pick<EtablissementProps, 'nomOfficiel' | 'sigle' | 'codeOfficiel' | 'agrement' | 'statutJuridique' | 'devisePropre'>>,
    localisation?: LocalisationVO,
    contacts?: ContactEtablissementVO,
    auteurId?: string
  ): void {
    if (props.nomOfficiel !== undefined) this.props.nomOfficiel = props.nomOfficiel;
    if (props.sigle !== undefined) this.props.sigle = props.sigle;
    if (props.codeOfficiel !== undefined) this.props.codeOfficiel = props.codeOfficiel;
    if (props.agrement !== undefined) this.props.agrement = props.agrement;
    if (props.statutJuridique !== undefined) this.props.statutJuridique = props.statutJuridique;
    if (props.devisePropre !== undefined) this.props.devisePropre = props.devisePropre;
    
    if (localisation) this.props.localisation = localisation;
    if (contacts) this.props.contacts = contacts;

    this.validerInvariants();
    this.touch(auteurId);
  }

  public mettreAJourLogo(logoUrl: string, auteurId: string): void {
    this.props.logoUrl = logoUrl;
    this.touch(auteurId);
  }

  /**
   * Calcule le taux de complétude et la liste des éléments manquants (RM-08, F-07, P3).
   */
  public evaluerCompletude(enTete: EnTeteOfficiel, signatairePrincipal?: Signataire): {
    pourcentage: number;
    elementsManquants: string[];
    estComplet: boolean;
  } {
    const elementsManquants: string[] = [];

    if (!this.props.logoUrl) elementsManquants.push('Logo de l\'établissement');
    if (!this.props.contacts.email) elementsManquants.push('Adresse e-mail de contact');
    if (!signatairePrincipal || !signatairePrincipal.estPrincipal || !signatairePrincipal.estActif) {
      elementsManquants.push('Signataire principal actif');
    }
    if (!enTete.estValide()) elementsManquants.push('En-tête officiel conforme');

    const totalCriteres = 4;
    const complets = totalCriteres - elementsManquants.length;
    const pourcentage = Math.round((complets / totalCriteres) * 100);

    return {
      pourcentage,
      elementsManquants,
      estComplet: elementsManquants.length === 0
    };
  }

  public verifierPretsPourActivation(enTete: EnTeteOfficiel, signatairePrincipal?: Signataire): void {
    const evaluation = this.evaluerCompletude(enTete, signatairePrincipal);
    if (!evaluation.estComplet) {
      throw new IncompletPourActivationError(evaluation.elementsManquants);
    }
  }
}