"use client"

import * as React from "react"

import { AppSidebar } from "~/components/app-sidebar"
import { SiteNavbar } from "~/components/site-navbar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar"
import {
  AffectationsMatieresSection,
  CyclesSection,
  FilieresSection,
  MatieresSection,
  NiveauxSection,
  referentielNavItemsFlat,
  SeriesSection,
  SystemeEnseignementSection,
  type ReferentielSectionKey,
} from "~/modules/referentiel/presentation"

const referentielSectionComponents: Record<ReferentielSectionKey, React.ComponentType> = {
  "systeme-enseignement": SystemeEnseignementSection,
  cycles: CyclesSection,
  niveaux: NiveauxSection,
  filieres: FilieresSection,
  series: SeriesSection,
  matieres: MatieresSection,
  "affectations-matieres": AffectationsMatieresSection,
}

/**
 * Layout super-admin : gère le référentiel global (structure des systèmes
 * éducatifs), partagé entre toutes les écoles. Distinct du layout admin
 * école (voir routes/ecole.tsx) qui ne gère que les données propres à une
 * école (structure pédagogique, etc.).
 */
export default function Page() {
  const [referentielKey, setReferentielKey] = React.useState<ReferentielSectionKey>(
    referentielNavItemsFlat[0].key,
  )

  const breadcrumb =
    referentielNavItemsFlat.find((item) => item.key === referentielKey)?.title ?? "Référentiel"

  const ActiveReferentielSection = referentielSectionComponents[referentielKey]

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "14rem",
          "--topbar-height": "3rem",
        } as React.CSSProperties
      }
    >
      <SiteNavbar />
      <div className="flex min-h-0 flex-1">
        <AppSidebar
          activeModule="referentiel"
          onSelectModule={() => {}}
          availableModules={["referentiel"]}
          referentiel={{ activeKey: referentielKey, onSelectItem: setReferentielKey }}
        />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 md:p-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Référentiel</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{breadcrumb}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <ActiveReferentielSection />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
