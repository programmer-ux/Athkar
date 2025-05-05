
'use client';

import { useEffect } from 'react';
import { allCategoryData } from '@/data/athkar'; // Import category data to get storage keys

const LAST_RESET_DATE_KEY = 'athkarpal_last_reset_date_v1';

// Function to get today's date as YYYY-MM-DD string
const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Custom hook to check if a daily reset is needed for Athkar progress
 * and perform the reset if the date has changed since the last reset.
 */
export function useDailyReset() {
  useEffect(() => {
    // Ensure this code runs only on the client-side
    if (typeof window === 'undefined') {
      return;
    }

    const todayString = getTodayDateString();
    let lastResetDate: string | null = null;

    // Safely get the last reset date from localStorage
    try {
        lastResetDate = window.localStorage.getItem(LAST_RESET_DATE_KEY);
    } catch (error) {
        console.error("Error reading last reset date from localStorage:", error);
        // Decide how to handle this error, e.g., attempt reset anyway or skip
    }


    // If the last reset was not today (or never happened), perform the reset
    if (lastResetDate !== todayString) {
      console.log(`Performing daily reset for ${todayString}...`);

      // Get all storage keys for completion data from the athkar data definition
      const storageKeysToReset = Object.values(allCategoryData).map(data => data.storageKey);

      try {
        storageKeysToReset.forEach(key => {
          // Reset completion state for each list to an empty object
          // Components using useLocalStorage for these keys will see the change
          window.localStorage.setItem(key, JSON.stringify({}));
          console.log(`Reset localStorage key: ${key}`);
        });

        // Update the last reset date in localStorage
        window.localStorage.setItem(LAST_RESET_DATE_KEY, todayString);
        console.log('Daily reset complete.');

        // Optional: Consider if a reload is needed for absolute certainty,
        // though hooks should react. For simplicity, let's rely on hook updates.
        // window.location.reload();

      } catch (error) {
        console.error("Error performing daily reset in localStorage:", error);
      }
    } else {
      // Log that reset is not needed if it already happened today
      console.log(`Daily reset already performed for ${todayString}.`);
    }

    // This effect should run only once when the component mounts client-side
  }, []); // Empty dependency array ensures it runs once on mount
}
