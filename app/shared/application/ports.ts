/** Génère un identifiant unique. Le domaine ne sait jamais lui-même générer un id. */
export interface IdGeneratorPort {
  generer(): string;
}

/** Donne l'heure actuelle. Permet aux tests de "figer le temps" facilement. */
export interface ClockPort {
  maintenant(): string; // ISO 8601
}