
// src/app/library/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

// Placeholder data - replace with actual library Athkar fetching logic
const libraryAthkar = [
  { id: 'lib1', text: 'ذكر للمكتبة ١', count: 5, category: 'General' },
  { id: 'lib2', text: 'ذكر للمكتبة ٢', count: 1, category: 'Prayer' },
  { id: 'lib3', text: 'ذكر للمكتبة ٣', count: 10, category: 'General' },
  { id: 'lib4', text: 'ذكر آخر طويل للمكتبة رقم أربعة', count: 3, category: 'Sleep' },
  { id: 'lib5', text: 'هذا ذكر خامس تجريبي', count: 7, category: 'General' },
];

export default function LibraryPage() {
  // Placeholder function - implement logic to add to daily list
  const handleAddToDaily = (id: string) => {
    console.log("Add to daily:", id);
    // TODO: Implement adding logic (e.g., update localStorage)
  };

  return (
    <div className="space-y-6">
      <header className="text-center py-4">
        <h1 className="text-3xl font-bold text-primary arabic">مكتبة الأذكار</h1>
        <p className="text-muted-foreground mt-1 arabic">استكشف وأضف أذكارًا جديدة ليومك</p>
      </header>

      {/* Optional Search Bar */}
      {/* <div className="relative">
        <Input placeholder="ابحث في المكتبة..." className="pr-10" />
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div> */}

      <div className="space-y-4">
        {libraryAthkar.map((athkar) => (
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
                onClick={() => handleAddToDaily(athkar.id)}
                aria-label={`إضافة "${athkar.text.substring(0, 20)}..." إلى قائمة اليوم`}
              >
                <PlusCircle className="h-5 w-5 text-primary" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

       {libraryAthkar.length === 0 && (
         <p className="text-muted-foreground text-center py-10">المكتبة فارغة حالياً.</p>
       )}
    </div>
  );
}
