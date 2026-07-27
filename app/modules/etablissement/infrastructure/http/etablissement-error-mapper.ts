import { BaseEtablissementError } from '~/modules/etablissement/domain/errors/etablissement.errors';

export class EtablissementErrorMapper {
  public static map(error: unknown): string {
    if (error instanceof BaseEtablissementError) {
      return error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return 'Une erreur inattendue est survenue au sein du module établissement.';
  }
}