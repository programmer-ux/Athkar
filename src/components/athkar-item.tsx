
"use client";

import type { Athkar } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface AthkarItemProps {
  athkar: Athkar;
  isCompleted: boolean;
  // Ensure the prop accepts the ID as an argument
  onToggleComplete: (id: string) => void;
}

export function AthkarItem({ athkar, isCompleted, onToggleComplete }: AthkarItemProps) {
  const [isVisible, setIsVisible] = useState(true); // For fade-out animation
  const [isHidden, setIsHidden] = useState(false); // To keep track if it *should* be hidden based on prop

  // Effect to manage visual state based on isCompleted prop
  useEffect(() => {
    if (isCompleted) {
      setIsVisible(false); // Start fade-out
      // Set a timer matching the animation duration to set display:none effectively
      const timer = setTimeout(() => {
        setIsHidden(true); // Mark as hidden for potential layout removal by parent
      }, 300); // Match transition duration
      return () => clearTimeout(timer); // Cleanup timer
    } else {
      // If becoming incomplete, reset states immediately or with slight delay for animation
      setIsHidden(false); // Ensure it's not hidden
      // Use requestAnimationFrame to ensure the element is rendered before starting transition
      requestAnimationFrame(() => {
        setIsVisible(true); // Start fade-in
      });
    }
  }, [isCompleted]);

  const handleTap = () => {
    // Call the passed handler only if not already completed
    if (!isCompleted) {
        // Pass the specific athkar's ID
        onToggleComplete(athkar.id);
    }
    // The actual state change and re-render triggering the useEffect above
    // happens in the parent component (AthkarList)
  };

  // Conditionally render null based on the isHidden state managed by useEffect
  // This allows the fade-out animation to complete before removing from DOM flow
  if (isHidden && isCompleted) {
     // Only return null if it's intended to be hidden *and* marked as completed.
     // This prevents it from disappearing during the brief moment isCompleted might be false before animation reset.
    return null;
  }

  return (
    <Card
      className={cn(
        'mb-4 cursor-pointer transition-all duration-300 ease-in-out', // Combined transitions
        !isVisible ? 'opacity-0 scale-95' : 'opacity-100 scale-100', // Fade and scale animation
        isCompleted && isVisible ? 'border-accent bg-accent/30' : '', // Style for completed *while visible*
        // Prevent applying completed styles if it's supposed to be hidden, looks smoother
      )}
      onClick={handleTap}
      role="button" // Accessibility
      aria-pressed={isCompleted} // Accessibility
      aria-label={`ذكر: ${athkar.text.substring(0, 30)}...`} // Accessibility
      style={{ display: isHidden && isCompleted ? 'none' : undefined }} // Directly control display based on final hidden state
    >
      <CardContent className="p-4">
        <p className={cn(
            "arabic text-lg leading-relaxed mb-2 transition-colors duration-300", // Added transition for text color
            isCompleted ? "text-muted-foreground line-through" : "text-card-foreground" // Mute text and add line-through when completed
            )}>
            {athkar.text}
        </p>
        <div className="flex justify-between items-center text-sm text-muted-foreground">
           {athkar.count > 1 && (
             <Badge variant="secondary" className={cn(
                 "transition-colors duration-300", // Added transition for badge colors
                 isCompleted ? "bg-accent/50 text-accent-foreground" : "bg-primary/10 text-primary" // Adjust badge style when completed
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
