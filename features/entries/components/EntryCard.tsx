'use client';

import { Trash2, Lock, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { relativeTimeMn } from '@/lib/utils/date';

function relativeTime(iso: string) {
  return relativeTimeMn(iso);
}

interface EntryCardProps {
  entry: {
    id: string;
    surface_text: string | null;
    is_encrypted: boolean;
    is_text_saved: boolean;
    entry_index: number;
    created_at: string;
  };
  onDelete: (id: string) => void;
  deleting: boolean;
}

export function EntryCard({ entry, onDelete, deleting }: EntryCardProps) {
  const preview = entry.surface_text?.slice(0, 120) ?? null;

  return (
    <div className="group relative flex gap-4 p-4 rounded-2xl border bg-card hover:border-primary/40 transition-all">
      {/* Index badge */}
      <div className="shrink-0 w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
        #{entry.entry_index}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-[13px] text-muted-foreground">
            {relativeTime(entry.created_at)}
          </p>
          <div className="flex items-center gap-1.5 shrink-0">
            {entry.is_encrypted && (
              <span className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full">
                <Lock size={9} />
                Шифрлэгдсэн
              </span>
            )}
            {!entry.is_text_saved && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                <FileText size={9} />
                Хадгалаагүй
              </span>
            )}
          </div>
        </div>

        {preview ? (
          <p className="text-sm leading-relaxed text-foreground/80 line-clamp-2">{preview}</p>
        ) : (
          <p className="text-sm text-muted-foreground/40 italic">
            {entry.is_encrypted ? 'Шифрлэгдсэн бичлэг' : 'Текст хадгалаагүй'}
          </p>
        )}
      </div>

      {/* Actions (appear on hover) */}
      <div className="flex items-center gap-2 shrink-0">
        <Link href={`/entries/${entry.id}`}>
          <Button variant="ghost" size="sm" className="rounded-xl text-xs h-8">
            Дэлгэрэнгүй
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-xl text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onDelete(entry.id)}
          disabled={deleting}
        >
          {deleting ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Trash2 size={14} />
          )}
        </Button>
      </div>
    </div>
  );
}
