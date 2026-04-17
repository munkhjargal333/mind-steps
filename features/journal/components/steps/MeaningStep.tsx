import { Textarea } from '@/shared/ui/textarea';
import { cn } from '@/shared/lib/utils';
import type { StepCopy } from '@/core/api/types';

interface Props {
  cfg: StepCopy['meaning'];
  meaningText: string;
  onMeaningChange: (v: string) => void;
}

export function MeaningStep({ cfg, meaningText, onMeaningChange }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold leading-snug text-foreground">{cfg.q}</h2>
      <div className="border border-border rounded-2xl p-4 bg-card focus-within:border-primary/50 transition-colors">
        <Textarea
          value={meaningText}
          onChange={(e) => onMeaningChange(e.target.value)}
          placeholder={cfg.placeholder}
          className={cn(
            'min-h-[200px] text-base resize-none',
            'border-0 bg-transparent p-0 shadow-none',
            'focus-visible:ring-0 focus-visible:ring-offset-0',
            'placeholder:text-muted-foreground/40 placeholder:italic',
          )}
          autoFocus
        />
      </div>
    </div>
  );
}
