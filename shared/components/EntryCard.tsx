'use client';

import { Trash2, Lock, FileText, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';
import { relativeTimeMn } from '@/shared/lib/date';
import { cn } from '@/shared/lib/utils';

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
    <div className="group relative flex gap-3 p-4 rounded-2xl border border-border/60 bg-card hover:border-primary/30 hover:bg-accent/20 transition-all duration-200">
      {/* Index badge */}
      <div className="shrink-0 w-8 h-8 rounded-xl bg-muted/60 flex items-center justify-center font-mono italic text-[13px] font-medium text-muted-foreground/70 select-none">
        {entry.entry_index}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 py-0.5">
        {/* Meta row */}
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="text-[12px] text-muted-foreground/60">
            {relativeTime(entry.created_at)}
          </span>

          {entry.is_encrypted && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/25 px-2 py-0.5 rounded-full border border-amber-100 dark:border-amber-900/40">
              <Lock size={8} strokeWidth={2.5} />
              Шифрлэгдсэн
            </span>
          )}

          {!entry.is_text_saved && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground/60 bg-muted/50 px-2 py-0.5 rounded-full border border-border/50">
              <FileText size={8} strokeWidth={2.5} />
              Хадгалаагүй
            </span>
          )}
        </div>

        {/* Preview */}
        {preview ? (
          <p className="text-[13px] leading-relaxed text-foreground/75 line-clamp-2">
            {preview}
          </p>
        ) : (
          <p className="text-[13px] text-muted-foreground/35 italic">
            {entry.is_encrypted ? 'Шифрлэгдсэн бичлэг' : 'Текст хадгалаагүй'}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0 self-start pt-0.5">
        <Link href={`/entries/${entry.id}`}>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl h-8 px-3 text-[12px] text-muted-foreground/60 hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ArrowRight size={13} />
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-xl text-muted-foreground/40 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onDelete(entry.id)}
          disabled={deleting}
        >
          {deleting ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Trash2 size={13} />
          )}
        </Button>
      </div>
    </div>
  );
}