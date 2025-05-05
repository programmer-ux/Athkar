// src/app/list/[categoryKey]/page.tsx
"use client";

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Use next/navigation for App Router
import { AthkarItem } from '@/components/athkar-item';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, RefreshCw, CheckSquare } from 'lucide-react'; // Changed ArrowLeft to ArrowRight
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

export default function AthkarListPage() {
  const params = useParams();
  const router = useRouter();
  const categoryKey = params.categoryKey ? decodeURIComponent(params.categoryKey as string) : null;

  const [listData, setListData] = useState<AthkarListData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [clientLoaded, setClientLoaded] = useState(false);

  // State for completion, now managed within this page
   const [completedAthkar, setCompletedAthkar] = useLocalStorage<CompletedState>(
       listData?.storageKey ?? `temp_completion_${categoryKey}`, // Use storageKey from listData or a temporary one
       {} // Initialize empty, will be overwritten by effect if data loads
     );

  useEffect(() => {
    setClientLoaded(true);
    if (categoryKey) {
      const data = getAthkarListByCategory(categoryKey);
      setListData(data);
      if (data) {
        // Once listData is available, update the localStorage hook's key and initial value
        const initialCompleted = safeJsonParse<CompletedState>(data.storageKey) ?? {};
        // This seems redundant with useLocalStorage's initializer, but ensures it uses the *correct* key
        // We might need a way to update the key of useLocalStorage if it changes, or manage this differently.
        // For now, we rely on useLocalStorage picking up the initial value correctly based on the updated key used in its definition.
      }
    }
    setIsLoading(false);
  }, [categoryKey]); // Re-run if categoryKey changes

  // Re-initialize useLocalStorage when listData (and thus storageKey) is loaded
  // This is a bit complex due to useLocalStorage hook structure.
  // A potentially cleaner way might involve a wrapper component or context.
  // Let's try updating the state directly after loading listData
  useEffect(() => {
      if (listData && clientLoaded) {
          const initialCompleted = safeJsonParse<CompletedState>(listData.storageKey) ?? {};
          setCompletedAthkar(initialCompleted);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listData, clientLoaded]); // Only run when listData or clientLoaded status changes


  const totalCount = listData?.list.length ?? 0;

  const completedCount = useMemo(() => {
    if (!clientLoaded || !listData || totalCount === 0) return 0;
     if (typeof completedAthkar !== 'object' || completedAthkar === null) {
       return 0;
     }
    return listData.list.filter(athkar => completedAthkar[athkar.id]).length;
  }, [completedAthkar, clientLoaded, listData, totalCount]);

   const handleToggleComplete = useCallback((id: string) => {
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
    if (typeof window !== 'undefined' && listData) {
        setCompletedAthkar((prev) => {
           const currentPrev = typeof prev === 'object' && prev !== null ? prev : {};
           const newState = { ...currentPrev };
           listData.list.forEach(athkar => {
               newState[athkar.id] = false;
           });
           return newState;
         });
    }
  }, [setCompletedAthkar, listData]);

  const handleMarkAllComplete = useCallback(() => {
    if (typeof window !== 'undefined' && listData) {
      setCompletedAthkar((prev) => {
        const currentPrev = typeof prev === 'object' && prev !== null ? prev : {};
        const newState = { ...currentPrev };
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
    return (
      <div className="space-y-6 p-4 text-center">
         <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="العودة للقائمة السابقة"> {/* Changed aria-label */}
            <ArrowRight className="h-6 w-6" /> {/* Changed Icon */}
        </Button>
        <h1 className="text-2xl font-bold text-destructive arabic">لم يتم العثور على القائمة</h1>
        <p className="text-muted-foreground arabic">لم نتمكن من تحميل الأذكار لهذه الفئة.</p>
        <Button onClick={() => router.push('/')}>العودة للصفحة الرئيسية</Button>
      </div>
    );
  }

  return (
     <TooltipProvider>
        <div className="space-y-4 p-4">
             <div className="flex items-center justify-between mb-4">
                  <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="العودة للقائمة السابقة"> {/* Changed aria-label */}
                      <ArrowRight className="h-6 w-6" /> {/* Changed Icon */}
                  </Button>
                  <div className="flex items-center gap-1">
                      <Tooltip>
                          <TooltipTrigger asChild>
                          <Button
                              variant="ghost"
                              size="icon"
                              onClick={handleMarkAllComplete}
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
                                  onClick={handleReset}
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
                  </div>
             </div>

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
                listData.list.map((athkar) => (
                    <AthkarItem
                    key={`${listData.storageKey}-${athkar.id}`} // Unique key
                    athkar={athkar}
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
