
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Noto_Naskh_Arabic } from 'next/font/google';
import '../globals.css'; // Adjusted path for locale structure
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { ServiceWorkerRegister } from '@/components/service-worker-register';
import { BottomNavigation } from '@/components/bottom-navigation';
import { I18nProviderClient } from '@/locales/client'; // Import client provider
import { locales } from '@/locales/config'; // Import available locales
import { DailyResetProvider } from '@/components/daily-reset-provider'; // Import the new provider

const inter = Inter({ subsets: ['latin'], variable: '--font-geist-sans' });

const notoNaskhArabic = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-arabic',
});

export const metadata: Metadata = {
  title: 'AthkarPal - أذكار اليوم والليلة',
  description: 'أذكار اليوم والليلة على هيئة مهام يومية بأسلوب بسيط. يعمل بدون انترنت وبدون إعلانات.',
  manifest: '/manifest.json',
};

// Function to generate static paths for locales
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function RootLayout({
  children,
  params: { locale } // Get locale from params
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // Validate locale, fallback to 'ar' if invalid
  const currentLocale = locales.includes(locale) ? locale : 'ar';

  return (
    <html lang={currentLocale} dir={currentLocale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body
        className={cn(
          inter.variable,
          notoNaskhArabic.variable,
          'antialiased'
        )}
      >
        {/* Wrap ThemeProvider and children with I18nProviderClient */}
        <I18nProviderClient locale={currentLocale}>
          <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
             {/* Wrap the main content area with DailyResetProvider */}
            <DailyResetProvider>
              <div className="container mx-auto max-w-2xl p-4 min-h-screen flex flex-col">
                 <main className="flex-grow pb-20 pt-4">{children}</main>
              </div>
              <BottomNavigation />
              <Toaster />
              <ServiceWorkerRegister />
             </DailyResetProvider>
          </ThemeProvider>
        </I18nProviderClient>
      </body>
    </html>
  );
}
