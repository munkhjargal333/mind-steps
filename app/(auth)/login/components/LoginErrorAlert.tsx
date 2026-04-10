'use client';

import { AlertCircle, X } from 'lucide-react';

interface LoginErrorAlertProps {
  error: string;
  onDismiss: () => void;
}

export function LoginErrorAlert({ error, onDismiss }: LoginErrorAlertProps) {
  return (
    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg relative">
      <button
        onClick={onDismiss}
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-start gap-3 pr-8">
        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-destructive mb-1">Алдаа гарлаа</p>
          <p className="text-sm text-destructive/80">{error}</p>
        </div>
      </div>
    </div>
  );
}
