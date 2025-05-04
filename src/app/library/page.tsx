
"use client"; // Add 'use client' directive

// src/app/library/page.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { allAthkar } from '@/data/athkar'; // Import all Athkar to find the one to add
import { useToast } from "@/hooks/use-toast";
import type { Athkar } from "@/types";
import { useEffect, useState } from "react";

// Key for storing the custom daily Athkar list in localStorage
const CUSTOM_DAILY_ATHKAR_KEY = 'custom_daily_athkar_v1';

export default function LibraryPage() {
  const { toast } = useToast();
  const [libraryAthkar, setLibraryAthkar] = useState<Athkar[]>([]);
  const [customDailyList, setCustomDailyList] = useState<Athkar[]>([]);
  const [clientLoaded, setClientLoaded] = useState(false);

  // Load library and custom list on client mount
  useEffect(() => {
    setLibraryAthkar(allAthkar); // Load the full library

    // Load custom daily list from localStorage
    const storedList = localStorage.getItem(CUSTOM_DAILY_ATHKAR_KEY);
    if (storedList) {
      try {
        setCustomDailyList(JSON.parse(storedList));
      } catch (e) {
        console.error("Failed to parse custom daily list from localStorage", e);
        setCustomDailyList([]); // Reset if parsing fails
      }
    }
    setClientLoaded(true); // Indicate client has loaded
  }, []);

  // Function to add Athkar to the custom daily list
  const handleAddToDaily = (id: string) => {
    if (!clientLoaded) return; // Ensure client is loaded

    const athkarToAdd = libraryAthkar.find((a) => a.id === id);
    if (!athkarToAdd) {
      console.error("Athkar not found in library:", id);
      toast({ title: "خطأ", description: "لم يتم العثور على الذكر.", variant: "destructive" });
      return;
    }

    // Check if the Athkar is already in the custom list
    if (customDailyList.some((a) => a.id === id)) {
      toast({ title: "موجود بالفعل", description: "هذا الذكر موجود بالفعل في قائمتك اليومية." });
      return;
    }

    // Add to the list and save to localStorage
    const updatedList = [...customDailyList, athkarToAdd];
    try {
      localStorage.setItem(CUSTOM_DAILY_ATHKAR_KEY, JSON.stringify(updatedList));
      setCustomDailyList(updatedList); // Update local state
      toast({ title: "تمت الإضافة", description: `"${athkarToAdd.text.substring(0, 20)}..." أضيف إلى قائمتك اليومية.` });
    } catch (e) {
      console.error("Failed to save custom daily list to localStorage", e);
      toast({ title: "خطأ في الحفظ", description: "لم نتمكن من حفظ الذكر في قائمتك.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <header className="text-center py-4">
        <h1 className="text-3xl font-bold text-primary arabic">مكتبة الأذكار</h1>
        <p className="text-muted-foreground mt-1 arabic">استكشف وأضف أذكارًا جديدة ليومك</p>
      </header>

      {/* Optional Search Bar - Future feature
      <div className="relative">
        <Input placeholder="ابحث في المكتبة..." className="pr-10" />
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div> */}

      <div className="space-y-4">
        {clientLoaded && libraryAthkar.map((athkar) => (
          <Card key={athkar.id}>
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <div>
                <p className="arabic text-lg leading-relaxed mb-1">{athkar.text}</p>
                <span className="text-sm text-muted-foreground">
                  (تكرار: {athkar.count}) - {athkar.category}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleAddToDaily(athkar.id)} // Call the implemented handler
                aria-label={`إضافة "${athkar.text.substring(0, 20)}..." إلى قائمة اليوم`}
                // Optional: Disable if already added
                disabled={customDailyList.some(a => a.id === athkar.id)}
              >
                <PlusCircle className={cn(
                    "h-5 w-5",
                    customDailyList.some(a => a.id === athkar.id) ? "text-muted-foreground" : "text-primary"
                 )} />
              </Button>
            </CardContent>
          </Card>
        ))}
         {!clientLoaded && (
           // Optional: Show skeletons or loading indicator while loading
           <div className="text-center py-10 text-muted-foreground">جاري تحميل المكتبة...</div>
         )}
         {clientLoaded && libraryAthkar.length === 0 && (
           <p className="text-muted-foreground text-center py-10">المكتبة فارغة حالياً.</p>
         )}
      </div>
    </div>
  );
}
