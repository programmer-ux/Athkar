
"use client";

import type { Athkar } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface AthkarItemProps {
  athkar: Athkar;
  isCompleted: boolean;
  onToggleComplete: (id: string) => void; // Handler expects ID
}

export function AthkarItem({ athkar, isCompleted, onToggleComplete }: AthkarItemProps) {
  const [isVisible, setIsVisible] = useState(!isCompleted); // Initially visible if not completed
  const [isHidden, setIsHidden] = useState(isCompleted); // Initially hidden if completed
  // Initialize remainingCount based on whether it's already completed or not
  const [remainingCount, setRemainingCount] = useState(isCompleted ? 0 : athkar.count);

  // Effect to manage visual state and count based on isCompleted prop (from parent/localStorage)
  useEffect(() => {
    if (isCompleted) {
      setIsVisible(false); // Start fade-out
      setRemainingCount(0); // Ensure count is 0 if marked completed externally (e.g., load)
      const timer = setTimeout(() => {
        setIsHidden(true); // Mark as hidden for layout removal
      }, 300); // Match transition duration
      return () => clearTimeout(timer); // Cleanup timer
    } else {
      // If becoming incomplete (e.g., on reset), reset states
      setRemainingCount(athkar.count); // Reset count to original
      setIsHidden(false); // Ensure it's not hidden
      // Use rAF to ensure the element is rendered before starting transition
      requestAnimationFrame(() => {
        setIsVisible(true); // Start fade-in
      });
    }
  }, [isCompleted, athkar.count]); // Depend on isCompleted and the original count

  const handleTap = () => {
    // Only allow tapping if not already marked as completed in parent state
    if (!isCompleted) {
      if (remainingCount > 1) {
        // Decrement count but don't mark complete yet
        setRemainingCount((prevCount) => prevCount - 1);
      } else if (remainingCount === 1) {
        // This is the last tap needed
        setRemainingCount(0); // Visually update count immediately
        onToggleComplete(athkar.id); // Trigger completion in parent state/localStorage
        // The useEffect listening to the 'isCompleted' prop will handle the fade-out animation
      }
      // If remainingCount is already 0, do nothing on tap
    }
  };

  // Conditionally render null based on the isHidden state managed by useEffect
  // This ensures the fade-out animation completes before removing from layout
  if (isHidden) {
    return null;
  }

  return (
    <Card
      className={cn(
        'mb-4 cursor-pointer transition-all duration-300 ease-in-out', // Combined transitions
        !isVisible ? 'opacity-0 scale-95' : 'opacity-100 scale-100', // Fade and scale animation
        // No specific style needed for completed here, as it will be hidden
      )}
      onClick={handleTap}
      role="button" // Accessibility
      aria-pressed={isCompleted} // Accessibility
      aria-label={`ذكر: ${athkar.text.substring(0, 30)}...`} // Accessibility
      // style={{ display: isHidden ? 'none' : undefined }} // Removed as returning null handles this
    >
      <CardContent className="p-4">
        <p className={cn(
            "arabic text-lg leading-relaxed mb-2 transition-colors duration-300",
             // Text style depends only on whether it's conceptually "done" (count 0)
            remainingCount <= 0 ? "text-muted-foreground line-through" : "text-card-foreground"
            )}>
            {athkar.text}
        </p>
        <div className="flex justify-between items-center text-sm text-muted-foreground">
           {/* Show badge only if original count > 1 AND conceptually not done (remaining > 0) */}
           {athkar.count > 1 && remainingCount > 0 && (
             <Badge variant="secondary" className={cn(
                 "transition-colors duration-300 bg-primary/10 text-primary" // Consistent style while active
                 )}>
               {remainingCount} مرات
             </Badge>
           )}
           {/* Ensure reference is always visible until hidden */}
          {athkar.reference && <span className={cn(remainingCount <= 0 ? "text-muted-foreground/80" : "")}>{athkar.reference}</span>}
        </div>
      </CardContent>
    </Card>
  );
}

