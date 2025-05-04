
"use client";

import * as React from 'react';
import { Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/hooks/use-notifications';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function NotificationToggle() {
  const { toast } = useToast();
  const {
    permissionStatus,
    remindersEnabled,
    requestPermission,
    toggleReminders,
    isLoading,
  } = useNotifications();

  const handleToggle = async () => {
    if (permissionStatus === 'default') {
      const granted = await requestPermission();
      if (granted) {
        toast({ title: 'تمكين الإشعارات', description: 'سيتم تذكيرك بأذكار الصباح والمساء.' });
      } else {
        toast({ title: 'تم حظر الإشعارات', description: 'يرجى السماح بالإشعارات في إعدادات المتصفح.', variant: 'destructive' });
      }
    } else if (permissionStatus === 'granted') {
      const newEnabledState = toggleReminders();
      toast({
        title: newEnabledState ? 'تمكين الإشعارات' : 'تعطيل الإشعارات',
        description: newEnabledState ? 'سيتم تذكيرك بأذكار الصباح والمساء.' : 'لن يتم إرسال تذكيرات.',
      });
    } else if (permissionStatus === 'denied') {
      toast({
        title: 'تم حظر الإشعارات',
        description: 'لا يمكن تمكين التذكيرات. يرجى السماح بالإشعارات في إعدادات المتصفح.',
        variant: 'destructive',
      });
    }
  };

  const getTooltipContent = () => {
    if (isLoading) return "جاري التحميل...";
    if (permissionStatus === 'denied') return "تم حظر الإشعارات من قبل المتصفح";
    if (permissionStatus === 'granted') {
      return remindersEnabled ? "تعطيل تذكيرات الأذكار" : "تمكين تذكيرات الأذكار";
    }
    return "طلب إذن الإشعارات";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={handleToggle}
            disabled={isLoading}
            aria-label={getTooltipContent()}
          >
            {permissionStatus === 'granted' && remindersEnabled ? (
              <Bell className="h-[1.2rem] w-[1.2rem] text-primary" />
            ) : (
              <BellOff className="h-[1.2rem] w-[1.2rem]" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipContent()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
