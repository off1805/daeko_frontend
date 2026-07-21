import { InMemoryEtablissementRepository } from '~/modules/etablissement/infrastructure/repositories/in-memory-etablissement.repository';
import { CreateEtablissementUseCase } from '~/modules/etablissement/application/use-cases/create-etablissement.use-case';
import { UpdateFicheEtablissementUseCase } from '~/modules/etablissement/application/use-cases/update-fiche-etablissement.use-case';
import { ConfigureEnTeteUseCase } from '~/modules/etablissement/application/use-cases/configure-en-tete.use-case';
import { ManageSignatairesUseCase } from '~/modules/etablissement/application/use-cases/manage-signataires.use-case';
import { ChangerEtatCompteUseCase } from '~/modules/etablissement/application/use-cases/changer-etat-compte.use-case';
import { ListAuditEtablissementUseCase } from '~/modules/etablissement/application/use-cases/list-audit-etablissement.use-case';
import { EtablissementQueries } from '~/modules/etablissement/infrastructure/queries/etablissement.queries';

class EtablissementContainer {
  private static instance: EtablissementContainer;

  public readonly repository = new InMemoryEtablissementRepository();
  public readonly queries = new EtablissementQueries(this.repository);

  public readonly createEtablissement = new CreateEtablissementUseCase(this.repository);
  public readonly updateFiche = new UpdateFicheEtablissementUseCase(this.repository);
  public readonly configureEnTete = new ConfigureEnTeteUseCase(this.repository);
  public readonly manageSignataires = new ManageSignatairesUseCase(this.repository);
  public readonly changerEtatCompte = new ChangerEtatCompteUseCase(this.repository);
  public readonly listAudit = new ListAuditEtablissementUseCase(this.repository);

  public static getInstance(): EtablissementContainer {
    if (!EtablissementContainer.instance) {
      EtablissementContainer.instance = new EtablissementContainer();
    }
    return EtablissementContainer.instance;
  }
}

export const etablissementContainer = EtablissementContainer.getInstance();