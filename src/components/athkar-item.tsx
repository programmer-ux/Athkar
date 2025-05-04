"use client";

import type { Athkar } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface AthkarItemProps {
  athkar: Athkar;
  isCompleted: boolean;
  onToggleComplete: (id: string, category: string) => void;
}

export function AthkarItem({ athkar, isCompleted, onToggleComplete }: AthkarItemProps) {
  const [isVisible, setIsVisible] = useState(true); // For fade-out animation
  const [isHidden, setIsHidden] = useState(isCompleted); // To remove from layout after animation

  // Sync local state if parent completion state changes (e.g., on reset)
  useEffect(() => {
    if (isCompleted) {
      setIsVisible(false);
      // Wait for animation to finish before setting hidden
      const timer = setTimeout(() => setIsHidden(true), 300); // Match animation duration
      return () => clearTimeout(timer);
    } else {
      setIsHidden(false);
      // Need a slight delay to allow display: none -> block transition before opacity change
      requestAnimationFrame(() => setIsVisible(true));
    }
  }, [isCompleted]);


  const handleTap = () => {
    if (!isCompleted) {
        onToggleComplete(athkar.id, athkar.category);
    }
    // Note: State updates based on `isCompleted` prop change via useEffect
  };

  if (isHidden) {
    return null; // Don't render if hidden
  }

  return (
    <Card
      className={cn(
        'mb-4 cursor-pointer transition-all duration-300 ease-in-out', // Added transition-all for background/border
        !isVisible ? 'opacity-0 scale-95' : 'opacity-100 scale-100', // Added scale for subtle animation
        isCompleted && 'border-accent bg-accent/30' // Use accent color border and slightly transparent accent background
      )}
      onClick={handleTap}
      role="button" // Accessibility
      aria-pressed={isCompleted} // Accessibility
      aria-label={`ذكر: ${athkar.text.substring(0, 30)}...`} // Accessibility
    >
      <CardContent className="p-4">
        <p className={cn(
            "arabic text-lg leading-relaxed mb-2",
            isCompleted && "text-muted-foreground line-through" // Mute text and add line-through when completed
            )}>
            {athkar.text}
        </p>
        <div className="flex justify-between items-center text-sm text-muted-foreground">
           {athkar.count > 1 && (
             <Badge variant="secondary" className={cn(
                 "bg-primary/10 text-primary",
                 isCompleted && "bg-accent/50 text-accent-foreground" // Adjust badge style when completed
                 )}>
               {athkar.count} مرات
             </Badge>
           )}
          {athkar.reference && <span>{athkar.reference}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
