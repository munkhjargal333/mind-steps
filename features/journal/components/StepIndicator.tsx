import { cn } from '@/shared/lib/utils';
import { STEPS } from '@/shared/constants';

interface Props {
  current: number; // 1-based
}

export function StepIndicator({ current }: Props) {
  const currentStep = STEPS[current - 1];

  return (
    <div className="space-y-2 mb-6">
      {/* Segmented progress bar */}
      <div className="flex items-center gap-1.5">
        {STEPS.map((_, i) => {
          const done   = i < current - 1;
          const active = i === current - 1;
          return (
            <div
              key={i}
              className={cn(
                'flex-1 h-1 rounded-full transition-all duration-300',
                active && 'bg-primary',
                done   && 'bg-primary/40',
                !active && !done && 'bg-muted',
              )}
            />
          );
        })}
      </div>
      {/* Step label */}
      {currentStep && (
        <p className="text-xs text-muted-foreground font-medium">
          {current} / {STEPS.length} — {currentStep.label}
        </p>
      )}
    </div>
  );
}
