import React from 'react';
import { cn } from './utils';

export function VegIcon({ isVeg, className }) {
  return (
    <div className={cn("flex items-center justify-center border-2 w-4 h-4 rounded-sm", isVeg ? "border-green-600" : "border-red-600", className)}>
      <div className={cn("w-2 h-2 rounded-full", isVeg ? "bg-green-600" : "bg-red-600")} />
    </div>
  );
}
