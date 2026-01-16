'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { useTheme } from 'next-themes'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}

export function useMounted() {
  const { resolvedTheme } = useTheme()
  const mounted = typeof window !== 'undefined'
  return { mounted, resolvedTheme }
}
