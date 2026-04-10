'use client';

// app/(dashboard)/entries/[entry_id]/_view/EntryDetailView.tsx
// Entry detail view - shows entry content only.

import { use } from 'react';
import { useEntry } from '@/features/entries';
import { Button } from '@/shared/ui/button';
import { formatDatetimeMn } from '@/shared/lib/utils/date';
import { ArrowLeft, Loader2, AlertCircle, Lock, FileText } from 'lucide-react';
import Link from 'next/link';

function Section({ label, content }: { label: string; content: string | null }) {
  if (!content) return null;
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">{label}</p>
      <p className="text-sm leading-relaxed text-foreground/80 bg-muted/30 rounded-2xl p-4">{content}</p>
    </div>
  );
}

export function EntryDetailView({ params }: { params: Promise<{ entry_id: string }> }) {
  const { entry_id } = use(params);
  const { entry, loading, error } = useEntry(entry_id);

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-8">
      <Link href="/entries">
        <Button variant="ghost" size="sm" className="rounded-xl gap-2 -ml-2 text-muted-foreground">
          <ArrowLeft size={14} /> Бичлэгүүд
        </Button>
      </Link>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 text-destructive text-sm">
          <AlertCircle size={16} />{error}
        </div>
      )}

      {entry && (
        <>
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold bg-muted px-2.5 py-1 rounded-full text-muted-foreground">#{entry.entry_index}</span>
              {entry.is_encrypted && (
                <span className="flex items-center gap-1 text-[11px] text-insight-summary bg-insight-summary/15 px-2.5 py-1 rounded-full">
                  <Lock size={10} />Шифрлэгдсэн
                </span>
              )}
              {!entry.is_text_saved && (
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                  <FileText size={10} />Текст хадгалаагүй
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{formatDatetimeMn(entry.created_at)}</p>
          </div>

          <div className="space-y-4">
            <Section label="Гадаргуу" content={entry.surface_text} />
            <Section label="Дотоод хариу" content={entry.inner_reaction_text} />
            <Section label="Утга" content={entry.meaning_text} />
          </div>
        </>
      )}
    </div>
  );
}
