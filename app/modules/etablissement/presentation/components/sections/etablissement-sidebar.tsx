"use client"

import * as React from "react"
import { BuildingIcon } from "lucide-react"

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
  etablissementNavItemsFlat,
  etablissementNavSections,
  type EtablissementSectionKey,
} from "~/modules/etablissement/presentation/nav"

interface EtablissementSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeKey: EtablissementSectionKey
  onSelectItem: (key: EtablissementSectionKey) => void
}

export function EtablissementSidebar({
  activeKey,
  onSelectItem,
  ...props
}: EtablissementSidebarProps) {
  const activeItem = etablissementNavItemsFlat.find(
    (item) => item.key === activeKey,
  )

  return (
    <>
      {/* Rail de navigation : réductible icônes-seules <-> icône+libellé
          via le trigger placé dans son propre pied de page. Sidebar
          dédiée au module Établissement — indépendante de celle du
          module Référentiel (voir ARCHITECTURE.md, isolation par
          bounded context). */}
      <Sidebar collapsible="icon" className="border-r" {...props}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Établissements"
                    onClick={() => onSelectItem(etablissementNavItemsFlat[0].key)}
                    isActive
                    className="px-2.5 md:px-2"
                  >
                    <BuildingIcon />
                    <span>Établissements</span>
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

      {/* Colonne de navigation du module Établissement : largeur fixe,
          jamais affectée par l'état collapsed/expanded du rail juste
          à côté. */}
      <Sidebar collapsible="none" className="hidden w-75 shrink-0 border-r md:flex">
        <SidebarHeader className="gap-1 border-b p-4">
          <div className="text-base font-medium text-foreground">
            Établissements
          </div>
          <p className="text-xs text-muted-foreground">
            {activeItem?.description ?? "Gestion des établissements scolaires"}
          </p>
        </SidebarHeader>
        <SidebarContent>
          {etablissementNavSections.map((section) => (
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