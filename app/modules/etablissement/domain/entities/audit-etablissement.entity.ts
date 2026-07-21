import { BaseDomainEntity } from '~/modules/etablissement/domain/shared/etablissement-entity';
import type { EntityMetadataProps } from '~/modules/etablissement/domain/shared/etablissement-entity';

export interface AuditChangementDetail {
  champ: string;
  valeurAncienne?: string;
  valeurNouvelle?: string;
}

export interface AuditEtablissementProps {
  action: string;             // ex: "MODIFICATION_FICHE", "CHANGEMENT_ETAT", "Nouveau logo téléversé"
  auteurNom: string;          // Nom complet de l'utilisateur qui a fait l'action
  modifications: AuditChangementDetail[];
  date: Date;
}

export class AuditEtablissementEntry extends BaseDomainEntity<AuditEtablissementProps> {

  private constructor(props: AuditEtablissementProps, metadata: EntityMetadataProps) {
    super(props, metadata);
  }

  public static create(
    props: AuditEtablissementProps,
    metadata: EntityMetadataProps
  ): AuditEtablissementEntry {
    return new AuditEtablissementEntry(props, metadata);
  }

  // Getters
  get action(): string { return this.props.action; }
  get auteurNom(): string { return this.props.auteurNom; }
  get modifications(): AuditChangementDetail[] { return [...this.props.modifications]; }
  get date(): Date { return this.props.date; }
}