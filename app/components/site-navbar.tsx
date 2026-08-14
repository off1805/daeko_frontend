import { Separator } from "~/components/ui/separator"
import { NavUser } from "~/components/nav-user"
import { ThemeToggle } from "~/components/theme-toggle"

const user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "",
}

interface SiteNavbarProps {
  /**
   * Titre contextuel affiché après le logo (ex : nom de la branche
   * consultée). Ce n'est pas un fil d'Ariane générique — celui-ci vit en
   * première ligne du contenu principal, propre à chaque écran.
   */
  title?: string
}

/**
 * Bandeau pleine largeur au sommet de l'écran, au-dessus de la sidebar.
 */
export function SiteNavbar({ title }: SiteNavbarProps) {
  return (
    <header
      data-print-hide
      className="sticky top-0 z-20 flex h-(--topbar-height) w-full shrink-0 items-center gap-2 border-b bg-background px-4"
    >
      <a href="#" className="flex items-center gap-2">
        <div
          aria-hidden="true"
          className="flex aspect-square size-6 items-center justify-center rounded-[5px] bg-primary text-primary-foreground"
        >
          <span className="text-xs font-semibold leading-none">D</span>
        </div>
        <span className="text-sm font-medium tracking-[-0.02em] text-foreground">daeko</span>
      </a>
      {title ? (
        <>
          <Separator orientation="vertical" className="mx-1 data-vertical:h-4 data-vertical:self-auto" />
          <span className="text-sm font-medium text-foreground">{title}</span>
        </>
      ) : null}
      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
        <NavUser user={user} />
      </div>
    </header>
  )
}
