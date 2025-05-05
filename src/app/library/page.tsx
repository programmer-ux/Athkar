
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, CheckCircle } from "lucide-react";
import { libraryCategories } from '@/data/athkar'; // Import the structured library categories
import { useToast } from "@/hooks/use-toast";
import type { Athkar } from "@/types";
import { useEffect, useState } from "react";
import { cn } from '@/lib/utils';
import { safeJsonParse } from "@/lib/utils"; // Import safeJsonParse

// Key for storing the custom daily Athkar list in localStorage
const CUSTOM_DAILY_ATHKAR_KEY = 'custom_daily_athkar_v1';

export default function LibraryPage() {
  const { toast } = useToast();
  const [customDailyList, setCustomDailyList] = useState<Athkar[]>([]);
  const [clientLoaded, setClientLoaded] = useState(false);

  // Load custom list on client mount
  useEffect(() => {
    // Load custom daily list from localStorage using safeJsonParse
    const loadedList = safeJsonParse<Athkar[]>(CUSTOM_DAILY_ATHKAR_KEY) ?? [];
    setCustomDailyList(loadedList);
    setClientLoaded(true); // Indicate client has loaded
  }, []);

  // Function to add all Athkar from a category/list to the custom daily list
  const handleAddListToDaily = (categoryKey: string) => {
    if (!clientLoaded) return; // Ensure client is loaded

    const categoryData = libraryCategories[categoryKey];
    if (!categoryData) {
      console.error("Category not found in library:", categoryKey);
      toast({ title: "خطأ", description: "لم يتم العثور على هذه المجموعة.", variant: "destructive" });
      return;
    }

    const listToAdd = categoryData.list;
    const currentCustomIds = new Set(customDailyList.map(a => a.id));
    const newItemsToAdd = listToAdd.filter(item => !currentCustomIds.has(item.id));

    if (newItemsToAdd.length === 0) {
      toast({ title: "موجودة بالفعل", description: `جميع أذكار "${categoryData.title}" موجودة بالفعل في قائمتك اليومية.` });
      return;
    }

    // Add only the new items to the list and save to localStorage
    const updatedList = [...customDailyList, ...newItemsToAdd];
    try {
      localStorage.setItem(CUSTOM_DAILY_ATHKAR_KEY, JSON.stringify(updatedList));
      setCustomDailyList(updatedList); // Update local state
      toast({ title: "تمت الإضافة", description: `تمت إضافة ${newItemsToAdd.length} ${newItemsToAdd.length === 1 ? 'ذكر' : 'أذكار'} من "${categoryData.title}" إلى قائمتك اليومية.` });
    } catch (e) {
      console.error("Failed to save custom daily list to localStorage", e);
      toast({ title: "خطأ في الحفظ", description: "لم نتمكن من حفظ الأذكار في قائمتك.", variant: "destructive" });
    }
  };

   // Check if all items from a specific list are already in the custom list
   const isListAlreadyAdded = (categoryKey: string): boolean => {
    if (!clientLoaded) return false;
    const categoryData = libraryCategories[categoryKey];
    if (!categoryData) return false;
    const customIds = new Set(customDailyList.map(a => a.id));
    return categoryData.list.every(item => customIds.has(item.id));
  };


  return (
    <div className="space-y-6">
      <header className="text-center py-4">
        <h1 className="text-3xl font-bold text-primary arabic">مكتبة الأذكار</h1>
        <p className="text-muted-foreground mt-1 arabic">استكشف وأضف مجموعات أذكار جديدة ليومك</p>
      </header>

      <div className="space-y-4">
        {clientLoaded && Object.entries(libraryCategories).map(([key, categoryData]) => {
          const alreadyAdded = isListAlreadyAdded(key);
          return (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="arabic flex items-center justify-between">
                  {categoryData.title}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleAddListToDaily(key)}
                    aria-label={`إضافة مجموعة "${categoryData.title}" إلى قائمة اليوم`}
                    disabled={alreadyAdded}
                  >
                    {alreadyAdded ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <PlusCircle className="h-6 w-6 text-primary" />
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              {/* We don't display individual items here, just the list title and add button */}
               {/* Optional: Add a description or count if desired
               <CardContent>
                 <p className="text-sm text-muted-foreground">
                   تحتوي هذه المجموعة على {categoryData.list.length} أذكار.
                 </p>
               </CardContent>
               */}
            </Card>
          );
        })}

        {!clientLoaded && (
           <div className="text-center py-10 text-muted-foreground">جاري تحميل المكتبة...</div>
        )}
        {clientLoaded && Object.keys(libraryCategories).length === 0 && (
           <p className="text-muted-foreground text-center py-10">المكتبة فارغة حالياً.</p>
         )}
      </div>
    </div>
  );
}
