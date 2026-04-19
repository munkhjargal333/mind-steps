import { cn } from "@/shared/lib";
import { useEffect, useState } from "react";

const ANALYZE_MESSAGES = [
  'Таны хуваалцсан мэдрэмжийг уншиж байна…',
  'Утга болон дотоод байдлыг задлан шинжилж байна…',
  'Таны өнцгөөс ойлголт бэлтгэж байна…',
];

export function AnalyzingLoader() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(p => (p + 1) % ANALYZE_MESSAGES.length);
        setVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Wave bars */}
      <div className="flex items-end gap-[3px] h-7">
        {[8,14,20,26,20,14,8].map((h, i) => (
          <div
            key={i}
            className="w-[3px] rounded-sm bg-foreground opacity-20 animate-[waveBar_1.2s_ease-in-out_infinite]"
            style={{ height: h, animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>

      {/* Message */}
      <div className="flex flex-col items-center gap-1.5 min-h-[3.5rem]">
        <span className="text-[10px] tracking-widest uppercase text-muted-foreground font-sans font-medium">
          боловсруулж байна
        </span>
        <span
          className={cn(
            'text-sm text-muted-foreground font-mono text-center max-w-[200px] leading-relaxed transition-all duration-500',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1.5',
          )}
        >
          {ANALYZE_MESSAGES[idx]}
        </span>
      </div>

      {/* Orb dots */}
      <div className="flex gap-2.5 items-center">
        {[0,1,2,3,4].map(i => (
          <div
            key={i}
            className="w-[7px] h-[7px] rounded-full bg-foreground opacity-15 animate-[orbPulse_1.6s_ease-in-out_infinite]"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-40 h-[1.5px] bg-border rounded-full overflow-hidden">
        <div className="h-full bg-muted-foreground rounded-full animate-[progressSlow_18s_linear_forwards]" />
      </div>
    </div>
  );
}