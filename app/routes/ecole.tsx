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
  MaStructureScreen,
  HistoriqueScreen,
  BrancheWorkspace,
  structurePedagogiqueNavItems,
  type StructurePedagogiqueScreenKey,
} from "~/modules/structure-pedagogique/presentation"

/**
 * Layout admin école : ne contient que les onglets propres à une école
 * (structure pédagogique aujourd'hui, d'autres modules scopés école pourront
 * s'ajouter au rail plus tard). Distinct du layout super-admin (voir
 * routes/dashboard.tsx) qui gère le référentiel global.
 *
 * Pas de colonne de navigation seconde ici : "Ma structure" est la seule
 * vraie page d'entrée, "Historique" est une page de type "drill-in" avec
 * son propre bouton retour. Le détail d'une branche va plus loin : il
 * remplace entièrement le rail de modules par la sidebar contextuelle de
 * BrancheWorkspace (retour + Configuration / Matrice / Classes), et son nom
 * remonte dans la navbar (BrancheWorkspace n'affiche plus ce contexte lui-même).
 */
export default function Page() {
  const [structureScreen, setStructureScreen] =
    React.useState<StructurePedagogiqueScreenKey>("ma-structure")
  const [brancheOuverteId, setBrancheOuverteId] = React.useState<string | null>(null)
  const [brancheOuverteNom, setBrancheOuverteNom] = React.useState<string | null>(null)

  const breadcrumb =
    structurePedagogiqueNavItems.find((item) => item.key === structureScreen)?.title ?? "Ma structure"

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "14rem",
          "--topbar-height": "3rem",
        } as React.CSSProperties
      }
    >
      <SiteNavbar title={brancheOuverteId ? (brancheOuverteNom ?? undefined) : undefined} />
      <div className="flex min-h-0 flex-1">
        {brancheOuverteId ? (
          <BrancheWorkspace
            brancheId={brancheOuverteId}
            onBack={() => {
              setBrancheOuverteId(null)
              setBrancheOuverteNom(null)
            }}
            onTitleChange={setBrancheOuverteNom}
          />
        ) : (
          <>
            <AppSidebar
              activeModule="structure-pedagogique"
              onSelectModule={() => {}}
              availableModules={["structure-pedagogique"]}
            />
            <SidebarInset>
              <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 md:p-6">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">Administration école</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{breadcrumb}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                {structureScreen === "ma-structure" ? (
                  <MaStructureScreen
                    onOpenHistorique={() => setStructureScreen("historique")}
                    onOpenBranche={(id) => setBrancheOuverteId(id)}
                  />
                ) : (
                  <HistoriqueScreen onBack={() => setStructureScreen("ma-structure")} />
                )}
              </div>
            </SidebarInset>
          </>
        )}
      </div>
    </SidebarProvider>
  )
}
