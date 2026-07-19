import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"
import { Separator } from "~/components/ui/separator"
import { SidebarTrigger } from "~/components/ui/sidebar"
import { NavUser } from "~/components/nav-user"
import { TerminalIcon } from "lucide-react"

const user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "",
}

interface SiteNavbarProps {
  /** Libellé de la page active, affiché comme feuille du fil d'Ariane. */
  breadcrumb?: string
}

/**
 * Bandeau pleine largeur au sommet de l'écran, au-dessus de la sidebar.
 * Reste à l'intérieur de SidebarProvider (SidebarTrigger a besoin du
 * contexte sidebar) mais n'est pas contraint à la colonne de contenu.
 */
export function SiteNavbar({ breadcrumb }: SiteNavbarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-(--topbar-height) w-full shrink-0 items-center gap-2 border-b bg-background px-4">
      <a href="#" className="flex items-center gap-2">
        <div className="flex aspect-square size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <TerminalIcon className="size-3.5" />
        </div>
        <span className="text-sm font-medium">Acme Inc</span>
      </a>
      <Separator
        orientation="vertical"
        className="mx-1 data-vertical:h-4 data-vertical:self-auto"
      />
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-vertical:h-4 data-vertical:self-auto"
      />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="#">Référentiel</BreadcrumbLink>
          </BreadcrumbItem>
          {breadcrumb ? (
            <>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{breadcrumb}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : null}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center">
        <NavUser user={user} />
      </div>
    </header>
  )
}
