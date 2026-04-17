'use client';

import { cn } from '@/shared/lib/utils';
import { INSIGHT_CARDS } from '@/shared/constants';

// Vintage Spot Colors - Номийн тодруулагчийн organic бэхэн өнгөнүүд
const VINTAGE_STYLES = {
  mirror: {
    // Маркерийн бэх (soft blue highlighter)
    highlighter: 'linear-gradient(104deg, rgba(56, 189, 248, 0.22) 0%, rgba(56, 189, 248, 0.08) 100%)',
    text: 'text-foreground', // Текстийг хар хэвээр үлдээнэ
    title: 'ТУСГАЛ',
  },
  reframe: {
    // Soft amber/orange highlighter
    highlighter: 'linear-gradient(104deg, rgba(251, 191, 36, 0.22) 0%, rgba(251, 191, 36, 0.08) 100%)',
    text: 'text-foreground', 
    title: 'ШИНЭ ӨНЦӨГ',
  },
  relief: {
    // Soft purple/magenta highlighter
    highlighter: 'linear-gradient(104deg, rgba(167, 139, 250, 0.22) 0%, rgba(167, 139, 250, 0.08) 100%)',
    text: 'text-foreground', 
    title: 'ТАЙВШИРАЛ',
  },
} as const;

export function InsightCardItem({
  card,
  text,
  index,
  compact = false,
}: {
  card: (typeof INSIGHT_CARDS)[number];
  text: string;
  index: number;
  compact?: boolean;
}) {
  const style = VINTAGE_STYLES[card.key as keyof typeof VINTAGE_STYLES];

  return (
    <div
      className={cn(
        // Rounded-2xl болон неон хүрээг устгасан
        'relative border-l-4 border-t-0 border-r-0 border-b-0 transition-all duration-300',
        'hover:translate-x-1 group overflow-hidden',
        // Зүүн талын хүрээний өнгийг зөөлөн бор-саарал болгох
        'border-foreground/10',
        compact ? 'p-4' : 'p-6',
        'animate-[fadeUp_0.5s_ease_both]'
      )}
      style={{ animationDelay: `${index * 120}ms` }}
    >
      {/* Header: Editorial Title Block with Highlight */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4">
        {/* The Stamp/Tag */}
        <div className={cn(
          'px-2 py-0.5 border font-black text-[10px] tracking-[0.2em] font-serif uppercase relative overflow-hidden',
          style?.text
        )}>
          {/* Background Highlighter Effect - Зөвхөн энэ үгэн дээр */}
          <div 
            className="absolute inset-0 z-0 pointer-events-none mix-blend-multiply opacity-[0.9]"
            style={{ background: style?.highlighter }} 
          />
          {/* Text is on top of highlighter */}
          <span className="relative z-10">{style?.title ?? card.label}</span>
        </div>
        
        {/* Separator Line */}
        <div className="h-[1px] flex-1 bg-foreground/10" />

        {/* Catchphrase ("Өөр өнцгөөс харвал") - Also Highlighted */}
        <span className={cn(
          'font-serif italic text-[11px] font-bold tracking-tight opacity-70 relative',
          style?.text
        )}>
          {/* Background Highlighter Effect */}
          <div 
            className="absolute -inset-1 z-0 pointer-events-none mix-blend-multiply opacity-[0.9] rounded-[1px]"
            style={{ background: style?.highlighter }} 
          />
          {/* Emoji strip and keep text */}
          <span className="relative z-10">
             {card.sub.replace(/^\p{Emoji}\s*/u, '')}
          </span>
        </span>
      </div>

      {/* Main Body: Editorial Text (No highlight here) */}
      <p
        className={cn(
          'font-serif leading-relaxed text-foregrounditalic text-letterpress',
          compact ? 'text-sm' : 'text-base',
        )}
      >
        “{text}”
          
      </p>

      {/* Decorative Index */}
      <div className="absolute bottom-2 right-3 opacity-10 font-serif text-[10px] font-bold italic">
        Section {index + 1}
      </div>

      {/* Texture Overlays (multiply for realism) */}
      <div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
    </div>
  );
}