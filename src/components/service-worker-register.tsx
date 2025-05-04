
"use client";

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export function ServiceWorkerRegister() {
  const { toast } = useToast();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);

            // Optional: Listen for updates
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                      // New content is available, prompt user to refresh.
                      console.log('New content is available; please refresh.');
                       toast({
                         title: "تحديث متوفر",
                         description: "تم تحديث التطبيق. أعد تحميل الصفحة للحصول على آخر نسخة.",
                         duration: 10000, // Keep toast longer
                         // Optionally add an action to refresh
                         // action: <ToastAction altText="Refresh" onClick={() => window.location.reload()}>تحديث</ToastAction>,
                       });
                    } else {
                      // Content is cached for offline use.
                      console.log('Content is cached for offline use.');
                    }
                  }
                };
              }
            };
          }).catch(error => {
            console.error('Service Worker registration failed:', error);
            // Optionally inform the user about the failure if offline capabilities are critical
            // toast({
            //   title: "فشل تسجيل عامل الخدمة",
            //   description: "قد لا تعمل بعض الميزات دون اتصال بالإنترنت.",
            //   variant: "destructive",
            // });
          });
      });

       // Optional: Listen for controller change (when a new SW takes control)
       navigator.serviceWorker.oncontrollerchange = () => {
         console.log('New service worker has taken control.');
         // You might want to reload the page here automatically or prompt the user
         // window.location.reload();
       };

    } else {
        console.warn('Service Worker not supported in this browser.');
    }
  }, [toast]); // Add toast to dependency array

  return null; // This component doesn't render anything
}
