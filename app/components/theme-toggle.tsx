"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "lucide-react"

import { Button } from "~/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip"
import { useTheme } from "~/hooks/use-theme"

/**
 * Bascule clair/sombre — charte §11.2 : toujours disponible, raccourci
 * clavier Ctrl/Cmd+Shift+L.
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === "l") {
        event.preventDefault()
        toggleTheme()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleTheme])

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
          >
            {theme === "dark" ? <SunIcon aria-hidden="true" /> : <MoonIcon aria-hidden="true" />}
          </Button>
        }
      />
      <TooltipContent>
        {theme === "dark" ? "Mode clair" : "Mode sombre"}
        <span className="ml-1.5 text-background/60">Ctrl/Cmd+Maj+L</span>
      </TooltipContent>
    </Tooltip>
  )
}
