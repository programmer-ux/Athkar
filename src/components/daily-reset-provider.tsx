
'use client';

import type React from 'react';
import { useDailyReset } from '@/hooks/use-daily-reset';

/**
 * A client component wrapper that calls the useDailyReset hook.
 * It doesn't render any UI itself, just ensures the reset logic runs.
 */
export function DailyResetProvider({ children }: { children: React.ReactNode }) {
  useDailyReset(); // Initialize the daily reset check
  return <>{children}</>; // Render the children passed to it
}
