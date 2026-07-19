"use client"

import * as React from "react"

import { AppSidebar } from "~/components/app-sidebar"
import { SiteNavbar } from "~/components/site-navbar"
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

const sectionComponents: Record<ReferentielSectionKey, React.ComponentType> = {
  "systeme-enseignement": SystemeEnseignementSection,
  cycles: CyclesSection,
  niveaux: NiveauxSection,
  filieres: FilieresSection,
  series: SeriesSection,
  matieres: MatieresSection,
  "affectations-matieres": AffectationsMatieresSection,
}

export default function Page() {
  const [activeKey, setActiveKey] = React.useState<ReferentielSectionKey>(
    referentielNavItemsFlat[0].key,
  )
  const activeTitle =
    referentielNavItemsFlat.find((item) => item.key === activeKey)?.title ??
    "Référentiel"
  const ActiveSection = sectionComponents[activeKey]

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "14rem",
          "--topbar-height": "3rem",
        } as React.CSSProperties
      }
    >
      <SiteNavbar breadcrumb={activeTitle} />
      <div className="flex min-h-0 flex-1">
        <AppSidebar activeKey={activeKey} onSelectItem={setActiveKey} />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 md:p-6">
            <ActiveSection />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
