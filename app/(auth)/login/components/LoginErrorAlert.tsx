'use client';

import { X } from 'lucide-react';

interface LoginErrorAlertProps {
  error: string;
  onDismiss: () => void;
}

export function LoginErrorAlert({ error, onDismiss }: LoginErrorAlertProps) {
  return (
    <div className="p-4 border-2 border-brand-terracotta bg-background relative overflow-hidden group">
      {/* Background texture for the alert */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(45deg,#000_25%,transparent_25%,transparent_50%,#000_50%,#000_75%,transparent_75%,transparent)] bg-[length:4px_4px]" />
      
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 p-1 text-foreground/50 hover:text-foreground transition-colors z-10"
      >
        <X className="w-4 h-4" strokeWidth={2} />
      </button>
      
      <div className="relative z-10 pr-6">
        <p className="font-serif text-[10px] font-black text-brand-terracotta uppercase tracking-[0.2em] mb-1">
          Анхааруулга:
        </p>
        <p className="font-serif text-sm italic leading-tight text-foreground/90">
          {error}
        </p>
      </div>
    </div>
  );
}