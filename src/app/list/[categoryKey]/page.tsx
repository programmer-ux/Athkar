// src/app/list/[categoryKey]/page.tsx
"use client";

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Use next/navigation for App Router
import { AthkarItem } from '@/components/athkar-item';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, RefreshCw, CheckSquare } from 'lucide-react';
import { getAthkarListByCategory, type AthkarListData } from '@/data/athkar';
import useLocalStorage from '@/hooks/use-local-storage';
import { safeJsonParse } from '@/lib/utils';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type CompletedState = {
  [id: string]: boolean;
};

// Function to get storage key synchronously
const getStorageKey = (categoryKey: string | null): string => {
  if (!categoryKey) return 'temp_completion_invalid_key'; // Fallback for invalid key
  const data = getAthkarListByCategory(categoryKey);
  return data?.storageKey ?? `custom_list_completed_${categoryKey}`; // Use defined key or generate one
};


export default function AthkarListPage() {
  const params = useParams();
  const router = useRouter();
  const categoryKey = params.categoryKey ? decodeURIComponent(params.categoryKey as string) : null;

  // Derive storageKey synchronously based on the categoryKey param
  const storageKey = useMemo(() => getStorageKey(categoryKey), [categoryKey]);

  const [listData, setListData] = useState<AthkarListData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [clientLoaded, setClientLoaded] = useState(false);

  // State for completion, now managed within this page using the derived storageKey
  // useLocalStorage will handle loading the initial value from storage based on the key
  const [completedAthkar, setCompletedAthkar] = useLocalStorage<CompletedState>(
      storageKey, // Use the derived storageKey
      {} // Initial value if nothing is in storage
    );

  // Effect to load the list data (title, items)
  useEffect(() => {
    setClientLoaded(true); // Indicate client has mounted
    if (categoryKey) {
      const data = getAthkarListByCategory(categoryKey);
      setListData(data);
    }
    setIsLoading(false);
  }, [categoryKey]); // Re-run only if categoryKey changes

  // Removed the second useEffect that tried to sync completedAthkar,
  // as useLocalStorage should handle the initial load correctly.

  const totalCount = listData?.list.length ?? 0;

  const completedCount = useMemo(() => {
    // Calculate only after client load and list data is available
    if (!clientLoaded || !listData || totalCount === 0 || typeof completedAthkar !== 'object' || completedAthkar === null) {
      return 0;
    }
    // Filter the list items based on the IDs present in the completedAthkar state
    return listData.list.filter(athkar => completedAthkar[athkar.id]).length;
  }, [completedAthkar, clientLoaded, listData, totalCount]);


   const handleToggleComplete = useCallback((id: string) => {
    // Ensure listData is loaded before attempting to toggle
    if (typeof window !== 'undefined' && listData) {
        setCompletedAthkar((prev) => {
           const currentPrev = typeof prev === 'object' && prev !== null ? prev : {};
           // Only toggle if the item exists in the current list
           if (listData.list.some(a => a.id === id)) {
             return {
                 ...currentPrev,
                 [id]: !currentPrev[id], // Toggle state
             };
           }
           return currentPrev; // Return unchanged if ID doesn't belong to this list
         });
    }
  }, [setCompletedAthkar, listData]);

   const handleReset = useCallback(() => {
    // Ensure listData is loaded before attempting to reset
    if (typeof window !== 'undefined' && listData) {
        setCompletedAthkar((prev) => {
           const currentPrev = typeof prev === 'object' && prev !== null ? prev : {};
           const newState = { ...currentPrev };
           // Set completion to false only for items belonging to this list
           listData.list.forEach(athkar => {
               newState[athkar.id] = false;
           });
           return newState;
         });
    }
  }, [setCompletedAthkar, listData]);

  const handleMarkAllComplete = useCallback(() => {
    // Ensure listData is loaded before attempting to mark all
    if (typeof window !== 'undefined' && listData) {
      setCompletedAthkar((prev) => {
        const currentPrev = typeof prev === 'object' && prev !== null ? prev : {};
        const newState = { ...currentPrev };
         // Set completion to true only for items belonging to this list
        listData.list.forEach(athkar => {
          newState[athkar.id] = true;
        });
        return newState;
      });
    }
  }, [setCompletedAthkar, listData]);

  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const isComplete = clientLoaded && totalCount > 0 && completedCount >= totalCount;


  if (isLoading || !clientLoaded) {
    // Keep Skeleton loading state
    return (
       <div className="space-y-6 p-4">
            <Skeleton className="h-8 w-1/4" /> {/* Back button */}
            <Skeleton className="h-10 w-3/4" /> {/* Title */}
            <Skeleton className="h-2 w-full" /> {/* Progress */}
            <Skeleton className="h-4 w-1/4 mx-auto" /> {/* Count */}
            <div className="space-y-4 pt-4">
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg" />
            </div>
       </div>
    );
  }

  if (!listData) {
     // Keep error state for missing list data
    return (
      <div className="space-y-6 p-4 text-center">
         <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="العودة للقائمة السابقة">
            <ArrowRight className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold text-destructive arabic">لم يتم العثور على القائمة</h1>
        <p className="text-muted-foreground arabic">لم نتمكن من تحميل الأذكار لهذه الفئة.</p>
        <Button onClick={() => router.push('/')}>العودة للصفحة الرئيسية</Button>
      </div>
    );
  }

  // Render the actual page content
  return (
     <TooltipProvider>
        <div className="space-y-4 p-4">
             <div className="flex items-center justify-between mb-4">
                  {/* Back Button */}
                  <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="العودة للقائمة السابقة">
                      <ArrowRight className="h-6 w-6" />
                  </Button>
                  {/* Action Buttons */}
                  <div className="flex items-center gap-1">
                      {/* Mark All Complete Button */}
                      <Tooltip>
                          <TooltipTrigger asChild>
                          <Button
                              variant="ghost"
                              size="icon"
                              onClick={handleMarkAllComplete}
                              aria-label="وضع علامة مكتمل للكل"
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
                      {/* Reset Button */}
                       <Tooltip>
                          <TooltipTrigger asChild>
                              <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={handleReset}
                                  aria-label="إعادة تعيين التقدم"
                                  className="h-8 w-8"
                              >
                                  <RefreshCw className="h-5 w-5" />
                              </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                              <p>إعادة تعيين</p>
                          </TooltipContent>
                      </Tooltip>
                  </div>
             </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-primary arabic text-center">{listData.title}</h1>

            {/* Progress Bar and Count */}
            {totalCount > 0 && (
            <div className='mb-4'>
                <Progress value={progress} className="w-full h-2 mb-1" />
                <p className="text-sm text-muted-foreground text-center">
                    {completedCount} / {totalCount}
                </p>
            </div>
            )}

            {/* Athkar Items */}
            <div className="space-y-4 pt-4">
                {listData.list.length > 0 ? (
                // Map through the listData items
                listData.list.map((athkar) => (
                    <AthkarItem
                    key={`${storageKey}-${athkar.id}`} // Ensure unique key using storageKey
                    athkar={athkar}
                    // Pass the completion state from the hook
                    isCompleted={!!(completedAthkar && completedAthkar[athkar.id])}
                    onToggleComplete={handleToggleComplete}
                    />
                ))
                ) : (
                <p className="text-muted-foreground text-center arabic">لا توجد أذكار في هذه القائمة.</p>
                )}
            </div>
        </div>
    </TooltipProvider>
  );
}
