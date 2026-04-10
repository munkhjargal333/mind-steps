import { Button } from '@/components/ui/button';

interface EntriesPaginationProps {
  page: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export function EntriesPagination({
  page,
  totalPages,
  loading,
  onPageChange,
}: EntriesPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1 || loading}
        className="rounded-xl gap-1"
      >
        Өмнөх
      </Button>
      <span className="text-sm text-muted-foreground">
        {page} / {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages || loading}
        className="rounded-xl gap-1"
      >
        Дараах
      </Button>
    </div>
  );
}
