
"use client";

import { useState, useEffect } from 'react';
import { AthkarList } from '@/components/athkar-list';
import { morningAthkar, eveningAthkar } from '@/data/athkar';
import { Separator } from '@/components/ui/separator';
import type { Athkar } from '@/types';
import useLocalStorage from '@/hooks/use-local-storage'; // Import useLocalStorage
import { safeJsonParse } from '@/lib/utils'; // Import safeJsonParse
import { libraryCategories } from '@/data/athkar'; // Import library categories to structure custom lists

// Key for storing the custom daily Athkar list IN STORAGE (contains ALL added Athkar IDs)
const CUSTOM_DAILY_ATHKAR_STORAGE_KEY = 'custom_daily_athkar_v1';
// Key prefix for storing the COMPLETION state of each custom list category
const CUSTOM_LIST_COMPLETED_KEY_PREFIX = 'custom_list_completed_';

export default function Home() {
  // State holds the structured lists for display
  const [customAthkarLists, setCustomAthkarLists] = useState<Record<string, { title: string; list: Athkar[] }>>({});
  // Use useLocalStorage to reactively track CHANGES in the stored list of ALL custom athkar
  const [storedCustomAthkar] = useLocalStorage<Athkar[]>(CUSTOM_DAILY_ATHKAR_STORAGE_KEY, []);
  const [clientLoaded, setClientLoaded] = useState(false);

  // Process the stored flat list into structured lists for display
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load the flat list of all custom Athkar from storage
      const flatCustomList = safeJsonParse<Athkar[]>(CUSTOM_DAILY_ATHKAR_STORAGE_KEY) ?? [];

      // Group the flat list back into categories based on libraryCategories
      const groupedLists: Record<string, { title: string; list: Athkar[] }> = {};
      const customAthkarIds = new Set(flatCustomList.map(a => a.id));

      Object.entries(libraryCategories).forEach(([key, categoryData]) => {
        const itemsForThisCategory = categoryData.list.filter(item => customAthkarIds.has(item.id));
        if (itemsForThisCategory.length > 0) {
          groupedLists[key] = {
            title: categoryData.title, // Use the original title
            list: itemsForThisCategory,
          };
        }
      });

      setCustomAthkarLists(groupedLists);
      setClientLoaded(true); // Indicate client has loaded and processed data
    }
  }, [storedCustomAthkar]); // Rerun effect if the value from useLocalStorage changes

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
        categoryKey="morning_completed_v1" // Keep unique key for default lists
      />
      <Separator className="my-6" />

      {/* Evening Athkar */}
      <AthkarList
        title="أذكار المساء"
        athkarList={eveningAthkar}
        categoryKey="evening_completed_v1" // Keep unique key for default lists
      />

      {/* Custom Daily Athkar Lists - Render based on processed state */}
      {clientLoaded && Object.entries(customAthkarLists).map(([categoryKey, listData]) => (
        listData.list.length > 0 && ( // Only render if the list actually has items for this user
          <div key={categoryKey}>
            <Separator className="my-6" />
            <AthkarList
              title={listData.title} // Use the title from the grouped data
              athkarList={listData.list} // Use the filtered list for this category
              categoryKey={`${CUSTOM_LIST_COMPLETED_KEY_PREFIX}${categoryKey}`} // Use a unique key for completion state based on category
              // Optional: Add functionality to remove items/lists later
            />
          </div>
        )
      ))}


      <footer className="text-center text-xs text-muted-foreground py-4 mt-8">
        <p>تطبيق مجاني بدون إعلانات. تم إضافة الأحاديث الصحيحة فقط (بإذن الله).</p>
        <p>&copy; {new Date().getFullYear()} AthkarPal</p>
      </footer>
    </div>
  );
}
