
"use client";

import type { Athkar } from '@/types';
import { AthkarItem } from './athkar-item';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { RefreshCw, Circle, CheckCircle2 } from 'lucide-react'; // Added Circle and CheckCircle2 icons
import { useEffect, useMemo, useState, useCallback } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { cn } from '@/lib/utils'; // Import cn for conditional classes
import { safeJsonParse } from '@/lib/utils'; // Import safeJsonParse

interface AthkarListProps {
  title: string;
  athkarList: Athkar[];
  categoryKey: string; // Unique key for localStorage, e.g., 'morning_completed'
  // Removed onComplete prop
}

type CompletedState = {
  [id: string]: boolean;
};

export function AthkarList({ title, athkarList, categoryKey }: AthkarListProps) {
   // Safely load initial completed state from localStorage
   const initialCompletedState = safeJsonParse<CompletedState>(categoryKey) ?? {};

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
    // Ensure completedAthkar is an object before trying to access values
     if (typeof completedAthkar !== 'object' || completedAthkar === null) {
       return 0;
     }
    return Object.values(completedAthkar).filter(Boolean).length;
  }, [completedAthkar, clientLoaded]);

  // Removed useEffect that called onComplete

   const handleToggleComplete = useCallback((id: string) => {
     // Ensure update happens only on client
    if (typeof window !== 'undefined') {
        setCompletedAthkar((prev) => {
           // Ensure prev is an object
           const currentPrev = typeof prev === 'object' && prev !== null ? prev : {};
           return {
               ...currentPrev,
               [id]: !currentPrev[id], // Toggle state
           };
         });
    }
  }, [setCompletedAthkar]); // Add setCompletedAthkar dependency

   const handleReset = useCallback(() => {
    if (typeof window !== 'undefined') {
        setCompletedAthkar({});
    }
  }, [setCompletedAthkar]); // Add setCompletedAthkar dependency


  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const isComplete = clientLoaded && totalCount > 0 && completedCount >= totalCount;

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
        <div className="flex items-center gap-2"> {/* Wrapper for title and icon */}
            {isComplete ? (
                 <CheckCircle2 className="h-6 w-6 text-primary" /> // Checkmark icon when complete, purple color
             ) : (
                 <Circle className="h-6 w-6 text-muted-foreground" /> // Circle icon when incomplete
            )}
            <h2 className="text-2xl font-bold text-primary">{title}</h2>
        </div>
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
            // Ensure completedAthkar exists and has the id property before accessing
            isCompleted={!!(completedAthkar && completedAthkar[athkar.id])}
            onToggleComplete={handleToggleComplete} // Pass the memoized handler
          />
        ))
      ) : (
        <p className="text-muted-foreground">لا توجد أذكار في هذه الفئة.</p>
      )}
    </div>
  );
}
