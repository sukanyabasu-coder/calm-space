import { ReactNode } from 'react';
import { BottomNav } from './BottomNav';
import { ThemeToggle } from '../ThemeToggle';

interface AppLayoutProps {
  children: ReactNode;
  showNav?: boolean;
  showThemeToggle?: boolean;
  title?: string;
}

export function AppLayout({ 
  children, 
  showNav = true, 
  showThemeToggle = true,
  title 
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      {(title || showThemeToggle) && (
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
            <h1 className="text-lg font-semibold text-foreground">
              {title || 'CalmMind'}
            </h1>
            {showThemeToggle && <ThemeToggle />}
          </div>
        </header>
      )}

      {/* Main content */}
      <main className={cn(
        "flex-1 px-4 py-6 max-w-lg mx-auto w-full",
        showNav && "pb-24"
      )}>
        {children}
      </main>

      {/* Bottom navigation */}
      {showNav && <BottomNav />}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
