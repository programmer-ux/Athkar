
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Keep Inter or Geist as a fallback/base
import { Noto_Naskh_Arabic } from 'next/font/google'; // Import Arabic font
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster
import { ThemeProvider } from '@/components/theme-provider'; // Import ThemeProvider
import { ServiceWorkerRegister } from '@/components/service-worker-register'; // Import ServiceWorkerRegister
import { BottomNavigation } from '@/components/bottom-navigation'; // Import BottomNavigation

// Keep Geist or Inter if desired for non-Arabic text, or remove if Noto Naskh covers everything needed.
const inter = Inter({ subsets: ['latin'], variable: '--font-geist-sans' }); // Using Inter as example

const notoNaskhArabic = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '700'], // Include weights you'll use
  variable: '--font-arabic', // Define CSS variable for Arabic font
});

export const metadata: Metadata = {
  title: 'AthkarPal - أذكار اليوم والليلة',
  description: 'أذكار اليوم والليلة على هيئة مهام يومية بأسلوب بسيط. يعمل بدون انترنت وبدون إعلانات.',
  // Add PWA related meta tags if making it installable
  manifest: '/manifest.json', // Example path, needs manifest file
  // themeColor: '#42A5F5', // Removed as it was causing warnings, handled by ThemeProvider
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={cn(
          inter.variable, // Apply base font variable
          notoNaskhArabic.variable, // Apply Arabic font variable
          'antialiased'
        )}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <div className="container mx-auto max-w-2xl p-4 min-h-screen flex flex-col">
             <main className="flex-grow pb-20 pt-4">{children}</main> {/* Added pt-4 for spacing */}
          </div>
          <BottomNavigation /> {/* Add Bottom Navigation */}
          <Toaster /> {/* Add Toaster for potential notifications */}
          <ServiceWorkerRegister /> {/* Register the service worker */}
        </ThemeProvider>
      </body>
    </html>
  );
}
