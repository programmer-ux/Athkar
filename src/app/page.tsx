import { AthkarList } from '@/components/athkar-list';
import { morningAthkar, eveningAthkar } from '@/data/athkar'; // Import the data
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <div className="space-y-8">
       <header className="text-center py-6">
         {/* Replace with a proper logo/icon if available */}
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 mx-auto text-primary mb-2">
           <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
         </svg>

         <h1 className="text-3xl font-bold text-primary arabic">زاد - أذكار اليوم والليلة</h1>
         <p className="text-muted-foreground mt-1 arabic">مهام يومية بسيطة لأذكارك الصحيحة</p>
       </header>

       <AthkarList
         title="أذكار الصباح"
         athkarList={morningAthkar}
         categoryKey="morning_completed_v1" // Unique key for morning Athkar completion state
       />

       <Separator className="my-6" />

       <AthkarList
         title="أذكار المساء"
         athkarList={eveningAthkar}
         categoryKey="evening_completed_v1" // Unique key for evening Athkar completion state
       />

       <footer className="text-center text-xs text-muted-foreground py-4 mt-8">
         <p>تطبيق مجاني بدون إعلانات. تم إضافة الأحاديث الصحيحة فقط (بإذن الله).</p>
         <p>&copy; {new Date().getFullYear()} AthkarPal</p>
       </footer>
    </div>
  );
}
