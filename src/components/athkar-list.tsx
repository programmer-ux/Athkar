
"use client";

import type { Athkar } from '@/types';
import { AthkarItem } from './athkar-item';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { RefreshCw, Circle, CheckCircle2, CheckSquare } from 'lucide-react'; // Added CheckSquare
import { useEffect, useMemo, useState, useCallback } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { cn } from '@/lib/utils'; // Import cn for conditional classes
import { safeJsonParse } from '@/lib/utils'; // Import safeJsonParse
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Import Tooltip components

interface AthkarListProps {
  title: string;
  athkarList: Athkar[];
  categoryKey: string; // Unique key for localStorage, e.g., 'morning_completed'
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
    // Filter the list based on IDs present and true in the completion state
    return athkarList.filter(athkar => completedAthkar[athkar.id]).length;
  }, [completedAthkar, clientLoaded, athkarList]); // Depend on athkarList as well

   const handleToggleComplete = useCallback((id: string) => {
     // Ensure update happens only on client
    if (typeof window !== 'undefined') {
        setCompletedAthkar((prev) => {
           // Ensure prev is an object
           const currentPrev = typeof prev === 'object' && prev !== null ? prev : {};
           // Only toggle if the item exists in the current list
           if (athkarList.some(a => a.id === id)) {
             return {
                 ...currentPrev,
                 [id]: !currentPrev[id], // Toggle state
             };
           }
           return currentPrev; // Return unchanged if ID doesn't belong to this list
         });
    }
  }, [setCompletedAthkar, athkarList]); // Add athkarList dependency

   const handleReset = useCallback(() => {
    if (typeof window !== 'undefined') {
        setCompletedAthkar((prev) => {
           // Ensure prev is an object
           const currentPrev = typeof prev === 'object' && prev !== null ? prev : {};
           const newState = { ...currentPrev };
           // Reset only the items belonging to this list
           athkarList.forEach(athkar => {
               newState[athkar.id] = false;
           });
           return newState;
         });
    }
  }, [setCompletedAthkar, athkarList]); // Add athkarList dependency

  const handleMarkAllComplete = useCallback(() => {
    if (typeof window !== 'undefined') {
      setCompletedAthkar((prev) => {
        const currentPrev = typeof prev === 'object' && prev !== null ? prev : {};
        const newState = { ...currentPrev };
        // Mark all items belonging to this list as complete
        athkarList.forEach(athkar => {
          newState[athkar.id] = true;
        });
        return newState;
      });
    }
  }, [setCompletedAthkar, athkarList]);


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
    <TooltipProvider> {/* Wrap with TooltipProvider */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 gap-2"> {/* Added gap */}
          <div className="flex items-center gap-2"> {/* Wrapper for title and icon */}
              {isComplete ? (
                  <CheckCircle2 className="h-6 w-6 text-primary" /> // Checkmark icon when complete, purple color
              ) : (
                  <Circle className="h-6 w-6 text-muted-foreground" /> // Circle icon when incomplete
              )}
              <h2 className="text-2xl font-bold text-primary">{title}</h2>
          </div>
          {totalCount > 0 && (
            <div className="flex items-center gap-1"> {/* Wrapper for buttons */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleMarkAllComplete}
                    aria-label="Mark all as complete"
                    disabled={isComplete} // Disable if already complete
                    className={cn(isComplete ? "text-muted-foreground" : "text-primary hover:text-primary/80")}
                  >
                    <CheckSquare className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>وضع علامة "مكتمل"</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleReset}
                      aria-label="Reset progress"
                      // Optionally disable reset if nothing is completed
                      // disabled={completedCount === 0}
                  >
                      <RefreshCw className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>إعادة تعيين</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>

        {totalCount > 0 && (
          <div className='mb-4'>
              <Progress value={progress} className="w-full h-2 mb-1" />
              <p className="text-sm text-muted-foreground text-center">
              {completedCount} / {totalCount}
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
    </TooltipProvider>
  );
}
