
"use client";

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { safeJsonParse } from '@/lib/utils'; // Import the safe utility

type SetValue<T> = Dispatch<SetStateAction<T>>;

function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = safeJsonParse<T>(key); // Use the safe parsing utility
    return item ?? initialValue; // Return parsed item or initial value if null
  });

  // useEffect to update local storage when the state changes
  // We use storedValue as dependency to only run when it changes.
  useEffect(() => {
    // Prevent build errors from localStorage access
    if (typeof window === 'undefined') {
        return;
    }
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        typeof storedValue === 'function'
          ? (storedValue as (prevState: T) => T)(storedValue) // Correctly handle function updates
          : storedValue;
      // Save state
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  }, [key, storedValue]);


  return [storedValue, setStoredValue];
}

export default useLocalStorage;
