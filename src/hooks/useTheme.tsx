'use client';

import { useTheme as useNextTheme } from 'next-themes';

/**
 * Thin wrapper around next-themes so the rest of the codebase keeps the same
 * `useTheme()` / `ThemeProvider` API without changes.
 *
 * next-themes automatically sets:
 *   - class="dark" | "light" on <html>
 *   - data-theme="dark" | "light" on <html>
 * Both of which HeroUI v3 reads.
 */
export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme();

  const currentTheme = (resolvedTheme || theme || 'dark') as 'dark' | 'light';

  const toggleTheme = () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  return { theme: currentTheme, toggleTheme };
}
