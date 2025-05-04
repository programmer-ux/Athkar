"use client";

import type { Athkar } from '@/types';
import { AthkarItem } from './athkar-item';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';

interface AthkarListProps {
  title: string;
  athkarList: Athkar[];
  categoryKey: string; // Unique key for localStorage, e.g., 'morning_completed'
}

type CompletedState = {
  [id: string]: boolean;
};

export function AthkarList({ title, athkarList, categoryKey }: AthkarListProps) {
   // Check if window is defined before accessing localStorage
    const initialCompletedState = typeof window !== 'undefined'
    ? JSON.parse(window.localStorage.getItem(categoryKey) || '{}')
    : {};

  const [completedAthkar, setCompletedAthkar] = useLocalStorage<CompletedState>(
      categoryKey,
      initialCompletedState
    );
  const [clientLoaded, setClientLoaded] = useState(false);


   // Ensure localStorage is only accessed client-side after mount
   useEffect(() => {
    setClientLoaded(true);
    // Optionally re-read from localStorage here if hydration issues persist
    // const currentStorage = JSON.parse(window.localStorage.getItem(categoryKey) || '{}');
    // setCompletedAthkar(currentStorage);
  }, [categoryKey]); // Removed setCompletedAthkar dependency

  const handleToggleComplete = (id: string) => {
     // Ensure update happens only on client
    if (typeof window !== 'undefined') {
        setCompletedAthkar((prev) => ({
         ...prev,
         [id]: !prev[id], // Toggle state
        }));
    }
  };

   const handleReset = () => {
    if (typeof window !== 'undefined') {
        setCompletedAthkar({});
    }
  };

  const completedCount = useMemo(() => {
    if (!clientLoaded) return 0; // Don't calculate server-side or before hydration
    return Object.values(completedAthkar).filter(Boolean).length;
  }, [completedAthkar, clientLoaded]);

  const totalCount = athkarList.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

   if (!clientLoaded) {
    // Render a loading state or placeholder until client hydration is complete
     return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-primary">{title}</h2>
        <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
        </div>
       </div>
    );
  }


  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-primary">{title}</h2>
         {totalCount > 0 && (
           <Button variant="ghost" size="icon" onClick={handleReset} aria-label="Reset progress">
             <RefreshCw className="h-5 w-5" />
           </Button>
         )}
      </div>

      {totalCount > 0 && (
        <div className='mb-4'>
            <Progress value={progress} className="w-full h-2 mb-1" />
             <p className="text-sm text-muted-foreground text-center">
            {completedCount} / {totalCount} completed
          </p>
        </div>
      )}

      {athkarList.length > 0 ? (
        athkarList.map((athkar) => (
          <AthkarItem
            key={athkar.id}
            athkar={athkar}
            isCompleted={!!completedAthkar[athkar.id]} // Ensure boolean value
            onToggleComplete={() => handleToggleComplete(athkar.id)}
          />
        ))
      ) : (
        <p className="text-muted-foreground">لا توجد أذكار في هذه الفئة.</p>
      )}
    </div>
  );
}
