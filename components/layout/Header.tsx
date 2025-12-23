'use client';

import { Search, Moon, Sun } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';

export const Header = () => {
  const { sidebarOpen, darkMode, toggleDarkMode } = useAppStore();

  return (
    <header
      className={cn(
        'fixed top-0 z-30 flex h-16 items-center border-b bg-background/95 backdrop-blur transition-all duration-300',
        sidebarOpen ? 'left-64' : 'left-20',
        'right-0'
      )}
    >
      <div className="flex w-full items-center gap-4 px-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-10"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </div>
      </div>
    </header>
  );
};
