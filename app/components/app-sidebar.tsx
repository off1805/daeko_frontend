"use client"

import * as React from "react"
import { GraduationCapIcon, LibraryBigIcon } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "~/components/ui/sidebar"
import {
  referentielNavItemsFlat,
  referentielNavSections,
  type ReferentielSectionKey,
} from "~/modules/referentiel/presentation/nav"

export type AppModuleKey = "referentiel" | "structure-pedagogique"

const MODULE_META: Record<AppModuleKey, { label: string; icon: typeof LibraryBigIcon }> = {
  referentiel: { label: "Référentiel", icon: LibraryBigIcon },
  "structure-pedagogique": { label: "Structure pédagogique", icon: GraduationCapIcon },
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeModule: AppModuleKey
  onSelectModule: (module: AppModuleKey) => void
  /** Modules affichés dans le rail. Un layout scopé (ex : admin école) n'en expose qu'un sous-ensemble. */
  availableModules?: AppModuleKey[]
  /**
   * Colonne de navigation seconde, propre au référentiel (arborescence
   * profonde : système -> parcours -> orientation -> programmes). La
   * structure pédagogique n'en a pas : "Ma structure" est la seule vraie
   * page, et le détail d'une branche a sa propre sidebar contextuelle
   * (voir BrancheWorkspace) plutôt qu'une colonne permanente ici.
   */
  referentiel?: {
    activeKey: ReferentielSectionKey
    onSelectItem: (key: ReferentielSectionKey) => void
  }
}

export function AppSidebar({
  activeModule,
  onSelectModule,
  availableModules = ["referentiel", "structure-pedagogique"],
  referentiel,
  ...props
}: AppSidebarProps) {
  const activeReferentielItem = referentiel
    ? referentielNavItemsFlat.find((item) => item.key === referentiel.activeKey)
    : undefined

  return (
    <>
      {/* Rail de navigation : réductible icônes-seules <-> icône+libellé. */}
      <Sidebar collapsible="icon" className="border-r" data-print-hide {...props}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {availableModules.map((moduleKey) => {
                  const meta = MODULE_META[moduleKey]
                  return (
                    <SidebarMenuItem key={moduleKey}>
                      <SidebarMenuButton
                        tooltip={meta.label}
                        onClick={() => onSelectModule(moduleKey)}
                        isActive={activeModule === moduleKey}
                        className="px-2.5 md:px-2"
                      >
                        <meta.icon />
                        <span>{meta.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarTrigger className="w-full" />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Colonne de navigation seconde : uniquement pour le référentiel,
          dont l'arborescence est assez profonde pour la justifier. */}
      {activeModule === "referentiel" && referentiel ? (
        <Sidebar collapsible="none" className="hidden w-75 shrink-0 border-r border-sidebar-border md:flex" data-print-hide>
          <SidebarHeader className="gap-1 border-b border-sidebar-accent p-4">
            <div className="text-base font-medium text-white">Référentiel</div>
            <p className="text-xs text-sidebar-foreground">
              {activeReferentielItem?.description ?? "Structure des systèmes éducatifs"}
            </p>
          </SidebarHeader>
          <SidebarContent>
            {referentielNavSections.map((section) => (
              <SidebarGroup key={section.title}>
                <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.key}>
                        <SidebarMenuButton
                          isActive={referentiel.activeKey === item.key}
                          onClick={() => referentiel.onSelectItem(item.key)}
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
          <SidebarFooter />
        </Sidebar>
      ) : null}
    </>
  )
}
