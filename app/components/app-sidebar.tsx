"use client"

import * as React from "react"
import { LibraryBigIcon } from "lucide-react"

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

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeKey: ReferentielSectionKey
  onSelectItem: (key: ReferentielSectionKey) => void
}

export function AppSidebar({
  activeKey,
  onSelectItem,
  ...props
}: AppSidebarProps) {
  const activeItem = referentielNavItemsFlat.find(
    (item) => item.key === activeKey,
  )

  return (
    <>
      {/* Rail de navigation : réductible icônes-seules <-> icône+libellé
          via le trigger placé dans son propre pied de page. Le module
          Référentiel est pour l'instant le seul module du dashboard. */}
      <Sidebar collapsible="icon" className="border-r" {...props}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Référentiel"
                    onClick={() => onSelectItem(referentielNavItemsFlat[0].key)}
                    isActive
                    className="px-2.5 md:px-2"
                  >
                    <LibraryBigIcon />
                    <span>Référentiel</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
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

      {/* Colonne de navigation du référentiel : largeur fixe, jamais
          affectée par l'état collapsed/expanded du rail juste à côté. */}
      <Sidebar collapsible="none" className="hidden w-75 shrink-0 border-r md:flex">
        <SidebarHeader className="gap-1 border-b p-4">
          <div className="text-base font-medium text-foreground">
            Référentiel
          </div>
          <p className="text-xs text-muted-foreground">
            {activeItem?.description ?? "Structure des systèmes éducatifs"}
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
                        isActive={activeKey === item.key}
                        onClick={() => onSelectItem(item.key)}
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
      </Sidebar>
    </>
  )
}
