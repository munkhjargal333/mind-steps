import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface EntriesHeaderProps {
  total: number;
}

export function EntriesHeader({ total }: EntriesHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Бичлэгүүд</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Нийт {total} бичлэг
        </p>
      </div>
      <Link href="/home">
        <Button size="sm" className="rounded-xl gap-2">
          <BookOpen size={14} />
          Шинэ
        </Button>
      </Link>
    </div>
  );
}
