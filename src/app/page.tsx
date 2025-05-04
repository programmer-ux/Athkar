
"use client"; // Required because we are using state and effects

import { useState, useEffect } from 'react';
import { AthkarList } from '@/components/athkar-list';
import { morningAthkar, eveningAthkar } from '@/data/athkar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react'; // Icon for the 'Show All' button

// Define initial visibility state based on categories
const initialVisibility = {
  morning_completed_v1: true,
  evening_completed_v1: true,
};

export default function Home() {
  const [listVisibility, setListVisibility] = useState(initialVisibility);

  // Check local storage on mount to potentially hide already completed lists
  useEffect(() => {
    const updatedVisibility = { ...initialVisibility };
    let hasHiddenLists = false;

    Object.keys(initialVisibility).forEach(categoryKey => {
      const storedData = localStorage.getItem(categoryKey);
      if (storedData) {
        try {
          const completedState = JSON.parse(storedData);
          const list = categoryKey === 'morning_completed_v1' ? morningAthkar : eveningAthkar;
          const totalCount = list.length;
          const completedCount = Object.values(completedState).filter(Boolean).length;

          if (totalCount > 0 && completedCount >= totalCount) {
            updatedVisibility[categoryKey as keyof typeof initialVisibility] = false;
            hasHiddenLists = true;
          }
        } catch (e) {
          console.error("Error parsing localStorage data for", categoryKey, e);
        }
      }
    });

    if (hasHiddenLists) {
      setListVisibility(updatedVisibility);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleListComplete = (categoryKey: string) => {
    setListVisibility(prev => ({
      ...prev,
      [categoryKey]: false,
    }));
  };

  const handleShowAll = () => {
    setListVisibility(initialVisibility);
     // Also reset the actual completion state in localStorage and AthkarList state
     Object.keys(initialVisibility).forEach(categoryKey => {
        localStorage.removeItem(categoryKey); // Clear storage
     });
     // Force re-render or rely on AthkarList internal reset if needed
     // This simple example might require a more robust state management or key prop change for AthkarList if reset doesn't happen automatically
     // For now, let's assume clicking 'Show All' implies wanting to start over.
     // A better UX might be just showing them without resetting progress. If so, remove the localStorage.removeItem loop.
     // Reloading the page to reflect cleared state might be the simplest temporary solution if AthkarList doesn't auto-reset.
     window.location.reload(); // Simple way to force refresh and reset lists based on cleared storage
  };

  const allListsHidden = Object.values(listVisibility).every(v => !v);

  return (
    <div className="space-y-8">
      <header className="text-center py-6">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 mx-auto text-primary mb-2">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
        </svg>
        <h1 className="text-3xl font-bold text-primary arabic">زاد - أذكار اليوم والليلة</h1>
        <p className="text-muted-foreground mt-1 arabic">مهام يومية بسيطة لأذكارك الصحيحة</p>
      </header>

      {allListsHidden && (
        <div className="text-center p-4 border border-dashed rounded-lg">
          <p className="text-lg text-muted-foreground mb-4">ما شاء الله! لقد أكملت جميع الأذكار لهذا اليوم.</p>
          <Button onClick={handleShowAll}>
            <Eye className="ml-2 h-4 w-4" />
            عرض القوائم مرة أخرى
          </Button>
        </div>
      )}

      {!allListsHidden && (
         <div className="flex justify-end mb-4">
            <Button variant="outline" onClick={handleShowAll}>
                 <Eye className="ml-2 h-4 w-4" />
                 إظهار وإعادة تعيين الكل
               </Button>
         </div>
        )}


      {listVisibility.morning_completed_v1 && (
        <>
          <AthkarList
            title="أذكار الصباح"
            athkarList={morningAthkar}
            categoryKey="morning_completed_v1"
            onComplete={() => handleListComplete("morning_completed_v1")}
          />
          <Separator className="my-6" />
        </>
      )}

      {listVisibility.evening_completed_v1 && (
        <AthkarList
          title="أذكار المساء"
          athkarList={eveningAthkar}
          categoryKey="evening_completed_v1"
          onComplete={() => handleListComplete("evening_completed_v1")}
        />
      )}

       {/* Removed the duplicate evening list */}

      <footer className="text-center text-xs text-muted-foreground py-4 mt-8">
        <p>تطبيق مجاني بدون إعلانات. تم إضافة الأحاديث الصحيحة فقط (بإذن الله).</p>
        <p>&copy; {new Date().getFullYear()} AthkarPal</p>
      </footer>
    </div>
  );
}
