// src/components/athkar-list.tsx
"use client";

import type { Athkar } from '@/types';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { RefreshCw, BookOpen, CheckSquare } from 'lucide-react'; // Keep BookOpen
import { useEffect, useMemo, useState, useCallback } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { cn } from '@/lib/utils';
import { safeJsonParse } from '@/lib/utils';
import { getAthkarListByCategory } from '@/data/athkar'; // Import function to get list data
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

interface AthkarListProps {
  title: string;
  athkarList: Athkar[];
  categoryKey: string; // Unique key for routing and identifying the list
}

type CompletedState = {
  [id: string]: boolean;
};

export function AthkarList({ title, athkarList, categoryKey }: AthkarListProps) {
   // Get the correct storage key using the category key
   const storageKey = useMemo(() => {
     const listData = getAthkarListByCategory(categoryKey);
     // Fallback to categoryKey itself if not found, though it shouldn't happen with valid keys
     return listData?.storageKey ?? categoryKey;
   }, [categoryKey]);

   // Safely load initial completed state from localStorage using the correct storageKey
   const initialCompletedState = safeJsonParse<CompletedState>(storageKey) ?? {};

   const [completedAthkar, setCompletedAthkar] = useLocalStorage<CompletedState>(
       storageKey, // Use the derived storageKey
       initialCompletedState
     );
   const [clientLoaded, setClientLoaded] = useState(false);


   // Ensure localStorage is only accessed client-side after mount
   useEffect(() => {
    setClientLoaded(true);
    // No need to re-fetch initial state here, useLocalStorage handles it.
   }, []); // Only run once on mount

  const totalCount = athkarList.length;

  const completedCount = useMemo(() => {
    if (!clientLoaded || totalCount === 0) return 0; // Don't calculate server-side, before hydration, or if list empty
     if (typeof completedAthkar !== 'object' || completedAthkar === null) {
       return 0;
     }
    return athkarList.filter(athkar => completedAthkar[athkar.id]).length;
  }, [completedAthkar, clientLoaded, athkarList, totalCount]); // Add totalCount and athkarList dependency


   const handleReset = useCallback(() => {
    if (typeof window !== 'undefined') {
        setCompletedAthkar((prev) => {
           const currentPrev = typeof prev === 'object' && prev !== null ? prev : {};
           const newState = { ...currentPrev };
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
     return (
      <Card className="mb-4 animate-pulse">
        <CardHeader>
            <div className="flex justify-between items-center mb-4">
                 <div className="h-7 bg-muted rounded w-1/3"></div>
                 <div className="h-8 w-8 bg-muted rounded-full"></div>
             </div>
        </CardHeader>
        <CardContent>
             <div className='mb-4'>
                <div className="h-3 bg-muted rounded w-full mb-1"></div> {/* Adjusted height */}
                 <div className="h-3 bg-muted rounded w-1/4 mx-auto"></div>
             </div>
        </CardContent>
       </Card>
    );
  }

  if (totalCount === 0) {
      return null;
  }

  return (
    <TooltipProvider>
        <Card className="mb-4 transition-shadow hover:shadow-md">
            <Link href={`/list/${encodeURIComponent(categoryKey)}`} legacyBehavior>
                <a className="block cursor-pointer">
                    <CardHeader>
                        <div className="flex justify-between items-center gap-2">
                          <div className="flex items-center gap-2">
                              {/* Updated Icon Logic - Reverted */}
                              <BookOpen
                                className={cn(
                                  "h-6 w-6",
                                  isComplete ? "text-primary fill-current" : "text-muted-foreground" // Fill when complete
                                )}
                                aria-hidden="true"
                              />
                              <h2 className={cn("text-2xl font-bold", isComplete ? "text-primary" : "text-foreground")}>{title}</h2>
                          </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className='mb-4'>
                              {/* Make progress bar thicker */}
                              <Progress value={progress} className="w-full h-3 mb-1" /> {/* Increased height */}
                              <p className="text-sm text-muted-foreground text-center">
                              {completedCount} / {totalCount}
                            </p>
                          </div>
                    </CardContent>
                </a>
            </Link>
             <CardContent className="pt-2 pb-4 flex justify-end items-center gap-1">
                <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); handleMarkAllComplete(); }}
                    aria-label="Mark all as complete"
                    disabled={isComplete}
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
                        onClick={(e) => { e.stopPropagation(); handleReset(); }}
                        aria-label="Reset progress"
                        className="h-8 w-8"
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
