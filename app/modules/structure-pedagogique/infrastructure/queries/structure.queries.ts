import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { structureContainer } from "~/modules/structure-pedagogique/infrastructure/structure.container";
import type {
  ClasseFilters,
  CreateAnneeAcademiqueInput,
  CreateBrancheInput,
  CreateMatiereLocaleInput,
  CreerClasseInput,
  CreerConfigurationInput,
  MatiereActiveInput,
  ModifierClasseInput,
} from "~/modules/structure-pedagogique/domain/repositories/structure.repository";
import type { AuditStructureFilters } from "~/modules/structure-pedagogique/domain/repositories/structure.repository";

/**
 * Un seul préfixe de clé ("structure") pour toutes les queries du module :
 * toute mutation invalide l'ensemble par préfixe plutôt que de maintenir
 * une carte fine query -> mutation. Le jeu de données mock reste petit,
 * le coût d'un refetch large est négligeable ; à affiner si le module
 * grossit significativement.
 */
const PREFIX = "structure";

function useInvalidateStructure() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: [PREFIX] });
}

// ---------------------------------------------------------------------------
// Tableau de bord
// ---------------------------------------------------------------------------

export function useTableauDeBord() {
  return useQuery({
    queryKey: [PREFIX, "tableau-de-bord"],
    queryFn: () => structureContainer.tableauDeBord.obtenirUseCase.execute(),
  });
}

// ---------------------------------------------------------------------------
// Branches
// ---------------------------------------------------------------------------

export function useBranches() {
  return useQuery({
    queryKey: [PREFIX, "branches"],
    queryFn: () => structureContainer.branches.listerUseCase.execute(),
  });
}

const AUTEUR_ID = "00000000-0000-4000-8000-000000000001";

export function useCreerBranche() {
  const invalidate = useInvalidateStructure();
  return useMutation({
    mutationFn: (data: CreateBrancheInput) =>
      structureContainer.branches.creerUseCase.execute({ data, auteurId: AUTEUR_ID }),
    onSuccess: invalidate,
  });
}

export function useActiverBranche() {
  const invalidate = useInvalidateStructure();
  return useMutation({
    mutationFn: (id: string) => structureContainer.branches.activerUseCase.execute({ id, auteurId: AUTEUR_ID }),
    onSuccess: invalidate,
  });
}

export function useSuspendreBranche() {
  const invalidate = useInvalidateStructure();
  return useMutation({
    mutationFn: (id: string) => structureContainer.branches.suspendreUseCase.execute({ id, auteurId: AUTEUR_ID }),
    onSuccess: invalidate,
  });
}

export function useReactiverBranche() {
  const invalidate = useInvalidateStructure();
  return useMutation({
    mutationFn: (id: string) => structureContainer.branches.reactiverUseCase.execute({ id, auteurId: AUTEUR_ID }),
    onSuccess: invalidate,
  });
}

export function useArchiverBranche() {
  const invalidate = useInvalidateStructure();
  return useMutation({
    mutationFn: ({ id, motif }: { id: string; motif: string }) =>
      structureContainer.branches.archiverUseCase.execute({ id, motif, auteurId: AUTEUR_ID }),
    onSuccess: invalidate,
  });
}

// ---------------------------------------------------------------------------
// Matières locales
// ---------------------------------------------------------------------------

export function useMatieresLocales(brancheId: string | undefined) {
  return useQuery({
    queryKey: [PREFIX, "matieres-locales", brancheId],
    queryFn: () =>
      structureContainer.matieresLocales.listerUseCase.execute({ brancheId: brancheId as string, etat: "TOUS" }),
    enabled: Boolean(brancheId),
  });
}

export function useCreerMatiereLocale() {
  const invalidate = useInvalidateStructure();
  return useMutation({
    mutationFn: (data: CreateMatiereLocaleInput) =>
      structureContainer.matieresLocales.creerUseCase.execute({ data, auteurId: AUTEUR_ID }),
    onSuccess: invalidate,
  });
}

export function useDeprecierMatiereLocale() {
  const invalidate = useInvalidateStructure();
  return useMutation({
    mutationFn: ({ id, motif }: { id: string; motif: string }) =>
      structureContainer.matieresLocales.deprecierUseCase.execute({ id, motif, auteurId: AUTEUR_ID }),
    onSuccess: invalidate,
  });
}

// ---------------------------------------------------------------------------
// Années académiques
// ---------------------------------------------------------------------------

export function useAnnees() {
  return useQuery({
    queryKey: [PREFIX, "annees"],
    queryFn: () => structureContainer.annees.listerUseCase.execute(),
  });
}

export function useCreerAnnee() {
  const invalidate = useInvalidateStructure();
  return useMutation({
    mutationFn: (data: CreateAnneeAcademiqueInput) =>
      structureContainer.annees.creerUseCase.execute({ data, auteurId: AUTEUR_ID }),
    onSuccess: invalidate,
  });
}

export function useCloturerAnnee() {
  const invalidate = useInvalidateStructure();
  return useMutation({
    mutationFn: ({ id, confirmation }: { id: string; confirmation: string }) =>
      structureContainer.annees.cloturerUseCase.execute({ id, confirmation, auteurId: AUTEUR_ID }),
    onSuccess: invalidate,
  });
}

export function useDemarrerAnnee() {
  const invalidate = useInvalidateStructure();
  return useMutation({
    mutationFn: (id: string) => structureContainer.annees.demarrerUseCase.execute({ id, auteurId: AUTEUR_ID }),
    onSuccess: invalidate,
  });
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

export function useConfigurationDetail(configurationId: string | undefined) {
  return useQuery({
    queryKey: [PREFIX, "configuration-detail", configurationId],
    queryFn: () => structureContainer.configurations.obtenirDetailUseCase.execute(configurationId as string),
    enabled: Boolean(configurationId),
  });
}

export function useConfigurationParBrancheEtAnnee(
  brancheId: string | undefined,
  anneeAcademiqueId: string | undefined,
) {
  return useQuery({
    queryKey: [PREFIX, "configuration-par-branche-annee", brancheId, anneeAcademiqueId],
    queryFn: () =>
      structureContainer.configurations.obtenirParBrancheEtAnneeUseCase.execute({
        brancheId: brancheId as string,
        anneeAcademiqueId: anneeAcademiqueId as string,
      }),
    enabled: Boolean(brancheId && anneeAcademiqueId),
  });
}

export function useCreerConfiguration() {
  const invalidate = useInvalidateStructure();
  return useMutation({
    mutationFn: (data: CreerConfigurationInput) =>
      structureContainer.configurations.creerUseCase.execute({ data, auteurId: AUTEUR_ID }),
    onSuccess: invalidate,
  });
}

export function useMettreAJourFilieresActives() {
  const invalidate = useInvalidateStructure();
  return useMutation({
    mutationFn: ({ configurationId, filiereIds }: { configurationId: string; filiereIds: string[] }) =>
      structureContainer.configurations.mettreAJourFilieresUseCase.execute({
        configurationId,
        filiereIds,
        auteurId: AUTEUR_ID,
      }),
    onSuccess: invalidate,
  });
}

export function useMettreAJourNiveauxActifs() {
  const invalidate = useInvalidateStructure();
  return useMutation({
    mutationFn: ({ configurationId, niveauIds }: { configurationId: string; niveauIds: string[] }) =>
      structureContainer.configurations.mettreAJourNiveauxUseCase.execute({
        configurationId,
        niveauIds,
        auteurId: AUTEUR_ID,
      }),
    onSuccess: invalidate,
  });
}

export function useMettreAJourSeriesActives() {
  const invalidate = useInvalidateStructure();
  return useMutation({
    mutationFn: ({ niveauActiveId, serieIds }: { niveauActiveId: string; serieIds: string[] }) =>
      structureContainer.configurations.mettreAJourSeriesUseCase.execute({
        niveauActiveId,
        serieIds,
        auteurId: AUTEUR_ID,
      }),
    onSuccess: invalidate,
  });
}

export function useMettreAJourMatieresActives() {
  const invalidate = useInvalidateStructure();
  return useMutation({
    mutationFn: ({ niveauActiveId, matieres }: { niveauActiveId: string; matieres: MatiereActiveInput[] }) =>
      structureContainer.configurations.mettreAJourMatieresUseCase.execute({
        niveauActiveId,
        matieres,
        auteurId: AUTEUR_ID,
      }),
    onSuccess: invalidate,
  });
}

export function useCorrigerCoefficient() {
  const invalidate = useInvalidateStructure();
  return useMutation({
    mutationFn: ({
      matiereActiveId,
      nouveauCoefficient,
      motif,
    }: {
      matiereActiveId: string;
      nouveauCoefficient: number;
      motif: string;
    }) =>
      structureContainer.configurations.corrigerCoefficientUseCase.execute({
        matiereActiveId,
        nouveauCoefficient,
        motif,
        auteurId: AUTEUR_ID,
      }),
    onSuccess: invalidate,
  });
}

// ---------------------------------------------------------------------------
// Classes
// ---------------------------------------------------------------------------

export function useClasses(configurationId: string | undefined, filters?: ClasseFilters) {
  return useQuery({
    queryKey: [PREFIX, "classes", configurationId, filters],
    queryFn: () =>
      structureContainer.classes.listerUseCase.execute({ configurationId: configurationId as string, filters }),
    enabled: Boolean(configurationId),
  });
}

export function useCreerClasse() {
  const invalidate = useInvalidateStructure();
  return useMutation({
    mutationFn: ({ configurationId, data }: { configurationId: string; data: CreerClasseInput }) =>
      structureContainer.classes.creerUseCase.execute({ configurationId, data, auteurId: AUTEUR_ID }),
    onSuccess: invalidate,
  });
}

export function useModifierClasse() {
  const invalidate = useInvalidateStructure();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ModifierClasseInput }) =>
      structureContainer.classes.modifierUseCase.execute({ id, data, auteurId: AUTEUR_ID }),
    onSuccess: invalidate,
  });
}

export function useDesactiverClasse() {
  const invalidate = useInvalidateStructure();
  return useMutation({
    mutationFn: ({ id, motif }: { id: string; motif: string }) =>
      structureContainer.classes.desactiverUseCase.execute({ id, motif, auteurId: AUTEUR_ID }),
    onSuccess: invalidate,
  });
}

export function useReactiverClasse() {
  const invalidate = useInvalidateStructure();
  return useMutation({
    mutationFn: (id: string) => structureContainer.classes.reactiverUseCase.execute({ id, auteurId: AUTEUR_ID }),
    onSuccess: invalidate,
  });
}

// ---------------------------------------------------------------------------
// Audit (Historique)
// ---------------------------------------------------------------------------

export function useAuditStructure(filters?: AuditStructureFilters) {
  return useQuery({
    queryKey: [PREFIX, "audit", filters],
    queryFn: () => structureContainer.audit.listerUseCase.execute(filters),
  });
}
