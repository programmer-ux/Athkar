
// src/app/settings/page.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Github, Mail, Info, MessageSquare } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle"; // Re-use existing toggles
import { NotificationToggle } from "@/components/notification-toggle"; // Re-use existing toggles
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const appVersion = "1.0.0"; // Replace with dynamic version later if needed

  return (
    <div className="space-y-8">
      <header className="text-center py-4">
        <h1 className="text-3xl font-bold text-primary arabic">الإعدادات والمعلومات</h1>
      </header>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle>المظهر</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme-toggle-button" className="text-base">السمة (فاتح/داكن)</Label>
             {/* Use existing ThemeToggle component */}
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
       <Card>
        <CardHeader>
          <CardTitle>الإشعارات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center justify-between">
             <Label htmlFor="notification-toggle-button" className="text-base">تذكيرات الأذكار</Label>
             {/* Use existing NotificationToggle component */}
             <NotificationToggle />
           </div>
           <CardDescription>
             سيتم إرسال تذكيرات لأذكار الصباح (حوالي 7ص) والمساء (حوالي 7م) حسب توقيت جهازك. تأكد من السماح بالإشعارات للمتصفح.
           </CardDescription>
         </CardContent>
       </Card>


      {/* App Information */}
      <Card>
        <CardHeader>
          <CardTitle>عن التطبيق</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">الإصدار</span>
            <span>{appVersion}</span>
          </div>
          <Separator />
          <p className="text-sm text-muted-foreground leading-relaxed arabic">
            زاد - أذكار اليوم والليلة هو تطبيق بسيط لمساعدتك على قراءة أذكارك اليومية بانتظام. تم تطويره ليكون مجانيًا وبدون إعلانات ويعمل دون الحاجة للاتصال بالإنترنت (بعد التحميل الأول).
            نسعى لإضافة الأحاديث الصحيحة والموثوقة فقط.
          </p>
          <div className="flex items-center justify-center space-x-4 space-x-reverse pt-2">
            {/* Add relevant links here */}
            <Link href="https://github.com/your-repo/athkarpal" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="h-6 w-6" />
              <span className="sr-only">GitHub Repository</span>
            </Link>
             {/* Add other links like Privacy Policy if available */}
             {/* <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
               <Info className="h-6 w-6" />
               <span className="sr-only">Privacy Policy</span>
             </Link> */}
          </div>
        </CardContent>
      </Card>

      {/* Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>ملاحظات واقتراحات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground arabic">
            نرحب بملاحظاتك واقتراحاتك لتحسين التطبيق.
          </p>
          <div className="flex items-center justify-center space-x-6 space-x-reverse pt-2">
            <Link href="mailto:your-email@example.com" className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors">
              <Mail className="h-7 w-7 mb-1" />
              <span className="text-xs">البريد الإلكتروني</span>
            </Link>
            <Link href="https://github.com/your-repo/athkarpal/issues" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors">
              <MessageSquare className="h-7 w-7 mb-1" />
              <span className="text-xs">فتح مشكلة (GitHub)</span>
            </Link>
          </div>
        </CardContent>
      </Card>

       {/* Footer section within the settings page */}
      <footer className="text-center text-xs text-muted-foreground py-4 mt-8">
         <p>&copy; {new Date().getFullYear()} AthkarPal</p>
       </footer>

    </div>
  );
}
