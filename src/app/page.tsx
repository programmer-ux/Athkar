"use client";

import { useState, useEffect } from 'react';
import { AthkarList } from '@/components/athkar-list';
import { morningAthkar, eveningAthkar } from '@/data/athkar';
import { Separator } from '@/components/ui/separator';
import type { Athkar } from '@/types';
import useLocalStorage from '@/hooks/use-local-storage';
import { safeJsonParse } from '@/lib/utils';
import { libraryCategories } from '@/data/athkar';
import { BookOpen } from 'lucide-react'; // Import BookOpen icon

// Key for storing the custom daily Athkar list IN STORAGE (contains ALL added Athkar IDs)
const CUSTOM_DAILY_ATHKAR_STORAGE_KEY = 'custom_daily_athkar_v1';

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
    <div className="space-y-6"> {/* Reduced spacing from space-y-8 */}
      <header className="text-center py-6">
        {/* Icon - Changed to BookOpen */}
        <BookOpen className="w-12 h-12 mx-auto text-primary mb-2" strokeWidth={1.5} />
        <h1 className="text-3xl font-bold text-primary arabic">زاد - أذكار اليوم والليلة</h1>
        <p className="text-muted-foreground mt-1 arabic">مهام يومية بسيطة لأذكارك الصحيحة</p>
      </header>

      {/* Morning Athkar - Now acts as a link */}
      <AthkarList
        title="أذكار الصباح"
        athkarList={morningAthkar}
        categoryKey="morning" // Using simplified key for routing
      />

      {/* Evening Athkar - Now acts as a link */}
      <AthkarList
        title="أذكار المساء"
        athkarList={eveningAthkar}
        categoryKey="evening" // Using simplified key for routing
      />

      {/* Custom Daily Athkar Lists - Render based on processed state */}
      {clientLoaded && Object.keys(customAthkarLists).length > 0 && (
         <Separator className="my-4" />
       )}
      {clientLoaded && Object.entries(customAthkarLists).map(([categoryKey, listData]) => (
        listData.list.length > 0 && ( // Only render if the list actually has items for this user
          <AthkarList
            key={categoryKey}
            title={listData.title} // Use the title from the grouped data
            athkarList={listData.list} // Use the filtered list for this category
            categoryKey={categoryKey} // Use the library category key directly for routing
          />
        )
      ))}

      {!clientLoaded && (
          // Skeleton loading for lists if needed, or keep simple text
          <p className="text-muted-foreground text-center py-10">جاري تحميل القوائم...</p>
      )}

      <footer className="text-center text-xs text-muted-foreground py-4 mt-8">
        <p>تطبيق مجاني بدون إعلانات. تم إضافة الأحاديث الصحيحة فقط (بإذن الله).</p>
        <p>&copy; {new Date().getFullYear()} AthkarPal</p>
      </footer>
    </div>
  );
}
