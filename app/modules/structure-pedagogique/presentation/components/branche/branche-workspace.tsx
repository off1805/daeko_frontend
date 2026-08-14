"use client"

import * as React from "react"
import {
  ArrowLeftIcon,
  SlidersHorizontalIcon,
  TableIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react"

import { Button } from "~/components/ui/button"
import { Skeleton } from "~/components/ui/skeleton"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"
import { ConfigurationSection } from "~/modules/structure-pedagogique/presentation/components/branche/configuration-section"
import { MatriceCoefficientsSection } from "~/modules/structure-pedagogique/presentation/components/branche/matrice-coefficients-section"
import { ClassesSection } from "~/modules/structure-pedagogique/presentation/components/branche/classes-section"
import { BrancheActionsMenu } from "~/modules/structure-pedagogique/presentation/components/branche/branche-actions-menu"
import {
  useBranches,
  useConfigurationParBrancheEtAnnee,
  useCreerConfiguration,
  useTableauDeBord,
} from "~/modules/structure-pedagogique/infrastructure/queries/structure.queries"
import { getErrorMessage } from "~/shared/presentation/forms/form-field"
import type {
  AnneeAcademiqueDto,
  BrancheDto,
  ConfigurationDetailDto,
} from "~/modules/structure-pedagogique/application/dto/structure-read.dto"

interface BrancheWorkspaceProps {
  brancheId: string
  onBack: () => void
  /** Remonte le nom de la branche une fois chargée — affiché dans la navbar plutôt que dans cette sidebar. */
  onTitleChange?: (title: string) => void
}

type BrancheSectionKey = "configuration" | "matrice" | "classes"

interface BrancheSectionNavItem {
  key: BrancheSectionKey
  label: string
  icon: LucideIcon
}

const BRANCHE_SECTIONS: BrancheSectionNavItem[] = [
  { key: "configuration", label: "Configuration", icon: SlidersHorizontalIcon },
  { key: "matrice", label: "Matrice des coefficients", icon: TableIcon },
  { key: "classes", label: "Classes", icon: UsersIcon },
]

function CreerConfigurationPanel({
  brancheId,
  anneeCourante,
}: {
  brancheId: string
  anneeCourante: AnneeAcademiqueDto
}) {
  const creer = useCreerConfiguration()

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/60 bg-muted/10 p-8 text-center">
      <p className="text-sm text-foreground">
        Aucune configuration pour l'année {anneeCourante.libelle}.
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          disabled={creer.isPending}
          onClick={() =>
            creer.mutate({
              brancheId,
              anneeAcademiqueId: anneeCourante.id,
              dupliquerDepuisPrecedente: true,
              copierClasses: true,
            })
          }
        >
          Dupliquer depuis l'année précédente
        </Button>
        <Button
          disabled={creer.isPending}
          onClick={() =>
            creer.mutate({
              brancheId,
              anneeAcademiqueId: anneeCourante.id,
              dupliquerDepuisPrecedente: false,
              copierClasses: false,
            })
          }
        >
          Configurer à partir de zéro
        </Button>
      </div>
      {creer.error ? <p className="text-xs text-destructive">{getErrorMessage(creer.error)}</p> : null}
    </div>
  )
}

function BrancheSectionContent({
  section,
  branche,
  detail,
  anneeCourante,
}: {
  section: BrancheSectionKey
  branche: BrancheDto
  detail: ConfigurationDetailDto
  anneeCourante: AnneeAcademiqueDto | null
}) {
  if (section === "configuration")
    return <ConfigurationSection branche={branche} detail={detail} anneeCourante={anneeCourante} />
  if (section === "matrice") return <MatriceCoefficientsSection detail={detail} />
  return <ClassesSection detail={detail} />
}

/**
 * Vue dédiée à une branche (vision UX) : remplace entièrement le rail de
 * modules pendant la consultation par une nouvelle sidebar contextuelle
 * (retour + Configuration / Matrice des coefficients / Classes), un seul
 * onglet affiché à la fois — plus un long fil d'informations empilées et
 * ancrées comme avant. Densité du dossier d'origine assumée ici seulement,
 * jamais remontée au niveau du tableau de bord.
 */
export function BrancheWorkspace({ brancheId, onBack, onTitleChange }: BrancheWorkspaceProps) {
  const [section, setSection] = React.useState<BrancheSectionKey>("configuration")
  const { data: tableauDeBord } = useTableauDeBord()
  const anneeCourante = tableauDeBord?.anneeCourante ?? null
  const { data: branches, isLoading: branchesLoading } = useBranches()
  const branche = branches?.find((b) => b.id === brancheId)
  const { data: detail, isLoading: detailLoading } = useConfigurationParBrancheEtAnnee(
    brancheId,
    anneeCourante?.id,
  )

  React.useEffect(() => {
    if (branche) onTitleChange?.(branche.libelle)
  }, [branche, onTitleChange])

  const loading = branchesLoading || Boolean(anneeCourante && detailLoading)

  return (
    <>
      <Sidebar collapsible="none" className="hidden w-56 shrink-0 border-r md:flex" data-print-hide>
        <SidebarHeader className="flex-row items-center justify-between gap-2 border-b p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="w-fit gap-1.5 px-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeftIcon className="size-3.5" />
            Retour à Ma structure
          </Button>
          {branche ? <BrancheActionsMenu branche={branche} onArchivee={onBack} /> : null}
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {BRANCHE_SECTIONS.map((item) => (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton isActive={section === item.key} onClick={() => setSection(item.key)}>
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>

      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto ">
          {loading ? (
            <div className="flex flex-col gap-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : !branche ? null : !anneeCourante ? (
            <p className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-6 text-center text-sm text-muted-foreground">
              Aucune année académique n'a encore été créée.
            </p>
          ) : !detail ? (
            <CreerConfigurationPanel brancheId={brancheId} anneeCourante={anneeCourante} />
          ) : (
            <BrancheSectionContent
              section={section}
              branche={branche}
              detail={detail}
              anneeCourante={anneeCourante}
            />
          )}
        </div>
      </SidebarInset>
    </>
  )
}
