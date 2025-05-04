
// src/app/favorites/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartOff } from "lucide-react"; // Icon for removing favorite
import { Button } from "@/components/ui/button";

// Placeholder data - replace with actual favorited Athkar fetching logic
const favoriteAthkar = [
  { id: 'm1', text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ...', count: 1, category: 'Morning', reference: 'مسلم' },
  { id: 'e3', text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ...', count: 3, category: 'Evening', reference: 'مسلم' },
];

export default function FavoritesPage() {
   // Placeholder function - implement logic to remove from favorites
  const handleRemoveFavorite = (id: string) => {
    console.log("Remove favorite:", id);
    // TODO: Implement removing logic (e.g., update localStorage)
  };

  return (
    <div className="space-y-6">
      <header className="text-center py-4">
        <h1 className="text-3xl font-bold text-primary arabic">الأذكار المفضلة</h1>
        <p className="text-muted-foreground mt-1 arabic">الأذكار التي قمت بحفظها</p>
      </header>

      <div className="space-y-4">
        {favoriteAthkar.map((athkar) => (
          <Card key={athkar.id}>
            <CardContent className="p-4 flex items-center justify-between gap-4">
               <div>
                <p className="arabic text-lg leading-relaxed mb-1">{athkar.text}</p>
                 <span className="text-sm text-muted-foreground">
                   (تكرار: {athkar.count}) - {athkar.reference || athkar.category}
                 </span>
               </div>
               <Button
                 variant="ghost"
                 size="icon"
                 onClick={() => handleRemoveFavorite(athkar.id)}
                 aria-label={`إزالة "${athkar.text.substring(0, 20)}..." من المفضلة`}
               >
                 <HeartOff className="h-5 w-5 text-destructive" />
               </Button>
             </CardContent>
          </Card>
        ))}
      </div>

      {favoriteAthkar.length === 0 && (
        <div className="text-center py-10">
          <HeartOff className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">لم تقم بإضافة أي أذكار للمفضلة بعد.</p>
          {/* Optional: Add a link/button to browse the library */}
          {/* <Button variant="link" asChild className="mt-4">
            <Link href="/library">تصفح المكتبة</Link>
          </Button> */}
        </div>
      )}
    </div>
  );
}
