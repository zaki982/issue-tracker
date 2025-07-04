'use client';

import * as React from 'react';
import { Moon, Sun, Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Ensure UI is mounted before rendering to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = (newTheme: string, event?: React.MouseEvent | React.KeyboardEvent) => {
    // Prevent default if event is provided (for keyboard events)
    event?.preventDefault();
    
    setIsLoading(true);
    setTheme(newTheme);
    
    // Small delay to show the loading state
    const timer = setTimeout(() => setIsLoading(false), 150);
    
    return () => clearTimeout(timer);
  };
  
  // Handle keyboard navigation for theme selection
  const handleKeyDown = (event: React.KeyboardEvent, theme: string) => {
    // Handle Enter, Space, or Arrow keys for navigation
    if (['Enter', ' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
      
      if (event.key === 'Enter' || event.key === ' ') {
        handleThemeChange(theme, event);
        // Close the dropdown after selection
        const trigger = document.activeElement as HTMLElement;
        trigger?.click();
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        // Move focus to next menu item
        const menuItems = document.querySelectorAll('[role="menuitem"]');
        const currentIndex = Array.from(menuItems).findIndex(item => item === event.currentTarget);
        const nextIndex = (currentIndex + 1) % menuItems.length;
        (menuItems[nextIndex] as HTMLElement)?.focus();
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        // Move focus to previous menu item
        const menuItems = document.querySelectorAll('[role="menuitem"]');
        const currentIndex = Array.from(menuItems).findIndex(item => item === event.currentTarget);
        const prevIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
        (menuItems[prevIndex] as HTMLElement)?.focus();
      }
    } else if (event.key === 'Escape') {
      // Close the dropdown on Escape
      const trigger = document.activeElement?.closest('button[aria-haspopup="menu"]') as HTMLElement;
      trigger?.click();
    } else if (event.key === 'Home') {
      // Move to first menu item
      const menuItems = document.querySelectorAll('[role="menuitem"]');
      (menuItems[0] as HTMLElement)?.focus();
      event.preventDefault();
    } else if (event.key === 'End') {
      // Move to last menu item
      const menuItems = document.querySelectorAll('[role="menuitem"]');
      (menuItems[menuItems.length - 1] as HTMLElement)?.focus();
      event.preventDefault();
    }
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="sr-only">Loading theme...</span>
      </Button>
    );
  }

  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 relative focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded-md transition-all duration-200 hover:scale-105 active:scale-95"
                aria-label="Toggle theme"
                aria-haspopup="menu"
                aria-expanded={false}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <div className="relative h-4 w-4">
                    <Sun 
                      className="absolute h-4 w-4 rotate-0 scale-100 transition-all duration-300 ease-in-out dark:-rotate-90 dark:scale-0" 
                      aria-hidden="true"
                    />
                    <Moon 
                      className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 ease-in-out dark:rotate-0 dark:scale-100" 
                      aria-hidden="true"
                    />
                  </div>
                )}
                <span className="sr-only">Toggle theme menu</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-primary text-primary-foreground">
            <p>Change theme</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            onClick={(e) => handleThemeChange('light', e)}
            onKeyDown={(e) => handleKeyDown(e, 'light')}
            className={`flex items-center ${theme === 'light' ? 'bg-accent' : 'hover:bg-accent/50'}`}
            role="menuitemradio"
            aria-checked={theme === 'light'}
            tabIndex={-1}
            data-state={theme === 'light' ? 'checked' : 'unchecked'}
          >
            <span className="flex-1">Light</span>
            {theme === 'light' && (
              <span className="ml-2" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3377 6.96028 11.3497C6.78499 11.3618 6.61143 11.2922 6.48941 11.1617L3.81441 8.48672C3.56475 8.23706 3.56475 7.8275 3.81441 7.57784C4.06407 7.32818 4.47363 7.32818 4.72329 7.57784L6.85371 9.70827L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                </svg>
              </span>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={(e) => handleThemeChange('dark', e)}
            onKeyDown={(e) => handleKeyDown(e, 'dark')}
            className={`flex items-center ${theme === 'dark' ? 'bg-accent' : 'hover:bg-accent/50'}`}
            role="menuitemradio"
            aria-checked={theme === 'dark'}
            tabIndex={-1}
            data-state={theme === 'dark' ? 'checked' : 'unchecked'}
          >
            <span className="flex-1">Dark</span>
            {theme === 'dark' && (
              <span className="ml-2" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3377 6.96028 11.3497C6.78499 11.3618 6.61143 11.2922 6.48941 11.1617L3.81441 8.48672C3.56475 8.23706 3.56475 7.8275 3.81441 7.57784C4.06407 7.32818 4.47363 7.32818 4.72329 7.57784L6.85371 9.70827L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                </svg>
              </span>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={(e) => handleThemeChange('system', e)}
            onKeyDown={(e) => handleKeyDown(e, 'system')}
            className={`flex items-center ${theme === 'system' ? 'bg-accent' : 'hover:bg-accent/50'}`}
            role="menuitemradio"
            aria-checked={theme === 'system'}
            tabIndex={-1}
            data-state={theme === 'system' ? 'checked' : 'unchecked'}
          >
            <span className="flex-1">System</span>
            {theme === 'system' && (
              <span className="ml-2" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3377 6.96028 11.3497C6.78499 11.3618 6.61143 11.2922 6.48941 11.1617L3.81441 8.48672C3.56475 8.23706 3.56475 7.8275 3.81441 7.57784C4.06407 7.32818 4.47363 7.32818 4.72329 7.57784L6.85371 9.70827L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                </svg>
              </span>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}
