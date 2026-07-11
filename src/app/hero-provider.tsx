'use client';

import { ReactNode, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';

/**
 * HeroProvider syncs the custom dark/light theme with HeroUI v3.
 * HeroUI v3 reads data-theme attribute and .dark / .light class on <html>.
 * next-themes (used in ClientProviders) handles this automatically.
 * This component can be used for additional future integrations.
 */
export const HeroProvider = ({ children }: { children: ReactNode }) => {
  // next-themes already sets class and data-theme on html — nothing extra needed.
  return <>{children}</>;
};
