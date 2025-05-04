
"use client"; // Required because we are using state and effects

import { useState, useEffect } from 'react';
import { AthkarList } from '@/components/athkar-list';
import { morningAthkar, eveningAthkar } from '@/data/athkar';
import { Separator } from '@/components/ui/separator';
import type { Athkar } from '@/types';
import useLocalStorage from '@/hooks/use-local-storage'; // Import useLocalStorage

// Key for storing the custom daily Athkar list in localStorage
const CUSTOM_DAILY_ATHKAR_KEY = 'custom_daily_athkar_v1';
// Key for storing the completion state of the custom list
const CUSTOM_DAILY_COMPLETED_KEY = 'custom_daily_completed_v1';

export default function Home() {
  const [customAthkarList, setCustomAthkarList] = useState<Athkar[]>([]);
  // Use useLocalStorage to reactively update when the list changes elsewhere
  const [storedCustomList] = useLocalStorage<Athkar[]>(CUSTOM_DAILY_ATHKAR_KEY, []);
  const [clientLoaded, setClientLoaded] = useState(false);

  // Load custom list from storage when client loads or storage changes
  useEffect(() => {
    // Check if window is defined before accessing localStorage
    if (typeof window !== 'undefined') {
        const storedListRaw = localStorage.getItem(CUSTOM_DAILY_ATHKAR_KEY);
        let loadedList: Athkar[] = [];
        if (storedListRaw) {
        try {
            loadedList = JSON.parse(storedListRaw);
        } catch (e) {
            console.error("Failed to parse custom daily list from localStorage", e);
            loadedList = []; // Reset if parsing fails
        }
        }
        setCustomAthkarList(loadedList);
        setClientLoaded(true); // Indicate client has loaded
    }
  }, [storedCustomList]); // Rerun effect if the value from useLocalStorage changes


  return (
    <div className="space-y-8">
      <header className="text-center py-6">
        {/* Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 mx-auto text-primary mb-2">
          <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A9.735 9.735 0 0 0 6 18a9.707 9.707 0 0 0 5.25 1.533.75.75 0 0 0 .75-.75V5.24a.75.75 0 0 0-.75-.707Zm0 0V19.5m1.5 0A9.707 9.707 0 0 0 18 18a9.735 9.735 0 0 0 3.25-.555.75.75 0 0 0 .5-.707V3.75a.75.75 0 0 0-1-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533.75.75 0 0 0-.75.75v14.25a.75.75 0 0 0 .75.75Z" />
        </svg>
        <h1 className="text-3xl font-bold text-primary arabic">زاد - أذكار اليوم والليلة</h1>
        <p className="text-muted-foreground mt-1 arabic">مهام يومية بسيطة لأذكارك الصحيحة</p>
      </header>

      {/* Morning Athkar */}
      <AthkarList
        title="أذكار الصباح"
        athkarList={morningAthkar}
        categoryKey="morning_completed_v1"
      />
      <Separator className="my-6" />

      {/* Evening Athkar */}
      <AthkarList
        title="أذكار المساء"
        athkarList={eveningAthkar}
        categoryKey="evening_completed_v1"
      />

      {/* Custom Daily Athkar - Only render if list has items and client has loaded */}
      {clientLoaded && customAthkarList.length > 0 && (
        <>
          <Separator className="my-6" />
          <AthkarList
            title="أذكار مضافة" // Title for the custom list
            athkarList={customAthkarList}
            categoryKey={CUSTOM_DAILY_COMPLETED_KEY} // Use a distinct key for completion state
            // Optional: Add functionality to remove items from this list later
            // showRemoveButton={true}
            // onRemoveItem={handleRemoveCustomItem}
          />
        </>
      )}

      <footer className="text-center text-xs text-muted-foreground py-4 mt-8">
        <p>تطبيق مجاني بدون إعلانات. تم إضافة الأحاديث الصحيحة فقط (بإذن الله).</p>
        <p>&copy; {new Date().getFullYear()} AthkarPal</p>
      </footer>
    </div>
  );
}
