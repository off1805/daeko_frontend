"use client"

import * as React from "react"

import { SiteNavbar } from "~/components/site-navbar"
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar"
import {
  EnTeteSection,
  EtablissementSidebar,
  etablissementNavItemsFlat,
  FicheIdentiteSection,
  HistoriqueSection,
  LocalisationSection,
  PortefeuilleSection,
  SignatairesSection,
  type EtablissementSectionKey,
} from "~/modules/etablissement/presentation"

export default function DashboardsudoPage() {
  const [activeKey, setActiveKey] = React.useState<EtablissementSectionKey>(
    etablissementNavItemsFlat[0].key,
  )
  const [selectedEtablissementId, setSelectedEtablissementId] =
    React.useState<string | null>(null)

  const activeTitle =
    etablissementNavItemsFlat.find((item) => item.key === activeKey)?.title ??
    "Établissements"

  const handleSelectEtablissement = (id: string) => {
    setSelectedEtablissementId(id)
    setActiveKey("fiche")
  }

  const renderActiveSection = () => {
    switch (activeKey) {
      case "portefeuille":
        return <PortefeuilleSection onSelectEtablissement={handleSelectEtablissement} />
      case "fiche":
        return (
          <div className="flex flex-col gap-4">
            <FicheIdentiteSection etablissementId={selectedEtablissementId} />
            <LocalisationSection etablissementId={selectedEtablissementId} />
          </div>
        )
      case "en-tete":
        return <EnTeteSection etablissementId={selectedEtablissementId} />
      case "signataires":
        return <SignatairesSection etablissementId={selectedEtablissementId} />
      case "audit":
        return <HistoriqueSection etablissementId={selectedEtablissementId} />
      default:
        return null
    }
  }

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
        <EtablissementSidebar activeKey={activeKey} onSelectItem={setActiveKey} />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 md:p-6">
            {renderActiveSection()}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}