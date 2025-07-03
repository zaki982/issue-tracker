'use client';

import * as React from 'react';
import { useToast } from '@/components/ui/use-toast';

export function Toaster() {
  const { toast: showToast, toasts } = useToast();
  
  // This component renders nothing, it just provides the toast functionality
  // The actual toasts are rendered by the Toaster component from @/components/ui/toast
  return null;
}
