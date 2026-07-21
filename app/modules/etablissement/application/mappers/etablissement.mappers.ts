import { Etablissement } from '~/modules/etablissement/domain/entities/etablissement.entity';
import { EnTeteOfficiel } from '~/modules/etablissement/domain/entities/en-tete.entity';
import { Signataire } from '~/modules/etablissement/domain/entities/signataire.entity';
import { AuditEtablissementEntry } from '~/modules/etablissement/domain/entities/audit-etablissement.entity';
import { STATUT_JURIDIQUE_LABELS } from '~/modules/etablissement/domain/shared/statut-juridique';
import type { 
  EtablissementReadDto, 
  EnTeteDto, 
  SignataireDto, 
  AuditEtablissementDto, 
  LocalisationDto, 
  ContactEtablissementDto 
} from '~/modules/etablissement/application/dto/etablissement-read.dto';

export class EtablissementMapper {
  
  /**
   * Convertit un Value Object Localisation en son DTO correspondand.
   */
  public static toLocalisationDto(localisation: Etablissement['localisation']): LocalisationDto {
    return {
      regionCode: localisation.regionCode,
      departementCode: localisation.departementCode,
      arrondissementCode: localisation.arrondissementCode,
      ville: localisation.ville,
    };
  }

  /**
   * Convertit un Value Object Contact en son DTO correspondand.
   */
  public static toContactDto(contacts: Etablissement['contacts']): ContactEtablissementDto {
    return {
      email: contacts.email,
      telephone: contacts.telephone,
      adressePostale: contacts.adressePostale,
      siteWeb: contacts.siteWeb,
    };
  }

  /**
   * Convertit l'entité EnTeteOfficiel en EnTeteDto.
   */
  public static toEnTeteDto(enTete: EnTeteOfficiel): EnTeteDto {
    return {
      id: enTete.id,
      mode: enTete.mode,
      deviseSpecifique: enTete.deviseSpecifique,
      lignes: enTete.lignes.map((l) => ({
        ordre: l.ordre,
        texteFr: l.texteFr,
        texteEn: l.texteEn,
      })),
    };
  }

  /**
   * Convertit l'entité Signataire en SignataireDto.
   */
  public static toSignataireDto(signataire: Signataire): SignataireDto {
    return {
      id: signataire.id,
      nom: signataire.nom,
      prenom: signataire.prenom,
      nomComplet: signataire.nomComplet,
      fonction: signataire.fonction,
      estPrincipal: signataire.estPrincipal,
      signatureImageUrl: signataire.signatureImageUrl,
      estActif: signataire.estActif,
      dateFinFonction: signataire.dateFinFonction ? signataire.dateFinFonction.toISOString() : undefined,
    };
  }

  /**
   * Convertit une entrée d'audit en AuditEtablissementDto.
   */
  public static toAuditDto(entry: AuditEtablissementEntry): AuditEtablissementDto {
    return {
      id: entry.id,
      action: entry.action,
      auteurNom: entry.auteurNom,
      date: entry.date.toISOString(),
      modifications: entry.modifications.map((m) => ({
        champ: m.champ,
        valeurAncienne: m.valeurAncienne,
        valeurNouvelle: m.valeurNouvelle,
      })),
    };
  }

  /**
   * Convertit l'agrégat complet Etablissement (avec ses dépendances) en DTO consolidé pour le Dashboard[cite: 1].
   */
  public static toReadDto(
    etablissement: Etablissement,
    enTete?: EnTeteOfficiel,
    signataires: Signataire[] = []
  ): EtablissementReadDto {
    const signatairePrincipal = signataires.find((s) => s.estPrincipal && s.estActif);
    
    // Évaluation de la complétude si l'en-tête est fourni
    const completudeEvaluation = enTete 
      ? etablissement.evaluerCompletude(enTete, signatairePrincipal)
      : { pourcentage: 0, elementsManquants: ['En-tête officiel non configuré'], estComplet: false };

    return {
      id: etablissement.id,
      tenantId: etablissement.tenantId,
      nomOfficiel: etablissement.nomOfficiel,
      sigle: etablissement.sigle,
      codeOfficiel: etablissement.codeOfficiel,
      agrement: etablissement.agrement,
      statutJuridique: etablissement.statutJuridique,
      statutJuridiqueLibelle: STATUT_JURIDIQUE_LABELS[etablissement.statutJuridique] || etablissement.statutJuridique,
      etat: etablissement.etat,
      motifChangementEtat: etablissement.motifChangementEtat,
      logoUrl: etablissement.logoUrl,
      devisePropre: etablissement.devisePropre,
      localisation: this.toLocalisationDto(etablissement.localisation),
      contacts: this.toContactDto(etablissement.contacts),
      enTete: enTete ? this.toEnTeteDto(enTete) : undefined,
      signataires: signataires.map((s) => this.toSignataireDto(s)),
      completude: completudeEvaluation,
      createdAt: etablissement.createdAt.toISOString(),
      updatedAt: etablissement.updatedAt.toISOString(),
    };
  }
}