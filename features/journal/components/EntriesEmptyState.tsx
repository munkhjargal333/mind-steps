import { BookOpen, Plus } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/shared/lib';

interface EntriesEmptyStateProps {
  hasSearch: boolean;
}

export function EntriesEmptyState({ hasSearch }: EntriesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      {/* Icon block — skeleton-тай ижил rounded-xl, bg-muted/40 */}
      <div
        className="w-14 h-14 rounded-xl bg-muted/40 flex items-center justify-center"
      >
        <BookOpen size={22} className="text-muted-foreground/40" />
      </div>

      <div className="space-y-1">
        <p className="font-mono text-sm font-medium text-foreground/60">
          {hasSearch ? 'Тохирох бичлэг олдсонгүй' : 'Бичлэг байхгүй байна'}
        </p>
        <p className="font-mono text-xs text-muted-foreground">
          {hasSearch ? 'Өөр үгээр хайж үзнэ үү' : 'Эхний тэмдэглэлээ үүсгэнэ үү'}
        </p>
      </div>

      {!hasSearch && (
        <Link
          href="/write"
          className={cn(
            'mt-1 flex items-center gap-1.5 px-3 py-2.5 rounded-sm border font-mono',
            'text-xs font-bold tracking-wide transition-all duration-150',
            'bg-foreground text-background border-foreground',
            'hover:bg-foreground/90 active:scale-[0.98]',
          )}
        >
          <Plus size={13} strokeWidth={2.5} />
          Тэмдэглэл нэмэх
        </Link>
      )}
    </div>
  );
}