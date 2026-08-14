import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  EtablissementFilters,
  PaginationParams,
} from '~/modules/etablissement/domain/repositories/etablissement.repository';
import type { CreateEtablissementCommand } from '~/modules/etablissement/application/use-cases/create-etablissement.use-case';
import type { UpdateFicheCommand } from '~/modules/etablissement/application/use-cases/update-fiche-etablissement.use-case';
import type { ConfigureEnTeteCommand } from '~/modules/etablissement/application/use-cases/configure-en-tete.use-case';
import type { AjouterSignataireCommand } from '~/modules/etablissement/application/use-cases/manage-signataires.use-case';
import type { ChangerEtatCommand } from '~/modules/etablissement/application/use-cases/changer-etat-compte.use-case';
import { etablissementContainer } from '~/modules/etablissement/infrastructure/etablissement.container';

const QUERY_KEY = 'etablissements';

export function usePortefeuilleEtablissements(
  filters?: EtablissementFilters,
  pagination: PaginationParams = { page: 1, limit: 50 },
) {
  return useQuery({
    queryKey: [QUERY_KEY, 'list', filters, pagination],
    queryFn: () => etablissementContainer.repository.findAll(filters, pagination),
  });
}

export function useEtablissementDetails(id: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, 'detail', id],
    queryFn: () => etablissementContainer.queries.getDetailsById(id as string),
    enabled: Boolean(id),
  });
}

export function useAuditEntries(etablissementId: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, 'audit', etablissementId],
    queryFn: () => etablissementContainer.listAudit.execute(etablissementId as string),
    enabled: Boolean(etablissementId),
  });
}

export function useCreateEtablissement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (command: CreateEtablissementCommand) =>
      etablissementContainer.createEtablissement.execute(command),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useUpdateFicheEtablissement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (command: UpdateFicheCommand) =>
      etablissementContainer.updateFiche.execute(command),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useConfigureEnTete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (command: ConfigureEnTeteCommand) =>
      etablissementContainer.configureEnTete.execute(command),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useAjouterSignataire() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (command: AjouterSignataireCommand) =>
      etablissementContainer.manageSignataires.ajouterSignataire(command),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useChangerEtatCompte() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (command: ChangerEtatCommand) =>
      etablissementContainer.changerEtatCompte.execute(command),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export const etablissementQueries = {
  usePortefeuille: usePortefeuilleEtablissements,
  useDetails: useEtablissementDetails,
  useAudit: useAuditEntries,
  useCreate: useCreateEtablissement,
  useUpdateFiche: useUpdateFicheEtablissement,
  useConfigureEnTete,
  useAjouterSignataire,
  useChangerEtat: useChangerEtatCompte,
};