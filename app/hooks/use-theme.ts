import * as React from "react"

export type Theme = "light" | "dark"

const STORAGE_KEY = "daeko-theme"

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function readStoredTheme(): Theme | null {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === "dark" || stored === "light" ? stored : null
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark")
}

/**
 * Bascule de thème — charte §11.2 : préférence utilisateur sauvegardée en
 * priorité, sinon préférence système, sinon clair. Le raccourci
 * Ctrl/Cmd+Shift+L est câblé par ThemeToggle, seul consommateur de ce hook.
 */
export function useTheme() {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window === "undefined") return "light"
    return readStoredTheme() ?? getSystemTheme()
  })

  React.useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const setTheme = React.useCallback((next: Theme) => {
    window.localStorage.setItem(STORAGE_KEY, next)
    setThemeState(next)
  }, [])

  const toggleTheme = React.useCallback(() => {
    setThemeState((current) => {
      const next = current === "dark" ? "light" : "dark"
      window.localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }, [])

  return { theme, setTheme, toggleTheme }
}
