
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Library, Heart, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'اليوم', icon: Home },
  { href: '/library', label: 'المكتبة', icon: Library },
  { href: '/favorites', label: 'المفضلة', icon: Heart },
  { href: '/settings', label: 'الإعدادات', icon: Settings },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border shadow-md z-50">
      <div className="flex justify-around items-center h-full max-w-2xl mx-auto px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center text-xs w-16 transition-colors duration-200',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon className={cn('h-5 w-5 mb-1', isActive ? 'fill-current' : '')} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
