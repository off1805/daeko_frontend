import { Eleve } from "../../domain/entities/eleve.entity";
import { Tuteur } from "../../domain/entities/tuteur.entity";
import type {
  EleveReadDto,
  EleveResumeReadDto,
  TuteurReadDto,
} from "../dto/eleve-read.dto";

/**
 * Traducteur entité <-> DTO pour l'agrégat Eleve. Point UNIQUE de
 * transformation : aucun cas d'usage ne doit reconstruire un DTO à la
 * main, tous appellent ce mapper — évite que deux écrans affichent
 * l'élève avec une forme légèrement différente.
 */
export class EleveMapper {
  static versTuteurDto(tuteur: Tuteur): TuteurReadDto {
    return {
      id: tuteur.id,
      nom: tuteur.nom,
      lienParente: tuteur.lienParente,
      telephone: tuteur.telephone,
      profession: tuteur.profession,
      adresse: tuteur.adresse,
      estContactPrincipal: tuteur.estContactPrincipal,
    };
  }

  static versReadDto(eleve: Eleve): EleveReadDto {
    const contactPrincipal = eleve.contactPrincipal;
    return {
      id: eleve.id,
      etablissementId: eleve.etablissementId,
      matricule: eleve.matricule,
      nom: eleve.identite.nom,
      prenoms: eleve.identite.prenoms,
      nomComplet: eleve.identite.nomComplet,
      sexe: eleve.identite.sexe,
      dateNaissance: eleve.identite.dateNaissance,
      lieuNaissance: eleve.identite.lieuNaissance,
      photoUrl: eleve.photoUrl,
      etat: eleve.etat,
      tuteurs: eleve.tuteurs.map(EleveMapper.versTuteurDto),
      contactPrincipal: contactPrincipal
        ? EleveMapper.versTuteurDto(contactPrincipal)
        : undefined,
    };
  }

  static versResumeDto(eleve: Eleve): EleveResumeReadDto {
    return {
      id: eleve.id,
      matricule: eleve.matricule,
      nomComplet: eleve.identite.nomComplet,
      sexe: eleve.identite.sexe,
      etat: eleve.etat,
    };
  }
}