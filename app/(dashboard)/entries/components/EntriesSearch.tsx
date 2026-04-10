import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface EntriesSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function EntriesSearch({ value, onChange }: EntriesSearchProps) {
  return (
    <div className="relative">
      <Search
        size={15}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50"
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Хайх..."
        className="pl-9 rounded-xl bg-muted/40 border-0 focus-visible:ring-1 focus-visible:ring-foreground/20"
      />
    </div>
  );
}
