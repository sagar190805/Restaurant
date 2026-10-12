import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from './utils';

export function QuantityStepper({ quantity, onIncrease, onDecrease, className }) {
  return (
    <div className={cn("flex items-center justify-between border border-green-600 bg-white rounded-md overflow-hidden h-8 w-20 shadow-sm", className)}>
      <button 
        onClick={onDecrease} 
        className="w-1/3 flex items-center justify-center text-green-600 hover:bg-green-50 h-full transition-colors"
      >
        <Minus size={14} strokeWidth={3} />
      </button>
      <span className="w-1/3 flex items-center justify-center text-green-700 font-semibold text-sm">
        {quantity}
      </span>
      <button 
        onClick={onIncrease} 
        className="w-1/3 flex items-center justify-center text-green-600 hover:bg-green-50 h-full transition-colors"
      >
        <Plus size={14} strokeWidth={3} />
      </button>
    </div>
  );
}
