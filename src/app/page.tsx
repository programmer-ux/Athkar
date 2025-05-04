
"use client"; // Required because we are using state and effects

// Removed useState and useEffect imports as they are no longer needed for visibility management here

import { AthkarList } from '@/components/athkar-list';
import { morningAthkar, eveningAthkar } from '@/data/athkar';
import { Separator } from '@/components/ui/separator';
// Removed Button and Eye icon imports as 'Show All' button is removed

export default function Home() {
  // Removed listVisibility state and related useEffect

  // Removed handleListComplete function
  // Removed handleShowAll function
  // Removed allListsHidden calculation

  return (
    <div className="space-y-8">
      <header className="text-center py-6">
        {/* Changed icon to a book/knowledge icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 mx-auto text-primary mb-2">
          <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A9.735 9.735 0 0 0 6 18a9.707 9.707 0 0 0 5.25 1.533.75.75 0 0 0 .75-.75V5.24a.75.75 0 0 0-.75-.707Zm0 0V19.5m1.5 0A9.707 9.707 0 0 0 18 18a9.735 9.735 0 0 0 3.25-.555.75.75 0 0 0 .5-.707V3.75a.75.75 0 0 0-1-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533.75.75 0 0 0-.75.75v14.25a.75.75 0 0 0 .75.75Z" />
        </svg>
        <h1 className="text-3xl font-bold text-primary arabic">زاد - أذكار اليوم والليلة</h1>
        <p className="text-muted-foreground mt-1 arabic">مهام يومية بسيطة لأذكارك الصحيحة</p>
      </header>

      {/* Removed conditional rendering and 'Show All' button */}

      {/* Always render the lists */}
       <AthkarList
         title="أذكار الصباح"
         athkarList={morningAthkar}
         categoryKey="morning_completed_v1"
         // Removed onComplete prop
       />
       <Separator className="my-6" />
       <AthkarList
         title="أذكار المساء"
         athkarList={eveningAthkar}
         categoryKey="evening_completed_v1"
         // Removed onComplete prop
       />


      <footer className="text-center text-xs text-muted-foreground py-4 mt-8">
        <p>تطبيق مجاني بدون إعلانات. تم إضافة الأحاديث الصحيحة فقط (بإذن الله).</p>
        <p>&copy; {new Date().getFullYear()} AthkarPal</p>
      </footer>
    </div>
  );
}
