/**
 * Surface publique du module Structure Pédagogique. Les routes ne doivent
 * importer que depuis ce barrel — jamais directement depuis domain/
 * application/infrastructure (voir ARCHITECTURE.md à la racine).
 */

export {
  structurePedagogiqueNavItems,
  type StructurePedagogiqueNavItem,
  type StructurePedagogiqueScreenKey,
} from "~/modules/structure-pedagogique/presentation/nav";

export { MaStructureScreen } from "~/modules/structure-pedagogique/presentation/components/dashboard/ma-structure-screen";
export { HistoriqueScreen } from "~/modules/structure-pedagogique/presentation/components/historique/historique-screen";
export { BrancheWorkspace } from "~/modules/structure-pedagogique/presentation/components/branche/branche-workspace";

export type {
  BrancheDto,
  MatiereLocaleDto,
  AnneeAcademiqueDto,
  ConfigurationBrancheAnneeDto,
  ConfigurationDetailDto,
  ClasseDto,
  AuditStructureDto,
  TableauDeBordDto,
  ModeTableauDeBord,
} from "~/modules/structure-pedagogique/application/dto/structure-read.dto";
