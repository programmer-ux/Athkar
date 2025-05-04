
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely parses JSON from localStorage.
 * Returns null if parsing fails or if running outside the browser.
 *
 * @param key The localStorage key.
 * @returns The parsed data or null.
 */
export function safeJsonParse<T>(key: string): T | null {
  if (typeof window === 'undefined') {
    return null; // Not in a browser environment
  }
  const item = window.localStorage.getItem(key);
  if (!item) {
    return null; // Item doesn't exist
  }
  try {
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error parsing JSON from localStorage key "${key}":`, error);
    return null; // Parsing failed
  }
}
