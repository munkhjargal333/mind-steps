import { BookOpen } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';

interface EntriesEmptyStateProps {
  hasSearch: boolean;
}

export function EntriesEmptyState({ hasSearch }: EntriesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
        <BookOpen size={24} className="text-muted-foreground/40" />
      </div>
      <div>
        <p className="font-medium text-foreground/70">Бичлэг олдсонгүй</p>
        <p className="text-sm text-muted-foreground mt-1">
          {hasSearch ? 'Өөр үгээр хайж үзнэ үү' : 'Эхний бичлэгээ үүсгэнэ үү'}
        </p>
      </div>
      {!hasSearch && (
        <Link href="/home">
          <Button size="sm" variant="outline" className="rounded-xl">
            Бичлэг үүсгэх →
          </Button>
        </Link>
      )}
    </div>
  );
}
