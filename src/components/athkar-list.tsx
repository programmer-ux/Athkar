
"use client";

import type { Athkar } from '@/types';
import { AthkarItem } from './athkar-item';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useEffect, useMemo, useState, useCallback } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';

interface AthkarListProps {
  title: string;
  athkarList: Athkar[];
  categoryKey: string; // Unique key for localStorage, e.g., 'morning_completed'
  onComplete?: () => void; // Optional callback when list is completed
}

type CompletedState = {
  [id: string]: boolean;
};

export function AthkarList({ title, athkarList, categoryKey, onComplete }: AthkarListProps) {
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
  }, []); // Only run once on mount

  const totalCount = athkarList.length;

  const completedCount = useMemo(() => {
    if (!clientLoaded) return 0; // Don't calculate server-side or before hydration
    return Object.values(completedAthkar).filter(Boolean).length;
  }, [completedAthkar, clientLoaded]);

  // Effect to check for completion and call onComplete
  useEffect(() => {
    if (clientLoaded && totalCount > 0 && completedCount >= totalCount) {
      onComplete?.(); // Call the callback if provided
    }
    // Intentionally disable onComplete dependency warning if it causes issues,
    // as its identity should ideally be stable or handled carefully if it changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedCount, totalCount, clientLoaded]); // Re-run when counts or loaded status change

   const handleToggleComplete = useCallback((id: string) => {
     // Ensure update happens only on client
    if (typeof window !== 'undefined') {
        setCompletedAthkar((prev) => ({
         ...prev,
         [id]: !prev[id], // Toggle state
        }));
    }
  }, [setCompletedAthkar]); // Add setCompletedAthkar dependency

   const handleReset = useCallback(() => {
    if (typeof window !== 'undefined') {
        setCompletedAthkar({});
        // Optionally, if the parent needs to know about the reset (e.g., to make it visible again)
        // you might need another callback here. But for simple reset, this is enough.
    }
  }, [setCompletedAthkar]); // Add setCompletedAthkar dependency


  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

   if (!clientLoaded) {
    // Render a loading state or placeholder until client hydration is complete
     return (
      <div className="mb-8 animate-pulse">
        <div className="flex justify-between items-center mb-4">
             <div className="h-7 bg-muted rounded w-1/3"></div>
             <div className="h-8 w-8 bg-muted rounded-full"></div>
         </div>
         <div className='mb-4'>
            <div className="h-2 bg-muted rounded w-full mb-1"></div>
             <div className="h-3 bg-muted rounded w-1/4 mx-auto"></div>
         </div>
        <div className="space-y-4">
            <div className="h-20 bg-muted rounded-lg w-full"></div>
            <div className="h-20 bg-muted rounded-lg w-full"></div>
            <div className="h-20 bg-muted rounded-lg w-full"></div>
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
            key={`${categoryKey}-${athkar.id}`} // Use a more unique key involving categoryKey
            athkar={athkar}
            isCompleted={!!completedAthkar[athkar.id]} // Ensure boolean value
            onToggleComplete={handleToggleComplete} // Pass the memoized handler
          />
        ))
      ) : (
        <p className="text-muted-foreground">لا توجد أذكار في هذه الفئة.</p>
      )}
    </div>
  );
}
