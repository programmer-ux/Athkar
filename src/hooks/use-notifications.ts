
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import useLocalStorage from './use-local-storage';

type PermissionStatus = 'default' | 'granted' | 'denied';

// --- Constants for Reminder Times ---
const MORNING_REMINDER_HOUR = 7; // 7 AM
const EVENING_REMINDER_HOUR = 19; // 7 PM (19:00)
// ------------------------------------

async function showNotification(title: string, options: NotificationOptions) {
  if (!('serviceWorker' in navigator) || !('showNotification' in ServiceWorkerRegistration.prototype)) {
    console.warn('Notifications API or Service Worker not supported.');
    return;
  }
  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, options);
  } catch (error) {
    console.error('Error showing notification:', error);
  }
}

export function useNotifications() {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus | null>(null);
  const [remindersEnabled, setRemindersEnabled] = useLocalStorage<boolean>('athkarpal_reminders_enabled_v1', false);
  const [isLoading, setIsLoading] = useState(true);
  const morningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const eveningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dailyCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check initial permission status
  useEffect(() => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    } else {
      setPermissionStatus('denied'); // Treat as denied if not supported
    }
    setIsLoading(false);
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    if (!('Notification' in window)) {
      console.error('This browser does not support desktop notification');
      setPermissionStatus('denied');
      setIsLoading(false);
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      if (permission === 'granted') {
        setRemindersEnabled(true); // Automatically enable if permission granted
        setIsLoading(false);
        return true;
      } else {
        setRemindersEnabled(false); // Disable if permission denied or dismissed
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      setPermissionStatus('denied'); // Assume denied on error
      setRemindersEnabled(false);
      setIsLoading(false);
      return false;
    }
  }, [setRemindersEnabled]);

  const toggleReminders = useCallback((): boolean => {
    if (permissionStatus === 'granted') {
      const newState = !remindersEnabled;
      setRemindersEnabled(newState);
      return newState;
    }
    // Cannot enable reminders if permission is not granted
    setRemindersEnabled(false);
    return false;
  }, [permissionStatus, remindersEnabled, setRemindersEnabled]);

  // Function to schedule notifications
  const scheduleNotifications = useCallback(() => {
    // Clear existing timeouts first
    if (morningTimeoutRef.current) clearTimeout(morningTimeoutRef.current);
    if (eveningTimeoutRef.current) clearTimeout(eveningTimeoutRef.current);
    if (dailyCheckTimeoutRef.current) clearTimeout(dailyCheckTimeoutRef.current);

    if (permissionStatus !== 'granted' || !remindersEnabled) {
      console.log('Notifications not scheduled (permission denied or reminders disabled).');
      return; // Don't schedule if not granted or not enabled
    }

    console.log('Scheduling notifications...');

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Midnight tomorrow

    const scheduleForTime = (hour: number, type: 'morning' | 'evening') => {
      const targetTime = new Date();
      targetTime.setHours(hour, 0, 0, 0); // Set target hour, minutes, seconds, ms

      let timeoutDelay: number;

      if (now.getTime() < targetTime.getTime()) {
        // Schedule for today
        timeoutDelay = targetTime.getTime() - now.getTime();
      } else {
        // Schedule for tomorrow
        const tomorrowTargetTime = new Date(targetTime);
        tomorrowTargetTime.setDate(targetTime.getDate() + 1);
        timeoutDelay = tomorrowTargetTime.getTime() - now.getTime();
      }

      console.log(`Scheduling ${type} reminder in ${Math.round(timeoutDelay / 1000 / 60)} minutes.`);

      const timeoutRef = type === 'morning' ? morningTimeoutRef : eveningTimeoutRef;
      timeoutRef.current = setTimeout(() => {
        const title = type === 'morning' ? '☀️ أذكار الصباح' : '🌙 أذكار المساء';
        const body = 'حان وقت قراءة أذكارك اليومية. اضغط هنا لفتح التطبيق.';
        showNotification(title, {
          body: body,
          icon: '/icons/icon-192x192.png', // Ensure this path is correct
          badge: '/icons/badge-72x72.png', // Optional: ensure this path is correct
          tag: `athkar-${type}-reminder`, // Use tag to prevent multiple notifications of same type
          renotify: true, // Allow replacing existing notification with same tag
          requireInteraction: false, // Keep false unless user action is mandatory
          // Add actions if needed:
          // actions: [
          //   { action: 'open-app', title: 'فتح التطبيق' },
          // ]
        });
        console.log(`${type} notification triggered.`);
        // Note: This timeout only runs once. Daily check handles rescheduling.
      }, timeoutDelay);
    };

    scheduleForTime(MORNING_REMINDER_HOUR, 'morning');
    scheduleForTime(EVENING_REMINDER_HOUR, 'evening');

    // Schedule a check just after midnight to reschedule for the next day
    const midnightDelay = tomorrow.getTime() - now.getTime() + 1000; // 1 second past midnight
    console.log(`Scheduling daily check in ${Math.round(midnightDelay / 1000 / 60 / 60)} hours.`);
    dailyCheckTimeoutRef.current = setTimeout(() => {
      console.log("Running daily check to reschedule notifications.");
      scheduleNotifications(); // Reschedule for the new day
    }, midnightDelay);

  }, [permissionStatus, remindersEnabled]);

  // Effect to schedule/reschedule notifications when status or enabled state changes
  useEffect(() => {
    // Check if running in a browser environment
    if (typeof window !== 'undefined' && 'Notification' in window && navigator.serviceWorker) {
      // Schedule immediately on load/change if conditions met
      scheduleNotifications();
    }

    // Cleanup function to clear timeouts on unmount or dependency change
    return () => {
      if (morningTimeoutRef.current) clearTimeout(morningTimeoutRef.current);
      if (eveningTimeoutRef.current) clearTimeout(eveningTimeoutRef.current);
      if (dailyCheckTimeoutRef.current) clearTimeout(dailyCheckTimeoutRef.current);
      console.log("Cleared existing notification timeouts.");
    };
  }, [scheduleNotifications]); // Depend on the memoized scheduling function

  return {
    permissionStatus: permissionStatus ?? 'default', // Provide default if null
    remindersEnabled,
    requestPermission,
    toggleReminders,
    isLoading,
  };
}
