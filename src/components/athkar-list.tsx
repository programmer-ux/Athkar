"use client";

import type { Athkar } from '@/types';
// Removed AthkarItem import
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { RefreshCw, Circle, CheckCircle2, CheckSquare, ArrowLeft } from 'lucide-react'; // Added ArrowLeft
import { useEffect, useMemo, useState, useCallback } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { cn } from '@/lib/utils';
import { safeJsonParse } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from 'next/link'; // Import Link
import { Card, CardContent, CardHeader } from '@/components/ui/card'; // Import Card components

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
    if (!clientLoaded || totalCount === 0) return 0; // Don't calculate server-side, before hydration, or if list empty
    // Ensure completedAthkar is an object before trying to access values
     if (typeof completedAthkar !== 'object' || completedAthkar === null) {
       return 0;
     }
    // Filter the list based on IDs present and true in the completion state
    return athkarList.filter(athkar => completedAthkar[athkar.id]).length;
  }, [completedAthkar, clientLoaded, athkarList, totalCount]); // Add totalCount and athkarList dependency

  // Note: handleToggleComplete is now handled on the detail page
  // const handleToggleComplete = useCallback(...)

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
      <Card className="mb-8 animate-pulse">
        <CardHeader>
            <div className="flex justify-between items-center mb-4">
                 <div className="h-7 bg-muted rounded w-1/3"></div>
                 <div className="h-8 w-8 bg-muted rounded-full"></div>
             </div>
        </CardHeader>
        <CardContent>
             <div className='mb-4'>
                <div className="h-2 bg-muted rounded w-full mb-1"></div>
                 <div className="h-3 bg-muted rounded w-1/4 mx-auto"></div>
             </div>
        </CardContent>
       </Card>
    );
  }

  // Don't render the list if it's empty
  if (totalCount === 0) {
      return null;
  }

  return (
    <TooltipProvider> {/* Wrap with TooltipProvider */}
        <Card className="mb-4 transition-shadow hover:shadow-md">
            <Link href={`/list/${encodeURIComponent(categoryKey)}`} legacyBehavior>
                <a className="block cursor-pointer">
                    <CardHeader>
                        <div className="flex justify-between items-center gap-2"> {/* Added gap */}
                          <div className="flex items-center gap-2"> {/* Wrapper for title and icon */}
                              {isComplete ? (
                                  <CheckCircle2 className="h-6 w-6 text-primary" /> // Checkmark icon when complete, purple color
                              ) : (
                                  <Circle className="h-6 w-6 text-muted-foreground" /> // Circle icon when incomplete
                              )}
                              <h2 className="text-2xl font-bold text-primary">{title}</h2>
                          </div>
                          {/* Controls moved outside the link to prevent nested interactive elements */}
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        {/* Progress Bar and Count */}
                        <div className='mb-4'>
                              <Progress value={progress} className="w-full h-2 mb-1" />
                              <p className="text-sm text-muted-foreground text-center">
                              {completedCount} / {totalCount}
                            </p>
                          </div>
                         {/* Removed AthkarItem mapping */}
                         {/* <p className="text-sm text-muted-foreground text-center">اضغط لعرض الأذكار</p> */}
                    </CardContent>
                </a>
            </Link>
             {/* Action Buttons - Placed outside the Link but within the Card */}
             <CardContent className="pt-2 pb-4 flex justify-end items-center gap-1">
                <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); handleMarkAllComplete(); }} // Prevent link navigation
                    aria-label="Mark all as complete"
                    disabled={isComplete} // Disable if already complete
                    className={cn("h-8 w-8", isComplete ? "text-muted-foreground" : "text-primary hover:text-primary/80")}
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
                        onClick={(e) => { e.stopPropagation(); handleReset(); }} // Prevent link navigation
                        aria-label="Reset progress"
                        className="h-8 w-8" // Smaller button
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
            </CardContent>
        </Card>
    </TooltipProvider>
  );
}
